'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../../../hooks/LanguageProvider'
import { useAuth } from '../../../components/AuthProvider'
import Link from 'next/link'
import { 
  StarIcon, 
  GiftIcon, 
  ClockIcon, 
  CheckCircleIcon,
  XCircleIcon,
  ArrowRightIcon,
  TrophyIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'

interface Reward {
  id: string
  name: string
  description: string
  pointsRequired: number
  type: string
  value: number
  available: boolean
}

interface RewardsData {
  totalPoints: number
  availablePoints: number
  usedPoints: number
  level: string
  nextLevelPoints: number
  pointsToNextLevel: number
  pointsExpiryDate: string
  availableRewards: Reward[]
  pointsHistory: Array<{
    date: string
    points: number
    description: string
    type: string
  }>
}

const RewardsPage = () => {
  const { language } = useLanguage()
  const { user } = useAuth()
  const [rewardsData, setRewardsData] = useState<RewardsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // دالة لتحويل التاريخ إلى التقويم الهجري
  const convertToHijri = (date: Date): string => {
    const hijriDate = new Intl.DateTimeFormat('ar-SA-u-ca-islamic', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    }).format(date);
    
    return hijriDate;
  }
  const [selectedTab, setSelectedTab] = useState<'rewards' | 'history'>('rewards')
  const [message, setMessage] = useState('')
  const [redeemedDiscounts, setRedeemedDiscounts] = useState<any[]>([])

  useEffect(() => {
    fetchRewardsData()
    fetchRedeemedDiscounts()
  }, [])


  const fetchRedeemedDiscounts = async () => {
    try {
      const token = localStorage.getItem('user_token')
      const userData = JSON.parse(localStorage.getItem('user_data') || '{}')

      const response = await fetch('/api/discounts', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'user-id': userData.id
        }
      })

      if (response.ok) {
        const data = await response.json()
        setRedeemedDiscounts(data.redeemedDiscounts || [])
      }
    } catch (error) {
      console.error('Error fetching redeemed discounts:', error)
    }
  }

  const fetchRewardsData = async () => {
    try {
      setIsLoading(true)
      
      // استخدام البيانات الافتراضية مباشرة
      setRewardsData({
        totalPoints: 1250,
        availablePoints: 850,
        usedPoints: 400,
        level: 'Gold',
        nextLevelPoints: 500,
        pointsToNextLevel: 250,
        pointsExpiryDate: '2025-12-31',
        availableRewards: [
          {
            id: 'REWARD-001',
            name: 'خصم 10 ريال',
            description: 'خصم 10 ريال على أي طلب',
            pointsRequired: 100,
            type: 'discount',
            value: 10,
            available: true
          },
          {
            id: 'REWARD-002',
            name: 'خصم 20 ريال',
            description: 'خصم 20 ريال على أي طلب',
            pointsRequired: 200,
            type: 'discount',
            value: 20,
            available: true
          },
          {
            id: 'REWARD-003',
            name: 'قهوة مجانية',
            description: 'قهوة لاتيه مجانية',
            pointsRequired: 150,
            type: 'free_item',
            value: 15,
            available: true
          },
          {
            id: 'REWARD-004',
            name: 'كيك مجاني',
            description: 'قطعة كيك مجانية',
            pointsRequired: 200,
            type: 'free_item',
            value: 12,
            available: true
          },
          {
            id: 'REWARD-005',
            name: 'خصم 50 ريال',
            description: 'خصم 50 ريال على طلب بقيمة 100 ريال أو أكثر',
            pointsRequired: 500,
            type: 'discount',
            value: 50,
            available: true
          }
        ],
        pointsHistory: [
          { date: '2025-01-15', points: 45, description: 'طلب #ORD-001', type: 'earned' },
          { date: '2025-01-14', points: 52, description: 'طلب #ORD-002', type: 'earned' },
          { date: '2025-01-13', points: 28, description: 'طلب #ORD-003', type: 'earned' },
          { date: '2025-01-12', points: -200, description: 'استبدال - خصم 20 ريال', type: 'redeemed' },
          { date: '2025-01-11', points: 55, description: 'طلب #ORD-005', type: 'earned' },
          { date: '2025-01-10', points: 24, description: 'طلب #ORD-006', type: 'earned' },
          { date: '2025-01-09', points: 67, description: 'طلب #ORD-007', type: 'earned' },
          { date: '2025-01-05', points: -200, description: 'استبدال - قهوة مجانية', type: 'redeemed' }
        ]
      })
    } catch (error) {
      console.error('Error fetching rewards:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRedeemReward = async (reward: Reward) => {
    if (rewardsData && rewardsData.availablePoints < reward.pointsRequired) {
      setMessage(language === 'ar' ? 'نقاط غير كافية' : 'Insufficient points')
      return
    }

    try {
      const token = localStorage.getItem('user_token')
      const userData = JSON.parse(localStorage.getItem('user_data') || '{}')
      
      // إذا كانت المكافأة خصم، أضفها إلى الخصومات المستبدلة
      if (reward.type === 'discount') {
        const discountResponse = await fetch('/api/discounts', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            discountId: reward.id,
            userId: userData.id,
            pointsUsed: reward.pointsRequired,
            rewardName: reward.name
          })
        })

        if (!discountResponse.ok) {
          const errorData = await discountResponse.json()
          setMessage(errorData.error || (language === 'ar' ? 'حدث خطأ في استبدال الخصم' : 'Error redeeming discount'))
          return
        }

        // تحديث قائمة الخصومات المستبدلة
        const discountResult = await discountResponse.json()
        setRedeemedDiscounts(prev => [discountResult.redeemedDiscount, ...prev])
      }

      // إذا كانت المكافأة منتج مجاني، أضفها إلى سلة التسوق
      if (reward.type === 'free_item') {
        const addToCartResponse = await fetch('/api/add-to-cart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            userId: userData.id,
            product: {
              id: reward.id,
              name: reward.name,
              price: reward.value,
              image: '🎁'
            },
            isFreeProduct: true
          })
        })

        if (!addToCartResponse.ok) {
          const errorData = await addToCartResponse.json()
          setMessage(errorData.error || (language === 'ar' ? 'حدث خطأ في إضافة المنتج إلى السلة' : 'Error adding product to cart'))
          return
        }
      }

      // استبدال النقاط
      const response = await fetch('/api/rewards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          rewardId: reward.id,
          points: reward.pointsRequired,
          rewardName: reward.name
        })
      })

      if (response.ok) {
        const result = await response.json()
        let successMessage = ''
        
        if (reward.type === 'discount') {
          successMessage = language === 'ar' ? 'تم استبدال الخصم بنجاح! يمكنك استخدامه في سلة التسوق' : 'Discount redeemed successfully! You can use it in your cart'
        } else if (reward.type === 'free_item') {
          successMessage = language === 'ar' ? 'تم إضافة المنتج المجاني إلى سلة التسوق بنجاح!' : 'Free product added to cart successfully!'
        } else {
          successMessage = language === 'ar' ? 'تم استبدال المكافأة بنجاح!' : 'Reward redeemed successfully!'
        }
        
        setMessage(successMessage)
        
        // تحديث النقاط المتاحة فوراً
        if (rewardsData && result.newAvailablePoints !== undefined) {
          setRewardsData(prev => prev ? {
            ...prev,
            availablePoints: result.newAvailablePoints,
            usedPoints: prev.usedPoints + reward.pointsRequired
          } : null)
        }
        
        // إضافة سجل الاستبدال إلى التاريخ
        if (rewardsData) {
          const newHistoryEntry = {
            date: new Date().toISOString().split('T')[0],
            points: -reward.pointsRequired,
            description: `استبدال - ${reward.name}`,
            type: 'redeemed'
          }
          
          setRewardsData(prev => prev ? {
            ...prev,
            pointsHistory: [newHistoryEntry, ...prev.pointsHistory]
          } : null)
        }
      } else {
        const errorData = await response.json()
        setMessage(errorData.message || (language === 'ar' ? 'حدث خطأ في الاستبدال' : 'Error redeeming reward'))
      }
    } catch (error) {
      setMessage(language === 'ar' ? 'حدث خطأ في الاستبدال' : 'Error redeeming reward')
    }
  }


  // دالة لإرسال تنبيه انتهاء النقاط
  const handleSendExpiryNotification = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user_data') || '{}')
      const userEmail = userData.email || 'customer@sakura-cafe.com'

      setMessage(language === 'ar' ? 'جاري إرسال التنبيه...' : 'Sending notification...')

      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userEmail: userEmail,
          expiryDate: rewardsData?.pointsExpiryDate || '2025-02-15',
          points: rewardsData?.availablePoints || 850
        })
      })

      if (response.ok) {
        const result = await response.json()
        setMessage(language === 'ar' ? `تم إرسال التنبيه بنجاح إلى ${userEmail}!` : `Notification sent successfully to ${userEmail}!`)
        
        // إظهار تفاصيل الإرسال في الكونسول
        console.log('📧 تفاصيل الإيميل المرسل:', result)
        
        setTimeout(() => setMessage(''), 5000)
      } else {
        const errorData = await response.json()
        setMessage(errorData.message || (language === 'ar' ? 'فشل في إرسال التنبيه' : 'Failed to send notification'))
      }
    } catch (error) {
      console.error('خطأ في إرسال التنبيه:', error)
      setMessage(language === 'ar' ? 'حدث خطأ في إرسال التنبيه' : 'Error sending notification')
    }
  }

  // دالة لإرسال إيميل حقيقي
  const handleSendRealEmail = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user_data') || '{}')
      const userEmail = userData.email || 'customer@sakura-cafe.com'

      setMessage(language === 'ar' ? 'جاري إرسال الإيميل الحقيقي...' : 'Sending real email...')

      const response = await fetch('/api/send-real-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userEmail: userEmail,
          expiryDate: rewardsData?.pointsExpiryDate || '2025-02-15',
          points: rewardsData?.availablePoints || 850
        })
      })

      if (response.ok) {
        const result = await response.json()
        if (result.realEmail) {
          setMessage(language === 'ar' ? `تم إرسال الإيميل الحقيقي بنجاح إلى ${userEmail}!` : `Real email sent successfully to ${userEmail}!`)
        } else {
          setMessage(language === 'ar' ? `تم إرسال الإيميل (محاكاة) إلى ${userEmail}!` : `Email sent (simulated) to ${userEmail}!`)
        }
        
        // إظهار تفاصيل الإرسال في الكونسول
        console.log('📧 تفاصيل الإيميل المرسل:', result)
        
        setTimeout(() => setMessage(''), 5000)
      } else {
        const errorData = await response.json()
        setMessage(errorData.message || (language === 'ar' ? 'فشل في إرسال الإيميل' : 'Failed to send email'))
      }
    } catch (error) {
      console.error('خطأ في إرسال الإيميل:', error)
      setMessage(language === 'ar' ? 'حدث خطأ في إرسال الإيميل' : 'Error sending email')
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Bronze': return 'from-yellow-600 to-yellow-800'
      case 'Silver': return 'from-gray-400 to-gray-600'
      case 'Gold': return 'from-yellow-400 to-yellow-600'
      case 'Platinum': return 'from-purple-400 to-purple-600'
      default: return 'from-yellow-400 to-yellow-600'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sakura-50/20 via-white to-deep-50/20 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sakura-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300 font-arabic">
            {language === 'ar' ? 'جاري التحميل...' : 'Loading...'}
          </p>
        </div>
      </div>
    )
  }

  if (!rewardsData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sakura-50/20 via-white to-deep-50/20 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300 font-arabic">
            {language === 'ar' ? 'حدث خطأ في تحميل البيانات' : 'Error loading data'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sakura-50/20 via-white to-deep-50/20 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Back Button */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-sakura-50 hover:text-sakura-100 transition-colors font-arabic"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {language === 'ar' ? 'العودة إلى الصفحة الرئيسية' : 'Back to Home'}
          </Link>
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <StarIcon className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4 font-arabic">
            {language === 'ar' ? 'برنامج المكافآت' : 'Rewards Program'}
          </h1>
          
          <p className="text-gray-600 dark:text-gray-300 text-lg font-arabic">
            {language === 'ar' ? 'احصل على نقاط مع كل طلب واستبدلها بمكافآت رائعة' : 'Earn points with every order and redeem them for amazing rewards'}
          </p>
        </motion.div>

        {/* Points Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid md:grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <SparklesIcon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2 font-english">
              {rewardsData.availablePoints}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 font-arabic">
              {language === 'ar' ? 'النقاط المتاحة' : 'Available Points'}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrophyIcon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2 font-arabic">
              {rewardsData.level}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 font-arabic">
              {language === 'ar' ? 'المستوى الحالي' : 'Current Level'}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <GiftIcon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2 font-english">
              {rewardsData.totalPoints}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 font-arabic">
              {language === 'ar' ? 'إجمالي النقاط' : 'Total Points'}
            </p>
          </div>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white font-arabic">
              {language === 'ar' ? 'التقدم للمستوى التالي' : 'Progress to Next Level'}
            </h3>
            <span className="text-sm text-gray-600 dark:text-gray-300 font-arabic">
              {rewardsData.pointsToNextLevel} {language === 'ar' ? 'نقطة متبقية' : 'points remaining'}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div 
              className={`bg-gradient-to-r ${getLevelColor(rewardsData.level)} h-3 rounded-full transition-all duration-500`}
              style={{ width: `${((rewardsData.totalPoints - rewardsData.usedPoints) / rewardsData.nextLevelPoints) * 100}%` }}
            ></div>
          </div>
          
          {/* Points Expiry Date */}
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300 font-arabic">
                {language === 'ar' ? 'تاريخ انتهاء النقاط:' : 'Points Expiry Date:'}
              </span>
              <span className="text-sm font-semibold text-orange-600 dark:text-orange-400 font-arabic">
                {convertToHijri(new Date(rewardsData.pointsExpiryDate))} هـ
              </span>
            </div>
            <div className="space-y-2">
              <button
                onClick={handleSendExpiryNotification}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-lg font-arabic transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {language === 'ar' ? 'إرسال تنبيه (محاكاة)' : 'Send Notification (Simulated)'}
              </button>
              <button
                onClick={handleSendRealEmail}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-arabic transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {language === 'ar' ? 'إرسال إيميل حقيقي' : 'Send Real Email'}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex space-x-4 mb-8"
        >
          <button
            onClick={() => setSelectedTab('rewards')}
            className={`px-6 py-3 rounded-lg font-arabic transition-colors ${
              selectedTab === 'rewards'
                ? 'bg-sakura-500 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            {language === 'ar' ? 'المكافآت المتاحة' : 'Available Rewards'}
          </button>
          <button
            onClick={() => setSelectedTab('history')}
            className={`px-6 py-3 rounded-lg font-arabic transition-colors ${
              selectedTab === 'history'
                ? 'bg-sakura-500 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            {language === 'ar' ? 'سجل النقاط' : 'Points History'}
          </button>
        </motion.div>

        {/* Available Discounts Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8"
        >
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 font-arabic">
            {language === 'ar' ? 'الخصومات المستبدلة بالنقاط' : 'Redeemed Discounts'}
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {redeemedDiscounts.length > 0 ? redeemedDiscounts
              .filter(discount => discount.status === 'available')
              .map((discount, index) => (
                <div
                  key={discount.id}
                  className="p-4 border border-green-200 dark:border-green-700 rounded-lg bg-green-50 dark:bg-green-900/20"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-green-600 dark:text-green-400 font-arabic">
                      {discount.rewardName}
                    </span>
                    <span className="text-xs text-green-500 dark:text-green-400">
                      {discount.pointsUsed} {language === 'ar' ? 'نقطة' : 'points'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-300 font-arabic mb-2">
                    {discount.discountDetails.description}
                  </p>
                  <div className="text-xs text-orange-600 dark:text-orange-400 font-arabic">
                    {language === 'ar' ? 'متاح للاستخدام في سلة التسوق' : 'Available for use in cart'}
                  </div>
                  <div className="text-xs text-blue-600 dark:text-blue-400 font-arabic mt-1">
                    {language === 'ar' ? `تم الاستبدال: ${new Date(discount.redeemedAt).toLocaleDateString('ar-SA')}` : `Redeemed: ${new Date(discount.redeemedAt).toLocaleDateString('en-US')}`}
                  </div>
                </div>
              )) : (
                <div className="col-span-full text-center py-8">
                  <div className="text-gray-500 dark:text-gray-400 font-arabic">
                    {language === 'ar' ? 'لا توجد خصومات مستبدلة بالنقاط' : 'No redeemed discounts available'}
                  </div>
                  <div className="text-sm text-gray-400 dark:text-gray-500 mt-2 font-arabic">
                    {language === 'ar' ? 'استبدل نقاطك للحصول على خصومات' : 'Redeem your points to get discounts'}
                  </div>
                </div>
              )}
          </div>
        </motion.div>

        {/* Message */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-lg font-arabic"
          >
            {message}
          </motion.div>
        )}

        {/* Content */}
        {selectedTab === 'rewards' ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {rewardsData.availableRewards.map((reward, index) => (
              <div
                key={reward.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-sakura-400 to-sakura-600 rounded-full flex items-center justify-center">
                    <GiftIcon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-sakura-600 dark:text-sakura-400 font-arabic">
                    {reward.pointsRequired} {language === 'ar' ? 'نقطة' : 'points'}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2 font-arabic">
                  {reward.name}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 font-arabic">
                  {reward.description}
                </p>
                
                <button
                  onClick={() => handleRedeemReward(reward)}
                  disabled={rewardsData.availablePoints < reward.pointsRequired}
                  className={`w-full py-2 px-4 rounded-lg font-arabic transition-colors ${
                    rewardsData.availablePoints >= reward.pointsRequired
                      ? 'bg-sakura-500 hover:bg-sakura-600 text-white'
                      : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {language === 'ar' ? 'استبدال' : 'Redeem'}
                </button>
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          >
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-6 font-arabic">
              {language === 'ar' ? 'سجل النقاط' : 'Points History'}
            </h3>
            
            <div className="space-y-4">
              {rewardsData.pointsHistory.map((entry, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    {entry.type === 'earned' ? (
                      <CheckCircleIcon className="w-6 h-6 text-green-500" />
                    ) : (
                      <XCircleIcon className="w-6 h-6 text-red-500" />
                    )}
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-white font-arabic">
                        {entry.description}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300 font-arabic">
                        {entry.date}
                      </p>
                    </div>
                  </div>
                  <span className={`font-semibold ${
                    entry.points > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {entry.points > 0 ? '+' : ''}{entry.points}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default RewardsPage