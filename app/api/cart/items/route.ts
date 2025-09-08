import { NextRequest, NextResponse } from 'next/server';
import { db, validateCartItem, type CartItem } from '../../../../lib/database';

// GET - جلب عناصر سلة التسوق للمستخدم
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

    console.log('🛒 جلب عناصر سلة التسوق للمستخدم:', userId);

    const cartItems = await db.getCartItems(userId);
    const cartRewards = await db.getCartRewards(userId);
    const availableRewards = await db.getAvailableRewards(userId);
    const stats = db.getCartStats(userId);
    const user = await db.getUser(userId);

    return NextResponse.json({
      success: true,
      items: cartItems,
      rewards: {
        available: availableRewards,
        applied: cartRewards
      },
      stats: {
        totalItems: stats.totalItems,
        subtotal: stats.subtotal,
        totalDiscounts: stats.totalDiscounts,
        finalTotal: stats.finalTotal,
        itemCount: stats.itemCount,
        appliedRewards: stats.appliedRewards
      },
      userPoints: user?.loyalty_points || 0,
      pointsExpiryDate: user?.points_expiry_date
    });

  } catch (error) {
    console.error('Error fetching cart items:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - إضافة منتج إلى سلة التسوق
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
    const { product_id, product_name, product_arabic_name, price, quantity, image, category, customizations } = body;

    // التحقق من صحة البيانات
    if (!product_id || !product_name || !product_arabic_name || !price || !quantity) {
      return NextResponse.json({ 
        error: 'Missing required fields: product_id, product_name, product_arabic_name, price, quantity' 
      }, { status: 400 });
    }

    const cartItem = {
      user_id: userId,
      product_id,
      product_name,
      product_arabic_name,
      price: parseFloat(price),
      quantity: parseInt(quantity),
      image: image || '/images/fallback.svg',
      category: category || 'general',
      customizations: customizations || {}
    };

    if (!validateCartItem(cartItem)) {
      return NextResponse.json({ error: 'Invalid cart item data' }, { status: 400 });
    }

    console.log('➕ إضافة منتج إلى سلة التسوق:', cartItem);

    const addedItem = await db.addToCart(cartItem);
    const updatedCartItems = await db.getCartItems(userId);
    const stats = db.getCartStats(userId);

    return NextResponse.json({
      success: true,
      message: 'تم إضافة المنتج إلى سلة التسوق بنجاح',
      item: addedItem,
      cart: {
        items: updatedCartItems,
        stats: {
          totalItems: stats.totalItems,
          subtotal: stats.subtotal,
          totalDiscounts: stats.totalDiscounts,
          finalTotal: stats.finalTotal,
          itemCount: stats.itemCount,
          appliedRewards: stats.appliedRewards
        }
      }
    });

  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - حذف جميع عناصر سلة التسوق
export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = request.headers.get('user-id');
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    console.log('🗑️ حذف جميع عناصر سلة التسوق للمستخدم:', userId);

    const success = await db.clearCart(userId);

    if (success) {
      return NextResponse.json({
        success: true,
        message: 'تم حذف جميع عناصر سلة التسوق بنجاح'
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'لم يتم العثور على عناصر في سلة التسوق'
      });
    }

  } catch (error) {
    console.error('Error clearing cart:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
