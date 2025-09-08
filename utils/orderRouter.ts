// نظام توجيه الطلبات للفروع
import { db, type Order, type Branch } from '../lib/database';

export interface OrderRoutingResult {
  success: boolean;
  branchId: string;
  branchName: string;
  estimatedTime: number;
  message: string;
}

export interface OrderRoutingOptions {
  userLocation?: {
    lat: number;
    lng: number;
  };
  preferredBranch?: string;
  orderType: 'pickup' | 'delivery';
  items: Array<{
    product_id: string;
    quantity: number;
  }>;
}

// حساب المسافة بين نقطتين
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // نصف قطر الأرض بالكيلومتر
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// حساب الوقت المتوقع للتحضير
function calculateEstimatedTime(items: Array<{ product_id: string; quantity: number }>): number {
  const baseTime = 5; // 5 دقائق أساسية
  const timePerItem = 3; // 3 دقائق لكل منتج
  
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  return baseTime + (totalItems * timePerItem);
}

// توجيه الطلب للفرع المناسب
export async function routeOrder(options: OrderRoutingOptions): Promise<OrderRoutingResult> {
  try {
    const branches = await db.getBranches();
    const openBranches = branches.filter(branch => branch.is_open);

    if (openBranches.length === 0) {
      return {
        success: false,
        branchId: '',
        branchName: '',
        estimatedTime: 0,
        message: 'لا توجد فروع مفتوحة حالياً'
      };
    }

    let selectedBranch: Branch;

    // إذا تم تحديد فرع مفضل
    if (options.preferredBranch) {
      const preferredBranch = openBranches.find(branch => branch.id === options.preferredBranch);
      if (preferredBranch) {
        selectedBranch = preferredBranch;
      } else {
        // إذا كان الفرع المفضل غير متاح، اختر أقرب فرع
        selectedBranch = await findNearestBranch(openBranches, options.userLocation);
      }
    } else {
      // اختر الفرع المناسب بناءً على نوع الطلب والموقع
      if (options.orderType === 'pickup' && options.userLocation) {
        selectedBranch = await findNearestBranch(openBranches, options.userLocation);
      } else {
        // للطلبات الموصلة أو بدون موقع، اختر الفرع الأقل ازدحاماً
        selectedBranch = await findLeastBusyBranch(openBranches);
      }
    }

    const estimatedTime = calculateEstimatedTime(options.items);

    return {
      success: true,
      branchId: selectedBranch.id,
      branchName: selectedBranch.name_ar,
      estimatedTime,
      message: `تم توجيه الطلب إلى ${selectedBranch.name_ar}`
    };

  } catch (error) {
    console.error('Error routing order:', error);
    return {
      success: false,
      branchId: '',
      branchName: '',
      estimatedTime: 0,
      message: 'حدث خطأ في توجيه الطلب'
    };
  }
}

// العثور على أقرب فرع
async function findNearestBranch(branches: Branch[], userLocation?: { lat: number; lng: number }): Promise<Branch> {
  if (!userLocation) {
    // إذا لم يتم تحديد الموقع، اختر الفرع الأول
    return branches[0];
  }

  let nearestBranch = branches[0];
  let shortestDistance = calculateDistance(
    userLocation.lat,
    userLocation.lng,
    branches[0].coordinates.lat,
    branches[0].coordinates.lng
  );

  for (let i = 1; i < branches.length; i++) {
    const distance = calculateDistance(
      userLocation.lat,
      userLocation.lng,
      branches[i].coordinates.lat,
      branches[i].coordinates.lng
    );

    if (distance < shortestDistance) {
      shortestDistance = distance;
      nearestBranch = branches[i];
    }
  }

  return nearestBranch;
}

// العثور على الفرع الأقل ازدحاماً
async function findLeastBusyBranch(branches: Branch[]): Promise<Branch> {
  const branchWorkloads = await Promise.all(
    branches.map(async (branch) => {
      const pendingOrders = await db.getOrders(branch.id, 'pending');
      const preparingOrders = await db.getOrders(branch.id, 'preparing');
      const workload = pendingOrders.length + preparingOrders.length;
      
      return { branch, workload };
    })
  );

  // ترتيب الفروع حسب العبء (الأقل عبء أولاً)
  branchWorkloads.sort((a, b) => a.workload - b.workload);
  
  return branchWorkloads[0].branch;
}

// تحديث حالة الطلب وإرسال إشعار للفرع
export async function updateOrderStatus(orderId: string, status: Order['status']): Promise<boolean> {
  try {
    const order = await db.getOrder(orderId);
    if (!order) {
      return false;
    }

    const updatedOrder = await db.updateOrderStatus(orderId, status);
    if (!updatedOrder) {
      return false;
    }

    // إرسال إشعار للفرع (في التطبيق الحقيقي، يمكن استخدام WebSocket أو Server-Sent Events)
    await notifyBranch(order.branch_id, {
      type: 'order_status_update',
      orderId: order.id,
      status: status,
      customerName: order.customer_name,
      timestamp: new Date().toISOString()
    });

    return true;
  } catch (error) {
    console.error('Error updating order status:', error);
    return false;
  }
}

// إرسال إشعار للفرع
async function notifyBranch(branchId: string, notification: any): Promise<void> {
  // في التطبيق الحقيقي، يمكن استخدام:
  // - WebSocket للاتصال المباشر
  // - Server-Sent Events
  // - Push Notifications
  // - Webhooks
  
  console.log(`📢 إشعار للفرع ${branchId}:`, notification);
  
  // محاكاة إرسال الإشعار
  // يمكن إضافة منطق إرسال الإشعارات هنا
}

// الحصول على إحصائيات الفرع
export async function getBranchStats(branchId: string) {
  try {
    const orders = await db.getOrders(branchId);
    const today = new Date().toDateString();
    const todayOrders = orders.filter(order => 
      new Date(order.created_at).toDateString() === today
    );

    return {
      totalOrders: orders.length,
      todayOrders: todayOrders.length,
      pendingOrders: orders.filter(o => o.status === 'pending').length,
      preparingOrders: orders.filter(o => o.status === 'preparing').length,
      readyOrders: orders.filter(o => o.status === 'ready').length,
      totalRevenue: orders.reduce((sum, order) => sum + order.total, 0),
      todayRevenue: todayOrders.reduce((sum, order) => sum + order.total, 0),
      averageOrderValue: orders.length > 0 ? orders.reduce((sum, order) => sum + order.total, 0) / orders.length : 0
    };
  } catch (error) {
    console.error('Error getting branch stats:', error);
    return null;
  }
}
