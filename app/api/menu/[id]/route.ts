import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdminPermission } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const item = await db.menuItem.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        category: true,
        variants: true,
      },
    });

    if (!item) {
      return NextResponse.json({ error: 'Menu item not found' }, { status: 404 });
    }

    return NextResponse.json({ item });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch menu item' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAdminPermission('menu.edit');
    const { id } = await params;
    const body = await request.json();

    const existing = await db.menuItem.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    const updatedItem = await db.menuItem.update({
      where: { id },
      data: {
        name: body.name ?? existing.name,
        slug: body.slug ?? existing.slug,
        urduName: body.urduName ?? existing.urduName,
        description: body.description ?? existing.description,
        shortDescription: body.shortDescription ?? existing.shortDescription,
        categoryId: body.categoryId ?? existing.categoryId,
        price: body.price !== undefined ? Number(body.price) : existing.price,
        compareAtPrice: body.compareAtPrice !== undefined ? (body.compareAtPrice ? Number(body.compareAtPrice) : null) : existing.compareAtPrice,
        image: body.image ?? existing.image,
        isFeatured: body.isFeatured !== undefined ? Boolean(body.isFeatured) : existing.isFeatured,
        isPopular: body.isPopular !== undefined ? Boolean(body.isPopular) : existing.isPopular,
        isAvailable: body.isAvailable !== undefined ? Boolean(body.isAvailable) : existing.isAvailable,
        isActive: body.isActive !== undefined ? Boolean(body.isActive) : existing.isActive,
        sortOrder: body.sortOrder !== undefined ? Number(body.sortOrder) : existing.sortOrder,
      },
      include: { category: true, variants: true },
    });

    await db.auditLog.create({
      data: {
        userId: session.id,
        userName: session.name,
        action: 'MENU_ITEM_UPDATED',
        entityType: 'MenuItem',
        entityId: id,
        metadata: JSON.stringify({ name: updatedItem.name, price: updatedItem.price }),
      },
    });

    return NextResponse.json({ success: true, item: updatedItem });
  } catch (error: any) {
    console.error('Update menu item error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update menu item' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAdminPermission('menu.delete');
    const { id } = await params;

    // Archive or hard delete
    await db.menuItem.update({
      where: { id },
      data: { isActive: false, isAvailable: false },
    });

    await db.auditLog.create({
      data: {
        userId: session.id,
        userName: session.name,
        action: 'MENU_ITEM_DELETED',
        entityType: 'MenuItem',
        entityId: id,
      },
    });

    return NextResponse.json({ success: true, message: 'Item archived successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete item' }, { status: 500 });
  }
}
