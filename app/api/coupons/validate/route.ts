import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { checkRateLimit } from '@/lib/rateLimit';

export async function POST(request: Request) {
  try {
    // 1. Fail-safe Rate Limiting (5 requests per minute per IP)
    try {
      const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';
      const rateLimit = checkRateLimit(`coupon_validate_${ip}`, 5, 60 * 1000);

      if (!rateLimit.success) {
        const retryAfterSeconds = Math.ceil(rateLimit.resetInMs / 1000);
        return NextResponse.json(
          { error: 'Too many coupon validation attempts. Please wait a minute before trying again.' },
          {
            status: 429,
            headers: {
              'Retry-After': String(retryAfterSeconds),
            },
          }
        );
      }
    } catch (rlErr) {
      console.warn('[RATE LIMITER WARNING]: Non-blocking rate limiter exception:', rlErr);
    }

    const { code, subtotal } = await request.json();

    if (!code || subtotal === undefined) {
      return NextResponse.json({ error: 'Coupon code and subtotal are required' }, { status: 400 });
    }

    const coupon = await db.coupon.findUnique({
      where: { code: String(code).trim().toUpperCase() },
    });

    if (!coupon || !coupon.isActive) {
      return NextResponse.json({ error: 'Invalid or inactive coupon code' }, { status: 400 });
    }

    if (coupon.minOrder && subtotal < coupon.minOrder) {
      return NextResponse.json(
        { error: `Minimum order amount of Rs. ${coupon.minOrder} required for this coupon` },
        { status: 400 }
      );
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json({ error: 'Coupon code usage limit has been reached' }, { status: 400 });
    }

    let discountAmount = 0;
    if (coupon.discountType === 'PERCENTAGE') {
      discountAmount = (subtotal * coupon.discountValue) / 100;
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    } else {
      discountAmount = coupon.discountValue;
    }

    discountAmount = Math.min(discountAmount, subtotal);
    discountAmount = Math.round(discountAmount);

    return NextResponse.json({
      valid: true,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to validate coupon' }, { status: 500 });
  }
}
