// نظام طباعة الفواتير واحتساب النقاط
import { db, type Order, type User } from '../lib/database';

export interface InvoiceData {
  orderId: string;
  customerName: string;
  customerPhone: string;
  branchName: string;
  items: Array<{
    name: string;
    name_ar: string;
    quantity: number;
    price: number;
    total: number;
  }>;
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: string;
  orderType: string;
  orderDate: string;
  estimatedTime: number;
  notes?: string;
}

export interface LoyaltyTransaction {
  userId: string;
  orderId: string;
  pointsEarned: number;
  pointsUsed: number;
  transactionType: 'earned' | 'used' | 'expired';
  description: string;
  timestamp: string;
}

// إنشاء بيانات الفاتورة
export async function generateInvoiceData(orderId: string): Promise<InvoiceData | null> {
  try {
    const order = await db.getOrder(orderId);
    if (!order) {
      return null;
    }

    const invoiceData: InvoiceData = {
      orderId: order.id,
      customerName: order.customer_name,
      customerPhone: order.customer_phone,
      branchName: order.branch_name,
      items: order.items.map(item => ({
        name: item.product_name,
        name_ar: item.product_name_ar,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity
      })),
      subtotal: order.subtotal,
      discount: order.discount,
      total: order.total,
      paymentMethod: order.payment_method,
      orderType: order.order_type === 'pickup' ? 'استلام' : 'توصيل',
      orderDate: new Date(order.created_at).toLocaleString('ar-SA'),
      estimatedTime: order.estimated_time,
      notes: order.notes
    };

    return invoiceData;
  } catch (error) {
    console.error('Error generating invoice data:', error);
    return null;
  }
}

// طباعة الفاتورة (محاكاة)
export async function printInvoice(invoiceData: InvoiceData): Promise<boolean> {
  try {
    console.log('🖨️ طباعة الفاتورة:', invoiceData.orderId);
    
    // في التطبيق الحقيقي، يمكن:
    // - إرسال البيانات لطابعة حقيقية
    // - إنشاء PDF وإرساله للطباعة
    // - إرسال البيانات لخدمة طباعة خارجية
    
    const printData = {
      header: {
        title: 'فاتورة مقهى ساكورا',
        branch: invoiceData.branchName,
        orderId: invoiceData.orderId,
        date: invoiceData.orderDate
      },
      customer: {
        name: invoiceData.customerName,
        phone: invoiceData.customerPhone
      },
      items: invoiceData.items,
      totals: {
        subtotal: invoiceData.subtotal,
        discount: invoiceData.discount,
        total: invoiceData.total
      },
      payment: {
        method: invoiceData.paymentMethod,
        type: invoiceData.orderType
      },
      footer: {
        estimatedTime: invoiceData.estimatedTime,
        notes: invoiceData.notes
      }
    };

    // محاكاة طباعة الفاتورة
    console.log('📄 بيانات الفاتورة:', JSON.stringify(printData, null, 2));
    
    return true;
  } catch (error) {
    console.error('Error printing invoice:', error);
    return false;
  }
}

// احتساب نقاط المكافآت
export async function calculateLoyaltyPoints(order: Order): Promise<LoyaltyTransaction> {
  try {
    const user = await db.getUser(order.user_id);
    if (!user) {
      throw new Error('User not found');
    }

    // حساب النقاط المكتسبة (1 نقطة لكل ريال)
    const pointsEarned = Math.floor(order.total * 0.1);
    
    // حساب النقاط المستخدمة (من الخصومات المطبقة)
    const pointsUsed = Math.floor(order.discount * 0.1);

    const transaction: LoyaltyTransaction = {
      userId: order.user_id,
      orderId: order.id,
      pointsEarned,
      pointsUsed,
      transactionType: 'earned',
      description: `نقاط مكتسبة من طلب #${order.id}`,
      timestamp: new Date().toISOString()
    };

    // تحديث نقاط المستخدم
    if (pointsEarned > 0) {
      await db.addPointsToUser(order.user_id, pointsEarned);
    }

    return transaction;
  } catch (error) {
    console.error('Error calculating loyalty points:', error);
    throw error;
  }
}

// معالجة الطلب الكاملة (إنشاء + طباعة + نقاط)
export async function processOrder(orderData: Omit<Order, 'id' | 'created_at' | 'updated_at'>): Promise<{
  success: boolean;
  order?: Order;
  invoiceData?: InvoiceData;
  loyaltyTransaction?: LoyaltyTransaction;
  message: string;
}> {
  try {
    // 1. إنشاء الطلب
    const order = await db.createOrder(orderData);
    console.log('✅ تم إنشاء الطلب:', order.id);

    // 2. إنشاء بيانات الفاتورة
    const invoiceData = await generateInvoiceData(order.id);
    if (!invoiceData) {
      throw new Error('Failed to generate invoice data');
    }

    // 3. طباعة الفاتورة
    const printSuccess = await printInvoice(invoiceData);
    if (!printSuccess) {
      console.warn('⚠️ فشل في طباعة الفاتورة');
    }

    // 4. احتساب نقاط المكافآت
    const loyaltyTransaction = await calculateLoyaltyPoints(order);
    console.log('🎁 تم احتساب النقاط:', loyaltyTransaction.pointsEarned);

    return {
      success: true,
      order,
      invoiceData,
      loyaltyTransaction,
      message: 'تم معالجة الطلب بنجاح'
    };

  } catch (error) {
    console.error('Error processing order:', error);
    return {
      success: false,
      message: 'حدث خطأ في معالجة الطلب'
    };
  }
}

// الحصول على تاريخ نقاط المستخدم
export async function getUserLoyaltyHistory(userId: string): Promise<LoyaltyTransaction[]> {
  try {
    const user = await db.getUser(userId);
    if (!user) {
      return [];
    }

    // في التطبيق الحقيقي، يمكن الحصول على تاريخ النقاط من قاعدة البيانات
    // هنا نعيد بيانات وهمية للتوضيح
    const mockHistory: LoyaltyTransaction[] = [
      {
        userId,
        orderId: 'order-001',
        pointsEarned: 25,
        pointsUsed: 0,
        transactionType: 'earned',
        description: 'نقاط مكتسبة من طلب #order-001',
        timestamp: new Date(Date.now() - 86400000).toISOString() // يوم مضى
      },
      {
        userId,
        orderId: 'order-002',
        pointsEarned: 18,
        pointsUsed: 0,
        transactionType: 'earned',
        description: 'نقاط مكتسبة من طلب #order-002',
        timestamp: new Date(Date.now() - 172800000).toISOString() // يومين مضى
      }
    ];

    return mockHistory;
  } catch (error) {
    console.error('Error getting loyalty history:', error);
    return [];
  }
}

// إنشاء تقرير مبيعات
export async function generateSalesReport(startDate: string, endDate: string, branchId?: string) {
  try {
    const orders = await db.getOrders(branchId);
    
    const filteredOrders = orders.filter(order => {
      const orderDate = new Date(order.created_at);
      return orderDate >= new Date(startDate) && orderDate <= new Date(endDate);
    });

    const report = {
      period: {
        startDate,
        endDate
      },
      summary: {
        totalOrders: filteredOrders.length,
        totalRevenue: filteredOrders.reduce((sum, order) => sum + order.total, 0),
        averageOrderValue: filteredOrders.length > 0 ? 
          filteredOrders.reduce((sum, order) => sum + order.total, 0) / filteredOrders.length : 0
      },
      ordersByStatus: {
        pending: filteredOrders.filter(o => o.status === 'pending').length,
        preparing: filteredOrders.filter(o => o.status === 'preparing').length,
        ready: filteredOrders.filter(o => o.status === 'ready').length,
        delivered: filteredOrders.filter(o => o.status === 'delivered').length,
        cancelled: filteredOrders.filter(o => o.status === 'cancelled').length
      },
      ordersByType: {
        pickup: filteredOrders.filter(o => o.order_type === 'pickup').length,
        delivery: filteredOrders.filter(o => o.order_type === 'delivery').length
      },
      orders: filteredOrders
    };

    return report;
  } catch (error) {
    console.error('Error generating sales report:', error);
    return null;
  }
}
