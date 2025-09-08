// Loyalty Points System
export interface LoyaltyPoint {
  id: string;
  userId: string;
  points: number;
  type: 'earned' | 'used' | 'expired';
  source: 'purchase' | 'bonus' | 'redemption' | 'expiry';
  description: string;
  orderId?: string;
  createdAt: Date;
  expiresAt?: Date;
}

export interface LoyaltyReward {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  pointsRequired: number;
  discountType: 'percentage' | 'fixed' | 'free_item';
  discountValue: number;
  isActive: boolean;
  validUntil?: Date;
  applicableProducts?: string[];
}

export interface UserLoyaltyProfile {
  userId: string;
  totalPoints: number;
  availablePoints: number;
  usedPoints: number;
  expiredPoints: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  joinDate: Date;
  lastActivity: Date;
  totalSpent: number;
  totalOrders: number;
}

// Default loyalty rewards
export const defaultRewards: LoyaltyReward[] = [
  {
    id: 'reward-001',
    name: '10% Discount',
    nameAr: 'خصم 10%',
    description: 'Get 10% off your next order',
    descriptionAr: 'احصل على خصم 10% على طلبك القادم',
    pointsRequired: 100,
    discountType: 'percentage',
    discountValue: 10,
    isActive: true
  },
  {
    id: 'reward-002',
    name: 'Free Coffee',
    nameAr: 'قهوة مجانية',
    description: 'Get a free medium coffee',
    descriptionAr: 'احصل على قهوة متوسطة مجانية',
    pointsRequired: 200,
    discountType: 'free_item',
    discountValue: 0,
    isActive: true,
    applicableProducts: ['coffee-medium']
  },
  {
    id: 'reward-003',
    name: '20 SAR Off',
    nameAr: 'خصم 20 ريال',
    description: 'Get 20 SAR off your order',
    descriptionAr: 'احصل على خصم 20 ريال من طلبك',
    pointsRequired: 500,
    discountType: 'fixed',
    discountValue: 20,
    isActive: true
  },
  {
    id: 'reward-004',
    name: 'Free Dessert',
    nameAr: 'حلوى مجانية',
    description: 'Get a free dessert with your order',
    descriptionAr: 'احصل على حلوى مجانية مع طلبك',
    pointsRequired: 300,
    discountType: 'free_item',
    discountValue: 0,
    isActive: true,
    applicableProducts: ['dessert-any']
  }
];

// Calculate points earned from purchase
export function calculatePointsEarned(amount: number, tier: string = 'bronze'): number {
  const baseRate = 1; // 1 point per 1 SAR
  const tierMultipliers = {
    bronze: 1,
    silver: 1.2,
    gold: 1.5,
    platinum: 2
  };
  
  const multiplier = tierMultipliers[tier as keyof typeof tierMultipliers] || 1;
  return Math.floor(amount * baseRate * multiplier);
}

// Calculate user tier based on total spent
export function calculateUserTier(totalSpent: number): string {
  if (totalSpent >= 5000) return 'platinum';
  if (totalSpent >= 2000) return 'gold';
  if (totalSpent >= 500) return 'silver';
  return 'bronze';
}

// Get tier benefits
export function getTierBenefits(tier: string) {
  const benefits = {
    bronze: {
      name: 'Bronze',
      nameAr: 'برونزي',
      pointsMultiplier: 1,
      freeDelivery: false,
      prioritySupport: false,
      exclusiveOffers: false
    },
    silver: {
      name: 'Silver',
      nameAr: 'فضي',
      pointsMultiplier: 1.2,
      freeDelivery: false,
      prioritySupport: true,
      exclusiveOffers: false
    },
    gold: {
      name: 'Gold',
      nameAr: 'ذهبي',
      pointsMultiplier: 1.5,
      freeDelivery: true,
      prioritySupport: true,
      exclusiveOffers: true
    },
    platinum: {
      name: 'Platinum',
      nameAr: 'بلاتيني',
      pointsMultiplier: 2,
      freeDelivery: true,
      prioritySupport: true,
      exclusiveOffers: true
    }
  };
  
  return benefits[tier as keyof typeof benefits] || benefits.bronze;
}

// Check if user can redeem reward
export function canRedeemReward(userPoints: number, reward: LoyaltyReward): boolean {
  return userPoints >= reward.pointsRequired && reward.isActive;
}

// Get available rewards for user
export function getAvailableRewards(userPoints: number): LoyaltyReward[] {
  return defaultRewards.filter(reward => canRedeemReward(userPoints, reward));
}

// Calculate points value in SAR
export function calculatePointsValue(points: number): number {
  return points * 0.1; // 1 point = 0.1 SAR
}

// Get points expiry date (6 months from earning)
export function getPointsExpiryDate(earnedDate: Date): Date {
  const expiryDate = new Date(earnedDate);
  expiryDate.setMonth(expiryDate.getMonth() + 6);
  return expiryDate;
}

// Check if points are expired
export function arePointsExpired(expiryDate: Date): boolean {
  return new Date() > expiryDate;
}

// Format points for display
export function formatPoints(points: number): string {
  return points.toLocaleString();
}

// Get tier color
export function getTierColor(tier: string): string {
  const colors = {
    bronze: 'text-amber-600',
    silver: 'text-gray-500',
    gold: 'text-yellow-500',
    platinum: 'text-purple-600'
  };
  
  return colors[tier as keyof typeof colors] || colors.bronze;
}

// Get tier background color
export function getTierBgColor(tier: string): string {
  const colors = {
    bronze: 'bg-amber-100 dark:bg-amber-900/20',
    silver: 'bg-gray-100 dark:bg-gray-900/20',
    gold: 'bg-yellow-100 dark:bg-yellow-900/20',
    platinum: 'bg-purple-100 dark:bg-purple-900/20'
  };
  
  return colors[tier as keyof typeof colors] || colors.bronze;
}

// Calculate next tier progress
export function getNextTierProgress(totalSpent: number): {
  currentTier: string;
  nextTier: string;
  progress: number;
  pointsToNext: number;
} {
  const tiers = [
    { name: 'bronze', threshold: 0 },
    { name: 'silver', threshold: 500 },
    { name: 'gold', threshold: 2000 },
    { name: 'platinum', threshold: 5000 }
  ];
  
  let currentTier = 'bronze';
  let nextTier = 'silver';
  let progress = 0;
  let pointsToNext = 500;
  
  for (let i = 0; i < tiers.length - 1; i++) {
    if (totalSpent >= tiers[i].threshold && totalSpent < tiers[i + 1].threshold) {
      currentTier = tiers[i].name;
      nextTier = tiers[i + 1].name;
      progress = ((totalSpent - tiers[i].threshold) / (tiers[i + 1].threshold - tiers[i].threshold)) * 100;
      pointsToNext = tiers[i + 1].threshold - totalSpent;
      break;
    }
  }
  
  if (totalSpent >= 5000) {
    currentTier = 'platinum';
    nextTier = 'platinum';
    progress = 100;
    pointsToNext = 0;
  }
  
  return { currentTier, nextTier, progress, pointsToNext };
}

// Generate loyalty point transaction
export function generateLoyaltyTransaction(
  userId: string,
  points: number,
  type: 'earned' | 'used' | 'expired',
  source: 'purchase' | 'bonus' | 'redemption' | 'expiry',
  description: string,
  orderId?: string
): LoyaltyPoint {
  return {
    id: `loyalty-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    userId,
    points,
    type,
    source,
    description,
    orderId,
    createdAt: new Date(),
    expiresAt: type === 'earned' ? getPointsExpiryDate(new Date()) : undefined
  };
}
