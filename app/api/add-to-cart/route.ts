import { NextRequest, NextResponse } from 'next/server';

// محاكاة قاعدة البيانات لسلة التسوق
let cartDatabase: any[] = [];

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const body = await request.json();
    const { userId, product, isFreeProduct = false } = body;

    // البحث عن سلة التسوق الخاصة بالمستخدم
    let userCart = cartDatabase.find(cart => cart.userId === userId);

    if (!userCart) {
      // إنشاء سلة تسوق جديدة
      userCart = {
        id: `cart-${userId}`,
        userId,
        items: [],
        subtotal: 0,
        discount: undefined,
        appliedDiscountId: undefined,
        total: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      cartDatabase.push(userCart);
    }

    // إضافة المنتج إلى السلة
    const cartItem = {
      id: product.id,
      name: product.name,
      price: isFreeProduct ? 0 : product.price, // المنتجات المجانية سعرها 0
      quantity: 1,
      image: product.image || '☕',
      isFreeProduct: isFreeProduct,
      addedAt: new Date().toISOString()
    };

    // التحقق من وجود المنتج في السلة
    const existingItemIndex = userCart.items.findIndex(
      (item: any) => item.id === product.id
    );

    if (existingItemIndex !== -1) {
      // زيادة الكمية
      userCart.items[existingItemIndex].quantity += 1;
    } else {
      // إضافة منتج جديد
      userCart.items.push(cartItem);
    }

    // إعادة حساب المجموع
    userCart.subtotal = userCart.items.reduce(
      (sum: number, item: any) => sum + (item.price * item.quantity), 0
    );

    // إعادة حساب المجموع النهائي
    if (userCart.discount) {
      if (userCart.discount.type === 'fixed') {
        userCart.total = Math.max(0, userCart.subtotal - userCart.discount.value);
      } else if (userCart.discount.type === 'percentage') {
        userCart.total = userCart.subtotal * (1 - userCart.discount.value / 100);
      }
    } else {
      userCart.total = userCart.subtotal;
    }

    userCart.updatedAt = new Date().toISOString();

    console.log(`✅ تم إضافة ${isFreeProduct ? 'منتج مجاني' : 'منتج'} إلى سلة التسوق:`, {
      userId,
      productName: product.name,
      isFreeProduct,
      cartTotal: userCart.total
    });

    return NextResponse.json({
      success: true,
      message: isFreeProduct 
        ? 'تم إضافة المنتج المجاني إلى سلة التسوق' 
        : 'تم إضافة المنتج إلى سلة التسوق',
      cart: {
        id: userCart.id,
        items: userCart.items,
        subtotal: userCart.subtotal,
        total: userCart.total,
        itemCount: userCart.items.length
      }
    });

  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

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
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const userCart = cartDatabase.find(cart => cart.userId === userId);

    if (!userCart) {
      return NextResponse.json({
        success: true,
        cart: {
          id: `cart-${userId}`,
          userId,
          items: [],
          subtotal: 0,
          total: 0,
          itemCount: 0
        }
      });
    }

    return NextResponse.json({
      success: true,
      cart: {
        id: userCart.id,
        items: userCart.items,
        subtotal: userCart.subtotal,
        total: userCart.total,
        itemCount: userCart.items.length
      }
    });

  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
