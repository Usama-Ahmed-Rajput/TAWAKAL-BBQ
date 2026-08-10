import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdminPermission } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const homepage = searchParams.get('homepage') === 'true';
    const all = searchParams.get('all') === 'true';

    const whereClause: any = all ? {} : { isActive: true };

    if (homepage) {
      whereClause.isHomepageFeatured = true;
    }

    const deals = await db.deal.findMany({
      where: whereClause,
      include: {
        dealItems: {
          include: {
            menuItem: true,
          },
        },
      },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json({ deals });
  } catch (error: any) {
    console.error('Fetch deals error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch deals' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireAdminPermission('deals.create');
    const body = await request.json();

    const {
      title,
      slug,
      shortDescription,
      description,
      image,
      originalPrice,
      dealPrice,
      discountType,
      discountValue,
      isActive,
      isFeatured,
      isHomepageFeatured,
      terms,
      dealItems,
    } = body;

    if (!title || dealPrice === undefined || !image) {
      return NextResponse.json({ error: 'Title, Deal Price and Image are required' }, { status: 400 });
    }

    const generatedSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const newDeal = await db.deal.create({
      data: {
        title,
        slug: generatedSlug,
        shortDescription,
        description,
        image,
        originalPrice: originalPrice ? Number(originalPrice) : Number(dealPrice),
        dealPrice: Number(dealPrice),
        discountType: discountType || 'FIXED',
        discountValue: discountValue ? Number(discountValue) : 0,
        isActive: isActive !== undefined ? Boolean(isActive) : true,
        isFeatured: Boolean(isFeatured),
        isHomepageFeatured: Boolean(isHomepageFeatured),
        terms,
        dealItems: dealItems && dealItems.length > 0 ? {
          create: dealItems.map((item: any) => ({
            menuItemId: item.menuItemId,
            quantity: item.quantity ? Number(item.quantity) : 1,
          })),
        } : undefined,
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
        action: 'DEAL_CREATED',
        entityType: 'Deal',
        entityId: newDeal.id,
        metadata: JSON.stringify({ title: newDeal.title, price: newDeal.dealPrice }),
      },
    });

    return NextResponse.json({ success: true, deal: newDeal });
  } catch (error: any) {
    console.error('Create deal error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create deal' }, { status: 500 });
  }
}
