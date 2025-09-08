import { NextRequest, NextResponse } from 'next/server';

// محاكاة قاعدة البيانات لسلة التسوق
let cartDatabase: any[] = [
  // بيانات تجريبية للاختبار
  {
    userId: 'customer-001',
    items: [
      {
        id: 'coffee-001',
        name: 'Cappuccino',
        arabicName: 'كابتشينو',
        price: 15.00,
        quantity: 2,
        image: '/images/coffee/cappuccino.jpg',
        customizations: {
          size: 'Medium',
          extras: ['Extra Shot']
        }
      },
      {
        id: 'dessert-001',
        name: 'Tiramisu',
        arabicName: 'تيراميسو',
        price: 25.00,
        quantity: 1,
        image: '/images/desserts/tiramisu.jpg'
      }
    ],
    subtotal: 55.00,
    total: 55.00,
    appliedDiscount: null,
    discount: null,
    pointsUsed: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// محاكاة قاعدة البيانات للخصومات المستخدمة
let usedDiscounts: any[] = [];

// GET - جلب محتويات سلة التسوق
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const userId = request.headers.get('user-id');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // البحث عن سلة التسوق للمستخدم
    const userCart = cartDatabase.find(cart => cart.userId === userId);
    
    if (!userCart) {
      return NextResponse.json({
        success: true,
        cart: {
          userId,
          items: [],
          subtotal: 0,
          discount: 0,
          total: 0,
          appliedDiscount: null
        }
      });
    }

    return NextResponse.json({
      success: true,
      cart: userCart
    });

  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - إضافة منتج إلى سلة التسوق
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const body = await request.json();
    const { userId, item } = body;

    if (!userId || !item) {
      return NextResponse.json(
        { error: 'User ID and item are required' },
        { status: 400 }
      );
    }

    // البحث عن سلة التسوق للمستخدم
    let userCart = cartDatabase.find(cart => cart.userId === userId);
    
    if (!userCart) {
      // إنشاء سلة تسوق جديدة
      userCart = {
        userId,
        items: [],
        subtotal: 0,
        discount: 0,
        total: 0,
        appliedDiscount: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      cartDatabase.push(userCart);
    }

    // التحقق من وجود المنتج في السلة
    const existingItemIndex = userCart.items.findIndex(
      (cartItem: any) => cartItem.id === item.id
    );

    if (existingItemIndex !== -1) {
      // زيادة الكمية
      userCart.items[existingItemIndex].quantity += item.quantity || 1;
    } else {
      // إضافة منتج جديد
      userCart.items.push({
        ...item,
        quantity: item.quantity || 1
      });
    }

    // إعادة حساب المجموع
    userCart.subtotal = userCart.items.reduce(
      (sum: number, cartItem: any) => sum + (cartItem.price * cartItem.quantity), 0
    );

    // إعادة حساب المجموع النهائي
    userCart.total = userCart.subtotal - userCart.discount;
    userCart.updatedAt = new Date().toISOString();

    return NextResponse.json({
      success: true,
      message: 'تم إضافة المنتج إلى السلة',
      cart: userCart
    });

  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - تحديث سلة التسوق (تطبيق خصم)
export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const body = await request.json();
    const { userId, discountId, action } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // البحث عن سلة التسوق للمستخدم
    const userCart = cartDatabase.find(cart => cart.userId === userId);
    
    if (!userCart) {
      return NextResponse.json(
        { error: 'سلة التسوق فارغة' },
        { status: 404 }
      );
    }

    if (action === 'apply_discount') {
      // التحقق من عدم وجود خصم مطبق مسبقاً
      if (userCart.appliedDiscount) {
        return NextResponse.json(
          { error: 'يوجد خصم مطبق مسبقاً. يمكن استخدام خصم واحد فقط لكل طلب' },
          { status: 400 }
        );
      }

      // البحث عن الخصم
      const discount = usedDiscounts.find(d => 
        d.discountId === discountId && d.userId === userId && d.status === 'active'
      );

      if (!discount) {
        return NextResponse.json(
          { error: 'الخصم غير متاح أو غير صالح' },
          { status: 404 }
        );
      }

      // التحقق من الحد الأدنى للطلب
      if (userCart.subtotal < discount.minOrderAmount) {
        return NextResponse.json(
          { error: `الحد الأدنى للطلب ${discount.minOrderAmount} ريال` },
          { status: 400 }
        );
      }

      // تطبيق الخصم
      userCart.discount = discount.discountAmount;
      userCart.appliedDiscount = discount;
      userCart.total = userCart.subtotal - userCart.discount;
      userCart.updatedAt = new Date().toISOString();

      return NextResponse.json({
        success: true,
        message: 'تم تطبيق الخصم بنجاح',
        cart: userCart
      });

    } else if (action === 'remove_discount') {
      // إلغاء الخصم
      userCart.discount = 0;
      userCart.appliedDiscount = null;
      userCart.total = userCart.subtotal;
      userCart.updatedAt = new Date().toISOString();

      return NextResponse.json({
        success: true,
        message: 'تم إلغاء الخصم',
        cart: userCart
      });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Error updating cart:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - حذف منتج من سلة التسوق
export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const itemId = searchParams.get('itemId');

    if (!userId || !itemId) {
      return NextResponse.json(
        { error: 'User ID and item ID are required' },
        { status: 400 }
      );
    }

    // البحث عن سلة التسوق للمستخدم
    const userCart = cartDatabase.find(cart => cart.userId === userId);
    
    if (!userCart) {
      return NextResponse.json(
        { error: 'سلة التسوق فارغة' },
        { status: 404 }
      );
    }

    // حذف المنتج
    userCart.items = userCart.items.filter((item: any) => item.id !== itemId);

    // إعادة حساب المجموع
    userCart.subtotal = userCart.items.reduce(
      (sum: number, cartItem: any) => sum + (cartItem.price * cartItem.quantity), 0
    );

    // إعادة حساب المجموع النهائي
    userCart.total = userCart.subtotal - userCart.discount;
    userCart.updatedAt = new Date().toISOString();

    return NextResponse.json({
      success: true,
      message: 'تم حذف المنتج من السلة',
      cart: userCart
    });

  } catch (error) {
    console.error('Error removing from cart:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
