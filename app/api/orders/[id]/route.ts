import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../lib/database';

// GET - جلب طلب محدد
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = params.id;

    console.log('📋 جلب الطلب:', orderId);

    const order = await db.getOrder(orderId);

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      order
    });

  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - تحديث حالة الطلب
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const orderId = params.id;
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }

    console.log('✏️ تحديث حالة الطلب:', orderId, 'إلى', status);

    const updatedOrder = await db.updateOrderStatus(orderId, status);

    if (!updatedOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'تم تحديث حالة الطلب بنجاح',
      order: updatedOrder
    });

  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
