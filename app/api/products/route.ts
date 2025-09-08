import { NextRequest, NextResponse } from 'next/server';
import { db, type Product } from '../../../lib/database';

// GET - جلب جميع المنتجات أو فلترة حسب الفئة
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status');

    console.log('📦 جلب المنتجات:', { category, status });

    let products = await db.getProducts(category || undefined);

    // فلترة حسب الحالة إذا تم تحديدها
    if (status) {
      products = products.filter(product => product.status === status);
    }

    return NextResponse.json({
      success: true,
      products,
      total: products.length
    });

  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - إنشاء منتج جديد
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { 
      name, 
      name_ar, 
      description, 
      description_ar, 
      price, 
      category, 
      image, 
      calories, 
      stock, 
      status 
    } = body;

    // التحقق من صحة البيانات
    if (!name || !name_ar || !price || !category) {
      return NextResponse.json({ 
        error: 'Missing required fields: name, name_ar, price, category' 
      }, { status: 400 });
    }

    const productData = {
      name,
      name_ar,
      description: description || '',
      description_ar: description_ar || '',
      price: parseFloat(price),
      category,
      image: image || '/images/fallback.svg',
      calories: parseInt(calories) || 0,
      stock: parseInt(stock) || 0,
      status: status || 'active'
    };

    console.log('➕ إنشاء منتج جديد:', productData);

    const newProduct = await db.createProduct(productData);

    return NextResponse.json({
      success: true,
      message: 'تم إنشاء المنتج بنجاح',
      product: newProduct
    });

  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
