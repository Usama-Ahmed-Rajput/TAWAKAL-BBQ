import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdminPermission } from '@/lib/auth';

export async function GET() {
  try {
    await requireAdminPermission('settings.manage');
    const settings = await db.restaurantSetting.findMany();
    const settingsMap: Record<string, string> = {};
    settings.forEach((s: any) => {
      settingsMap[s.key] = s.value;
    });

    return NextResponse.json({ settings: settingsMap });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await requireAdminPermission('settings.manage');
    const body = await request.json();

    for (const [key, value] of Object.entries(body)) {
      await db.restaurantSetting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      });
    }

    await db.auditLog.create({
      data: {
        userId: session.id,
        userName: session.name,
        action: 'SETTINGS_UPDATED',
        entityType: 'RestaurantSetting',
        metadata: JSON.stringify(body),
      },
    });

    return NextResponse.json({ success: true, message: 'Settings saved successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to save settings' }, { status: 500 });
  }
}
