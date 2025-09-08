// نظام معالجة الأخطاء الشامل
import { realTimeEvents } from './realTimeUpdates';

export interface ErrorInfo {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
  userId?: string;
  component?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface ErrorContext {
  userId?: string;
  sessionId?: string;
  component?: string;
  action?: string;
  data?: any;
}

// أنواع الأخطاء المختلفة
export enum ErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  PAYMENT_ERROR = 'PAYMENT_ERROR',
  ORDER_ERROR = 'ORDER_ERROR',
  SYSTEM_ERROR = 'SYSTEM_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

// فئة معالجة الأخطاء
export class ErrorHandler {
  private static instance: ErrorHandler;
  private errorLog: ErrorInfo[] = [];
  private maxLogSize = 1000; // الحد الأقصى لعدد الأخطاء المحفوظة

  private constructor() {
    this.setupGlobalErrorHandlers();
  }

  public static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  // إعداد معالجات الأخطاء العامة
  private setupGlobalErrorHandlers(): void {
    // معالج أخطاء JavaScript العامة
    if (typeof window !== 'undefined') {
      window.addEventListener('error', (event) => {
        this.handleError({
          code: 'JAVASCRIPT_ERROR',
          message: event.message,
          details: {
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
            stack: event.error?.stack
          },
          timestamp: new Date().toISOString(),
          severity: 'high'
        });
      });

      // معالج أخطاء Promise المرفوضة
      window.addEventListener('unhandledrejection', (event) => {
        this.handleError({
          code: 'UNHANDLED_PROMISE_REJECTION',
          message: event.reason?.message || 'Unhandled Promise Rejection',
          details: {
            reason: event.reason,
            stack: event.reason?.stack
          },
          timestamp: new Date().toISOString(),
          severity: 'high'
        });
      });
    }
  }

  // معالجة الأخطاء العامة
  public handleError(error: ErrorInfo, context?: ErrorContext): void {
    // إضافة السياق للخطأ
    if (context) {
      error.userId = context.userId;
      error.component = context.component;
    }

    // تسجيل الخطأ
    this.logError(error);

    // إرسال إشعار فوري للأخطاء الحرجة
    if (error.severity === 'critical') {
      this.sendCriticalErrorNotification(error);
    }

    // إرسال إشعار عام
    this.broadcastErrorNotification(error);
  }

  // تسجيل الخطأ
  private logError(error: ErrorInfo): void {
    this.errorLog.push(error);

    // الحفاظ على حجم السجل
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog = this.errorLog.slice(-this.maxLogSize);
    }

    // تسجيل في وحدة التحكم
    console.error('🚨 Error:', error);

    // في التطبيق الحقيقي، يمكن إرسال الأخطاء لخدمة مراقبة خارجية
    // مثل Sentry, LogRocket, أو خدمة مخصصة
  }

  // إرسال إشعار للأخطاء الحرجة
  private sendCriticalErrorNotification(error: ErrorInfo): void {
    // إرسال إشعار فوري للمديرين
    realTimeEvents.emit('critical_error', {
      type: 'critical_error',
      title: 'خطأ حرج في النظام',
      message: `خطأ حرج: ${error.message}`,
      priority: 'urgent',
      timestamp: new Date().toISOString(),
      data: error
    });

    // في التطبيق الحقيقي، يمكن إرسال:
    // - رسائل SMS للمديرين
    // - إشعارات push
    // - رسائل WhatsApp
    // - رسائل بريد إلكتروني
  }

  // بث إشعار الخطأ
  private broadcastErrorNotification(error: ErrorInfo): void {
    realTimeEvents.emit('system_error', {
      type: 'system_error',
      title: 'خطأ في النظام',
      message: error.message,
      priority: error.severity === 'critical' ? 'urgent' : 'medium',
      timestamp: new Date().toISOString(),
      data: error
    });
  }

  // معالجة أخطاء الشبكة
  public handleNetworkError(error: any, context?: ErrorContext): void {
    this.handleError({
      code: ErrorType.NETWORK_ERROR,
      message: 'خطأ في الاتصال بالشبكة',
      details: {
        originalError: error.message,
        status: error.response?.status,
        url: error.config?.url
      },
      timestamp: new Date().toISOString(),
      severity: 'medium'
    }, context);
  }

  // معالجة أخطاء المصادقة
  public handleAuthenticationError(error: any, context?: ErrorContext): void {
    this.handleError({
      code: ErrorType.AUTHENTICATION_ERROR,
      message: 'خطأ في المصادقة',
      details: {
        originalError: error.message,
        status: error.response?.status
      },
      timestamp: new Date().toISOString(),
      severity: 'high'
    }, context);
  }

  // معالجة أخطاء التحقق من البيانات
  public handleValidationError(errors: any, context?: ErrorContext): void {
    this.handleError({
      code: ErrorType.VALIDATION_ERROR,
      message: 'خطأ في التحقق من البيانات',
      details: errors,
      timestamp: new Date().toISOString(),
      severity: 'low'
    }, context);
  }

  // معالجة أخطاء قاعدة البيانات
  public handleDatabaseError(error: any, context?: ErrorContext): void {
    this.handleError({
      code: ErrorType.DATABASE_ERROR,
      message: 'خطأ في قاعدة البيانات',
      details: {
        originalError: error.message,
        query: error.query,
        parameters: error.parameters
      },
      timestamp: new Date().toISOString(),
      severity: 'high'
    }, context);
  }

  // معالجة أخطاء الدفع
  public handlePaymentError(error: any, context?: ErrorContext): void {
    this.handleError({
      code: ErrorType.PAYMENT_ERROR,
      message: 'خطأ في معالجة الدفع',
      details: {
        originalError: error.message,
        paymentMethod: context?.data?.paymentMethod,
        amount: context?.data?.amount
      },
      timestamp: new Date().toISOString(),
      severity: 'critical'
    }, context);
  }

  // معالجة أخطاء الطلبات
  public handleOrderError(error: any, context?: ErrorContext): void {
    this.handleError({
      code: ErrorType.ORDER_ERROR,
      message: 'خطأ في معالجة الطلب',
      details: {
        originalError: error.message,
        orderId: context?.data?.orderId,
        customerId: context?.data?.customerId
      },
      timestamp: new Date().toISOString(),
      severity: 'high'
    }, context);
  }

  // الحصول على سجل الأخطاء
  public getErrorLog(limit?: number): ErrorInfo[] {
    if (limit) {
      return this.errorLog.slice(-limit);
    }
    return [...this.errorLog];
  }

  // الحصول على إحصائيات الأخطاء
  public getErrorStats(): {
    total: number;
    bySeverity: Record<string, number>;
    byCode: Record<string, number>;
    recent: ErrorInfo[];
  } {
    const bySeverity = this.errorLog.reduce((acc, error) => {
      acc[error.severity] = (acc[error.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byCode = this.errorLog.reduce((acc, error) => {
      acc[error.code] = (acc[error.code] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const recent = this.errorLog.slice(-10); // آخر 10 أخطاء

    return {
      total: this.errorLog.length,
      bySeverity,
      byCode,
      recent
    };
  }

  // مسح سجل الأخطاء
  public clearErrorLog(): void {
    this.errorLog = [];
  }

  // إنشاء تقرير أخطاء
  public generateErrorReport(startDate?: string, endDate?: string): {
    period: { start: string; end: string };
    summary: any;
    errors: ErrorInfo[];
  } {
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 24 * 60 * 60 * 1000); // آخر 24 ساعة
    const end = endDate ? new Date(endDate) : new Date();

    const filteredErrors = this.errorLog.filter(error => {
      const errorDate = new Date(error.timestamp);
      return errorDate >= start && errorDate <= end;
    });

    const stats = this.getErrorStats();

    return {
      period: {
        start: start.toISOString(),
        end: end.toISOString()
      },
      summary: {
        totalErrors: filteredErrors.length,
        criticalErrors: filteredErrors.filter(e => e.severity === 'critical').length,
        highErrors: filteredErrors.filter(e => e.severity === 'high').length,
        mediumErrors: filteredErrors.filter(e => e.severity === 'medium').length,
        lowErrors: filteredErrors.filter(e => e.severity === 'low').length
      },
      errors: filteredErrors
    };
  }
}

// إنشاء instance واحد
export const errorHandler = ErrorHandler.getInstance();

// دوال مساعدة للاستخدام السريع
export const handleError = (error: ErrorInfo, context?: ErrorContext) => {
  errorHandler.handleError(error, context);
};

export const handleNetworkError = (error: any, context?: ErrorContext) => {
  errorHandler.handleNetworkError(error, context);
};

export const handleAuthError = (error: any, context?: ErrorContext) => {
  errorHandler.handleAuthenticationError(error, context);
};

export const handleValidationError = (errors: any, context?: ErrorContext) => {
  errorHandler.handleValidationError(errors, context);
};

export const handleDatabaseError = (error: any, context?: ErrorContext) => {
  errorHandler.handleDatabaseError(error, context);
};

export const handlePaymentError = (error: any, context?: ErrorContext) => {
  errorHandler.handlePaymentError(error, context);
};

export const handleOrderError = (error: any, context?: ErrorContext) => {
  errorHandler.handleOrderError(error, context);
};

// دالة مساعدة لإنشاء رسالة خطأ ودية للمستخدم
export const getUserFriendlyMessage = (error: ErrorInfo): string => {
  switch (error.code) {
    case ErrorType.NETWORK_ERROR:
      return 'حدث خطأ في الاتصال. يرجى التحقق من اتصال الإنترنت والمحاولة مرة أخرى.';
    
    case ErrorType.AUTHENTICATION_ERROR:
      return 'انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى.';
    
    case ErrorType.VALIDATION_ERROR:
      return 'يرجى التحقق من البيانات المدخلة والمحاولة مرة أخرى.';
    
    case ErrorType.DATABASE_ERROR:
      return 'حدث خطأ في النظام. يرجى المحاولة مرة أخرى لاحقاً.';
    
    case ErrorType.PAYMENT_ERROR:
      return 'حدث خطأ في معالجة الدفع. يرجى التحقق من بيانات الدفع والمحاولة مرة أخرى.';
    
    case ErrorType.ORDER_ERROR:
      return 'حدث خطأ في معالجة الطلب. يرجى المحاولة مرة أخرى أو التواصل مع خدمة العملاء.';
    
    case ErrorType.SYSTEM_ERROR:
      return 'حدث خطأ في النظام. يرجى المحاولة مرة أخرى لاحقاً.';
    
    default:
      return 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.';
  }
};

export default errorHandler;
