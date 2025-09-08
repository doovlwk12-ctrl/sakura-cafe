import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../lib/database';

// GET - جلب منتج محدد
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id;

    console.log('📦 جلب المنتج:', productId);

    const product = await db.getProduct(productId);

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      product
    });

  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - تحديث منتج
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const productId = params.id;
    const body = await request.json();

    console.log('✏️ تحديث المنتج:', productId, body);

    const updatedProduct = await db.updateProduct(productId, body);

    if (!updatedProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'تم تحديث المنتج بنجاح',
      product: updatedProduct
    });

  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - حذف منتج
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const productId = params.id;

    console.log('🗑️ حذف المنتج:', productId);

    const success = await db.deleteProduct(productId);

    if (!success) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'تم حذف المنتج بنجاح'
    });

  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
