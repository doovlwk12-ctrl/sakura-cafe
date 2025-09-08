'use client'

import React from 'react'
import { useCart } from '../../hooks/useCart'
import { useOrders } from '../../hooks/useOrders'
import { useAuth } from '../../components/AuthProvider'
import { useLanguage } from '../../hooks/LanguageProvider'
import { useTheme } from '../../hooks/useTheme'
import { processPayment, getAvailablePaymentMethods, type PaymentResult } from '../../utils/payment'
import { motion } from 'framer-motion'
import { 
  XMarkIcon, 
  PlusIcon, 
  MinusIcon, 
  ShoppingBagIcon,
  CreditCardIcon,
  BanknotesIcon,
  MapPinIcon,
  ArrowLeftIcon,
  SunIcon,
  MoonIcon,
  LanguageIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function CartPage() {
  const { items, totalItems, totalPrice, updateQuantity, removeFromCart, clearCart } = useCart()
  const { createOrder } = useOrders()
  const { user, isAuthenticated } = useAuth()
  const { t, isRTL, language, changeLanguage } = useLanguage()
  const { isDark, toggleTheme } = useTheme()

  const [isCheckingOut, setIsCheckingOut] = React.useState(false)
  const [showCheckout, setShowCheckout] = React.useState(false)
  const [checkoutData, setCheckoutData] = React.useState({
    paymentMethod: 'cash',
    orderType: 'pickup' as 'pickup' | 'delivery',
    branchId: 'branch-001',
    branchName: 'فرع صديان',
    deliveryAddress: '',
    usePoints: false,
    customerPhone: '',
    appliedDiscount: null as any
  })

  const [cartData, setCartData] = React.useState<any>(null)
  const [isLoadingCart, setIsLoadingCart] = React.useState(false)
  const [isApplyingReward, setIsApplyingReward] = React.useState(false)

  // دالة لتحويل التاريخ إلى التقويم الهجري
  const convertToHijri = (date: Date): string => {
    const hijriDate = new Intl.DateTimeFormat('ar-SA-u-ca-islamic', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    }).format(date);
    
    return hijriDate;
  }

  const [availablePaymentMethods, setAvailablePaymentMethods] = React.useState(getAvailablePaymentMethods(t))

  // Update payment methods when language changes
  React.useEffect(() => {
    setAvailablePaymentMethods(getAvailablePaymentMethods(t))
  }, [language, t])

  // جلب بيانات سلة التسوق مع المكافآت
  React.useEffect(() => {
    if (isAuthenticated) {
      fetchCartData()
    }
  }, [isAuthenticated])

  // تحديث بيانات السلة عند تغيير المنتجات
  React.useEffect(() => {
    if (isAuthenticated && items.length > 0) {
      fetchCartData()
    }
  }, [items, isAuthenticated])

  const fetchCartData = async () => {
    try {
      setIsLoadingCart(true)
      const token = localStorage.getItem('user_token')
      const userData = JSON.parse(localStorage.getItem('user_data') || '{}')

      console.log('🛒 جلب بيانات سلة التسوق مع المكافآت للمستخدم:', userData.id)

      const response = await fetch('/api/cart/items', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'user-id': userData.id
        }
      })

      if (response.ok) {
        const data = await response.json()
        console.log('✅ تم جلب بيانات سلة التسوق مع المكافآت:', data)
        setCartData(data)
      } else {
        console.error('❌ فشل في جلب بيانات سلة التسوق:', response.status)
      }
    } catch (error) {
      console.error('Error fetching cart data:', error)
    } finally {
      setIsLoadingCart(false)
    }
  }

  const branches = [
    { id: 'branch-001', name: 'فرع صديان', address: 'طريق الملك فهد الدائري المنتزه الشرقي، حائل 55428' },
    { id: 'branch-002', name: 'فرع النقرة', address: 'فهد العلى العريفي النقرة، حائل 55431' },
    { id: 'branch-003', name: 'فرع الجامعيين', address: 'المطار حائل 55421' },
    { id: 'branch-004', name: 'فرع طريق المدينة', address: 'طريق المدينة، النقرة، حائل 55433' },
    { id: 'branch-005', name: 'فرع الراجحي', address: '3335 خليفة رسول الله ابو بكر الصديق، حي النقرة، حائل 55433' },
    { id: 'branch-006', name: 'فرع فجر', address: 'حائل GJ4P+QW9' }
  ]

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      alert(t('auth.loginRequired'))
      return
    }

    setIsCheckingOut(true)

    try {
      // Process payment first
      const paymentResult: PaymentResult = await processPayment(
        checkoutData.paymentMethod,
        finalPrice,
        user?.email,
        checkoutData.customerPhone
      )

      if (!paymentResult.success) {
        alert(`${t('payment.failed')}: ${paymentResult.error}`)
        setIsCheckingOut(false)
        return
      }

      // If payment is successful, create the order
      const orderItems = items.map(item => ({
        id: item.id,
        name: item.name,
        arabicName: item.arabicName,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        customizations: item.customizations
      }))

      const order = await createOrder({
        items: orderItems,
        totalAmount: finalPrice,
        paymentMethod: checkoutData.paymentMethod as 'card' | 'cash' | 'wallet',
        branchId: checkoutData.branchId,
        branchName: checkoutData.branchName,
        orderType: checkoutData.orderType,
        deliveryAddress: checkoutData.deliveryAddress,
        loyaltyPointsUsed: checkoutData.usePoints ? Math.min(user?.loyaltyPoints || 0, Math.floor(totalPrice / 2)) : 0
      })

      if (order) {
        clearCart()
        alert(t('order.success'))
        setShowCheckout(false)
        
        // Redirect to payment page if needed
        if (paymentResult.redirectUrl) {
          window.location.href = paymentResult.redirectUrl
        }
      }
    } catch (error) {
      console.error('Error creating order:', error)
      alert(t('order.error'))
    } finally {
      setIsCheckingOut(false)
    }
  }

  const availablePoints = user?.loyaltyPoints || 0
  const maxPointsUsable = Math.floor(totalPrice / 2)
  const legacyPointsToUse = checkoutData.usePoints ? Math.min(availablePoints, maxPointsUsable) : 0
  
  // حساب الخصم المطبق
  const discountAmount = checkoutData.appliedDiscount ? checkoutData.appliedDiscount.discountDetails.value : 0
  
  // حساب السعر النهائي (يتضمن خصم النقاط من API)
  const pointsDiscountAmount = cartData?.stats?.totalDiscounts || 0
  const finalPrice = (cartData?.stats?.finalTotal || totalPrice) - legacyPointsToUse - discountAmount

  const applyDiscount = (discount: any) => {
    setCheckoutData({
      ...checkoutData,
      appliedDiscount: discount
    })
  }

  const removeDiscount = () => {
    setCheckoutData({
      ...checkoutData,
      appliedDiscount: null
    })
  }

  const applyReward = async (rewardId: string, action: 'apply' | 'remove') => {
    if (!isAuthenticated || !user) {
      alert('الرجاء تسجيل الدخول أولاً')
      return
    }

    try {
      setIsApplyingReward(true)
      const token = localStorage.getItem('user_token')
      const userData = JSON.parse(localStorage.getItem('user_data') || '{}')

      const response = await fetch('/api/cart/rewards', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'user-id': userData.id,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          rewardId: rewardId,
          action: action
        })
      })

      if (response.ok) {
        const data = await response.json()
        console.log(`✅ تم ${action === 'apply' ? 'تطبيق' : 'إزالة'} المكافأة:`, data)
        
        // تحديث بيانات سلة التسوق
        setCartData(data)
        
        // رسالة نجاح
        alert(data.message)
      } else {
        const errorData = await response.json()
        alert(`فشل في ${action === 'apply' ? 'تطبيق' : 'إزالة'} المكافأة: ${errorData.error}`)
      }
    } catch (error) {
      console.error('Error applying reward:', error)
      alert(`حدث خطأ في ${action === 'apply' ? 'تطبيق' : 'إزالة'} المكافأة`)
    } finally {
      setIsApplyingReward(false)
    }
  }

  const removePointsDiscount = async () => {
    if (!isAuthenticated || !user) {
      return
    }

    try {
      setIsApplyingDiscount(true)
      const token = localStorage.getItem('user_token')
      const userData = JSON.parse(localStorage.getItem('user_data') || '{}')

      const response = await fetch('/api/cart/apply-discount', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: userData.id
        })
      })

      if (response.ok) {
        const data = await response.json()
        console.log('✅ تم إلغاء خصم النقاط:', data)
        
        // تحديث بيانات سلة التسوق
        setCartData(data.cart)
        
        // تحديث نقاط المستخدم
        if (user) {
          user.loyaltyPoints = data.userPoints.remaining
        }
        
        alert('تم إلغاء خصم النقاط وإرجاع النقاط إلى حسابك')
      } else {
        const errorData = await response.json()
        alert(`فشل في إلغاء الخصم: ${errorData.error}`)
      }
    } catch (error) {
      console.error('Error removing points discount:', error)
      alert('حدث خطأ في إلغاء الخصم')
    } finally {
      setIsApplyingDiscount(false)
    }
  }

  // Check if user is authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
        {/* Theme and Language Controls */}
        <div className="fixed top-4 right-4 z-50 flex gap-2">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            title={isDark ? t('navbar.switchToLight') : t('navbar.switchToDark')}
          >
            {isDark ? (
              <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>
          
          {/* Language Toggle */}
          <button
            onClick={() => changeLanguage(language === 'ar' ? 'en' : 'ar')}
            className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            title={language === 'ar' ? t('navbar.switchToEnglish') : t('navbar.switchToArabic')}
          >
            <svg className="w-5 h-5 text-sakura-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
          </button>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-sakura-50 mb-6">
              <svg className="h-12 w-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 font-arabic">
              {t('auth.loginRequired')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8 font-arabic">
              {t('cart.loginRequiredMessage')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-2 bg-sakura-50 text-white px-6 py-3 rounded-lg hover:bg-sakura-100 transition-colors font-arabic"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                {t('auth.login')}
              </Link>
              <Link
                href="/auth/register"
                className="inline-flex items-center gap-2 border border-sakura-50 text-sakura-50 px-6 py-3 rounded-lg hover:bg-sakura-50 hover:text-white transition-colors font-arabic"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                {t('auth.createAccount')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
        {/* Theme and Language Controls */}
        <div className="fixed top-4 right-4 z-50 flex gap-2">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            title={isDark ? t('navbar.switchToLight') : t('navbar.switchToDark')}
          >
            {isDark ? (
              <SunIcon className="w-5 h-5 text-yellow-500" />
            ) : (
              <MoonIcon className="w-5 h-5 text-gray-700" />
            )}
          </button>
          
          {/* Language Toggle */}
          <button
            onClick={() => changeLanguage(language === 'ar' ? 'en' : 'ar')}
            className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            title={language === 'ar' ? t('navbar.switchToEnglish') : t('navbar.switchToArabic')}
          >
            <LanguageIcon className="w-5 h-5 text-sakura-50" />
          </button>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <ShoppingBagIcon className="w-24 h-24 text-gray-400 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 font-arabic">
              {t('cart.emptyTitle')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8 font-arabic">
              {t('cart.emptyDescription')}
            </p>
            <Link 
              href="/#menu"
              className="inline-flex items-center gap-2 bg-sakura-50 text-white px-6 py-3 rounded-lg hover:bg-sakura-100 transition-colors font-arabic"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              {t('cart.continueShopping')}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      {/* Theme and Language Controls */}
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
          title={isDark ? t('navbar.switchToLight') : t('navbar.switchToDark')}
        >
          {isDark ? (
            <SunIcon className="w-5 h-5 text-yellow-500" />
          ) : (
            <MoonIcon className="w-5 h-5 text-gray-700" />
          )}
        </button>
        
        {/* Language Toggle */}
        <button
          onClick={() => changeLanguage(language === 'ar' ? 'en' : 'ar')}
          className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
          title={language === 'ar' ? t('navbar.switchToEnglish') : t('navbar.switchToArabic')}
        >
          <LanguageIcon className="w-5 h-5 text-sakura-50" />
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link 
              href="/"
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-sakura-50 transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              {t('cart.continueShopping')}
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {t('cart.title')} ({cartData?.stats?.totalItems || totalItems})
            </h1>
          </div>
          <button
            onClick={clearCart}
            className="text-red-500 hover:text-red-700 transition-colors"
          >
            مسح السلة
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                المنتجات المضافة
              </h2>
              
              <div className="space-y-4">
                {(cartData?.items || items).map((item) => (
                  <motion.div
                    key={`${item.id}-${JSON.stringify(item.customizations)}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                  >
                    <img
                      src={item.image}
                      alt={item.arabicName}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 dark:text-white">
                        {item.arabicName}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {item.name}
                      </p>
                      {item.customizations && (
                        <div className="text-xs text-gray-500 mt-1">
                          {item.customizations.size && (
                            <span>الحجم: {item.customizations.size}</span>
                          )}
                          {item.customizations.extras && item.customizations.extras.length > 0 && (
                            <span> | إضافات: {item.customizations.extras.join(', ')}</span>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <MinusIcon className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-bold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <PlusIcon className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-bold text-gray-900 dark:text-white">
                        {(item.price * item.quantity).toFixed(2)} ريال
                      </p>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 text-sm transition-colors"
                      >
                        حذف
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 font-arabic">
                {t('cart.checkoutTitle')}
              </h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between font-arabic">
                  <span>{t('cart.yourItems')}:</span>
                  <span className="font-bold">{cartData?.stats?.totalItems || totalItems}</span>
                </div>
                <div className="flex justify-between font-arabic">
                  <span>{t('cart.subtotal')}:</span>
                  <span className="font-bold">{(cartData?.stats?.subtotal || totalPrice).toFixed(2)} {t('cart.currency')}</span>
                </div>
                
                {/* عرض المكافآت المطبقة */}
                {cartData?.rewards?.applied?.map((reward: any, index: number) => (
                  <div key={index} className="flex justify-between text-green-600">
                    <span>مكافأة: {reward.reward_type === 'discount' ? 'خصم' : 'منتج مجاني'}</span>
                    <span className="font-bold">-{reward.reward_value} ريال</span>
                  </div>
                ))}
                
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold font-arabic">
                    <span>{t('cart.total')}:</span>
                    <span>{(cartData?.stats?.finalTotal || finalPrice).toFixed(2)} {t('cart.currency')}</span>
                  </div>
                </div>
              </div>

              {!showCheckout ? (
                <button
                  onClick={() => setShowCheckout(true)}
                  className="w-full bg-sakura-50 text-white py-3 rounded-lg hover:bg-sakura-100 transition-colors font-bold font-arabic"
                >
                  {t('cart.continueOrder')}
                </button>
              ) : (
                <div className="space-y-4">
                  {/* Payment Method */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-arabic">
                      {t('cart.paymentMethod')}
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      {availablePaymentMethods.map((method) => {
                        return (
                          <label 
                            key={method.id} 
                            className={`relative flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:scale-105 ${
                              checkoutData.paymentMethod === method.id
                                ? 'border-red-500 bg-red-50 dark:bg-red-900/20 shadow-lg'
                                : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-sakura-400 hover:shadow-md'
                            }`}
                          >
                            <input
                              type="radio"
                              name="paymentMethod"
                              value={method.id}
                              checked={checkoutData.paymentMethod === method.id}
                              onChange={(e) => setCheckoutData({...checkoutData, paymentMethod: e.target.value})}
                              className="absolute top-3 right-3 w-4 h-4 text-red-500 focus:ring-red-500"
                            />
                            
                            <div className="flex flex-col items-center gap-3 w-full">
                              {method.image ? (
                                <img 
                                  src={method.image} 
                                  alt={method.name}
                                  className="w-16 h-12 object-contain rounded-lg"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = `data:image/svg+xml;base64,${btoa(`
                                      <svg width="64" height="48" viewBox="0 0 64 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect width="64" height="48" rx="8" fill="#f3f4f6"/>
                                        <text x="32" y="30" font-family="Arial" font-size="16" font-weight="bold" fill="#374151" text-anchor="middle">${method.icon}</text>
                                      </svg>
                                    `)}`;
                                  }}
                                />
                              ) : (
                                <div className="w-16 h-12 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg">
                                  <span className="text-2xl">{method.icon}</span>
                                </div>
                              )}
                              
                              <div className="text-center">
                                <div className="font-semibold text-gray-900 dark:text-white text-sm">
                                  {method.name}
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                  {method.description}
                                </div>
                              </div>
                            </div>
                          </label>
                        )
                      })}
                    </div>
                  </div>

                  {/* Order Type - فقط استلام من الفرع */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-arabic">
                      {t('cart.orderType')}
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="orderType"
                          value="pickup"
                          checked={checkoutData.orderType === 'pickup'}
                          onChange={(e) => setCheckoutData({...checkoutData, orderType: e.target.value as any})}
                          className="text-sakura-50"
                        />
                                <span className='font-arabic'>{t('cart.pickup')}</span>
                      </label>
                    </div>
                  </div>

                  {/* Branch Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-arabic">
                      {t('cart.branch')}
                    </label>
                    <select
                      value={checkoutData.branchId}
                      onChange={(e) => {
                        const branch = branches.find(b => b.id === e.target.value)
                        setCheckoutData({
                          ...checkoutData, 
                          branchId: e.target.value,
                          branchName: branch?.name || ''
                        })
                      }}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      {branches.map((branch) => (
                        <option key={branch.id} value={branch.id}>
                          {branch.name} - {branch.address}
                        </option>
                      ))}
                    </select>
                  </div>


                  {/* Customer Phone - Required for STC Pay */}
                  {checkoutData.paymentMethod === 'stc_pay' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-arabic">
                        {t('cart.customerPhone')} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={checkoutData.customerPhone}
                        onChange={(e) => setCheckoutData({...checkoutData, customerPhone: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sakura-50 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        placeholder={t('cart.phonePlaceholder')}
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1 font-arabic">
                        {t('cart.phoneRequired')}
                      </p>
                    </div>
                  )}


                  {/* نظام المكافآت */}
                  {isAuthenticated && cartData?.rewards?.available && (
                    <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 font-arabic">
                          المكافآت المتاحة ({cartData.rewards.available.length})
                        </h3>
                        <div className="text-xs text-sakura-600 font-arabic">
                          نقاطك: {cartData.userPoints}
                          {cartData.pointsExpiryDate && (
                            <div className="text-xs text-gray-500 mt-1">
                              تنتهي: {convertToHijri(new Date(cartData.pointsExpiryDate))} هـ
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        {cartData.rewards.available.map((reward: any) => {
                          const isApplied = cartData.rewards.applied.some((applied: any) => applied.reward_id === reward.id);
                          
                          return (
                            <div
                              key={reward.id}
                              className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                                isApplied
                                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                                  : 'border-gray-200 dark:border-gray-600 hover:border-sakura-400'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="font-medium text-gray-900 dark:text-white font-arabic">
                                    {reward.arabic_name}
                                  </div>
                                  <div className="text-sm text-gray-600 dark:text-gray-400 font-arabic">
                                    {reward.arabic_description}
                                  </div>
                                  <div className="text-xs text-gray-500 font-arabic">
                                    {reward.points_required} نقطة
                                  </div>
                                </div>
                                <div className="text-right ml-3">
                                  <div className="font-bold text-sakura-600 dark:text-sakura-400">
                                    {reward.type === 'discount' ? `-${reward.value} ريال` : 'مجاني'}
                                  </div>
                                  <button
                                    onClick={() => applyReward(reward.id, isApplied ? 'remove' : 'apply')}
                                    disabled={isApplyingReward}
                                    className={`mt-2 px-3 py-1 rounded text-xs font-arabic transition-colors ${
                                      isApplied
                                        ? 'bg-red-500 text-white hover:bg-red-600'
                                        : 'bg-sakura-50 text-sakura-600 hover:bg-sakura-100'
                                    } disabled:opacity-50`}
                                  >
                                    {isApplied ? 'إزالة' : 'تطبيق'}
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}


                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowCheckout(false)}
                      className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      إلغاء
                    </button>
                    <button
                      onClick={handleCheckout}
                      disabled={isCheckingOut}
                      className="flex-1 bg-sakura-50 text-white py-2 rounded-lg hover:bg-sakura-100 transition-colors disabled:opacity-50"
                    >
                      {isCheckingOut ? 'جاري الإرسال...' : 'تأكيد الطلب'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
