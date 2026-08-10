import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdminPermission } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get('category');
    const search = searchParams.get('search');
    const isFeatured = searchParams.get('featured') === 'true';
    const all = searchParams.get('all') === 'true'; // For admin to see inactive

    const whereClause: any = all ? {} : { isActive: true, isAvailable: true };

    if (categorySlug && categorySlug !== 'all') {
      whereClause.category = { slug: categorySlug };
    }

    if (isFeatured) {
      whereClause.isFeatured = true;
    }

    if (search) {
      whereClause.OR = [
        { name: { contains: search } },
        { urduName: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const [items, categories] = await Promise.all([
      db.menuItem.findMany({
        where: whereClause,
        include: {
          category: true,
          variants: { where: { isAvailable: true } },
        },
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      }),
      db.menuCategory.findMany({
        where: all ? {} : { isActive: true },
        orderBy: { sortOrder: 'asc' },
      }),
    ]);

    return NextResponse.json({ items, categories });
  } catch (error: any) {
    console.error('Fetch menu error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch menu' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireAdminPermission('menu.create');
    const body = await request.json();

    const {
      name,
      slug,
      urduName,
      description,
      shortDescription,
      categoryId,
      price,
      compareAtPrice,
      image,
      isFeatured,
      isPopular,
      isAvailable,
      isActive,
      sortOrder,
      variants,
    } = body;

    if (!name || !categoryId || price === undefined || !image) {
      return NextResponse.json({ error: 'Name, Category, Price and Image are required' }, { status: 400 });
    }

    const generatedSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const newItem = await db.menuItem.create({
      data: {
        name,
        slug: generatedSlug,
        urduName,
        description,
        shortDescription,
        categoryId,
        price: Number(price),
        compareAtPrice: compareAtPrice ? Number(compareAtPrice) : null,
        image,
        isFeatured: Boolean(isFeatured),
        isPopular: Boolean(isPopular),
        isAvailable: isAvailable !== undefined ? Boolean(isAvailable) : true,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
        sortOrder: sortOrder ? Number(sortOrder) : 0,
        variants: variants && variants.length > 0 ? {
          create: variants.map((v: any) => ({
            name: v.name,
            price: Number(v.price),
            isAvailable: v.isAvailable !== undefined ? Boolean(v.isAvailable) : true,
          }))
        } : undefined,
      },
      include: { category: true, variants: true },
    });

    await db.auditLog.create({
      data: {
        userId: session.id,
        userName: session.name,
        action: 'MENU_ITEM_CREATED',
        entityType: 'MenuItem',
        entityId: newItem.id,
        metadata: JSON.stringify({ name: newItem.name, price: newItem.price }),
      },
    });

    return NextResponse.json({ success: true, item: newItem });
  } catch (error: any) {
    console.error('Create menu item error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create menu item' }, { status: 500 });
  }
}
