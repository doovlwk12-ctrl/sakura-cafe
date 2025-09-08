'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GiftIcon, 
  StarIcon, 
  TrophyIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { useLanguage } from '../hooks/LanguageProvider';
import { 
  defaultRewards,
  getAvailableRewards,
  calculatePointsValue,
  formatPoints,
  getTierBenefits,
  getTierColor,
  getTierBgColor,
  getNextTierProgress,
  type UserLoyaltyProfile,
  type LoyaltyReward
} from '../utils/loyalty';

interface LoyaltyPointsProps {
  userProfile?: UserLoyaltyProfile;
  onRedeemReward?: (rewardId: string) => void;
  className?: string;
}

const LoyaltyPoints: React.FC<LoyaltyPointsProps> = ({
  userProfile,
  onRedeemReward,
  className = ''
}) => {
  const { t, isRTL } = useLanguage();
  const [availableRewards, setAvailableRewards] = useState<LoyaltyReward[]>([]);
  const [selectedReward, setSelectedReward] = useState<LoyaltyReward | null>(null);
  const [showRewards, setShowRewards] = useState(false);

  // Mock user profile if not provided
  const profile: UserLoyaltyProfile = userProfile || {
    userId: 'user-001',
    totalPoints: 1250,
    availablePoints: 850,
    usedPoints: 400,
    expiredPoints: 0,
    tier: 'silver',
    joinDate: new Date('2024-01-01'),
    lastActivity: new Date(),
    totalSpent: 1250,
    totalOrders: 25
  };

  useEffect(() => {
    const rewards = getAvailableRewards(profile.availablePoints);
    setAvailableRewards(rewards);
  }, [profile.availablePoints]);

  const tierBenefits = getTierBenefits(profile.tier);
  const nextTierProgress = getNextTierProgress(profile.totalSpent);
  const pointsValue = calculatePointsValue(profile.availablePoints);

  const handleRedeemReward = (reward: LoyaltyReward) => {
    setSelectedReward(reward);
    if (onRedeemReward) {
      onRedeemReward(reward.id);
    }
  };

  const getRewardIcon = (reward: LoyaltyReward) => {
    switch (reward.discountType) {
      case 'percentage':
        return <GiftIcon className="w-6 h-6" />;
      case 'fixed':
        return <StarIcon className="w-6 h-6" />;
      case 'free_item':
        return <SparklesIcon className="w-6 h-6" />;
      default:
        return <GiftIcon className="w-6 h-6" />;
    }
  };

  const getRewardDescription = (reward: LoyaltyReward) => {
    return isRTL ? reward.descriptionAr : reward.description;
  };

  const getRewardName = (reward: LoyaltyReward) => {
    return isRTL ? reward.nameAr : reward.name;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-arabic mb-2">
          {t('loyalty.points')}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 font-arabic">
          استمتع بمكافآت حصرية مع كل طلب
        </p>
      </div>

      {/* Points Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-sakura-50 to-deep-50 rounded-2xl p-6 text-white"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">
              {formatPoints(profile.availablePoints)}
            </div>
            <div className="text-sm opacity-90 font-arabic">
              {t('loyalty.balance')}
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">
              {formatPoints(profile.totalPoints)}
            </div>
            <div className="text-sm opacity-90 font-arabic">
              {t('loyalty.earned')}
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-2">
              {formatPoints(profile.usedPoints)}
            </div>
            <div className="text-sm opacity-90 font-arabic">
              {t('loyalty.used')}
            </div>
          </div>
        </div>

        <div className="mt-4 text-center">
          <div className="text-sm opacity-90 font-arabic">
            قيمة النقاط: {pointsValue.toFixed(2)} ريال
          </div>
        </div>
      </motion.div>

      {/* Tier Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`${getTierBgColor(profile.tier)} rounded-xl p-4`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <TrophyIcon className={`w-8 h-8 ${getTierColor(profile.tier)}`} />
            <div>
              <h3 className={`font-bold text-lg ${getTierColor(profile.tier)} font-arabic`}>
                {isRTL ? tierBenefits.nameAr : tierBenefits.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-arabic">
                {tierBenefits.pointsMultiplier}x نقاط لكل ريال
              </p>
            </div>
          </div>
        </div>

        {/* Tier Progress */}
        {nextTierProgress.nextTier !== profile.tier && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-arabic">
              <span className="text-gray-600 dark:text-gray-400">
                التقدم للفئة التالية
              </span>
              <span className="text-gray-600 dark:text-gray-400">
                {nextTierProgress.progress.toFixed(0)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-sakura-50 h-2 rounded-full transition-all duration-500"
                style={{ width: `${nextTierProgress.progress}%` }}
              />
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 font-arabic">
              {nextTierProgress.pointsToNext} ريال للوصول للفئة التالية
            </p>
          </div>
        )}
      </motion.div>

      {/* Available Rewards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white font-arabic">
            {t('loyalty.rewards')} {t('loyalty.available')}
          </h3>
          <button
            onClick={() => setShowRewards(!showRewards)}
            className="text-sakura-50 hover:text-sakura-100 transition-colors font-arabic"
          >
            {showRewards ? 'إخفاء' : 'عرض الكل'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence>
            {(showRewards ? availableRewards : availableRewards.slice(0, 2)).map((reward, index) => (
              <motion.div
                key={reward.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-sakura-50/10 rounded-lg flex items-center justify-center text-sakura-50">
                      {getRewardIcon(reward)}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white font-arabic">
                        {getRewardName(reward)}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 font-arabic">
                        {getRewardDescription(reward)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <StarIcon className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm font-bold text-gray-900 dark:text-white">
                      {reward.pointsRequired} نقطة
                    </span>
                  </div>
                  <button
                    onClick={() => handleRedeemReward(reward)}
                    className="px-4 py-2 bg-sakura-50 text-white rounded-lg hover:bg-sakura-100 transition-colors text-sm font-arabic"
                  >
                    استبدال
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {availableRewards.length === 0 && (
          <div className="text-center py-8">
            <GiftIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400 font-arabic">
              لا توجد مكافآت متاحة حالياً
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 font-arabic mt-2">
              استمر في التسوق لتراكم المزيد من النقاط
            </p>
          </div>
        )}
      </motion.div>

      {/* Tier Benefits */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4"
      >
        <h3 className="font-bold text-gray-900 dark:text-white font-arabic mb-4">
          مميزات فئتك الحالية
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
              <CheckCircleIcon className="w-5 h-5 text-green-600" />
            </div>
            <span className="text-sm text-gray-700 dark:text-gray-300 font-arabic">
              {tierBenefits.pointsMultiplier}x نقاط لكل ريال
            </span>
          </div>
          {tierBenefits.prioritySupport && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                <CheckCircleIcon className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-sm text-gray-700 dark:text-gray-300 font-arabic">
                دعم أولوية
              </span>
            </div>
          )}
          {tierBenefits.freeDelivery && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                <CheckCircleIcon className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-sm text-gray-700 dark:text-gray-300 font-arabic">
                توصيل مجاني
              </span>
            </div>
          )}
          {tierBenefits.exclusiveOffers && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center">
                <CheckCircleIcon className="w-5 h-5 text-yellow-600" />
              </div>
              <span className="text-sm text-gray-700 dark:text-gray-300 font-arabic">
                عروض حصرية
              </span>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default LoyaltyPoints;
