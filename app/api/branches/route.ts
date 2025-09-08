import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../lib/database';

// GET - جلب جميع الفروع
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const isOpen = searchParams.get('is_open');

    console.log('🏢 جلب الفروع:', { isOpen });

    let branches = await db.getBranches();

    // فلترة حسب حالة الفتح إذا تم تحديدها
    if (isOpen !== null) {
      const openStatus = isOpen === 'true';
      branches = branches.filter(branch => branch.is_open === openStatus);
    }

    return NextResponse.json({
      success: true,
      branches,
      total: branches.length
    });

  } catch (error) {
    console.error('Error fetching branches:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
