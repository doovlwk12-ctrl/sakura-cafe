'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../../hooks/LanguageProvider';
import Link from 'next/link';
import { ShoppingBagIcon, ClockIcon, CheckCircleIcon, XCircleIcon, EyeIcon, TruckIcon } from '@heroicons/react/24/outline';

export default function OrdersPage() {
  const { language } = useLanguage();
  const [selectedStatus, setSelectedStatus] = useState('all');

  // حالة الطلبات
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // جلب الطلبات الحقيقية
  React.useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        // محاولة جلب الطلبات من API
        const response = await fetch('/api/orders', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('user_token')}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setOrders(data.orders || []);
        } else {
          // استخدام بيانات افتراضية
          const defaultOrders = [
            {
              id: 'ORD-001',
              date: '2025-01-15',
              time: '14:30',
              status: 'completed',
              total: 45.50,
              pointsEarned: 45,
              items: [
                { name: 'قهوة لاتيه', quantity: 2, price: 15.00, image: '☕' },
                { name: 'كرواسون', quantity: 1, price: 8.50, image: '🥐' },
                { name: 'عصير برتقال', quantity: 1, price: 7.00, image: '🍊' }
              ],
              deliveryAddress: 'حائل، حي النخيل، شارع الملك فهد',
              paymentMethod: 'نقدي'
            },
            {
              id: 'ORD-002',
              date: '2025-01-14',
              time: '10:15',
              status: 'preparing',
              total: 52.00,
              pointsEarned: 52,
              items: [
                { name: 'كابتشينو', quantity: 1, price: 12.00, image: '☕' },
                { name: 'مافن الشوكولاتة', quantity: 2, price: 20.00, image: '🧁' }
              ],
              deliveryAddress: 'حائل، حي الصفا، شارع الأمير محمد',
              paymentMethod: 'بطاقة ائتمان'
            }
          ];
          setOrders(defaultOrders);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        // في حالة الخطأ، استخدم بيانات افتراضية
        const defaultOrders = [
          {
            id: 'ORD-001',
            date: '2025-01-15',
            time: '14:30',
            status: 'completed',
            total: 45.50,
            pointsEarned: 45,
            items: [
              { name: 'قهوة لاتيه', quantity: 2, price: 15.00, image: '☕' },
              { name: 'كرواسون', quantity: 1, price: 8.50, image: '🥐' },
              { name: 'عصير برتقال', quantity: 1, price: 7.00, image: '🍊' }
            ],
            deliveryAddress: 'حائل، حي النخيل، شارع الملك فهد',
            paymentMethod: 'نقدي'
          }
        ];
        setOrders(defaultOrders);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // دالة لإضافة طلب جديد
  const addOrder = (newOrder: any) => {
    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    localStorage.setItem('user_orders', JSON.stringify(updatedOrders));
  };

  // دالة لتحديث حالة الطلب
  const updateOrderStatus = (orderId: string, newStatus: string) => {
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
    localStorage.setItem('user_orders', JSON.stringify(updatedOrders));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'preparing':
        return <ClockIcon className="w-5 h-5 text-yellow-500" />;
      case 'pending':
        return <ClockIcon className="w-5 h-5 text-blue-500" />;
      case 'cancelled':
        return <XCircleIcon className="w-5 h-5 text-red-500" />;
      case 'delivered':
        return <TruckIcon className="w-5 h-5 text-green-600" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return language === 'ar' ? 'مكتمل' : 'Completed';
      case 'preparing':
        return language === 'ar' ? 'قيد التحضير' : 'Preparing';
      case 'pending':
        return language === 'ar' ? 'في الانتظار' : 'Pending';
      case 'cancelled':
        return language === 'ar' ? 'ملغي' : 'Cancelled';
      case 'delivered':
        return language === 'ar' ? 'تم التسليم' : 'Delivered';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'preparing':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'pending':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const filteredOrders = selectedStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === selectedStatus);

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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-24 h-24 bg-gradient-to-r from-sakura-50 to-sakura-100 rounded-full flex items-center justify-center mb-4">
              <ShoppingBagIcon className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-arabic mb-2">
              {language === 'ar' ? 'طلباتي' : 'My Orders'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 font-arabic">
              {language === 'ar' ? 'تتبع جميع طلباتك السابقة والحالية' : 'Track all your previous and current orders'}
            </p>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {[
              { key: 'all', label: language === 'ar' ? 'جميع الطلبات' : 'All Orders' },
              { key: 'pending', label: language === 'ar' ? 'في الانتظار' : 'Pending' },
              { key: 'preparing', label: language === 'ar' ? 'قيد التحضير' : 'Preparing' },
              { key: 'completed', label: language === 'ar' ? 'مكتمل' : 'Completed' },
              { key: 'delivered', label: language === 'ar' ? 'تم التسليم' : 'Delivered' },
              { key: 'cancelled', label: language === 'ar' ? 'ملغي' : 'Cancelled' }
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setSelectedStatus(filter.key)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  selectedStatus === filter.key
                    ? 'bg-sakura-50 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Orders List */}
          <div className="space-y-6">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin w-12 h-12 border-4 border-sakura-50 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-500 dark:text-gray-400 font-arabic text-lg">
                  {language === 'ar' ? 'جاري تحميل الطلبات...' : 'Loading orders...'}
                </p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBagIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 font-arabic text-lg">
                  {language === 'ar' ? 'لا توجد طلبات بعد' : 'No orders yet'}
                </p>
                <p className="text-gray-400 dark:text-gray-500 font-arabic text-sm mt-2">
                  {language === 'ar' ? 'ابدأ بالتسوق لرؤية طلباتك هنا' : 'Start shopping to see your orders here'}
                </p>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-6 border border-gray-200 dark:border-gray-600"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div className="flex items-center gap-4 mb-4 md:mb-0">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(order.status)}
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white font-arabic">
                          {language === 'ar' ? 'طلب رقم' : 'Order'} #{order.id}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(order.date).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')} - {order.time}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                          {order.total.toFixed(2)} {language === 'ar' ? 'ريال' : 'SAR'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-arabic">
                          {order.paymentMethod}
                        </p>
                        {/* Points Earned */}
                        {order.pointsEarned > 0 && (
                          <p className="text-xs text-green-600 dark:text-green-400 font-arabic font-medium">
                            +{order.pointsEarned} {language === 'ar' ? 'نقطة' : 'points'}
                          </p>
                        )}
                      </div>
                      <button className="p-2 text-gray-500 hover:text-sakura-50 transition-colors">
                        <EyeIcon className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900 dark:text-white font-arabic">
                      {language === 'ar' ? 'المنتجات:' : 'Items:'}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {order.items.map((item: any, index: number) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-white dark:bg-gray-600 rounded-lg">
                          <span className="text-2xl">{item.image}</span>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-white font-arabic">
                              {item.quantity}x {item.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {item.price.toFixed(2)} {language === 'ar' ? 'ريال' : 'SAR'} × {item.quantity}
                            </p>
                          </div>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">
                            {(item.price * item.quantity).toFixed(2)} {language === 'ar' ? 'ريال' : 'SAR'}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Delivery Address */}
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                    <div className="flex items-start gap-2">
                      <TruckIcon className="w-4 h-4 text-gray-500 mt-1" />
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-arabic">
                          {language === 'ar' ? 'عنوان التسليم:' : 'Delivery Address:'}
                        </p>
                        <p className="text-sm text-gray-700 dark:text-gray-300 font-arabic">
                          {order.deliveryAddress}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
