import { NextRequest, NextResponse } from 'next/server';
import { db, type Order, type OrderItem } from '../../../lib/database';

// GET - جلب الطلبات
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const branchId = searchParams.get('branch_id');
    const status = searchParams.get('status');
    const limit = searchParams.get('limit');

    console.log('📋 جلب الطلبات:', { branchId, status, limit });

    let orders = await db.getOrders(branchId || undefined, status || undefined);

    // تحديد عدد النتائج إذا تم تحديده
    if (limit) {
      orders = orders.slice(0, parseInt(limit));
    }

    return NextResponse.json({
      success: true,
      orders,
      total: orders.length
    });

  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - إنشاء طلب جديد
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { 
      user_id,
      customer_name,
      customer_phone,
      branch_id,
      branch_name,
      items,
      order_type,
      payment_method,
      notes
    } = body;

    // التحقق من صحة البيانات
    if (!user_id || !customer_name || !customer_phone || !branch_id || !items || !Array.isArray(items)) {
      return NextResponse.json({ 
        error: 'Missing required fields: user_id, customer_name, customer_phone, branch_id, items' 
      }, { status: 400 });
    }

    // حساب المجموع
    const subtotal = items.reduce((sum: number, item: OrderItem) => sum + (item.price * item.quantity), 0);
    const discount = 0; // يمكن إضافة حساب الخصومات هنا
    const total = subtotal - discount;

    // حساب الوقت المتوقع (15 دقيقة لكل منتج)
    const estimatedTime = items.reduce((sum: number, item: OrderItem) => sum + (item.quantity * 15), 0);

    const orderData = {
      user_id,
      customer_name,
      customer_phone,
      branch_id,
      branch_name: branch_name || 'فرع غير محدد',
      items,
      subtotal,
      discount,
      total,
      status: 'pending' as const,
      order_type: order_type || 'pickup',
      payment_method: payment_method || 'cash',
      payment_status: 'pending' as const,
      notes,
      estimated_time: estimatedTime
    };

    console.log('➕ إنشاء طلب جديد:', orderData);

    const newOrder = await db.createOrder(orderData);

    // إضافة نقاط المكافآت للمستخدم
    const pointsEarned = Math.floor(total * 0.1); // 1 نقطة لكل ريال
    await db.addPointsToUser(user_id, pointsEarned);

    return NextResponse.json({
      success: true,
      message: 'تم إنشاء الطلب بنجاح',
      order: newOrder,
      pointsEarned
    });

  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}