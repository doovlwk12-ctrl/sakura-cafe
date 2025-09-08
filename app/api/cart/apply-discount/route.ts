import { NextRequest, NextResponse } from 'next/server';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  isFreeProduct?: boolean;
}

interface Cart {
  userId: string;
  items: CartItem[];
  subtotal: number;
  total: number;
  appliedDiscountId?: string;
  discount?: { id: string; value: number; type: 'fixed' | 'percentage' };
  pointsUsed?: number;
}

// محاكاة قاعدة البيانات للسلات
const cartDatabase: Cart[] = [];

// محاكاة قاعدة البيانات للمستخدمين
const userDatabase = [
  {
    id: 'customer-001',
    username: 'ahmed_salem',
    loyaltyPoints: 250,
    email: 'ahmed@example.com'
  }
];

// POST - تطبيق خصم النقاط على سلة التسوق
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { userId, pointsToUse, discountType } = body;

    if (!userId || !pointsToUse || pointsToUse <= 0) {
      return NextResponse.json({ 
        error: 'User ID and valid points amount are required' 
      }, { status: 400 });
    }

    // البحث عن المستخدم
    const user = userDatabase.find(u => u.id === userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // التحقق من وجود نقاط كافية
    if (user.loyaltyPoints < pointsToUse) {
      return NextResponse.json({ 
        error: 'Insufficient points',
        availablePoints: user.loyaltyPoints,
        requestedPoints: pointsToUse
      }, { status: 400 });
    }

    // البحث عن سلة التسوق
    let userCart = cartDatabase.find(cart => cart.userId === userId);
    if (!userCart) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
    }

    // حساب قيمة الخصم بناءً على النقاط
    let discountValue = 0;
    if (discountType === 'fixed') {
      // 1 نقطة = 0.1 ريال (10 نقاط = 1 ريال)
      discountValue = pointsToUse * 0.1;
    } else if (discountType === 'percentage') {
      // 1 نقطة = 0.1% خصم (100 نقطة = 10% خصم)
      discountValue = (userCart.subtotal * pointsToUse * 0.1) / 100;
    }

    // التأكد من عدم تجاوز الخصم للمجموع الكلي
    discountValue = Math.min(discountValue, userCart.subtotal);

    // تطبيق الخصم
    userCart.discount = {
      id: `points-discount-${Date.now()}`,
      value: discountValue,
      type: 'fixed'
    };
    userCart.pointsUsed = pointsToUse;
    userCart.total = Math.max(0, userCart.subtotal - discountValue);

    // خصم النقاط من حساب المستخدم
    user.loyaltyPoints -= pointsToUse;

    console.log(`✅ تم تطبيق خصم ${discountValue} ريال باستخدام ${pointsToUse} نقطة للمستخدم ${userId}`);

    return NextResponse.json({
      success: true,
      message: 'تم تطبيق خصم النقاط بنجاح',
      cart: userCart,
      discountApplied: {
        pointsUsed: pointsToUse,
        discountValue: discountValue,
        newTotal: userCart.total
      },
      userPoints: {
        remaining: user.loyaltyPoints,
        used: pointsToUse
      }
    });

  } catch (error) {
    console.error('Error applying points discount:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

// DELETE - إلغاء خصم النقاط
export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ 
        error: 'User ID is required' 
      }, { status: 400 });
    }

    // البحث عن سلة التسوق
    let userCart = cartDatabase.find(cart => cart.userId === userId);
    if (!userCart) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
    }

    // البحث عن المستخدم
    const user = userDatabase.find(u => u.id === userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // إرجاع النقاط للمستخدم
    if (userCart.pointsUsed) {
      user.loyaltyPoints += userCart.pointsUsed;
    }

    // إلغاء الخصم
    userCart.discount = undefined;
    userCart.pointsUsed = undefined;
    userCart.total = userCart.subtotal;

    console.log(`✅ تم إلغاء خصم النقاط وإرجاع ${userCart.pointsUsed} نقطة للمستخدم ${userId}`);

    return NextResponse.json({
      success: true,
      message: 'تم إلغاء خصم النقاط بنجاح',
      cart: userCart,
      userPoints: {
        remaining: user.loyaltyPoints
      }
    });

  } catch (error) {
    console.error('Error removing points discount:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
