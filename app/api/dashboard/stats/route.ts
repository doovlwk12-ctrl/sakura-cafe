import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../lib/database';

// GET - جلب إحصائيات لوحة التحكم
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('📊 جلب إحصائيات لوحة التحكم');

    const stats = db.getDashboardStats();
    const recentOrders = await db.getOrders(undefined, undefined);
    const products = await db.getProducts();
    const branches = await db.getBranches();

    // إحصائيات إضافية
    const ordersByStatus = {
      pending: stats.pendingOrders,
      preparing: stats.preparingOrders,
      ready: stats.readyOrders,
      delivered: recentOrders.filter(o => o.status === 'delivered').length,
      cancelled: recentOrders.filter(o => o.status === 'cancelled').length
    };

    const ordersByBranch = branches.map(branch => ({
      branch_id: branch.id,
      branch_name: branch.name_ar,
      orders_count: recentOrders.filter(o => o.branch_id === branch.id).length
    }));

    const topProducts = products.map(product => {
      const productOrders = recentOrders.flatMap(order => 
        order.items.filter(item => item.product_id === product.id)
      );
      const totalQuantity = productOrders.reduce((sum, item) => sum + item.quantity, 0);
      
      return {
        product_id: product.id,
        product_name: product.name_ar,
        total_quantity: totalQuantity,
        revenue: productOrders.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      };
    }).sort((a, b) => b.total_quantity - a.total_quantity).slice(0, 5);

    return NextResponse.json({
      success: true,
      stats: {
        ...stats,
        ordersByStatus,
        ordersByBranch,
        topProducts
      },
      recentOrders: recentOrders.slice(0, 10), // آخر 10 طلبات
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
