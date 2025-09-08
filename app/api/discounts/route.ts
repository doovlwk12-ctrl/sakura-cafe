import { NextRequest, NextResponse } from 'next/server';

// محاكاة قاعدة البيانات للخصومات المستخدمة
let usedDiscounts: any[] = [];

// محاكاة قاعدة البيانات للخصومات المستبدلة بالنقاط
let redeemedDiscounts: any[] = [
  // بيانات تجريبية للاختبار
  {
    id: 'redeemed-test-001',
    discountId: 'REWARD-001',
    userId: 'customer-001',
    pointsUsed: 100,
    rewardName: 'خصم 10 ريال',
    discountDetails: {
      id: 'REWARD-001',
      name: 'خصم 10 ريال',
      description: 'خصم 10 ريال على أي طلب',
      value: 10,
      type: 'fixed',
      minOrderAmount: 0,
      maxDiscountAmount: 10,
      isActive: true,
      usageLimit: 1,
      pointsRequired: 100
    },
    redeemedAt: new Date().toISOString(),
    status: 'available',
    usedInOrder: null
  },
  {
    id: 'redeemed-test-002',
    discountId: 'REWARD-002',
    userId: 'customer-001',
    pointsUsed: 200,
    rewardName: 'خصم 20 ريال',
    discountDetails: {
      id: 'REWARD-002',
      name: 'خصم 20 ريال',
      description: 'خصم 20 ريال على أي طلب',
      value: 20,
      type: 'fixed',
      minOrderAmount: 0,
      maxDiscountAmount: 20,
      isActive: true,
      usageLimit: 1,
      pointsRequired: 200
    },
    redeemedAt: new Date().toISOString(),
    status: 'available',
    usedInOrder: null
  }
];

// محاكاة قاعدة البيانات للخصومات المتاحة
const availableDiscounts = [
  {
    id: 'DISCOUNT-001',
    name: 'خصم 10 ريال',
    description: 'خصم 10 ريال على أي طلب',
    value: 10,
    type: 'fixed',
    minOrderAmount: 0,
    maxDiscountAmount: 10,
    isActive: true,
    usageLimit: 1, // مرة واحدة فقط لكل طلب
    pointsRequired: 100
  },
  {
    id: 'DISCOUNT-002',
    name: 'خصم 20 ريال',
    description: 'خصم 20 ريال على أي طلب',
    value: 20,
    type: 'fixed',
    minOrderAmount: 0,
    maxDiscountAmount: 20,
    isActive: true,
    usageLimit: 1,
    pointsRequired: 200
  },
  {
    id: 'DISCOUNT-003',
    name: 'خصم 50 ريال',
    description: 'خصم 50 ريال على طلب بقيمة 100 ريال أو أكثر',
    value: 50,
    type: 'fixed',
    minOrderAmount: 100,
    maxDiscountAmount: 50,
    isActive: true,
    usageLimit: 1,
    pointsRequired: 500
  }
];

// GET - جلب الخصومات المتاحة
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const userId = request.headers.get('user-id');

    return NextResponse.json({
      success: true,
      discounts: availableDiscounts,
      usedDiscounts: usedDiscounts.filter(d => d.userId === userId),
      redeemedDiscounts: redeemedDiscounts.filter(d => d.userId === userId)
    });

  } catch (error) {
    console.error('Error fetching discounts:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - تطبيق خصم على الطلب
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const body = await request.json();
    const { discountId, orderId, userId, orderAmount } = body;

    // البحث عن الخصم
    const discount = availableDiscounts.find(d => d.id === discountId);
    if (!discount) {
      return NextResponse.json(
        { error: 'الخصم غير موجود' },
        { status: 404 }
      );
    }

    // التحقق من الحد الأدنى للطلب
    if (orderAmount < discount.minOrderAmount) {
      return NextResponse.json(
        { error: `الحد الأدنى للطلب ${discount.minOrderAmount} ريال` },
        { status: 400 }
      );
    }

    // التحقق من عدم استخدام الخصم مسبقاً لهذا الطلب
    const alreadyUsed = usedDiscounts.find(d => 
      d.discountId === discountId && d.orderId === orderId
    );

    if (alreadyUsed) {
      return NextResponse.json(
        { error: 'تم استخدام هذا الخصم مسبقاً لهذا الطلب' },
        { status: 400 }
      );
    }

    // التحقق من عدم استخدام خصم آخر لهذا الطلب
    const otherDiscountUsed = usedDiscounts.find(d => 
      d.orderId === orderId && d.userId === userId
    );

    if (otherDiscountUsed) {
      return NextResponse.json(
        { error: 'يمكن استخدام خصم واحد فقط لكل طلب' },
        { status: 400 }
      );
    }

    // حساب قيمة الخصم
    let discountAmount = discount.value;
    if (discount.type === 'percentage') {
      discountAmount = (orderAmount * discount.value) / 100;
    }

    // التأكد من عدم تجاوز الحد الأقصى
    if (discountAmount > discount.maxDiscountAmount) {
      discountAmount = discount.maxDiscountAmount;
    }

    // إضافة الخصم إلى قائمة الخصومات المستخدمة
    const usedDiscount = {
      id: `used-${Date.now()}`,
      discountId,
      orderId,
      userId,
      discountAmount,
      orderAmount,
      appliedAt: new Date().toISOString(),
      status: 'active'
    };

    usedDiscounts.push(usedDiscount);

    return NextResponse.json({
      success: true,
      message: 'تم تطبيق الخصم بنجاح',
      discount: {
        id: discount.id,
        name: discount.name,
        amount: discountAmount,
        type: discount.type
      },
      usedDiscount
    });

  } catch (error) {
    console.error('Error applying discount:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - إلغاء خصم
export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const { searchParams } = new URL(request.url);
    const usedDiscountId = searchParams.get('usedDiscountId');

    if (!usedDiscountId) {
      return NextResponse.json(
        { error: 'معرف الخصم مطلوب' },
        { status: 400 }
      );
    }

    // البحث عن الخصم المستخدم
    const discountIndex = usedDiscounts.findIndex(d => d.id === usedDiscountId);
    
    if (discountIndex === -1) {
      return NextResponse.json(
        { error: 'الخصم غير موجود' },
        { status: 404 }
      );
    }

    // حذف الخصم
    usedDiscounts.splice(discountIndex, 1);

    return NextResponse.json({
      success: true,
      message: 'تم إلغاء الخصم بنجاح'
    });

  } catch (error) {
    console.error('Error removing discount:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - إضافة خصم مستبدل بالنقاط
export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const body = await request.json();
    const { discountId, userId, pointsUsed, rewardName } = body;

    // البحث عن الخصم في قائمة الخصومات المتاحة
    let discount = availableDiscounts.find(d => d.id === discountId);
    
    // إذا لم يتم العثور على الخصم، ابحث في مكافآت الخصم
    if (!discount) {
      // محاكاة مكافآت الخصم من نظام المكافآت
      const rewardDiscounts = [
        {
          id: 'REWARD-001', // خصم 10 ريال
          name: 'خصم 10 ريال',
          description: 'خصم 10 ريال على أي طلب',
          value: 10,
          type: 'fixed',
          minOrderAmount: 0,
          maxDiscountAmount: 10,
          isActive: true,
          usageLimit: 1,
          pointsRequired: 100
        },
        {
          id: 'REWARD-002', // خصم 20 ريال
          name: 'خصم 20 ريال',
          description: 'خصم 20 ريال على أي طلب',
          value: 20,
          type: 'fixed',
          minOrderAmount: 0,
          maxDiscountAmount: 20,
          isActive: true,
          usageLimit: 1,
          pointsRequired: 200
        },
        {
          id: 'REWARD-005', // خصم 50 ريال
          name: 'خصم 50 ريال',
          description: 'خصم 50 ريال على طلب بقيمة 100 ريال أو أكثر',
          value: 50,
          type: 'fixed',
          minOrderAmount: 100,
          maxDiscountAmount: 50,
          isActive: true,
          usageLimit: 1,
          pointsRequired: 500
        }
      ];
      
      discount = rewardDiscounts.find(d => d.id === discountId);
    }
    
    if (!discount) {
      return NextResponse.json(
        { error: 'الخصم غير موجود' },
        { status: 404 }
      );
    }

    // إضافة الخصم المستبدل
    const redeemedDiscount = {
      id: `redeemed-${Date.now()}`,
      discountId,
      userId,
      pointsUsed,
      rewardName,
      discountDetails: discount,
      redeemedAt: new Date().toISOString(),
      status: 'available', // متاح للاستخدام
      usedInOrder: null // لم يتم استخدامه في طلب بعد
    };

    redeemedDiscounts.push(redeemedDiscount);

    return NextResponse.json({
      success: true,
      message: 'تم استبدال الخصم بنجاح',
      redeemedDiscount
    });

  } catch (error) {
    console.error('Error redeeming discount:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
