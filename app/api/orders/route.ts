import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const branchId = searchParams.get('branchId');
    const search = searchParams.get('search');

    const where: any = {};
    if (status && status !== 'ALL') {
      where.orderStatus = status;
    }
    if (branchId) {
      where.branchId = branchId;
    }
    if (search) {
      where.OR = [
        { orderNumber: { contains: search } },
        { customerPhone: { contains: search } },
        { customerName: { contains: search } },
      ];
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        orderItems: true,
        branch: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      branchId,
      customerName,
      customerPhone,
      whatsapp,
      deliveryAddress,
      deliveryArea,
      deliveryNotes,
      orderType = 'DELIVERY',
      items = [],
      deliveryFee: clientDeliveryFee,
      discountAmount = 0,
      couponCode,
    } = body;

    if (!customerName || !customerPhone || items.length === 0) {
      return NextResponse.json({ error: 'Customer details and cart items are required' }, { status: 400 });
    }

    // 1. Fetch DB items & deals to calculate real authoritative subtotal
    let calculatedSubtotal = 0;
    const validatedOrderItems: {
      productId?: string;
      dealId?: string;
      name: string;
      price: number;
      quantity: number;
      notes?: string;
    }[] = [];

    for (const cartItem of items) {
      if (cartItem.type === 'DEAL' && cartItem.dealId) {
        const dbDeal = await prisma.deal.findUnique({
          where: { id: cartItem.dealId },
        });

        if (dbDeal) {
          const itemPrice = dbDeal.dealPrice;
          calculatedSubtotal += itemPrice * cartItem.quantity;
          validatedOrderItems.push({
            dealId: dbDeal.id,
            name: `${dbDeal.dealNumber ? dbDeal.dealNumber + ' — ' : ''}${dbDeal.title}`,
            price: itemPrice,
            quantity: cartItem.quantity,
            notes: 'Includes compulsory Raita',
          });
        }
      } else if (cartItem.productId) {
        const dbProduct = await prisma.menuItem.findUnique({
          where: { id: cartItem.productId },
        });

        if (dbProduct) {
          const itemPrice = dbProduct.price;
          calculatedSubtotal += itemPrice * cartItem.quantity;
          validatedOrderItems.push({
            productId: dbProduct.id,
            name: dbProduct.name,
            price: itemPrice,
            quantity: cartItem.quantity,
          });
        }
      }
    }

    if (validatedOrderItems.length === 0) {
      return NextResponse.json({ error: 'No valid products or deals in order' }, { status: 400 });
    }

    // 2. Delivery fee calculation
    const finalDeliveryFee = orderType === 'DELIVERY' ? (typeof clientDeliveryFee === 'number' ? clientDeliveryFee : 150) : 0;
    const totalAmount = Math.max(0, calculatedSubtotal - discountAmount + finalDeliveryFee);

    // 3. Generate unique order number (e.g. TWK-84920)
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `TWK-${randomSuffix}`;

    // 4. Find or create Customer
    let customer = await prisma.customer.findUnique({
      where: { phone: customerPhone },
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          name: customerName,
          phone: customerPhone,
        },
      });
    }

    // 5. Create Order with snapshot values
    const newOrder = await prisma.order.create({
      data: {
        orderNumber,
        branchId: branchId || undefined,
        customerId: customer.id,
        customerName,
        customerPhone,
        deliveryAddress: deliveryAddress || 'Pickup at restaurant',
        deliveryArea: deliveryArea || '',
        deliveryNotes: deliveryNotes || '',
        orderType,
        orderStatus: 'PENDING',
        paymentMethod: 'CASH_ON_DELIVERY',
        paymentStatus: 'PENDING',
        subtotal: calculatedSubtotal,
        discountAmount,
        couponCode: couponCode || null,
        deliveryFee: finalDeliveryFee,
        totalAmount,
        orderItems: {
          create: validatedOrderItems.map((item) => ({
            menuItemId: item.productId,
            dealId: item.dealId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            notes: item.notes,
          })),
        },
      },
      include: {
        orderItems: true,
        branch: true,
      },
    });

    return NextResponse.json({
      success: true,
      orderNumber: newOrder.orderNumber,
      order: newOrder,
    });
  } catch (error) {
    console.error('Failed to create order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
