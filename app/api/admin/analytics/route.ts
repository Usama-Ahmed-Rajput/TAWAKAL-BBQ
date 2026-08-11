import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdminPermission } from '@/lib/auth';

export async function GET() {
  try {
    await requireAdminPermission('analytics.view');

    const totalOrders = await db.order.count();
    const pendingOrders = await db.order.count({
      where: { orderStatus: 'PENDING' },
    });
    const completedOrders = await db.order.count({
      where: { orderStatus: 'DELIVERED' },
    });

    const revenueResult = await db.order.aggregate({
      where: { orderStatus: { not: 'CANCELLED' } },
      _sum: { totalAmount: true },
      _avg: { totalAmount: true },
    });

    const totalRevenue = revenueResult._sum.totalAmount || 0;
    const avgOrderValue = Math.round(revenueResult._avg.totalAmount || 0);

    const recentOrders = await db.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { orderItems: true },
    });

    const totalCustomers = await db.customer.count();
    const totalReservations = await db.reservation.count();

    // Top selling items from OrderItems
    const topItemsRaw = await db.orderItem.groupBy({
      by: ['name'],
      _sum: { quantity: true, price: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5,
    });

    const topSellingItems = topItemsRaw.map((item: any) => ({
      name: item.name,
      totalQuantity: item._sum.quantity || 0,
    }));

    return NextResponse.json({
      summary: {
        totalRevenue,
        totalOrders,
        pendingOrders,
        completedOrders,
        avgOrderValue,
        totalCustomers,
        totalReservations,
      },
      recentOrders,
      topSellingItems,
    });
  } catch (error: any) {
    console.error('Analytics error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch analytics' }, { status: 500 });
  }
}
