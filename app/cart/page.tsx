'use client'

import React, { useState, useEffect } from 'react'
import { useCart } from '../../hooks/useCart'
import { useOrders } from '../../hooks/useOrders'
import { useAuth } from '../../components/AuthProvider'
import { useLanguage } from '../../hooks/LanguageProvider'
import { useTheme } from '../../hooks/useTheme'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function CartPage() {
  const { items, totalItems, totalPrice, updateQuantity, removeFromCart, clearCart } = useCart()
  const { addOrder } = useOrders() // ✅ استبدلنا createOrder بـ addOrder
  const { user, isAuthenticated } = useAuth()
  const { t, isRTL, language } = useLanguage()
  const { isDark } = useTheme()
  const router = useRouter()

  // ✅ حالات التحميل
  const [isApplyingReward, setIsApplyingReward] = useState(false)
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false)

  // مثال دالة إنشاء الطلب
  const handleCheckout = async () => {
    if (!isAuthenticated) {
      router.push('/auth/login')
      return
    }

    try {
      await addOrder({
        items,
        total: totalPrice,
        userId: user?.id
      })
      clearCart()
      router.push('/orders')
    } catch (error) {
      console.error('Error creating order:', error)
    }
  }

  // مثال دالة تطبيق خصم
  const applyDiscount = async () => {
    try {
      setIsApplyingDiscount(true)
      const token = localStorage.getItem('user_token')
      const userData = JSON.parse(localStorage.getItem('user_data') || '{}')

      if (!token || !userData) {
        console.warn('User not logged in for discount')
        return
      }

      // هنا من المفترض تنادي API الكوبونات
      console.log('Applying discount for user:', userData)

    } catch (error) {
      console.error('Error applying discount:', error)
    } finally {
      setIsApplyingDiscount(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <h1 className="text-2xl font-bold mb-4">{t('cart.title')}</h1>

      {items.length === 0 ? (
        <p>{t('cart.empty')}</p>
      ) : (
        <div>
          <ul>
            {items.map((item: any) => (
              <li key={item.id} className="flex justify-between mb-2">
                <span>{item.name} x {item.quantity}</span>
                <span>{item.price * item.quantity} SAR</span>
              </li>
            ))}
          </ul>

          <div className="mt-4">
            <p>{t('cart.totalItems')}: {totalItems}</p>
            <p>{t('cart.totalPrice')}: {totalPrice} SAR</p>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={applyDiscount}
              disabled={isApplyingDiscount}
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
            >
              {isApplyingDiscount ? t('cart.applyingDiscount') : t('cart.applyDiscount')}
            </button>

            <button
              onClick={handleCheckout}
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              {t('cart.checkout')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}