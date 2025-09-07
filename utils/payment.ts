// Payment utilities for Sakura Cafe
export interface PaymentMethod {
  id: string;
  name: string;
  type: 'cash' | 'card' | 'wallet' | 'digital_wallet';
  enabled: boolean;
  config?: any;
  icon?: string;
  description?: string;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
  redirectUrl?: string;
  paymentUrl?: string;
}

// Payment methods configuration for Saudi Arabia
export const getPaymentMethods = (t: (key: string) => string): PaymentMethod[] => [
  {
    id: 'cash',
    name: t('payment.cash'),
    type: 'cash',
    enabled: true,
    icon: '💵',
    description: t('cart.cash')
  },
  {
    id: 'mada',
    name: t('payment.mada'),
    type: 'card',
    enabled: true,
    icon: '💳',
    description: t('payment.mada'),
    config: {
      gateway: 'tap',
      apiKey: process.env.TAP_API_KEY,
      merchantId: process.env.TAP_MERCHANT_ID
    }
  },
  {
    id: 'visa',
    name: t('payment.visa'),
    type: 'card',
    enabled: true,
    icon: '💳',
    description: t('payment.visa'),
    config: {
      gateway: 'tap',
      apiKey: process.env.TAP_API_KEY,
      merchantId: process.env.TAP_MERCHANT_ID
    }
  },
  {
    id: 'mastercard',
    name: t('payment.mastercard'),
    type: 'card',
    enabled: true,
    icon: '💳',
    description: t('payment.mastercard'),
    config: {
      gateway: 'tap',
      apiKey: process.env.TAP_API_KEY,
      merchantId: process.env.TAP_MERCHANT_ID
    }
  },
  {
    id: 'stc_pay',
    name: t('payment.stcPay'),
    type: 'digital_wallet',
    enabled: true,
    icon: '📱',
    description: t('payment.stcPay'),
    config: {
      gateway: 'myfatoorah',
      apiKey: process.env.MYFATOORAH_API_KEY,
      merchantId: process.env.MYFATOORAH_MERCHANT_ID
    }
  },
  {
    id: 'samsung_wallet',
    name: t('payment.samsungWallet'),
    type: 'wallet',
    enabled: true,
    icon: '📱',
    description: t('payment.samsungWallet'),
    config: {
      gateway: 'tap',
      apiKey: process.env.TAP_API_KEY,
      merchantId: process.env.TAP_MERCHANT_ID
    }
  },
  {
    id: 'apple_pay',
    name: t('payment.applePay'),
    type: 'wallet',
    enabled: true,
    icon: '🍎',
    description: t('payment.applePay'),
    config: {
      gateway: 'tap',
      apiKey: process.env.TAP_API_KEY,
      merchantId: process.env.TAP_MERCHANT_ID
    }
  },
  {
    id: 'google_pay',
    name: t('payment.googlePay'),
    type: 'wallet',
    enabled: true,
    icon: '📱',
    description: t('payment.googlePay'),
    config: {
      gateway: 'tap',
      apiKey: process.env.TAP_API_KEY,
      merchantId: process.env.TAP_MERCHANT_ID
    }
  }
];

// Cash payment (always successful)
export const processCashPayment = async (amount: number): Promise<PaymentResult> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        transactionId: `CASH_${Date.now()}`,
      });
    }, 1000);
  });
};

// Tap Payments processing (Mada, Visa, Mastercard, Samsung Wallet, Apple Pay, Google Pay)
export const processTapPayment = async (
  amount: number,
  currency: string = 'SAR',
  customerEmail?: string,
  paymentMethod: string = 'mada'
): Promise<PaymentResult> => {
  try {
    const response = await fetch('/api/payments/tap', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        currency,
        customerEmail,
        paymentMethod,
      }),
    });

    const result = await response.json();

    if (result.success) {
      return {
        success: true,
        transactionId: result.transactionId,
        redirectUrl: result.redirectUrl,
        paymentUrl: result.paymentUrl,
      };
    } else {
      return {
        success: false,
        error: result.error || 'Tap payment failed',
      };
    }
  } catch (error) {
    return {
      success: false,
      error: 'Network error occurred',
    };
  }
};

// STC Pay processing via MyFatoorah
export const processSTCPayPayment = async (
  amount: number,
  customerEmail?: string,
  customerPhone?: string
): Promise<PaymentResult> => {
  try {
    const response = await fetch('/api/payments/stc-pay', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        currency: 'SAR',
        customerEmail,
        customerPhone,
      }),
    });

    const result = await response.json();

    if (result.success) {
      return {
        success: true,
        transactionId: result.transactionId,
        redirectUrl: result.redirectUrl,
        paymentUrl: result.paymentUrl,
      };
    } else {
      return {
        success: false,
        error: result.error || 'STC Pay payment failed',
      };
    }
  } catch (error) {
    return {
      success: false,
      error: 'Network error occurred',
    };
  }
};

// Apple Pay processing
export const processApplePayPayment = async (
  amount: number,
  currency: string = 'SAR'
): Promise<PaymentResult> => {
  try {
    // Check if Apple Pay is available
    if (!window.ApplePaySession || !ApplePaySession.canMakePayments()) {
      return {
        success: false,
        error: 'Apple Pay is not available on this device',
      };
    }

    // Create Apple Pay session
    const session = new ApplePaySession(3, {
      countryCode: 'SA',
      currencyCode: currency,
      supportedNetworks: ['visa', 'masterCard', 'amex', 'mada'],
      merchantCapabilities: ['supports3DS'],
      total: {
        label: 'مقهى ساكورا',
        amount: amount.toFixed(2),
      },
    });

    return new Promise((resolve) => {
      session.onvalidatemerchant = async (event) => {
        try {
          const response = await fetch('/api/payments/apple-pay/validate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              validationURL: event.validationURL,
            }),
          });

          const merchantSession = await response.json();
          session.completeMerchantValidation(merchantSession);
        } catch (error) {
          session.abort();
          resolve({
            success: false,
            error: 'Apple Pay validation failed',
          });
        }
      };

      session.onpaymentauthorized = async (event) => {
        try {
          const response = await fetch('/api/payments/apple-pay/process', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              payment: event.payment,
              amount,
            }),
          });

          const result = await response.json();

          if (result.success) {
            session.completePayment(ApplePaySession.STATUS_SUCCESS);
            resolve({
              success: true,
              transactionId: result.transactionId,
            });
          } else {
            session.completePayment(ApplePaySession.STATUS_FAILURE);
            resolve({
              success: false,
              error: result.error || 'Apple Pay payment failed',
            });
          }
        } catch (error) {
          session.completePayment(ApplePaySession.STATUS_FAILURE);
          resolve({
            success: false,
            error: 'Apple Pay processing failed',
          });
        }
      };

      session.oncancel = () => {
        resolve({
          success: false,
          error: 'Payment cancelled by user',
        });
      };

      session.begin();
    });
  } catch (error) {
    return {
      success: false,
      error: 'Apple Pay initialization failed',
    };
  }
};

// Google Pay processing
export const processGooglePayPayment = async (
  amount: number,
  currency: string = 'SAR'
): Promise<PaymentResult> => {
  try {
    // Check if Google Pay is available
    if (!window.google || !window.google.payments) {
      return {
        success: false,
        error: 'Google Pay is not available',
      };
    }

    const paymentsClient = new window.google.payments.api.PaymentsClient({
      environment: process.env.NODE_ENV === 'production' ? 'PRODUCTION' : 'TEST',
    });

    const paymentDataRequest = {
      apiVersion: 2,
      apiVersionMinor: 0,
      allowedPaymentMethods: [
        {
          type: 'CARD',
          parameters: {
            allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
            allowedCardNetworks: ['VISA', 'MASTERCARD', 'AMEX', 'MADA'],
          },
          tokenizationSpecification: {
            type: 'PAYMENT_GATEWAY',
            parameters: {
              gateway: 'stripe',
              gatewayMerchantId: process.env.NEXT_PUBLIC_STRIPE_MERCHANT_ID,
            },
          },
        },
      ],
      transactionInfo: {
        totalPriceStatus: 'FINAL',
        totalPriceLabel: 'Total',
        totalPrice: amount.toFixed(2),
        currencyCode: currency,
      },
      merchantInfo: {
        merchantId: process.env.NEXT_PUBLIC_GOOGLE_PAY_MERCHANT_ID,
        merchantName: 'مقهى ساكورا',
      },
    };

    const paymentData = await paymentsClient.loadPaymentData(paymentDataRequest);

    // Process the payment with your backend
    const response = await fetch('/api/payments/google-pay', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paymentData,
        amount,
      }),
    });

    const result = await response.json();

    if (result.success) {
      return {
        success: true,
        transactionId: result.transactionId,
      };
    } else {
      return {
        success: false,
        error: result.error || 'Google Pay payment failed',
      };
    }
  } catch (error) {
    return {
      success: false,
      error: 'Google Pay processing failed',
    };
  }
};

// Main payment processor
export const processPayment = async (
  method: string,
  amount: number,
  customerEmail?: string,
  customerPhone?: string
): Promise<PaymentResult> => {
  switch (method) {
    case 'cash':
      return processCashPayment(amount);
    
    case 'mada':
    case 'visa':
    case 'mastercard':
    case 'samsung_wallet':
    case 'apple_pay':
    case 'google_pay':
      return processTapPayment(amount, 'SAR', customerEmail, method);
    
    case 'stc_pay':
      return processSTCPayPayment(amount, customerEmail, customerPhone);
    
    default:
      return {
        success: false,
        error: 'Unsupported payment method',
      };
  }
};

// Check if payment method is available
export const isPaymentMethodAvailable = (method: string): boolean => {
  const paymentMethod = PAYMENT_METHODS.find(m => m.id === method);
  return paymentMethod ? paymentMethod.enabled : false;
};

// Get available payment methods
export const getAvailablePaymentMethods = (t: (key: string) => string): PaymentMethod[] => {
  return getPaymentMethods(t).filter(method => method.enabled);
};
