'use client';

import React, { useState } from 'react';
import { productImages } from '../../data/productImages';
import { useLanguage } from '../../hooks/LanguageProvider';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
}

const POSSystem: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const [currentOrder, setCurrentOrder] = useState<OrderItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  const categories = [
    { id: 'all', label: t('all'), icon: '🍽️' },
    { id: 'drinks', label: t('drinks'), icon: '☕' },
    { id: 'sweets', label: t('sweets'), icon: '🍰' },
    { id: 'sandwiches', label: t('sandwiches'), icon: '🥪' },
    { id: 'groups', label: t('groups'), icon: '📦' }
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
    alert('تم معالجة الدفع بنجاح!');
    clearOrder();
  };

  return (
    <div className="min-h-screen new-system bg-background-light dark:bg-background-dark">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-6 h-6 rounded-md overflow-hidden">
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
              <h1 className="text-2xl font-bold text-deep-50">نقطة البيع</h1>
              <p className="text-deep-50 text-sm">نظام إدارة المبيعات</p>
            </div>
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
              placeholder="البحث في المنتجات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input w-full max-w-md"
            />
            
            <div className="flex gap-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    selectedCategory === category.id
                      ? 'bg-[#C36C72] text-white'
                      : 'bg-[#2A4842] text-gray-300 hover:bg-[#254740]'
                  }`}
                >
                  <span>{category.icon}</span>
                  <span>{category.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-auto h-[calc(100vh-200px)]">
            {filteredProducts.map(product => (
              <div
                key={product.id}
                className="card cursor-pointer hover:scale-105 transition-transform duration-200"
                onClick={() => addToOrder(product)}
              >
                <div className="text-center p-4">
                  <div className="w-20 h-20 mx-auto mb-3 rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={product.imagePath}
                      alt={product.arabicName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/images/fallback.svg';
                      }}
                    />
                  </div>
                  <h3 className="font-bold mb-1 text-sm" style={{ color: 'var(--text-primary)' }}>
                    {product.arabicName}
                  </h3>
                  <p className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>
                    {product.englishName}
                  </p>
                  <div className="text-lg font-bold text-[#C36C72]">
                    {product.price} ريال
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel - Current Order */}
        <div className="w-96 bg-[#2A4842] p-4 border-l border-[#C36C72]">
          <h2 className="text-2xl font-bold text-white mb-6">الطلب الحالي</h2>
          
          {/* Customer Info */}
          <div className="card mb-4">
            <h3 className="font-bold mb-3" style={{ color: 'var(--text-primary)' }}>معلومات العميل</h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="اسم العميل"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="input w-full"
              />
              <input
                type="tel"
                placeholder="رقم الهاتف"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="input w-full"
              />
            </div>
          </div>

          {/* Order Items */}
          <div className="card mb-4">
            <h3 className="font-bold mb-3" style={{ color: 'var(--text-primary)' }}>العناصر</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {currentOrder.map(item => (
                <div key={item.id} className="flex items-center justify-between p-2 bg-[#1D453E] rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>
                      {item.name}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {item.price} ريال × {item.quantity}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-6 h-6 bg-[#C36C72] text-white rounded-full flex items-center justify-center text-sm"
                    >
                      -
                    </button>
                    <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-6 h-6 bg-[#C36C72] text-white rounded-full flex items-center justify-center text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
              
              {currentOrder.length === 0 && (
                <p className="text-center text-gray-500 py-4">
                  لا توجد عناصر في الطلب
                </p>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="card mb-4">
            <div className="flex justify-between items-center mb-2">
              <span style={{ color: 'var(--text-primary)' }}>المجموع:</span>
              <span className="text-xl font-bold text-[#C36C72]">
                {calculateTotal()} ريال
              </span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span style={{ color: 'var(--text-primary)' }}>الضريبة (15%):</span>
              <span className="text-[#C36C72]">
                {(calculateTotal() * 0.15).toFixed(2)} ريال
              </span>
            </div>
            <div className="border-t border-[#C36C72] pt-2">
              <div className="flex justify-between items-center">
                <span className="font-bold" style={{ color: 'var(--text-primary)' }}>المجموع النهائي:</span>
                <span className="text-2xl font-bold text-[#C36C72]">
                  {(calculateTotal() * 1.15).toFixed(2)} ريال
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={processPayment}
              disabled={currentOrder.length === 0}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              معالجة الدفع
            </button>
            
            <button
              onClick={clearOrder}
              disabled={currentOrder.length === 0}
              className="btn-secondary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              مسح الطلب
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default POSSystem;

