import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getAdminSession, requireAdminPermission } from '@/lib/auth';

const VALID_STATUSES = [
  'PENDING',
  'CONFIRMED',
  'PREPARING',
  'READY',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'COMPLETED',
  'CANCELLED',
  'REFUNDED',
];

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getAdminSession();

    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id }, { orderNumber: id }],
      },
      include: {
        orderItems: true,
        branch: true,
        customer: true,
      },
    });

    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    if (session) {
      return NextResponse.json({ success: true, order });
    }

    // Customer-safe sanitized payload for post-checkout order confirmation
    const sanitizedOrder = {
      id: order.id,
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      deliveryAddress: order.deliveryAddress,
      deliveryArea: order.deliveryArea,
      deliveryNotes: order.deliveryNotes,
      orderType: order.orderType,
      orderStatus: order.orderStatus,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      subtotal: order.subtotal,
      deliveryFee: order.deliveryFee,
      discountAmount: order.discountAmount,
      totalAmount: order.totalAmount,
      createdAt: order.createdAt,
      orderItems: order.orderItems.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        variantName: item.variantName,
        notes: item.notes,
      })),
      branch: order.branch
        ? {
            name: order.branch.name,
            address: order.branch.address,
            phone: order.branch.phone,
            whatsapp: order.branch.whatsapp,
          }
        : null,
    };

    return NextResponse.json({ success: true, order: sanitizedOrder });
  } catch (error: any) {
    console.error('[API ORDER GET ERROR]:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch order' }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return handleOrderUpdate(req, params);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return handleOrderUpdate(req, params);
}

async function handleOrderUpdate(
  req: Request,
  params: Promise<{ id: string }>
) {
  try {
    const session = await requireAdminPermission('orders.manage');
    const { id } = await params;
    const body = await req.json();

    const { orderStatus, paymentStatus, deliveryAddress, deliveryNotes, branchId } = body;

    // Validate status value if provided
    if (orderStatus && !VALID_STATUSES.includes(orderStatus.toUpperCase())) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid order status value. Allowed: ${VALID_STATUSES.join(', ')}`,
        },
        { status: 400 }
      );
    }

    const existingOrder = await prisma.order.findFirst({
      where: {
        OR: [{ id }, { orderNumber: id }],
      },
    });

    if (!existingOrder) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    const targetStatus = orderStatus ? orderStatus.toUpperCase() : undefined;

    const updatedOrder = await prisma.order.update({
      where: { id: existingOrder.id },
      data: {
        ...(targetStatus ? { orderStatus: targetStatus } : {}),
        ...(paymentStatus ? { paymentStatus } : {}),
        ...(deliveryAddress ? { deliveryAddress } : {}),
        ...(deliveryNotes !== undefined ? { deliveryNotes } : {}),
        ...(branchId ? { branchId } : {}),
      },
      include: {
        orderItems: true,
        branch: true,
        customer: true,
      },
    });

    // Record audit log
    try {
      await prisma.auditLog.create({
        data: {
          userId: session.id,
          userName: session.name,
          action: 'ORDER_STATUS_UPDATED',
          entityType: 'Order',
          entityId: updatedOrder.id,
          metadata: JSON.stringify({
            orderNumber: updatedOrder.orderNumber,
            previousStatus: existingOrder.orderStatus,
            newStatus: updatedOrder.orderStatus,
          }),
        },
      });
    } catch (auditErr) {
      console.warn('Failed to record audit log for order status update:', auditErr);
    }

    return NextResponse.json({
      success: true,
      message: `Order status updated to ${updatedOrder.orderStatus}`,
      order: updatedOrder,
    });
  } catch (error: any) {
    console.error('[API ORDER UPDATE ERROR]:', error);
    const status = error.message?.includes('UNAUTHORIZED')
      ? 401
      : error.message?.includes('FORBIDDEN')
      ? 403
      : 500;
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update order status' },
      { status }
    );
  }
}
