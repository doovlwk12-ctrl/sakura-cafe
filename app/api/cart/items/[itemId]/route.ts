import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../../lib/database';

// PUT - تحديث كمية عنصر في سلة التسوق
export async function PUT(
  request: NextRequest,
  { params }: { params: { itemId: string } }
) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = request.headers.get('user-id');
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const { itemId } = params;
    const body = await request.json();
    const { quantity } = body;

    if (typeof quantity !== 'number' || quantity < 0) {
      return NextResponse.json({ error: 'Invalid quantity' }, { status: 400 });
    }

    console.log(`🔄 تحديث كمية العنصر ${itemId} للمستخدم ${userId}:`, quantity);

    // البحث عن العنصر باستخدام product_id
    const cartItems = await db.getCartItems(userId);
    const itemToUpdate = cartItems.find(item => item.product_id === itemId);
    
    if (!itemToUpdate) {
      return NextResponse.json({
        success: false,
        message: 'لم يتم العثور على العنصر في سلة التسوق'
      }, { status: 404 });
    }

    const updatedItem = await db.updateCartItemQuantity(itemToUpdate.id, quantity);
    const updatedCartItems = await db.getCartItems(userId);
    const stats = db.getCartStats(userId);

    if (updatedItem) {
      return NextResponse.json({
        success: true,
        message: 'تم تحديث كمية العنصر بنجاح',
        item: updatedItem,
        cart: {
          items: updatedCartItems,
          stats: {
            totalItems: stats.totalItems,
            subtotal: stats.subtotal,
            totalDiscounts: stats.totalDiscounts,
            finalTotal: stats.finalTotal,
            appliedRewards: stats.appliedRewards,
            itemCount: stats.itemCount
          }
        }
      });
    } else {
      return NextResponse.json({
        success: true,
        message: quantity === 0 ? 'تم حذف العنصر من سلة التسوق' : 'تم تحديث كمية العنصر بنجاح',
        cart: {
          items: updatedCartItems,
          stats: {
            totalItems: stats.totalItems,
            subtotal: stats.subtotal,
            totalDiscounts: stats.totalDiscounts,
            finalTotal: stats.finalTotal,
            appliedRewards: stats.appliedRewards,
            itemCount: stats.itemCount
          }
        }
      });
    }

  } catch (error) {
    console.error('Error updating cart item:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - حذف عنصر محدد من سلة التسوق
export async function DELETE(
  request: NextRequest,
  { params }: { params: { itemId: string } }
) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = request.headers.get('user-id');
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const { itemId } = params;

    console.log(`🗑️ حذف العنصر ${itemId} من سلة التسوق للمستخدم ${userId}`);

    // البحث عن العنصر باستخدام product_id
    const cartItems = await db.getCartItems(userId);
    const itemToDelete = cartItems.find(item => item.product_id === itemId);
    
    if (!itemToDelete) {
      return NextResponse.json({
        success: false,
        message: 'لم يتم العثور على العنصر في سلة التسوق'
      }, { status: 404 });
    }

    const success = await db.removeFromCart(itemToDelete.id);
    const updatedCartItems = await db.getCartItems(userId);
    const stats = db.getCartStats(userId);

    if (success) {
      return NextResponse.json({
        success: true,
        message: 'تم حذف العنصر من سلة التسوق بنجاح',
        cart: {
          items: updatedCartItems,
          stats: {
            totalItems: stats.totalItems,
            subtotal: stats.subtotal,
            totalDiscounts: stats.totalDiscounts,
            finalTotal: stats.finalTotal,
            appliedRewards: stats.appliedRewards,
            itemCount: stats.itemCount
          }
        }
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'لم يتم العثور على العنصر في سلة التسوق'
      }, { status: 404 });
    }

  } catch (error) {
    console.error('Error removing cart item:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
