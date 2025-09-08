// نظام التحديثات الفورية بين الأنظمة
import { EventEmitter } from 'events';

// إنشاء EventEmitter للتواصل بين الأنظمة
export const realTimeEvents = new EventEmitter();

export interface OrderUpdate {
  orderId: string;
  status: string;
  branchId: string;
  timestamp: string;
  customerName: string;
  estimatedTime?: number;
}

export interface NewOrderNotification {
  orderId: string;
  branchId: string;
  customerName: string;
  total: number;
  items: Array<{
    name: string;
    quantity: number;
  }>;
  timestamp: string;
}

export interface SystemNotification {
  type: 'order_update' | 'new_order' | 'system_alert' | 'inventory_alert';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  timestamp: string;
  data?: any;
}

// إرسال تحديث حالة الطلب
export function broadcastOrderUpdate(update: OrderUpdate): void {
  console.log('📢 بث تحديث الطلب:', update);
  
  realTimeEvents.emit('order_update', update);
  
  // إرسال إشعار للفرع المحدد
  realTimeEvents.emit(`branch_${update.branchId}_order_update`, update);
  
  // إرسال إشعار عام
  realTimeEvents.emit('system_notification', {
    type: 'order_update',
    title: 'تحديث حالة الطلب',
    message: `تم تحديث حالة الطلب #${update.orderId} إلى ${update.status}`,
    priority: 'medium',
    timestamp: new Date().toISOString(),
    data: update
  } as SystemNotification);
}

// إرسال إشعار طلب جديد
export function broadcastNewOrder(notification: NewOrderNotification): void {
  console.log('🆕 بث طلب جديد:', notification);
  
  realTimeEvents.emit('new_order', notification);
  
  // إرسال إشعار للفرع المحدد
  realTimeEvents.emit(`branch_${notification.branchId}_new_order`, notification);
  
  // إرسال إشعار عام
  realTimeEvents.emit('system_notification', {
    type: 'new_order',
    title: 'طلب جديد',
    message: `طلب جديد من ${notification.customerName} بقيمة ${notification.total} ريال`,
    priority: 'high',
    timestamp: new Date().toISOString(),
    data: notification
  } as SystemNotification);
}

// إرسال إشعار نظام
export function broadcastSystemNotification(notification: SystemNotification): void {
  console.log('🔔 بث إشعار النظام:', notification);
  
  realTimeEvents.emit('system_notification', notification);
  
  // إرسال إشعارات خاصة حسب النوع
  if (notification.type === 'inventory_alert') {
    realTimeEvents.emit('inventory_alert', notification);
  }
}

// إرسال إشعار انخفاض المخزون
export function broadcastInventoryAlert(productId: string, productName: string, currentStock: number): void {
  const notification: SystemNotification = {
    type: 'inventory_alert',
    title: 'تنبيه المخزون',
    message: `انخفاض مخزون ${productName} إلى ${currentStock} وحدة`,
    priority: currentStock === 0 ? 'urgent' : 'high',
    timestamp: new Date().toISOString(),
    data: {
      productId,
      productName,
      currentStock
    }
  };
  
  broadcastSystemNotification(notification);
}

// إرسال إشعار إحصائية يومية
export function broadcastDailyStats(stats: {
  totalOrders: number;
  totalRevenue: number;
  topProducts: Array<{ name: string; quantity: number }>;
  branchStats: Array<{ branchName: string; orders: number; revenue: number }>;
}): void {
  const notification: SystemNotification = {
    type: 'system_alert',
    title: 'إحصائيات اليوم',
    message: `تم إنجاز ${stats.totalOrders} طلب بإيرادات ${stats.totalRevenue} ريال`,
    priority: 'low',
    timestamp: new Date().toISOString(),
    data: stats
  };
  
  broadcastSystemNotification(notification);
}

// إرسال إشعار صيانة النظام
export function broadcastMaintenanceAlert(message: string, scheduledTime?: string): void {
  const notification: SystemNotification = {
    type: 'system_alert',
    title: 'تنبيه صيانة النظام',
    message: scheduledTime ? `صيانة مجدولة في ${scheduledTime}: ${message}` : message,
    priority: 'high',
    timestamp: new Date().toISOString(),
    data: {
      scheduledTime,
      maintenanceMessage: message
    }
  };
  
  broadcastSystemNotification(notification);
}

// إرسال إشعار خطأ في النظام
export function broadcastSystemError(error: string, component: string): void {
  const notification: SystemNotification = {
    type: 'system_alert',
    title: 'خطأ في النظام',
    message: `خطأ في ${component}: ${error}`,
    priority: 'urgent',
    timestamp: new Date().toISOString(),
    data: {
      error,
      component
    }
  };
  
  broadcastSystemNotification(notification);
}

// إرسال إشعار نجاح العملية
export function broadcastSuccessMessage(title: string, message: string, data?: any): void {
  const notification: SystemNotification = {
    type: 'system_alert',
    title,
    message,
    priority: 'low',
    timestamp: new Date().toISOString(),
    data
  };
  
  broadcastSystemNotification(notification);
}

// إعداد مستمعي الأحداث
export function setupEventListeners(): void {
  // مستمع لتحديثات الطلبات
  realTimeEvents.on('order_update', (update: OrderUpdate) => {
    console.log('📋 تحديث الطلب:', update);
    // يمكن إضافة منطق إضافي هنا مثل:
    // - إرسال إشعارات push
    // - تحديث قاعدة البيانات
    // - إرسال رسائل SMS
  });

  // مستمع للطلبات الجديدة
  realTimeEvents.on('new_order', (notification: NewOrderNotification) => {
    console.log('🆕 طلب جديد:', notification);
    // يمكن إضافة منطق إضافي هنا مثل:
    // - إرسال إشعار للكاشير
    // - تحديث لوحة التحكم
    // - إرسال رسالة WhatsApp
  });

  // مستمع لإشعارات النظام
  realTimeEvents.on('system_notification', (notification: SystemNotification) => {
    console.log('🔔 إشعار النظام:', notification);
    // يمكن إضافة منطق إضافي هنا مثل:
    // - حفظ الإشعارات في قاعدة البيانات
    // - إرسال إشعارات للمديرين
    // - تسجيل الأحداث
  });

  // مستمع لتنبيهات المخزون
  realTimeEvents.on('inventory_alert', (notification: SystemNotification) => {
    console.log('📦 تنبيه المخزون:', notification);
    // يمكن إضافة منطق إضافي هنا مثل:
    // - إرسال إشعار للمدير
    // - طلب تلقائي للمخزون
    // - تحديث حالة المنتج
  });
}

// بدء نظام التحديثات الفورية
export function initializeRealTimeSystem(): void {
  console.log('🚀 بدء نظام التحديثات الفورية');
  setupEventListeners();
  
  // إرسال إشعار بدء النظام
  broadcastSuccessMessage(
    'بدء النظام',
    'تم بدء نظام التحديثات الفورية بنجاح',
    { timestamp: new Date().toISOString() }
  );
}

// إيقاف نظام التحديثات الفورية
export function shutdownRealTimeSystem(): void {
  console.log('🛑 إيقاف نظام التحديثات الفورية');
  
  // إرسال إشعار إيقاف النظام
  broadcastSystemNotification({
    type: 'system_alert',
    title: 'إيقاف النظام',
    message: 'تم إيقاف نظام التحديثات الفورية',
    priority: 'medium',
    timestamp: new Date().toISOString()
  });
  
  // إزالة جميع المستمعين
  realTimeEvents.removeAllListeners();
}

// تصدير الوظائف للاستخدام في التطبيق
export {
  realTimeEvents as events
};
