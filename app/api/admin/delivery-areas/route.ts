import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const areas = await prisma.deliveryArea.findMany({
      include: { branch: true },
      orderBy: { sortOrder: 'asc' },
    });
    return NextResponse.json({ areas });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch delivery areas' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, name, branchId, deliveryFee, minOrder, estimatedTime, isActive, sortOrder } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Area name is required' }, { status: 400 });
    }

    const normalizedName = name.trim().replace(/\s+/g, ' ');

    if (id) {
      const area = await prisma.deliveryArea.update({
        where: { id },
        data: {
          name: normalizedName,
          branchId: branchId || undefined,
          deliveryFee: parseFloat(deliveryFee) || 150,
          minOrder: parseFloat(minOrder) || 300,
          estimatedTime: estimatedTime || '30-45 mins',
          isActive: isActive !== undefined ? isActive : true,
          sortOrder: parseInt(sortOrder, 10) || 0,
        },
      });
      return NextResponse.json({ area, message: 'Delivery area updated successfully.' });
    }

    // Upsert pattern by name if no id specified
    const area = await prisma.deliveryArea.upsert({
      where: { name: normalizedName },
      update: {
        branchId: branchId || undefined,
        deliveryFee: parseFloat(deliveryFee) || 150,
        minOrder: parseFloat(minOrder) || 300,
        estimatedTime: estimatedTime || '30-45 mins',
        isActive: isActive !== undefined ? isActive : true,
        sortOrder: parseInt(sortOrder, 10) || 0,
      },
      create: {
        name: normalizedName,
        branchId: branchId || undefined,
        deliveryFee: parseFloat(deliveryFee) || 150,
        minOrder: parseFloat(minOrder) || 300,
        estimatedTime: estimatedTime || '30-45 mins',
        isActive: isActive !== undefined ? isActive : true,
        sortOrder: parseInt(sortOrder, 10) || 0,
      },
    });

    return NextResponse.json({ area, message: 'Delivery area saved successfully.' });
  } catch (error: any) {
    console.error('Error saving delivery area:', error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'A delivery area with this name already exists.' }, { status: 409 });
    }
    return NextResponse.json({ error: error.message || 'Failed to save delivery area' }, { status: 500 });
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
      return NextResponse.json({ error: 'Delivery area ID is required' }, { status: 400 });
    }

    await prisma.deliveryArea.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Delivery area deleted successfully.' });
  } catch (error: any) {
    console.error('Error deleting delivery area:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete delivery area' }, { status: 500 });
  }
}
