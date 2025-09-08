'use client'

import React, { useEffect, useRef, useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'

interface PaymentRequestButtonProps {
  amount: number
  currency?: string
  onSuccess?: (paymentIntent: any) => void
  onError?: (error: any) => void
  disabled?: boolean
}

const PaymentRequestButton: React.FC<PaymentRequestButtonProps> = ({
  amount,
  currency = 'SAR',
  onSuccess,
  onError,
  disabled = false
}) => {
  const [stripe, setStripe] = useState<any>(null)
  const [paymentRequest, setPaymentRequest] = useState<any>(null)
  const [canMakePayment, setCanMakePayment] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const elementsRef = useRef<any>(null)

  useEffect(() => {
    const initializeStripe = async () => {
      try {
        const stripeInstance = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
        setStripe(stripeInstance)

        if (stripeInstance) {
          const options = {
            requestPayerName: true,
            requestPayerEmail: true
          };

          const pr = stripeInstance.paymentRequest({
            country: 'SA', // Saudi Arabia
            currency: currency.toLowerCase(),
            total: {
              label: 'مقهى ساكورا',
              amount: Math.round(amount * 100), // السعر بالسنتات
            },
            ...options,
            requestPayerPhone: true,
          })

          // Check if Apple Pay and Google Pay are available
          const canMakePaymentResult = await pr.canMakePayment()
          setCanMakePayment(!!canMakePaymentResult)
          setPaymentRequest(pr)

          // Handle payment method
          pr.on('paymentmethod', async (ev: any) => {
            setIsLoading(true)
            
            try {
              // Create payment intent on your server
              const response = await fetch('/api/payments/stripe', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  amount: amount,
                  currency: currency,
                  paymentMethodId: ev.paymentMethod.id,
                }),
              })

              const { clientSecret } = await response.json()

              // Confirm payment intent
              const { error, paymentIntent } = await stripeInstance.confirmCardPayment(
                clientSecret,
                { payment_method: ev.paymentMethod.id },
                { handleActions: false }
              )

              if (error) {
                ev.complete('fail')
                onError?.(error)
              } else {
                ev.complete('success')
                onSuccess?.(paymentIntent)
              }
            } catch (error) {
              ev.complete('fail')
              onError?.(error)
            } finally {
              setIsLoading(false)
            }
          })
        }
      } catch (error) {
        console.error('Error initializing Stripe:', error)
        onError?.(error)
      }
    }

    initializeStripe()
  }, [amount, currency, onSuccess, onError])

  const handleClick = () => {
    if (paymentRequest && canMakePayment) {
      paymentRequest.show()
    }
  }

  if (!canMakePayment) {
    return null // لا تظهر الزر إذا لم يكن Apple Pay أو Google Pay متاحين
  }

  return (
    <div className="w-full">
      <button
        onClick={handleClick}
        disabled={disabled || isLoading}
        className={`
          w-full px-6 py-4 rounded-lg font-medium text-white
          transition-all duration-300 transform hover:scale-105
          disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
          ${isLoading 
            ? 'bg-gray-400 cursor-wait' 
            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
          }
          shadow-lg hover:shadow-xl
        `}
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span className="font-arabic">جاري المعالجة...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
            <span className="font-arabic">الدفع بـ Apple Pay / Google Pay</span>
          </div>
        )}
      </button>
    </div>
  )
}

export default PaymentRequestButton
