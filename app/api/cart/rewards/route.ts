import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../lib/database';

// GET - جلب المكافآت المتاحة للمستخدم
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = request.headers.get('user-id');
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    console.log('🎁 جلب المكافآت المتاحة للمستخدم:', userId);

    const availableRewards = await db.getAvailableRewards(userId);
    const cartRewards = await db.getCartRewards(userId);
    const user = await db.getUser(userId);

    return NextResponse.json({
      success: true,
      availableRewards,
      appliedRewards: cartRewards,
      userPoints: user?.loyalty_points || 0,
      pointsExpiryDate: user?.points_expiry_date
    });

  } catch (error) {
    console.error('Error fetching rewards:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - تطبيق مكافأة على سلة التسوق
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = request.headers.get('user-id');
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const body = await request.json();
    const { rewardId, action } = body;

    if (!rewardId || !action) {
      return NextResponse.json({ 
        error: 'Missing required fields: rewardId, action' 
      }, { status: 400 });
    }

    console.log(`🎁 ${action === 'apply' ? 'تطبيق' : 'إزالة'} المكافأة ${rewardId} للمستخدم ${userId}`);

    let result;
    if (action === 'apply') {
      result = await db.applyReward(userId, rewardId);
    } else if (action === 'remove') {
      result = await db.removeReward(userId, rewardId);
    } else {
      return NextResponse.json({ error: 'Invalid action. Use "apply" or "remove"' }, { status: 400 });
    }

    if (result.success) {
      // جلب البيانات المحدثة
      const availableRewards = await db.getAvailableRewards(userId);
      const cartRewards = await db.getCartRewards(userId);
      const cartItems = await db.getCartItems(userId);
      const cartStats = db.getCartStats(userId);
      const user = await db.getUser(userId);

      return NextResponse.json({
        success: true,
        message: result.message,
        cartReward: result.cartReward || null,
        cart: {
          items: cartItems,
          rewards: cartRewards,
          stats: cartStats
        },
        availableRewards,
        userPoints: user?.loyalty_points || 0,
        pointsExpiryDate: user?.points_expiry_date
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        error: result.message 
      }, { status: 400 });
    }

  } catch (error) {
    console.error('Error managing reward:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
