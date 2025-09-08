import { NextRequest, NextResponse } from 'next/server';
import { orders as mockOrders } from '../../../lib/database';

// GET - جلب جميع الطلبات
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = searchParams.get('limit');
    
    let filteredOrders = [...mockOrders].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    
    if (status && status !== 'all') {
      filteredOrders = filteredOrders.filter(order => order.status === status);
    }
    
    if (limit) {
      filteredOrders = filteredOrders.slice(0, parseInt(limit));
    }
    
    return NextResponse.json({
      success: true,
      data: filteredOrders,
      total: filteredOrders.length
    });
  } catch (error) {
    console.error('خطأ في جلب الطلبات:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في جلب الطلبات' },
      { status: 500 }
    );
  }
}

// POST - إضافة طلب جديد
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const newOrder = {
      id: Date.now().toString(),
      ...body,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // إضافة الطلب لقاعدة البيانات المحلية
    mockOrders.unshift(newOrder);
    
    return NextResponse.json({
      success: true,
      data: newOrder,
      message: 'تم إضافة الطلب بنجاح'
    });
  } catch (error) {
    console.error('خطأ في إضافة الطلب:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في إضافة الطلب' },
      { status: 500 }
    );
  }
}

// PUT - تحديث حالة الطلب
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, ...updateData } = body;
    
    const orderIndex = mockOrders.findIndex(o => o.id === id);
    
    if (orderIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'الطلب غير موجود' },
        { status: 404 }
      );
    }
    
    mockOrders[orderIndex] = {
      ...mockOrders[orderIndex],
      status,
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    return NextResponse.json({
      success: true,
      data: mockOrders[orderIndex],
      message: 'تم تحديث الطلب بنجاح'
    });
  } catch (error) {
    console.error('خطأ في تحديث الطلب:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في تحديث الطلب' },
      { status: 500 }
    );
  }
}
