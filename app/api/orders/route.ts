import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

function generateOrderNumber(): string {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `TB-${dateStr}-${randomSuffix}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      customerName,
      customerPhone,
      customerEmail,
      deliveryAddress,
      deliveryArea,
      deliveryNotes,
      orderType = 'DELIVERY',
      paymentMethod = 'CASH_ON_DELIVERY',
      couponCode,
      items,
    } = body;

    if (!customerName || !customerPhone || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'Customer Name, Phone and cart items are required' },
        { status: 400 }
      );
    }

    if (orderType === 'DELIVERY' && !deliveryAddress) {
      return NextResponse.json({ error: 'Delivery address is required' }, { status: 400 });
    }

    // 1. Calculate subtotal & validate items server-side
    let calculatedSubtotal = 0;
    const validatedOrderItems: any[] = [];

    for (const cartItem of items) {
      if (cartItem.dealId) {
        // Deal item
        const deal = await db.deal.findUnique({
          where: { id: cartItem.dealId },
        });

        if (!deal || !deal.isActive) {
          return NextResponse.json(
            { error: `Deal "${cartItem.name || 'Selected deal'}" is no longer available` },
            { status: 400 }
          );
        }

        const itemTotal = deal.dealPrice * cartItem.quantity;
        calculatedSubtotal += itemTotal;

        validatedOrderItems.push({
          dealId: deal.id,
          name: deal.title,
          price: deal.dealPrice,
          quantity: cartItem.quantity,
          variantName: null,
          notes: cartItem.notes || null,
        });
      } else if (cartItem.menuItemId) {
        // Menu item
        const menuItem = await db.menuItem.findUnique({
          where: { id: cartItem.menuItemId },
          include: { variants: true },
        });

        if (!menuItem || !menuItem.isActive || !menuItem.isAvailable) {
          return NextResponse.json(
            { error: `Item "${cartItem.name || 'Selected dish'}" is currently unavailable` },
            { status: 400 }
          );
        }

        let unitPrice = menuItem.price;
        let variantName = null;

        if (cartItem.variantId) {
          const variant = menuItem.variants.find((v: any) => v.id === cartItem.variantId);
          if (variant) {
            unitPrice = variant.price;
            variantName = variant.name;
          }
        }

        const itemTotal = unitPrice * cartItem.quantity;
        calculatedSubtotal += itemTotal;

        validatedOrderItems.push({
          menuItemId: menuItem.id,
          name: menuItem.name,
          price: unitPrice,
          quantity: cartItem.quantity,
          variantName,
          notes: cartItem.notes || null,
        });
      }
    }

    // 2. Validate Coupon Server-Side
    let discountAmount = 0;
    if (couponCode) {
      const coupon = await db.coupon.findUnique({
        where: { code: couponCode.trim().toUpperCase() },
      });

      if (coupon && coupon.isActive) {
        if (!coupon.minOrder || calculatedSubtotal >= coupon.minOrder) {
          if (coupon.discountType === 'PERCENTAGE') {
            discountAmount = (calculatedSubtotal * coupon.discountValue) / 100;
            if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
              discountAmount = coupon.maxDiscount;
            }
          } else {
            discountAmount = coupon.discountValue;
          }
          discountAmount = Math.min(discountAmount, calculatedSubtotal);

          // Update coupon usage
          await db.coupon.update({
            where: { id: coupon.id },
            data: { usedCount: { increment: 1 } },
          });
        }
      }
    }

    // 3. Delivery Fee Server-Side Calculation
    const deliveryFeeSetting = await db.restaurantSetting.findUnique({
      where: { key: 'delivery_fee' },
    });
    const deliveryFee = orderType === 'DELIVERY' ? Number(deliveryFeeSetting?.value || 150) : 0;

    const totalAmount = Math.max(0, calculatedSubtotal - discountAmount + deliveryFee);
    const orderNumber = generateOrderNumber();

    // 4. Upsert Customer Record
    let customer = await db.customer.findUnique({
      where: { phone: customerPhone.trim() },
    });

    if (!customer) {
      customer = await db.customer.create({
        data: {
          name: customerName.trim(),
          phone: customerPhone.trim(),
          email: customerEmail ? customerEmail.trim() : null,
        },
      });
    }

    // 5. Persist Order in Database
    const newOrder = await db.order.create({
      data: {
        orderNumber,
        customerId: customer.id,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerEmail: customerEmail ? customerEmail.trim() : null,
        deliveryAddress: deliveryAddress ? deliveryAddress.trim() : null,
        deliveryArea: deliveryArea ? deliveryArea.trim() : null,
        deliveryNotes: deliveryNotes ? deliveryNotes.trim() : null,
        orderType,
        orderStatus: 'PENDING',
        paymentMethod,
        paymentStatus: 'PENDING',
        subtotal: calculatedSubtotal,
        discountAmount,
        deliveryFee,
        totalAmount,
        couponCode: couponCode ? couponCode.trim().toUpperCase() : null,
        orderItems: {
          create: validatedOrderItems,
        },
        payments: {
          create: {
            paymentMethod,
            paymentStatus: 'PENDING',
            amount: totalAmount,
          },
        },
      },
      include: {
        orderItems: true,
      },
    });

    // 6. Create Admin Notification
    await db.notification.create({
      data: {
        title: 'New Order Received',
        message: `Order #${newOrder.orderNumber} for Rs. ${newOrder.totalAmount} received from ${newOrder.customerName}`,
        type: 'ORDER',
      },
    });

    return NextResponse.json({
      success: true,
      order: {
        orderNumber: newOrder.orderNumber,
        subtotal: newOrder.subtotal,
        discountAmount: newOrder.discountAmount,
        deliveryFee: newOrder.deliveryFee,
        totalAmount: newOrder.totalAmount,
        status: newOrder.orderStatus,
        createdAt: newOrder.createdAt,
      },
    });
  } catch (error: any) {
    console.error('Order creation error:', error);
    return NextResponse.json({ error: error.message || 'Failed to place order' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const whereClause: any = {};
    if (status && status !== 'ALL') {
      whereClause.orderStatus = status;
    }

    if (search) {
      whereClause.OR = [
        { orderNumber: { contains: search } },
        { customerName: { contains: search } },
        { customerPhone: { contains: search } },
      ];
    }

    const orders = await db.order.findMany({
      where: whereClause,
      include: {
        orderItems: true,
        payments: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return NextResponse.json({ orders });
  } catch (error: any) {
    console.error('Fetch orders error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch orders' }, { status: 500 });
  }
}
