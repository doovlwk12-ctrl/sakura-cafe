'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCardIcon,
  DevicePhoneMobileIcon,
  BanknotesIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { useLanguage } from '../hooks/LanguageProvider';
import PaymentRequestButton from './PaymentRequestButton';

export interface PaymentMethod {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  icon: React.ComponentType<any>;
  isAvailable: boolean;
  processingFee?: number;
  minAmount?: number;
  maxAmount?: number;
}

interface PaymentMethodsProps {
  amount: number;
  currency?: string;
  onPaymentMethodSelect: (methodId: string) => void;
  onPaymentSuccess?: (paymentData: any) => void;
  onPaymentError?: (error: any) => void;
  selectedMethod?: string;
  disabled?: boolean;
  className?: string;
}

const PaymentMethods: React.FC<PaymentMethodsProps> = ({
  amount,
  currency = 'SAR',
  onPaymentMethodSelect,
  onPaymentSuccess,
  onPaymentError,
  selectedMethod,
  disabled = false,
  className = ''
}) => {
  const { t, isRTL } = useLanguage();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');

  // Available payment methods
  const paymentMethods: PaymentMethod[] = [
    {
      id: 'mada',
      name: 'Mada',
      nameAr: 'مدى',
      description: 'Pay with your Mada card',
      descriptionAr: 'ادفع ببطاقة مدى',
      icon: CreditCardIcon,
      isAvailable: true,
      processingFee: 0,
      minAmount: 1,
      maxAmount: 50000
    },
    {
      id: 'visa',
      name: 'Visa',
      nameAr: 'فيزا',
      description: 'Pay with Visa card',
      descriptionAr: 'ادفع ببطاقة فيزا',
      icon: CreditCardIcon,
      isAvailable: true,
      processingFee: 0.029,
      minAmount: 1,
      maxAmount: 50000
    },
    {
      id: 'mastercard',
      name: 'Mastercard',
      nameAr: 'ماستركارد',
      description: 'Pay with Mastercard',
      descriptionAr: 'ادفع ببطاقة ماستركارد',
      icon: CreditCardIcon,
      isAvailable: true,
      processingFee: 0.029,
      minAmount: 1,
      maxAmount: 50000
    },
    {
      id: 'stc-pay',
      name: 'STC Pay',
      nameAr: 'STC Pay',
      description: 'Pay with STC Pay wallet',
      descriptionAr: 'ادفع بمحفظة STC Pay',
      icon: DevicePhoneMobileIcon,
      isAvailable: true,
      processingFee: 0,
      minAmount: 1,
      maxAmount: 10000
    },
    {
      id: 'apple-pay',
      name: 'Apple Pay',
      nameAr: 'Apple Pay',
      description: 'Pay with Apple Pay',
      descriptionAr: 'ادفع بـ Apple Pay',
      icon: DevicePhoneMobileIcon,
      isAvailable: true,
      processingFee: 0,
      minAmount: 1,
      maxAmount: 50000
    },
    {
      id: 'google-pay',
      name: 'Google Pay',
      nameAr: 'Google Pay',
      description: 'Pay with Google Pay',
      descriptionAr: 'ادفع بـ Google Pay',
      icon: DevicePhoneMobileIcon,
      isAvailable: true,
      processingFee: 0,
      minAmount: 1,
      maxAmount: 50000
    },
    {
      id: 'samsung-wallet',
      name: 'Samsung Wallet',
      nameAr: 'Samsung Wallet',
      description: 'Pay with Samsung Wallet',
      descriptionAr: 'ادفع بـ Samsung Wallet',
      icon: DevicePhoneMobileIcon,
      isAvailable: true,
      processingFee: 0,
      minAmount: 1,
      maxAmount: 50000
    },
    {
      id: 'cash',
      name: 'Cash',
      nameAr: 'نقدي',
      description: 'Pay with cash on delivery',
      descriptionAr: 'ادفع نقداً عند الاستلام',
      icon: BanknotesIcon,
      isAvailable: true,
      processingFee: 0,
      minAmount: 1,
      maxAmount: 10000
    }
  ];

  // Filter available payment methods based on amount
  const availableMethods = paymentMethods.filter(method => {
    if (!method.isAvailable) return false;
    if (method.minAmount && amount < method.minAmount) return false;
    if (method.maxAmount && amount > method.maxAmount) return false;
    return true;
  });

  const handleMethodSelect = (methodId: string) => {
    onPaymentMethodSelect(methodId);
  };

  const handlePaymentSuccess = (paymentData: any) => {
    setPaymentStatus('success');
    setIsProcessing(false);
    onPaymentSuccess?.(paymentData);
  };

  const handlePaymentError = (error: any) => {
    setPaymentStatus('error');
    setIsProcessing(false);
    onPaymentError?.(error);
  };

  const getMethodName = (method: PaymentMethod) => {
    return isRTL ? method.nameAr : method.name;
  };

  const getMethodDescription = (method: PaymentMethod) => {
    return isRTL ? method.descriptionAr : method.description;
  };

  const getStatusIcon = () => {
    switch (paymentStatus) {
      case 'success':
        return <CheckCircleIcon className="w-5 h-5 text-green-600" />;
      case 'error':
        return <XCircleIcon className="w-5 h-5 text-red-600" />;
      case 'processing':
        return <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />;
      default:
        return null;
    }
  };

  const getStatusMessage = () => {
    switch (paymentStatus) {
      case 'success':
        return 'تم الدفع بنجاح';
      case 'error':
        return 'فشل في الدفع';
      case 'processing':
        return 'جاري معالجة الدفع...';
      default:
        return '';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white font-arabic mb-2">
          {t('cart.paymentMethod')}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 font-arabic">
          اختر طريقة الدفع المناسبة لك
        </p>
      </div>

      {/* Payment Status */}
      {paymentStatus !== 'idle' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg border ${
            paymentStatus === 'success'
              ? 'bg-green-50 border-green-200 text-green-800'
              : paymentStatus === 'error'
              ? 'bg-red-50 border-red-200 text-red-800'
              : 'bg-blue-50 border-blue-200 text-blue-800'
          }`}
        >
          <div className="flex items-center gap-3">
            {getStatusIcon()}
            <span className="font-arabic">{getStatusMessage()}</span>
          </div>
        </motion.div>
      )}

      {/* Payment Methods Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence>
          {availableMethods.map((method, index) => {
            const IconComponent = method.icon;
            const isSelected = selectedMethod === method.id;
            const isDisabled = disabled || isProcessing;

            return (
              <motion.div
                key={method.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                  isSelected
                    ? 'border-sakura-50 bg-sakura-50/10 shadow-lg'
                    : 'border-gray-200 dark:border-gray-700 hover:border-sakura-50/50 hover:shadow-md'
                } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => !isDisabled && handleMethodSelect(method.id)}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    isSelected ? 'bg-sakura-50 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 dark:text-white font-arabic">
                      {getMethodName(method)}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-arabic">
                      {getMethodDescription(method)}
                    </p>
                    
                    {method.processingFee && method.processingFee > 0 && (
                      <p className="text-xs text-gray-500 dark:text-gray-500 font-arabic mt-1">
                        رسوم معالجة: {(method.processingFee * 100).toFixed(1)}%
                      </p>
                    )}
                  </div>

                  {isSelected && (
                    <div className="w-6 h-6 bg-sakura-50 rounded-full flex items-center justify-center">
                      <CheckCircleIcon className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>

                {/* Method-specific content */}
                {method.id === 'apple-pay' && isSelected && (
                  <div className="mt-4">
                    <PaymentRequestButton
                      amount={amount}
                      currency={currency}
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                      disabled={isDisabled}
                    />
                  </div>
                )}

                {method.id === 'google-pay' && isSelected && (
                  <div className="mt-4">
                    <PaymentRequestButton
                      amount={amount}
                      currency={currency}
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                      disabled={isDisabled}
                    />
                  </div>
                )}

                {method.id === 'stc-pay' && isSelected && (
                  <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-sm text-blue-800 dark:text-blue-200 font-arabic">
                      سيتم توجيهك إلى تطبيق STC Pay لإتمام الدفع
                    </p>
                  </div>
                )}

                {method.id === 'cash' && isSelected && (
                  <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <p className="text-sm text-green-800 dark:text-green-200 font-arabic">
                      ستحتاج إلى دفع المبلغ نقداً عند استلام الطلب
                    </p>
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* No methods available */}
      {availableMethods.length === 0 && (
        <div className="text-center py-8">
          <ExclamationTriangleIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 font-arabic">
            لا توجد طرق دفع متاحة لهذا المبلغ
          </p>
        </div>
      )}

      {/* Payment Summary */}
      {selectedMethod && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4"
        >
          <h4 className="font-bold text-gray-900 dark:text-white font-arabic mb-3">
            ملخص الدفع
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400 font-arabic">المبلغ الأساسي:</span>
              <span className="text-gray-900 dark:text-white">{amount.toFixed(2)} {currency}</span>
            </div>
            {selectedMethod && paymentMethods.find(m => m.id === selectedMethod)?.processingFee && (
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400 font-arabic">رسوم المعالجة:</span>
                <span className="text-gray-900 dark:text-white">
                  {(amount * (paymentMethods.find(m => m.id === selectedMethod)?.processingFee || 0)).toFixed(2)} {currency}
                </span>
              </div>
            )}
            <div className="flex justify-between font-bold border-t border-gray-200 dark:border-gray-700 pt-2">
              <span className="text-gray-900 dark:text-white font-arabic">المجموع:</span>
              <span className="text-gray-900 dark:text-white">
                {(amount + (amount * (paymentMethods.find(m => m.id === selectedMethod)?.processingFee || 0))).toFixed(2)} {currency}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default PaymentMethods;
