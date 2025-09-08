'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { productImages } from '../../data/productImages';
import { useLanguage } from '../../hooks/LanguageProvider';
import { useTheme } from '../../hooks/useTheme';
import LanguageSwitcher from '../LanguageSwitcher';
import ThemeToggle from '../ThemeToggle';
import RealTimeNotifications from '../RealTimeNotifications';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
}

interface POSSystemProps {
  cashierName?: string;
  branchId?: string;
}

const POSSystem: React.FC<POSSystemProps> = ({ cashierName = 'كاشير', branchId = 'branch-001' }) => {
  const { t, isRTL } = useLanguage();
  const { isDark } = useTheme();
  const router = useRouter();
  const [currentOrder, setCurrentOrder] = useState<OrderItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  const handleLogout = () => {
    localStorage.removeItem('cashierSession');
    router.push('/cashier-login');
  };

  const categories = [
    { id: 'all', label: t('pos.all'), icon: '🍽️' },
    { id: 'drinks', label: t('pos.drinks'), icon: '☕' },
    { id: 'sweets', label: t('pos.sweets'), icon: '🍰' },
    { id: 'sandwiches', label: t('pos.sandwiches'), icon: '🥪' },
    { id: 'groups', label: t('pos.groups'), icon: '📦' }
  ];

  const filteredProducts = productImages.filter(product => {
    const matchesSearch = product.englishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.arabicName.includes(searchTerm);
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToOrder = (product: any) => {
    const existingItem = currentOrder.find(item => item.id === product.id);
    
    if (existingItem) {
      setCurrentOrder(prev => prev.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.price }
          : item
      ));
    } else {
      setCurrentOrder(prev => [...prev, {
        id: product.id,
        name: product.arabicName,
        price: product.price,
        quantity: 1,
        total: product.price
      }]);
    }
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      setCurrentOrder(prev => prev.filter(item => item.id !== itemId));
    } else {
      setCurrentOrder(prev => prev.map(item =>
        item.id === itemId
          ? { ...item, quantity: newQuantity, total: newQuantity * item.price }
          : item
      ));
    }
  };

  const calculateTotal = () => {
    return currentOrder.reduce((sum, item) => sum + item.total, 0);
  };

  const clearOrder = () => {
    setCurrentOrder([]);
    setCustomerName('');
    setCustomerPhone('');
  };

  const processPayment = () => {
    if (currentOrder.length === 0) return;
    
    // هنا يمكن إضافة منطق معالجة الدفع
    const message = isRTL ? 'تم معالجة الدفع بنجاح!' : 'Payment processed successfully!';
    alert(message);
    clearOrder();
  };

  return (
    <div className="min-h-screen bg-[#fefefe] dark:bg-[#111827] transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-[#1f2937] border-b border-gray-200 dark:border-[#374151] p-4 transition-colors duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-md overflow-hidden">
              <img 
                src="/images/logo.png" 
                alt="Sakura Cafe Logo" 
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.currentTarget.src = '/images/fallback.svg';
                  e.currentTarget.alt = 'Sakura Cafe Logo';
                }}
                loading="eager"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#1f2937] dark:text-[#f9fafb] font-arabic">{t('pos.title')}</h1>
              <p className="text-[#6b7280] dark:text-[#9ca3af] text-sm font-arabic">{t('pos.subtitle')}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <RealTimeNotifications userRole="cashier" />
            <LanguageSwitcher showText={false} />
            <ThemeToggle showText={false} />
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-arabic"
            >
              تسجيل الخروج
            </button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Panel - Products */}
        <div className="flex-1 p-4 overflow-hidden">
          {/* Search and Filters */}
          <div className="mb-6 space-y-4">
            <input
              type="text"
              placeholder={t('pos.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full max-w-md px-4 py-3 border border-gray-300 dark:border-[#374151] rounded-lg bg-white dark:bg-[#1f2937] text-[#1f2937] dark:text-[#f9fafb] focus:ring-2 focus:ring-[#e57373] focus:border-transparent transition-all duration-300 font-arabic"
            />
            
            <div className="flex gap-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    selectedCategory === category.id
                      ? 'bg-[#e57373] text-white'
                      : 'bg-white dark:bg-[#1f2937] text-[#6b7280] dark:text-[#9ca3af] hover:bg-[#fce7e7] dark:hover:bg-[#374151] hover:text-[#1f2937] dark:hover:text-[#f9fafb] border border-gray-200 dark:border-[#374151]'
                  }`}
                >
                  <span>{category.icon}</span>
                  <span className="font-arabic">{category.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-auto h-[calc(100vh-200px)]">
            {filteredProducts.map(product => (
              <div
                key={product.id}
                className="bg-white dark:bg-[#1f2937] border border-gray-200 dark:border-[#374151] rounded-xl p-4 cursor-pointer hover:scale-105 hover:shadow-lg transition-all duration-300"
                onClick={() => addToOrder(product)}
              >
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-3 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                    <img
                      src={product.imagePath}
                      alt={isRTL ? product.arabicName : product.englishName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/images/fallback.svg';
                      }}
                    />
                  </div>
                  <h3 className="font-bold mb-1 text-sm text-[#1f2937] dark:text-[#f9fafb] font-arabic">
                    {isRTL ? product.arabicName : product.englishName}
                  </h3>
                  <p className="text-xs mb-2 text-[#6b7280] dark:text-[#9ca3af]">
                    {isRTL ? product.englishName : product.arabicName}
                  </p>
                  <div className="text-lg font-bold text-[#e57373]">
                    {product.price} {t('pos.currency')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel - Current Order */}
        <div className="w-96 bg-white dark:bg-[#1f2937] p-4 border-l border-gray-200 dark:border-[#374151]">
          <h2 className="text-2xl font-bold text-[#1f2937] dark:text-[#f9fafb] mb-6 font-arabic">{t('pos.currentOrder')}</h2>
          
          {/* Customer Info */}
          <div className="bg-white dark:bg-[#1f2937] border border-gray-200 dark:border-[#374151] rounded-xl p-4 mb-4">
            <h3 className="font-bold mb-3 text-[#1f2937] dark:text-[#f9fafb] font-arabic">{t('pos.customerInfo')}</h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder={t('pos.customerName')}
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-[#374151] rounded-lg bg-white dark:bg-[#1f2937] text-[#1f2937] dark:text-[#f9fafb] focus:ring-2 focus:ring-[#e57373] focus:border-transparent transition-all duration-300 font-arabic"
              />
              <input
                type="tel"
                placeholder={t('pos.customerPhone')}
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-[#374151] rounded-lg bg-white dark:bg-[#1f2937] text-[#1f2937] dark:text-[#f9fafb] focus:ring-2 focus:ring-[#e57373] focus:border-transparent transition-all duration-300 font-arabic"
              />
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white dark:bg-[#1f2937] border border-gray-200 dark:border-[#374151] rounded-xl p-4 mb-4">
            <h3 className="font-bold mb-3 text-[#1f2937] dark:text-[#f9fafb] font-arabic">{t('pos.items')}</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {currentOrder.map(item => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#374151] rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-sm text-[#1f2937] dark:text-[#f9fafb] font-arabic">
                      {item.name}
                    </p>
                    <p className="text-xs text-[#6b7280] dark:text-[#9ca3af]">
                      {item.price} {t('pos.currency')} × {item.quantity}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-6 h-6 bg-[#e57373] text-white rounded-full flex items-center justify-center text-sm hover:bg-[#d65a5a] transition-colors"
                    >
                      -
                    </button>
                    <span className="text-sm font-medium text-[#1f2937] dark:text-[#f9fafb]">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-6 h-6 bg-[#e57373] text-white rounded-full flex items-center justify-center text-sm hover:bg-[#d65a5a] transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
              
              {currentOrder.length === 0 && (
                <p className="text-center text-[#6b7280] dark:text-[#9ca3af] py-4 font-arabic">
                  {t('pos.noItems')}
                </p>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white dark:bg-[#1f2937] border border-gray-200 dark:border-[#374151] rounded-xl p-4 mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[#1f2937] dark:text-[#f9fafb] font-arabic">{t('pos.subtotal')}:</span>
              <span className="text-xl font-bold text-[#e57373]">
                {calculateTotal()} {t('pos.currency')}
              </span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[#1f2937] dark:text-[#f9fafb] font-arabic">{t('pos.taxAmount')}:</span>
              <span className="text-[#e57373]">
                {(calculateTotal() * 0.15).toFixed(2)} {t('pos.currency')}
              </span>
            </div>
            <div className="border-t border-gray-200 dark:border-[#374151] pt-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-[#1f2937] dark:text-[#f9fafb] font-arabic">{t('pos.grandTotal')}:</span>
                <span className="text-2xl font-bold text-[#e57373]">
                  {(calculateTotal() * 1.15).toFixed(2)} {t('pos.currency')}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={processPayment}
              disabled={currentOrder.length === 0}
              className="w-full px-6 py-3 bg-[#e57373] text-white rounded-lg font-medium hover:bg-[#d65a5a] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-arabic"
            >
              {t('pos.processPayment')}
            </button>
            
            <button
              onClick={clearOrder}
              disabled={currentOrder.length === 0}
              className="w-full px-6 py-3 bg-gray-200 dark:bg-[#374151] text-[#1f2937] dark:text-[#f9fafb] rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-[#4b5563] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-arabic"
            >
              {t('pos.clearOrder')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default POSSystem;

