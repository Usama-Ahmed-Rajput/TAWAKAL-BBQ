import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdminPermission } from '@/lib/auth';
import { sendAdminOrderNotification } from '@/lib/push';

export async function GET(req: Request) {
  try {
    await requireAdminPermission('orders.view');
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const branchId = searchParams.get('branchId');
    const search = searchParams.get('search');

    const pageParam = parseInt(searchParams.get('page') || '1', 10);
    const limitParam = parseInt(searchParams.get('limit') || '50', 10);
    const page = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;
    const limit = isNaN(limitParam) || limitParam < 1 ? 50 : Math.min(limitParam, 100);
    const skip = (page - 1) * limit;

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

    const [totalCount, orders] = await Promise.all([
      prisma.order.count({ where }),
      prisma.order.findMany({
        where,
        include: {
          orderItems: true,
          branch: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    const totalPages = Math.ceil(totalCount / limit) || 1;

    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
      },
    });
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

    // 1. Resolve branch safely to prevent foreign key constraint P2003 failure
    let validBranchId: string | null = null;
    if (branchId && typeof branchId === 'string') {
      const existingBranch = await prisma.branch.findUnique({
        where: { id: branchId },
      });
      if (existingBranch) {
        validBranchId = existingBranch.id;
      }
    }
    if (!validBranchId) {
      const defaultActiveBranch = await prisma.branch.findFirst({
        where: { isActive: true },
        orderBy: { createdAt: 'asc' },
      });
      if (defaultActiveBranch) {
        validBranchId = defaultActiveBranch.id;
      }
    }

    // 2. Fetch DB items & deals with strict DB price validation (Never trust client-provided prices)
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
      const qty = typeof cartItem.quantity === 'number' && cartItem.quantity > 0 ? cartItem.quantity : 1;
      let matched = false;

      // Try matching Deal
      const dealIdCandidate = cartItem.dealId || (cartItem.type === 'DEAL' || (typeof cartItem.id === 'string' && cartItem.id.startsWith('deal-')) ? cartItem.id?.replace('deal-', '') : undefined);
      if (dealIdCandidate) {
        const dbDeal = await prisma.deal.findUnique({
          where: { id: dealIdCandidate },
        });

        if (dbDeal && dbDeal.isActive !== false) {
          const itemPrice = Math.round(dbDeal.dealPrice);
          calculatedSubtotal += itemPrice * qty;
          validatedOrderItems.push({
            dealId: dbDeal.id,
            name: `${dbDeal.dealNumber ? dbDeal.dealNumber + ' — ' : ''}${dbDeal.title}`,
            price: itemPrice,
            quantity: qty,
            notes: cartItem.includesCompulsoryRaita || cartItem.notes ? 'Includes compulsory Raita' : undefined,
          });
          matched = true;
        }
      }

      // Try matching MenuItem
      if (!matched) {
        const productIdCandidate = cartItem.productId || (typeof cartItem.id === 'string' && cartItem.id.startsWith('item-') ? cartItem.id.replace('item-', '') : cartItem.id);
        if (productIdCandidate) {
          const dbProduct = await prisma.menuItem.findUnique({
            where: { id: productIdCandidate },
          });

          if (dbProduct && dbProduct.isActive !== false && dbProduct.isAvailable !== false) {
            const itemPrice = Math.round(dbProduct.price);
            calculatedSubtotal += itemPrice * qty;
            validatedOrderItems.push({
              productId: dbProduct.id,
              name: dbProduct.name,
              price: itemPrice,
              quantity: qty,
              notes: cartItem.notes || undefined,
            });
            matched = true;
          }
        }
      }

      // If DB entity is missing or unavailable, reject the unverified item
      if (!matched) {
        return NextResponse.json(
          { error: `Invalid or unavailable item in cart: ${cartItem.name || 'Unknown Item'}` },
          { status: 400 }
        );
      }
    }

    if (validatedOrderItems.length === 0) {
      return NextResponse.json({ error: 'No valid products or deals in order' }, { status: 400 });
    }

    // 3. Delivery fee & Currency Math Safeguards (Strict deterministic integer/rupee rounding)
    const rawDeliveryFee = orderType === 'DELIVERY' ? (typeof clientDeliveryFee === 'number' ? clientDeliveryFee : 150) : 0;
    const sanitizedSubtotal = Math.round(calculatedSubtotal);
    const sanitizedDiscount = Math.round(typeof discountAmount === 'number' ? Math.max(0, discountAmount) : 0);
    const sanitizedDeliveryFee = Math.round(rawDeliveryFee);
    const sanitizedTotal = Math.max(0, Math.round(sanitizedSubtotal - sanitizedDiscount + sanitizedDeliveryFee));

    // 4. Generate collision-safe unique order number (e.g. TWK-84920)
    let orderNumber = '';
    let isUnique = false;
    let attempts = 0;

    while (!isUnique && attempts < 10) {
      attempts++;
      const randomSuffix = Math.floor(10000 + Math.random() * 90000);
      const candidate = `TWK-${randomSuffix}`;
      const existingOrder = await prisma.order.findUnique({
        where: { orderNumber: candidate },
      });
      if (!existingOrder) {
        orderNumber = candidate;
        isUnique = true;
      }
    }

    if (!orderNumber) {
      orderNumber = `TWK-${Date.now().toString().slice(-6)}`;
    }

    // 5. Find or create Customer (Atomic Upsert)
    const customer = await prisma.customer.upsert({
      where: { phone: customerPhone },
      update: { name: customerName },
      create: {
        name: customerName,
        phone: customerPhone,
      },
    });

    // 6. Create Order with snapshot values
    const newOrder = await prisma.order.create({
      data: {
        orderNumber,
        branchId: validBranchId || undefined,
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
        subtotal: sanitizedSubtotal,
        discountAmount: sanitizedDiscount,
        couponCode: couponCode || null,
        deliveryFee: sanitizedDeliveryFee,
        totalAmount: sanitizedTotal,
        orderItems: {
          create: validatedOrderItems.map((item) => ({
            menuItemId: item.productId || undefined,
            dealId: item.dealId || undefined,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            notes: item.notes || undefined,
          })),
        },
      },
      include: {
        orderItems: true,
        branch: true,
      },
    });

    // 7. Trigger Admin Push Notification asynchronously (Fail-safe, non-blocking)
    sendAdminOrderNotification({
      orderNumber: newOrder.orderNumber,
      totalAmount: newOrder.totalAmount,
    }).catch((err) => {
      console.error('[PUSH TRIGGER ERROR]:', err);
    });

    return NextResponse.json({
      success: true,
      orderNumber: newOrder.orderNumber,
      order: newOrder,
    });
  } catch (error: any) {
    console.error('[ORDER CREATION ERROR DETAILED]:', {
      message: error?.message || String(error),
      code: error?.code,
      meta: error?.meta,
      stack: error?.stack,
    });
    return NextResponse.json(
      {
        error: 'Failed to create order',
        details: error?.message || 'Server error during order processing',
      },
      { status: 500 }
    );
  }
}
