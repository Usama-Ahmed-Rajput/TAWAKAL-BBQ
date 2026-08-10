import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdminPermission } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  try {
    const { orderNumber } = await params;

    const order = await db.order.findFirst({
      where: {
        OR: [{ orderNumber }, { id: orderNumber }],
      },
      include: {
        orderItems: true,
        payments: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch order details' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  try {
    const session = await requireAdminPermission('orders.manage');
    const { orderNumber } = await params;
    const { orderStatus, paymentStatus, deliveryNotes } = await request.json();

    const order = await db.order.findFirst({
      where: { OR: [{ orderNumber }, { id: orderNumber }] },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const updatedOrder = await db.order.update({
      where: { id: order.id },
      data: {
        orderStatus: orderStatus || order.orderStatus,
        paymentStatus: paymentStatus || order.paymentStatus,
        deliveryNotes: deliveryNotes || order.deliveryNotes,
      },
      include: { orderItems: true },
    });

    await db.auditLog.create({
      data: {
        userId: session.id,
        userName: session.name,
        action: 'ORDER_STATUS_UPDATED',
        entityType: 'Order',
        entityId: order.id,
        metadata: JSON.stringify({
          orderNumber: order.orderNumber,
          oldStatus: order.orderStatus,
          newStatus: updatedOrder.orderStatus,
        }),
      },
    });

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error: any) {
    console.error('Update order status error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update order status' }, { status: 500 });
  }
}
