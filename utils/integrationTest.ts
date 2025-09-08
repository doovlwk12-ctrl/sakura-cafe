// نظام اختبار شامل للتكامل
import { db } from '../lib/database';
import { routeOrder, updateOrderStatus, getBranchStats } from './orderRouter';
import { generateInvoiceData, printInvoice, calculateLoyaltyPoints, processOrder } from './invoiceSystem';
import { broadcastOrderUpdate, broadcastNewOrder, initializeRealTimeSystem } from './realTimeUpdates';
import { errorHandler } from './errorHandler';

export interface TestResult {
  testName: string;
  success: boolean;
  message: string;
  duration: number;
  details?: any;
}

export interface TestSuite {
  name: string;
  tests: TestResult[];
  totalTests: number;
  passedTests: number;
  failedTests: number;
  duration: number;
}

// فئة اختبار التكامل
export class IntegrationTester {
  private testResults: TestResult[] = [];

  // تشغيل جميع الاختبارات
  public async runAllTests(): Promise<TestSuite> {
    console.log('🧪 بدء اختبارات التكامل الشاملة...');
    const startTime = Date.now();

    // تشغيل اختبارات قاعدة البيانات
    await this.testDatabaseIntegration();
    
    // تشغيل اختبارات توجيه الطلبات
    await this.testOrderRouting();
    
    // تشغيل اختبارات نظام الفواتير
    await this.testInvoiceSystem();
    
    // تشغيل اختبارات التحديثات الفورية
    await this.testRealTimeUpdates();
    
    // تشغيل اختبارات معالجة الأخطاء
    await this.testErrorHandling();
    
    // تشغيل اختبارات التكامل الشاملة
    await this.testFullIntegration();

    const endTime = Date.now();
    const duration = endTime - startTime;

    const passedTests = this.testResults.filter(t => t.success).length;
    const failedTests = this.testResults.filter(t => !t.success).length;

    const testSuite: TestSuite = {
      name: 'اختبارات التكامل الشاملة',
      tests: this.testResults,
      totalTests: this.testResults.length,
      passedTests,
      failedTests,
      duration
    };

    this.printTestResults(testSuite);
    return testSuite;
  }

  // اختبارات قاعدة البيانات
  private async testDatabaseIntegration(): Promise<void> {
    console.log('📊 اختبار تكامل قاعدة البيانات...');

    // اختبار إنشاء منتج
    await this.runTest('إنشاء منتج جديد', async () => {
      const product = await db.createProduct({
        name: 'Test Product',
        name_ar: 'منتج تجريبي',
        description: 'Test description',
        description_ar: 'وصف تجريبي',
        price: 25,
        category: 'drinks',
        image: '/test.jpg',
        calories: 150,
        stock: 10,
        status: 'active'
      });

      if (!product || !product.id) {
        throw new Error('فشل في إنشاء المنتج');
      }

      return { productId: product.id };
    });

    // اختبار إنشاء طلب
    await this.runTest('إنشاء طلب جديد', async () => {
      const order = await db.createOrder({
        user_id: 'test-user-1',
        customer_name: 'عميل تجريبي',
        customer_phone: '+966501234567',
        branch_id: 'branch-001',
        branch_name: 'فرع تجريبي',
        items: [{
          id: 'item-1',
          product_id: 'product-001',
          product_name: 'Latte',
          product_name_ar: 'لاتيه',
          price: 18,
          quantity: 2
        }],
        subtotal: 36,
        discount: 0,
        total: 36,
        status: 'pending',
        order_type: 'pickup',
        payment_method: 'cash',
        payment_status: 'pending',
        estimated_time: 15
      });

      if (!order || !order.id) {
        throw new Error('فشل في إنشاء الطلب');
      }

      return { orderId: order.id };
    });

    // اختبار جلب الإحصائيات
    await this.runTest('جلب إحصائيات لوحة التحكم', async () => {
      const stats = db.getDashboardStats();
      
      if (!stats || typeof stats.totalProducts !== 'number') {
        throw new Error('فشل في جلب الإحصائيات');
      }

      return stats;
    });
  }

  // اختبارات توجيه الطلبات
  private async testOrderRouting(): Promise<void> {
    console.log('🛣️ اختبار توجيه الطلبات...');

    // اختبار توجيه طلب للفرع الأقرب
    await this.runTest('توجيه طلب للفرع الأقرب', async () => {
      const result = await routeOrder({
        userLocation: { lat: 27.5114, lng: 41.6901 },
        orderType: 'pickup',
        items: [{ product_id: 'product-001', quantity: 1 }]
      });

      if (!result.success) {
        throw new Error('فشل في توجيه الطلب');
      }

      return result;
    });

    // اختبار تحديث حالة الطلب
    await this.runTest('تحديث حالة الطلب', async () => {
      const success = await updateOrderStatus('order_123', 'preparing');
      
      if (!success) {
        throw new Error('فشل في تحديث حالة الطلب');
      }

      return { success };
    });

    // اختبار جلب إحصائيات الفرع
    await this.runTest('جلب إحصائيات الفرع', async () => {
      const stats = await getBranchStats('branch-001');
      
      if (!stats) {
        throw new Error('فشل في جلب إحصائيات الفرع');
      }

      return stats;
    });
  }

  // اختبارات نظام الفواتير
  private async testInvoiceSystem(): Promise<void> {
    console.log('🧾 اختبار نظام الفواتير...');

    // اختبار إنشاء بيانات الفاتورة
    await this.runTest('إنشاء بيانات الفاتورة', async () => {
      const invoiceData = await generateInvoiceData('order_123');
      
      if (!invoiceData) {
        throw new Error('فشل في إنشاء بيانات الفاتورة');
      }

      return invoiceData;
    });

    // اختبار طباعة الفاتورة
    await this.runTest('طباعة الفاتورة', async () => {
      const invoiceData = {
        orderId: 'test-order',
        customerName: 'عميل تجريبي',
        customerPhone: '+966501234567',
        branchName: 'فرع تجريبي',
        items: [{
          name: 'Latte',
          name_ar: 'لاتيه',
          quantity: 1,
          price: 18,
          total: 18
        }],
        subtotal: 18,
        discount: 0,
        total: 18,
        paymentMethod: 'cash',
        orderType: 'استلام',
        orderDate: new Date().toLocaleString('ar-SA'),
        estimatedTime: 15
      };

      const success = await printInvoice(invoiceData);
      
      if (!success) {
        throw new Error('فشل في طباعة الفاتورة');
      }

      return { success };
    });

    // اختبار احتساب نقاط المكافآت
    await this.runTest('احتساب نقاط المكافآت', async () => {
      const order = {
        id: 'test-order',
        user_id: 'test-user',
        customer_name: 'عميل تجريبي',
        customer_phone: '+966501234567',
        branch_id: 'branch-001',
        branch_name: 'فرع تجريبي',
        items: [{
          id: 'item-1',
          product_id: 'product-001',
          product_name: 'Latte',
          product_name_ar: 'لاتيه',
          price: 18,
          quantity: 1
        }],
        subtotal: 18,
        discount: 0,
        total: 18,
        status: 'pending' as const,
        order_type: 'pickup' as const,
        payment_method: 'cash',
        payment_status: 'pending' as const,
        estimated_time: 15,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const transaction = await calculateLoyaltyPoints(order);
      
      if (!transaction || transaction.pointsEarned <= 0) {
        throw new Error('فشل في احتساب نقاط المكافآت');
      }

      return transaction;
    });
  }

  // اختبارات التحديثات الفورية
  private async testRealTimeUpdates(): Promise<void> {
    console.log('⚡ اختبار التحديثات الفورية...');

    // اختبار بث تحديث طلب
    await this.runTest('بث تحديث طلب', async () => {
      const update = {
        orderId: 'test-order',
        status: 'preparing',
        branchId: 'branch-001',
        timestamp: new Date().toISOString(),
        customerName: 'عميل تجريبي',
        estimatedTime: 15
      };

      broadcastOrderUpdate(update);
      return { success: true };
    });

    // اختبار بث طلب جديد
    await this.runTest('بث طلب جديد', async () => {
      const notification = {
        orderId: 'test-order-2',
        branchId: 'branch-001',
        customerName: 'عميل تجريبي 2',
        total: 25,
        items: [{ name: 'Cappuccino', quantity: 1 }],
        timestamp: new Date().toISOString()
      };

      broadcastNewOrder(notification);
      return { success: true };
    });

    // اختبار بدء نظام التحديثات الفورية
    await this.runTest('بدء نظام التحديثات الفورية', async () => {
      initializeRealTimeSystem();
      return { success: true };
    });
  }

  // اختبارات معالجة الأخطاء
  private async testErrorHandling(): Promise<void> {
    console.log('🚨 اختبار معالجة الأخطاء...');

    // اختبار معالجة خطأ الشبكة
    await this.runTest('معالجة خطأ الشبكة', async () => {
      const networkError = new Error('Network Error');
      errorHandler.handleNetworkError(networkError, {
        component: 'test',
        action: 'test_network_error'
      });

      return { success: true };
    });

    // اختبار معالجة خطأ المصادقة
    await this.runTest('معالجة خطأ المصادقة', async () => {
      const authError = new Error('Authentication failed');
      errorHandler.handleAuthenticationError(authError, {
        component: 'test',
        action: 'test_auth_error'
      });

      return { success: true };
    });

    // اختبار جلب إحصائيات الأخطاء
    await this.runTest('جلب إحصائيات الأخطاء', async () => {
      const stats = errorHandler.getErrorStats();
      
      if (!stats || typeof stats.total !== 'number') {
        throw new Error('فشل في جلب إحصائيات الأخطاء');
      }

      return stats;
    });
  }

  // اختبارات التكامل الشاملة
  private async testFullIntegration(): Promise<void> {
    console.log('🔗 اختبار التكامل الشامل...');

    // اختبار سيناريو طلب كامل
    await this.runTest('سيناريو طلب كامل', async () => {
      // 1. إنشاء طلب
      const order = await db.createOrder({
        user_id: 'integration-test-user',
        customer_name: 'عميل التكامل',
        customer_phone: '+966501234567',
        branch_id: 'branch-001',
        branch_name: 'فرع التكامل',
        items: [{
          id: 'item-1',
          product_id: 'product-001',
          product_name: 'Latte',
          product_name_ar: 'لاتيه',
          price: 18,
          quantity: 1
        }],
        subtotal: 18,
        discount: 0,
        total: 18,
        status: 'pending',
        order_type: 'pickup',
        payment_method: 'cash',
        payment_status: 'pending',
        estimated_time: 15
      });

      // 2. توجيه الطلب
      const routingResult = await routeOrder({
        orderType: 'pickup',
        items: [{ product_id: 'product-001', quantity: 1 }]
      });

      // 3. معالجة الطلب
      const processResult = await processOrder({
        user_id: 'integration-test-user',
        customer_name: 'عميل التكامل',
        customer_phone: '+966501234567',
        branch_id: routingResult.branchId,
        branch_name: routingResult.branchName,
        items: [{
          id: 'item-1',
          product_id: 'product-001',
          product_name: 'Latte',
          product_name_ar: 'لاتيه',
          price: 18,
          quantity: 1
        }],
        subtotal: 18,
        discount: 0,
        total: 18,
        status: 'pending',
        order_type: 'pickup',
        payment_method: 'cash',
        payment_status: 'pending',
        estimated_time: routingResult.estimatedTime
      });

      if (!processResult.success) {
        throw new Error('فشل في معالجة الطلب الكامل');
      }

      return {
        orderId: order.id,
        routingResult,
        processResult
      };
    });

    // اختبار سيناريو تحديث حالة الطلب
    await this.runTest('سيناريو تحديث حالة الطلب', async () => {
      // إنشاء طلب
      const order = await db.createOrder({
        user_id: 'status-test-user',
        customer_name: 'عميل الحالة',
        customer_phone: '+966501234567',
        branch_id: 'branch-001',
        branch_name: 'فرع الحالة',
        items: [{
          id: 'item-1',
          product_id: 'product-001',
          product_name: 'Latte',
          product_name_ar: 'لاتيه',
          price: 18,
          quantity: 1
        }],
        subtotal: 18,
        discount: 0,
        total: 18,
        status: 'pending',
        order_type: 'pickup',
        payment_method: 'cash',
        payment_status: 'pending',
        estimated_time: 15
      });

      // تحديث الحالة
      const updateSuccess = await updateOrderStatus(order.id, 'preparing');
      
      if (!updateSuccess) {
        throw new Error('فشل في تحديث حالة الطلب');
      }

      // بث التحديث
      broadcastOrderUpdate({
        orderId: order.id,
        status: 'preparing',
        branchId: 'branch-001',
        timestamp: new Date().toISOString(),
        customerName: 'عميل الحالة'
      });

      return { orderId: order.id, updateSuccess };
    });
  }

  // تشغيل اختبار واحد
  private async runTest(testName: string, testFunction: () => Promise<any>): Promise<void> {
    const startTime = Date.now();
    
    try {
      const result = await testFunction();
      const duration = Date.now() - startTime;
      
      this.testResults.push({
        testName,
        success: true,
        message: 'تم بنجاح',
        duration,
        details: result
      });
      
      console.log(`✅ ${testName} - نجح في ${duration}ms`);
    } catch (error) {
      const duration = Date.now() - startTime;
      
      this.testResults.push({
        testName,
        success: false,
        message: error instanceof Error ? error.message : 'خطأ غير معروف',
        duration,
        details: error
      });
      
      console.log(`❌ ${testName} - فشل في ${duration}ms: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`);
    }
  }

  // طباعة نتائج الاختبارات
  private printTestResults(testSuite: TestSuite): void {
    console.log('\n📊 نتائج اختبارات التكامل:');
    console.log('='.repeat(50));
    console.log(`إجمالي الاختبارات: ${testSuite.totalTests}`);
    console.log(`الاختبارات الناجحة: ${testSuite.passedTests}`);
    console.log(`الاختبارات الفاشلة: ${testSuite.failedTests}`);
    console.log(`معدل النجاح: ${((testSuite.passedTests / testSuite.totalTests) * 100).toFixed(1)}%`);
    console.log(`الوقت الإجمالي: ${testSuite.duration}ms`);
    console.log('='.repeat(50));

    if (testSuite.failedTests > 0) {
      console.log('\n❌ الاختبارات الفاشلة:');
      testSuite.tests
        .filter(t => !t.success)
        .forEach(test => {
          console.log(`  - ${test.testName}: ${test.message}`);
        });
    }

    console.log('\n✅ جميع الاختبارات مكتملة!');
  }
}

// تشغيل الاختبارات
export async function runIntegrationTests(): Promise<TestSuite> {
  const tester = new IntegrationTester();
  return await tester.runAllTests();
}

// تشغيل اختبارات سريعة
export async function runQuickTests(): Promise<TestSuite> {
  console.log('⚡ تشغيل اختبارات سريعة...');
  const tester = new IntegrationTester();
  
  // تشغيل اختبارات أساسية فقط
  await tester['testDatabaseIntegration']();
  await tester['testOrderRouting']();
  
  const testSuite: TestSuite = {
    name: 'اختبارات سريعة',
    tests: tester['testResults'],
    totalTests: tester['testResults'].length,
    passedTests: tester['testResults'].filter(t => t.success).length,
    failedTests: tester['testResults'].filter(t => !t.success).length,
    duration: 0
  };

  return testSuite;
}

export default IntegrationTester;
