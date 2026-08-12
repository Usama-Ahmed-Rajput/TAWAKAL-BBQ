import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { checkRateLimit } from '@/lib/rateLimit';

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const rateLimit = checkRateLimit(`track_${ip}`, 10, 60 * 1000); // 10 tracking requests per minute

    if (!rateLimit.success) {
      return NextResponse.json(
        { success: false, error: 'Too many order tracking requests. Please wait a minute.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { orderNumber, phone } = body;

    return await handleTrackOrder(orderNumber, phone);
  } catch (error: any) {
    console.error('[TRACK ORDER API ERROR]:', error);
    return NextResponse.json(
      { success: false, error: 'An error occurred while tracking your order.' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orderNumber = searchParams.get('orderNumber');
    const phone = searchParams.get('phone');

    return await handleTrackOrder(orderNumber, phone);
  } catch (error: any) {
    console.error('[TRACK ORDER API ERROR]:', error);
    return NextResponse.json(
      { success: false, error: 'An error occurred while tracking your order.' },
      { status: 500 }
    );
  }
}

async function handleTrackOrder(rawOrderNumber?: string | null, rawPhone?: string | null) {
  if (!rawOrderNumber || !rawPhone) {
    return NextResponse.json(
      { success: false, error: 'Please provide both Order Number and Phone Number.' },
      { status: 400 }
    );
  }

  const orderNumber = rawOrderNumber.trim().toUpperCase();
  const inputPhoneDigits = rawPhone.replace(/[^0-9]/g, '');

  if (inputPhoneDigits.length < 7) {
    return NextResponse.json(
      { success: false, error: 'Please enter a valid Phone Number.' },
      { status: 400 }
    );
  }

  // Find order by exact or case-insensitive orderNumber
  const order = await prisma.order.findFirst({
    where: {
      orderNumber: { equals: orderNumber, mode: 'insensitive' },
    },
    include: {
      orderItems: {
        select: {
          id: true,
          name: true,
          price: true,
          quantity: true,
          variantName: true,
          notes: true,
        },
      },
    },
  });

  if (!order) {
    return NextResponse.json(
      {
        success: false,
        error: 'No order found matching the provided Order Number and Phone Number.',
      },
      { status: 404 }
    );
  }

  // Verify phone number match (compare last 7-10 digits)
  const dbPhoneDigits = order.customerPhone.replace(/[^0-9]/g, '');
  const inputLast7 = inputPhoneDigits.slice(-7);
  const dbLast7 = dbPhoneDigits.slice(-7);

  if (inputLast7 !== dbLast7) {
    return NextResponse.json(
      {
        success: false,
        error: 'No order found matching the provided Order Number and Phone Number.',
      },
      { status: 404 }
    );
  }

  // Return ONLY sanitized customer-facing payload
  const safeOrderPayload = {
    orderNumber: order.orderNumber,
    customerName: order.customerName,
    customerPhone: order.customerPhone,
    orderType: order.orderType,
    orderStatus: order.orderStatus,
    subtotal: order.subtotal,
    deliveryFee: order.deliveryFee,
    discountAmount: order.discountAmount,
    totalAmount: order.totalAmount,
    deliveryAddress: order.deliveryAddress,
    deliveryArea: order.deliveryArea,
    deliveryNotes: order.deliveryNotes,
    createdAt: order.createdAt,
    orderItems: order.orderItems,
  };

  return NextResponse.json({
    success: true,
    order: safeOrderPayload,
  });
}
