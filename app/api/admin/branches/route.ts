import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const branches = await prisma.branch.findMany({
      orderBy: { createdAt: 'asc' },
    });
    return NextResponse.json({ branches });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch branches' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, name, address, locationReference, phone, whatsapp, mapUrl, openingHours, isActive } = body;

    if (!name || !address) {
      return NextResponse.json({ error: 'Branch name and address are required' }, { status: 400 });
    }

    const slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');

    // Duplicate slug check
    const existing = await prisma.branch.findFirst({
      where: {
        slug,
        ...(id ? { NOT: { id } } : {}),
      },
    });

    if (existing) {
      return NextResponse.json({ error: 'A branch with this slug already exists.' }, { status: 400 });
    }

    if (id) {
      const branch = await prisma.branch.update({
        where: { id },
        data: {
          slug,
          name,
          address,
          locationReference,
          phone: phone || '+92 343 1265090',
          whatsapp,
          mapUrl,
          openingHours: openingHours || '12:00 PM - 01:00 AM',
          isActive: isActive !== undefined ? isActive : true,
        },
      });
      return NextResponse.json({ branch, message: 'Branch updated successfully.' });
    } else {
      const branch = await prisma.branch.create({
        data: {
          slug,
          name,
          address,
          locationReference,
          phone: phone || '+92 343 1265090',
          whatsapp,
          mapUrl,
          openingHours: openingHours || '12:00 PM - 01:00 AM',
          isActive: isActive !== undefined ? isActive : true,
        },
      });
      return NextResponse.json({ branch, message: 'Branch created successfully.' });
    }
  } catch (error: any) {
    console.error('Error saving branch:', error);
    return NextResponse.json({ error: error.message || 'Failed to save branch' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  return POST(req);
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Branch ID is required' }, { status: 400 });
    }

    // Check for associated orders before deleting
    const orderCount = await prisma.order.count({
      where: { branchId: id },
    });

    if (orderCount > 0) {
      return NextResponse.json(
        {
          error:
            'This branch cannot be permanently deleted because it has existing orders associated with it. You can deactivate or archive it instead.',
          hasDependencies: true,
        },
        { status: 400 }
      );
    }

    await prisma.branch.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Branch deleted successfully.' });
  } catch (error: any) {
    console.error('Error deleting branch:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete branch' }, { status: 500 });
  }
}
