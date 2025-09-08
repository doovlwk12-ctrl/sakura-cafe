'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  XMarkIcon, 
  PlusIcon, 
  MinusIcon, 
  ShoppingBagIcon,
  CreditCardIcon,
  BanknotesIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import { useCart } from '../hooks/useCart';
import { useOrders } from '../hooks/useOrders';
import { useAuth } from './AuthProvider';
import { useLanguage } from '../hooks/LanguageProvider';

interface ShoppingCartProps {
  isOpen: boolean;
  onClose: () => void;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({ isOpen, onClose }) => {
  const { items, totalItems, totalPrice, updateQuantity, removeFromCart, clearCart } = useCart();
  const { addOrder } = useOrders();
  const { user, isAuthenticated } = useAuth();
  const { t, isRTL } = useLanguage();

  console.log('ShoppingCart rendered, isOpen:', isOpen);
  
  // Debug: Log when component mounts/unmounts
  useEffect(() => {
    console.log('ShoppingCart mounted');
    return () => console.log('ShoppingCart unmounted');
  }, []);
  
  // Force re-render when isOpen changes
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.position = 'unset';
      document.body.style.width = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.position = 'unset';
      document.body.style.width = 'unset';
    };
  }, [isOpen]);

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutData, setCheckoutData] = useState({
    paymentMethod: 'cash' as 'cash' | 'card' | 'wallet',
    orderType: 'pickup' as 'pickup' | 'delivery',
    branchId: 'branch-001',
    branchName: 'فرع صديان',
    deliveryAddress: '',
    notes: '',
    usePoints: false
  });

  const [availableRewards, setAvailableRewards] = useState<any[]>([]);
  const [appliedRewards, setAppliedRewards] = useState<any[]>([]);

  // جلب المكافآت المتاحة عند فتح السلة
  useEffect(() => {
    const loadRewards = async () => {
      if (!isAuthenticated || !isOpen) return;
      
      try {
        const token = localStorage.getItem('user_token');
        const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
        
        if (token && userData.id) {
          const response = await fetch('/api/cart/items', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'user-id': userData.id
            }
          });

          if (response.ok) {
            const data = await response.json();
            setAvailableRewards(data.rewards?.available || []);
            setAppliedRewards(data.rewards?.applied || []);
            console.log('✅ تم جلب المكافآت:', data.rewards);
          }
        }
      } catch (error) {
        console.error('Error loading rewards:', error);
      }
    };

    loadRewards();
  }, [isAuthenticated, isOpen]);

  const branches = [
    { id: 'branch-001', name: 'فرع صديان', address: 'صديان، حائل' },
    { id: 'branch-002', name: 'فرع النقرة', address: 'النقرة، حائل' },
    { id: 'branch-003', name: 'فرع الجامعيين', address: 'الجامعيين، حائل' },
    { id: 'branch-004', name: 'فرع طريق المدينة', address: 'طريق المدينة، حائل' }
  ];

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      alert('يرجى تسجيل الدخول أولاً');
      return;
    }

    setIsCheckingOut(true);

    try {
      const orderItems = items.map(item => ({
        id: item.id,
        name: item.name,
        arabicName: item.arabicName,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        customizations: item.customizations
      }));

      const order = await addOrder({
        items: orderItems,
        totalAmount: totalPrice,
        paymentMethod: checkoutData.paymentMethod,
        branchId: checkoutData.branchId,
        branchName: checkoutData.branchName,
        orderType: checkoutData.orderType,
        deliveryAddress: checkoutData.deliveryAddress,
        notes: checkoutData.notes,
        loyaltyPointsUsed: checkoutData.usePoints ? Math.min(user?.loyaltyPoints || 0, Math.floor(totalPrice / 2)) : 0
      });

      clearCart();
      onClose();
      
      // Show success message with barcode
      alert(`تم إنشاء الطلب بنجاح!\nرقم الطلب: ${(order as any)?.orderNumber || 'N/A'}\nالباركود: ${(order as any)?.barcode || 'N/A'}\nالوقت المتوقع: ${(order as any)?.estimatedTime || 'N/A'} دقيقة`);
      
    } catch (error) {
      console.error('Error creating order:', error);
      alert('حدث خطأ في إنشاء الطلب. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsCheckingOut(false);
      setShowCheckout(false);
    }
  };

  const availablePoints = user?.loyaltyPoints || 0;
  const maxPointsUsable = Math.floor(totalPrice / 2); // يمكن استخدام نقاط تصل إلى 50% من قيمة الطلب
  const pointsToUse = checkoutData.usePoints ? Math.min(availablePoints, maxPointsUsable) : 0;
  const finalPrice = totalPrice - pointsToUse;

  // تطبيق مكافأة
  const applyReward = async (rewardId: string) => {
    try {
      const token = localStorage.getItem('user_token');
      const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
      
      if (!token || !userData.id) {
        alert('الرجاء تسجيل الدخول أولاً');
        return;
      }

      const response = await fetch('/api/cart/rewards', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'user-id': userData.id,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          rewardId,
          action: 'apply'
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ تم تطبيق المكافأة:', data);
        
        // تحديث المكافآت المتاحة والمطبقة
        setAvailableRewards(data.availableRewards || []);
        setAppliedRewards(data.cart.rewards || []);
        
        // تحديث نقاط المستخدم
        const updatedUserData = {
          ...userData,
          loyaltyPoints: data.userPoints || 0
        };
        localStorage.setItem('user_data', JSON.stringify(updatedUserData));
        
        alert('تم تطبيق المكافأة بنجاح!');
      } else {
        const errorData = await response.json();
        alert(`فشل في تطبيق المكافأة: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error applying reward:', error);
      alert('حدث خطأ في تطبيق المكافأة');
    }
  };

  // إزالة مكافأة
  const removeReward = async (rewardId: string) => {
    try {
      const token = localStorage.getItem('user_token');
      const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
      
      if (!token || !userData.id) {
        alert('الرجاء تسجيل الدخول أولاً');
        return;
      }

      const response = await fetch('/api/cart/rewards', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'user-id': userData.id,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          rewardId,
          action: 'remove'
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ تم إزالة المكافأة:', data);
        
        // تحديث المكافآت المتاحة والمطبقة
        setAvailableRewards(data.availableRewards || []);
        setAppliedRewards(data.cart.rewards || []);
        
        // تحديث نقاط المستخدم
        const updatedUserData = {
          ...userData,
          loyaltyPoints: data.userPoints || 0
        };
        localStorage.setItem('user_data', JSON.stringify(updatedUserData));
        
        alert('تم إزالة المكافأة بنجاح!');
      } else {
        const errorData = await response.json();
        alert(`فشل في إزالة المكافأة: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error removing reward:', error);
      alert('حدث خطأ في إزالة المكافأة');
    }
  };

  // Don't render if not open
  if (!isOpen) {
    return null;
  }

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div 
          className="fixed inset-0 overflow-hidden" 
          style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            zIndex: 99999,
            pointerEvents: 'auto',
            backgroundColor: 'transparent',
            isolation: 'isolate'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            style={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              right: 0, 
              bottom: 0,
              zIndex: 99998,
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              isolation: 'isolate'
            }}
            onClick={onClose}
          />

          {/* Cart Panel */}
          <motion.div
            initial={{ x: isRTL ? -400 : 400 }}
            animate={{ x: 0 }}
            exit={{ x: isRTL ? -400 : 400 }}
            className={`absolute top-0 ${isRTL ? 'left-0' : 'right-0'} h-full w-full max-w-lg bg-white dark:bg-gray-800 shadow-2xl border-l border-gray-200 dark:border-gray-600`}
            style={{ 
              position: 'absolute', 
              top: 0, 
              [isRTL ? 'left' : 'right']: 0, 
              height: '100%', 
              width: '100%', 
              maxWidth: '24rem',
              zIndex: 99999,
              backgroundColor: 'white',
              isolation: 'isolate'
            }}
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-600 bg-gradient-to-r from-sakura-50 to-deep-50">
                <h2 className="text-lg font-bold text-white font-arabic">
                  سلة التسوق ({totalItems})
                </h2>
                <button
                  onClick={onClose}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-4">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-8">
                    <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-full p-8 mb-6">
                      <ShoppingBagIcon className="w-20 h-20 text-gray-400 dark:text-gray-500" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-600 dark:text-gray-300 font-arabic mb-2">
                      سلة التسوق فارغة
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 font-arabic mb-4">
                      لم تقم بإضافة أي منتجات بعد
                    </p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 font-arabic">
                      تصفح قائمة الطعام وأضف منتجاتك المفضلة
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map((item, index) => (
                      <motion.div
                        key={`${item.id}-${index}`}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="flex items-center space-x-3 space-x-reverse bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-600"
                      >
                        <img
                          src={item.image}
                          alt={item.arabicName || item.name || 'منتج'}
                          className="w-16 h-16 rounded-xl object-cover shadow-md border-2 border-white dark:border-gray-500"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 dark:text-white font-arabic text-sm mb-1 truncate">
                            {item.arabicName || item.name || 'منتج'}
                          </h4>
                          <p className="text-sm font-bold text-sakura-50 mb-1">
                            {item.price} ر.س
                          </p>
                          {item.customizations?.size && (
                            <p className="text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded-full inline-block">
                              الحجم: {item.customizations.size === 'large' ? 'كبير' : item.customizations.size === 'medium' ? 'وسط' : 'صغير'}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col items-center space-y-2">
                          <div className="flex items-center space-x-2 space-x-reverse">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 flex items-center justify-center hover:bg-red-200 dark:hover:bg-red-800 transition-colors shadow-sm"
                            >
                              <MinusIcon className="w-4 h-4" />
                            </button>
                            <span className="w-12 text-center text-sm font-bold bg-white dark:bg-gray-800 rounded-lg py-1 px-2 shadow-sm border">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 flex items-center justify-center hover:bg-green-200 dark:hover:bg-green-800 transition-colors shadow-sm"
                            >
                              <PlusIcon className="w-4 h-4" />
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 flex items-center justify-center hover:bg-red-200 dark:hover:bg-red-800 transition-colors shadow-sm"
                            title="حذف من السلة"
                          >
                            <XMarkIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="border-t border-gray-200 dark:border-gray-600 p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-700">
                  {/* Total */}
                  <div className="flex justify-between items-center bg-gradient-to-r from-sakura-50 to-deep-50 text-white p-3 rounded-xl shadow-md">
                    <span className="text-lg font-bold font-arabic">
                      المجموع:
                    </span>
                    <span className="text-xl font-bold">
                      {totalPrice.toFixed(2)} ر.س
                    </span>
                  </div>

                  {/* Loyalty Points */}
                  {user && user.loyaltyPoints && user.loyaltyPoints > 0 && (
                    <div className="text-sm text-gray-600 dark:text-gray-400 font-arabic">
                      نقاط المكافآت المتاحة: {availablePoints} نقطة
                    </div>
                  )}

                  {/* Available Rewards */}
                  {availableRewards.length > 0 && (
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-3 rounded-lg border border-purple-200 dark:border-purple-800">
                      <h4 className="text-sm font-semibold text-purple-700 dark:text-purple-300 font-arabic mb-2">
                        🎁 المكافآت المتاحة ({availableRewards.length})
                      </h4>
                      <div className="space-y-2">
                        {availableRewards.slice(0, 3).map((reward) => (
                          <div key={reward.id} className="flex items-center justify-between bg-white dark:bg-gray-800 p-2 rounded-lg shadow-sm">
                            <div>
                              <p className="text-xs font-semibold text-gray-900 dark:text-white font-arabic">
                                {reward.arabic_name}
                              </p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                {reward.points_required} نقطة
                              </p>
                            </div>
                            <button
                              onClick={() => applyReward(reward.id)}
                              className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 px-2 py-1 rounded-full hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors"
                            >
                              تطبيق
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Applied Rewards */}
                  {appliedRewards.length > 0 && (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
                      <h4 className="text-sm font-semibold text-green-700 dark:text-green-300 font-arabic mb-2">
                        ✅ المكافآت المطبقة ({appliedRewards.length})
                      </h4>
                      <div className="space-y-2">
                        {appliedRewards.map((reward) => (
                          <div key={reward.id} className="flex items-center justify-between bg-white dark:bg-gray-800 p-2 rounded-lg shadow-sm">
                            <div>
                              <p className="text-xs font-semibold text-gray-900 dark:text-white font-arabic">
                                {reward.reward_name}
                              </p>
                              <p className="text-xs text-green-600 dark:text-green-400">
                                -{reward.discount_amount} ر.س
                              </p>
                            </div>
                            <button
                              onClick={() => removeReward(reward.reward_id)}
                              className="text-xs bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 px-2 py-1 rounded-full hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                            >
                              إزالة
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Checkout Button */}
                  {!showCheckout ? (
                    <button
                      onClick={() => setShowCheckout(true)}
                      disabled={!isAuthenticated}
                      className="w-full bg-gradient-to-r from-sakura-50 to-deep-50 text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed font-arabic shadow-lg"
                    >
                      {isAuthenticated ? '🛒 إتمام الطلب' : '🔐 يرجى تسجيل الدخول'}
                    </button>
                  ) : (
                    <div className="space-y-3">
                      {/* Branch Selection */}
                      <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 font-arabic flex items-center">
                          <MapPinIcon className="w-4 h-4 ml-2" />
                          اختر الفرع:
                        </label>
                        <select
                          value={checkoutData.branchId}
                          onChange={(e) => {
                            const branch = branches.find(b => b.id === e.target.value);
                            setCheckoutData(prev => ({
                              ...prev,
                              branchId: e.target.value,
                              branchName: branch?.name || ''
                            }));
                          }}
                          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm font-arabic focus:ring-2 focus:ring-sakura-50 focus:border-transparent"
                        >
                          {branches.map(branch => (
                            <option key={branch.id} value={branch.id}>
                              {branch.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Payment Method */}
                      <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 font-arabic">
                          طريقة الدفع:
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            onClick={() => setCheckoutData(prev => ({ ...prev, paymentMethod: 'cash' }))}
                            className={`p-3 rounded-lg border-2 text-sm font-arabic flex items-center justify-center transition-all ${
                              checkoutData.paymentMethod === 'cash'
                                ? 'bg-sakura-50 text-white border-sakura-50 shadow-md'
                                : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-sakura-50 hover:bg-sakura-50/10'
                            }`}
                          >
                            <BanknotesIcon className="w-5 h-5 ml-2" />
                            نقداً
                          </button>
                          <button
                            onClick={() => setCheckoutData(prev => ({ ...prev, paymentMethod: 'card' }))}
                            className={`p-3 rounded-lg border-2 text-sm font-arabic flex items-center justify-center transition-all ${
                              checkoutData.paymentMethod === 'card'
                                ? 'bg-sakura-50 text-white border-sakura-50 shadow-md'
                                : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-sakura-50 hover:bg-sakura-50/10'
                            }`}
                          >
                            <CreditCardIcon className="w-5 h-5 ml-2" />
                            بطاقة
                          </button>
                        </div>
                      </div>

                      {/* Use Points */}
                      {availablePoints > 0 && maxPointsUsable > 0 && (
                        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800">
                          <div className="flex items-center justify-between">
                            <div>
                              <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 font-arabic">
                                استخدم نقاط المكافآت
                              </label>
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                متاح: {availablePoints} نقطة (خصم {pointsToUse} ر.س)
                              </p>
                            </div>
                            <input
                              type="checkbox"
                              checked={checkoutData.usePoints}
                              onChange={(e) => setCheckoutData(prev => ({ ...prev, usePoints: e.target.checked }))}
                              className="w-5 h-5 rounded border-gray-300 text-sakura-50 focus:ring-sakura-50"
                            />
                          </div>
                        </div>
                      )}

                      {/* Final Price */}
                      {pointsToUse > 0 && (
                        <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
                          <div className="flex justify-between items-center">
                            <span className="font-arabic text-green-700 dark:text-green-300 font-semibold">المجموع بعد الخصم:</span>
                            <span className="font-bold text-green-600 dark:text-green-400 text-lg">{finalPrice.toFixed(2)} ر.س</span>
                          </div>
                          <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                            تم توفير {pointsToUse} ر.س من نقاط المكافآت
                          </p>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex space-x-3 space-x-reverse pt-2">
                        <button
                          onClick={() => setShowCheckout(false)}
                          className="flex-1 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-arabic font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          ← رجوع
                        </button>
                        <button
                          onClick={handleCheckout}
                          disabled={isCheckingOut}
                          className="flex-1 bg-gradient-to-r from-sakura-50 to-deep-50 text-white py-3 rounded-xl text-sm font-arabic font-bold disabled:opacity-50 hover:shadow-lg transition-all"
                        >
                          {isCheckingOut ? '⏳ جاري الإرسال...' : '✅ تأكيد الطلب'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ShoppingCart;
