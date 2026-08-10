import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdminPermission } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { name, phone, email, date, time, guests, specialRequests } = await request.json();

    if (!name || !phone || !date || !time || !guests) {
      return NextResponse.json(
        { error: 'Name, Phone, Date, Time, and Guest count are required' },
        { status: 400 }
      );
    }

    const reservation = await db.reservation.create({
      data: {
        name,
        phone,
        email: email || null,
        date,
        time,
        guests: Number(guests),
        specialRequest: specialRequests || null,
        status: 'PENDING',
      },
    });

    await db.notification.create({
      data: {
        title: 'New Table Reservation',
        message: `Reservation for ${reservation.guests} guests on ${reservation.date} at ${reservation.time} by ${reservation.name}`,
        type: 'RESERVATION',
      },
    });

    return NextResponse.json({ success: true, reservation });
  } catch (error: any) {
    console.error('Create reservation error:', error);
    return NextResponse.json({ error: error.message || 'Failed to submit reservation' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    await requireAdminPermission('reservations.view');

    const reservations = await db.reservation.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return NextResponse.json({ reservations });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch reservations' }, { status: 500 });
  }
}
