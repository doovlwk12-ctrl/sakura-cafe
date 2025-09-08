import { NextRequest, NextResponse } from 'next/server';
import { orders as mockOrders, products as mockProducts, users as mockUsers } from '../../../../lib/database';

export async function GET(request: NextRequest) {
  try {
    // حساب إجمالي المبيعات
    const totalSales = mockOrders
      .filter(order => order.status === 'delivered')
      .reduce((sum, order) => sum + order.total, 0);

    // حساب الطلبات اليوم
    const today = new Date().toDateString();
    const todayOrders = mockOrders.filter(order => 
      new Date(order.created_at).toDateString() === today
    ).length;

    // حساب الطلبات المعلقة
    const pendingOrders = mockOrders.filter(order => 
      order.status === 'pending' || order.status === 'preparing'
    ).length;

    // حساب الطلبات المكتملة اليوم
    const completedOrders = mockOrders.filter(order => 
      order.status === 'delivered' && 
      new Date(order.created_at).toDateString() === today
    ).length;

    // حساب الإيرادات اليوم
        const todayRevenue = mockOrders
      .filter(order => 
        new Date(order.created_at).toDateString() === today &&
        order.status === 'delivered'
      )
      .reduce((sum, order) => sum + order.total, 0);

    // حساب النمو (محاكاة)
    const growth = Math.round((Math.random() * 20 + 5) * 100) / 100;

    const stats = {
      totalSales,
      totalProducts: mockProducts.length,
      todayOrders,
      totalCustomers: mockUsers.length,
      pendingOrders,
      completedOrders,
      revenue: todayRevenue,
      growth
    };

    return NextResponse.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('خطأ في جلب الإحصائيات:', error);
    return NextResponse.json(
      { success: false, error: 'فشل في جلب الإحصائيات' },
      { status: 500 }
    );
  }
}
