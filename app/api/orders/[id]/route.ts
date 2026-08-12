import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdminPermission } from '@/lib/auth';

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
    await requireAdminPermission('orders.view');
    const { id } = await params;

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

    return NextResponse.json({ success: true, order });
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
