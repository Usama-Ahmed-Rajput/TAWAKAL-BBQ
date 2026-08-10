import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdminPermission } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const deal = await db.deal.findFirst({
      where: {
        OR: [{ slug }, { id: slug }],
      },
      include: {
        dealItems: {
          include: { menuItem: true },
        },
      },
    });

    if (!deal) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
    }

    return NextResponse.json({ deal });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch deal details' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await requireAdminPermission('deals.edit');
    const { slug } = await params;
    const body = await request.json();

    const existing = await db.deal.findFirst({
      where: { OR: [{ id: slug }, { slug }] },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
    }

    const updatedDeal = await db.deal.update({
      where: { id: existing.id },
      data: {
        title: body.title ?? existing.title,
        slug: body.slug ?? existing.slug,
        shortDescription: body.shortDescription ?? existing.shortDescription,
        description: body.description ?? existing.description,
        image: body.image ?? existing.image,
        originalPrice: body.originalPrice !== undefined ? Number(body.originalPrice) : existing.originalPrice,
        dealPrice: body.dealPrice !== undefined ? Number(body.dealPrice) : existing.dealPrice,
        discountType: body.discountType ?? existing.discountType,
        discountValue: body.discountValue !== undefined ? Number(body.discountValue) : existing.discountValue,
        isActive: body.isActive !== undefined ? Boolean(body.isActive) : existing.isActive,
        isFeatured: body.isFeatured !== undefined ? Boolean(body.isFeatured) : existing.isFeatured,
        isHomepageFeatured: body.isHomepageFeatured !== undefined ? Boolean(body.isHomepageFeatured) : existing.isHomepageFeatured,
        terms: body.terms ?? existing.terms,
      },
      include: {
        dealItems: {
          include: { menuItem: true },
        },
      },
    });

    await db.auditLog.create({
      data: {
        userId: session.id,
        userName: session.name,
        action: 'DEAL_UPDATED',
        entityType: 'Deal',
        entityId: existing.id,
        metadata: JSON.stringify({ title: updatedDeal.title, price: updatedDeal.dealPrice }),
      },
    });

    return NextResponse.json({ success: true, deal: updatedDeal });
  } catch (error: any) {
    console.error('Update deal error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update deal' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await requireAdminPermission('deals.delete');
    const { slug } = await params;

    const existing = await db.deal.findFirst({
      where: { OR: [{ id: slug }, { slug }] },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
    }

    await db.deal.update({
      where: { id: existing.id },
      data: { isActive: false },
    });

    await db.auditLog.create({
      data: {
        userId: session.id,
        userName: session.name,
        action: 'DEAL_DELETED',
        entityType: 'Deal',
        entityId: existing.id,
      },
    });

    return NextResponse.json({ success: true, message: 'Deal deactivated' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete deal' }, { status: 500 });
  }
}
