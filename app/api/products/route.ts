import { NextRequest, NextResponse } from 'next/server';
import { products as mockProducts } from '../../../lib/database';

// GET - جلب جميع المنتجات
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    let filteredProducts = mockProducts;
    
    if (category && category !== 'all') {
      filteredProducts = mockProducts.filter(product => product.category === category);
    }
    
    return NextResponse.json({
      success: true,
      data: filteredProducts,
      total: filteredProducts.length
    });
  } catch (error) {
    console.error('خطأ في جلب المنتجات:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في جلب المنتجات' },
      { status: 500 }
    );
  }
}

// POST - إضافة منتج جديد
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const newProduct = {
      id: Date.now().toString(),
      ...body,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // إضافة المنتج لقاعدة البيانات المحلية
    mockProducts.push(newProduct);
    
    return NextResponse.json({
      success: true,
      data: newProduct,
      message: 'تم إضافة المنتج بنجاح'
    });
  } catch (error) {
    console.error('خطأ في إضافة المنتج:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في إضافة المنتج' },
      { status: 500 }
    );
  }
}

// PUT - تحديث منتج
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    
    const productIndex = mockProducts.findIndex(p => p.id === id);
    
    if (productIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'المنتج غير موجود' },
        { status: 404 }
      );
    }
    
    mockProducts[productIndex] = {
      ...mockProducts[productIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    return NextResponse.json({
      success: true,
      data: mockProducts[productIndex],
      message: 'تم تحديث المنتج بنجاح'
    });
  } catch (error) {
    console.error('خطأ في تحديث المنتج:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في تحديث المنتج' },
      { status: 500 }
    );
  }
}

// DELETE - حذف منتج
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'معرف المنتج مطلوب' },
        { status: 400 }
      );
    }
    
    const productIndex = mockProducts.findIndex(p => p.id === id);
    
    if (productIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'المنتج غير موجود' },
        { status: 404 }
      );
    }
    
    const deletedProduct = mockProducts.splice(productIndex, 1)[0];
    
    return NextResponse.json({
      success: true,
      data: deletedProduct,
      message: 'تم حذف المنتج بنجاح'
    });
  } catch (error) {
    console.error('خطأ في حذف المنتج:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في حذف المنتج' },
      { status: 500 }
    );
  }
}
