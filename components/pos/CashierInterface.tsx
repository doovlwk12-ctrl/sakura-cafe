'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BellIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  PrinterIcon
} from '@heroicons/react/24/outline';
import { useLanguage } from '../../hooks/LanguageProvider';

interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  orderType: 'pickup' | 'delivery';
  branch: string;
  createdAt: Date;
  estimatedTime: number;
  paymentMethod: string;
  notes?: string;
}

interface CashierInterfaceProps {
  cashierName: string;
  branchId: string;
}

const CashierInterface: React.FC<CashierInterfaceProps> = ({
  cashierName,
  branchId
}) => {
  const { t, isRTL } = useLanguage();
  const [orders, setOrders] = useState<Order[]>([
    {
      id: '1234',
      customerName: 'أحمد محمد',
      customerPhone: '+966501234567',
      items: [
        { name: 'لاتيه', quantity: 2, price: 18 },
        { name: 'كرواسون', quantity: 1, price: 12 }
      ],
      total: 48,
      status: 'pending',
      orderType: 'pickup',
      branch: 'فرع صديان',
      createdAt: new Date('2024-01-15T10:30:00'),
      estimatedTime: 15,
      paymentMethod: 'stc-pay',
      notes: 'بدون سكر'
    },
    {
      id: '1235',
      customerName: 'فاطمة علي',
      customerPhone: '+966501234568',
      items: [
        { name: 'كابتشينو', quantity: 1, price: 16 },
        { name: 'براوني', quantity: 1, price: 14 }
      ],
      total: 30,
      status: 'preparing',
      orderType: 'delivery',
      branch: 'فرع النقرة',
      createdAt: new Date('2024-01-15T10:15:00'),
      estimatedTime: 10,
      paymentMethod: 'mada'
    }
  ]);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newOrdersCount, setNewOrdersCount] = useState(0);
  const [isConnected, setIsConnected] = useState(true);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate new orders
      if (Math.random() > 0.8) {
        setNewOrdersCount(prev => prev + 1);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'preparing':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'ready':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'delivered':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return t('pos.orderStatus.pending');
      case 'preparing':
        return t('pos.orderStatus.preparing');
      case 'ready':
        return t('pos.orderStatus.ready');
      case 'delivered':
        return t('pos.orderStatus.delivered');
      case 'cancelled':
        return t('pos.orderStatus.cancelled');
      default:
        return t('pos.orderStatus.undefined');
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <ClockIcon className="w-5 h-5" />;
      case 'preparing':
        return <ClockIcon className="w-5 h-5" />;
      case 'ready':
        return <CheckCircleIcon className="w-5 h-5" />;
      case 'delivered':
        return <CheckCircleIcon className="w-5 h-5" />;
      case 'cancelled':
        return <XCircleIcon className="w-5 h-5" />;
      default:
        return <ClockIcon className="w-5 h-5" />;
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ar-SA', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const printOrder = (order: Order) => {
    // Simulate printing
    console.log('Printing order:', order);
    // In real implementation, this would send to printer
  };

  const pendingOrders = orders.filter(order => order.status === 'pending');
  const preparingOrders = orders.filter(order => order.status === 'preparing');
  const readyOrders = orders.filter(order => order.status === 'ready');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-sakura-50 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl">☕</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800 dark:text-white font-arabic">
                  واجهة الكاشير
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-arabic">
                  مرحباً، {cashierName}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Connection Status */}
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-sm text-gray-600 dark:text-gray-400 font-arabic">
                  {isConnected ? t('pos.connected') : t('pos.disconnected')}
                </span>
              </div>

              {/* New Orders Notification */}
              {newOrdersCount > 0 && (
                <div className="relative">
                  <button className="p-2 bg-sakura-50 text-white rounded-lg hover:bg-sakura-100 transition-colors">
                    <BellIcon className="w-6 h-6" />
                  </button>
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {newOrdersCount}
                  </span>
                </div>
              )}

              {/* Current Time */}
              <div className="text-sm text-gray-600 dark:text-gray-400 font-arabic">
                {new Date().toLocaleTimeString('ar-SA')}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass-card p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <ClockIcon className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
              {pendingOrders.length}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-arabic">
              طلبات في الانتظار
            </p>
          </div>

          <div className="glass-card p-6 text-center">
            <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <ClockIcon className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
              {preparingOrders.length}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-arabic">
              قيد التحضير
            </p>
          </div>

          <div className="glass-card p-6 text-center">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircleIcon className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
              {readyOrders.length}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-arabic">
              جاهز للاستلام
            </p>
          </div>
        </div>

        {/* Orders Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence>
            {orders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-6 hover-lift"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                      #{order.id}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-arabic">
                      {order.customerName}
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(order.status)}
                      <span>{getStatusText(order.status)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400 font-arabic">{t('pos.phone')}:</span>
                    <span className="text-gray-800 dark:text-white">{order.customerPhone}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400 font-arabic">{t('pos.orderType')}:</span>
                    <span className="text-gray-800 dark:text-white">
                      {order.orderType === 'pickup' ? t('pos.orderType.pickup') : t('pos.orderType.delivery')}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400 font-arabic">{t('pos.time')}:</span>
                    <span className="text-gray-800 dark:text-white">{formatTime(order.createdAt)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400 font-arabic">{t('pos.payment')}:</span>
                    <span className="text-gray-800 dark:text-white">
                      {order.paymentMethod === 'stc-pay' ? t('pos.paymentMethod.stcPay') : 
                       order.paymentMethod === 'mada' ? t('pos.paymentMethod.mada') : 
                       order.paymentMethod === 'cash' ? t('pos.paymentMethod.cash') : order.paymentMethod}
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 font-arabic mb-2">
                    المنتجات:
                  </p>
                  <div className="space-y-1">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400 font-arabic">
                          {item.quantity}x {item.name}
                        </span>
                        <span className="text-gray-800 dark:text-white">
                          {item.price * item.quantity} ريال
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {order.notes && (
                  <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200 font-arabic">
                      <span className="font-medium">ملاحظات:</span> {order.notes}
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between mb-4">
                  <span className="text-xl font-bold text-sakura-50">
                    {order.total} ريال
                  </span>
                  {order.estimatedTime > 0 && (
                    <span className="text-sm text-gray-500 font-arabic">
                      متوقع خلال {order.estimatedTime} دقيقة
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="flex-1 px-3 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors text-sm font-arabic"
                  >
                    <EyeIcon className="w-4 h-4 inline mr-1" />
                    تفاصيل
                  </button>
                  <button
                    onClick={() => printOrder(order)}
                    className="px-3 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <PrinterIcon className="w-4 h-4" />
                  </button>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 flex gap-2">
                  {order.status === 'pending' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'preparing')}
                      className="flex-1 px-3 py-2 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition-colors text-sm font-arabic"
                    >
                      بدء التحضير
                    </button>
                  )}
                  {order.status === 'preparing' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'ready')}
                      className="flex-1 px-3 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors text-sm font-arabic"
                    >
                      جاهز
                    </button>
                  )}
                  {order.status === 'ready' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'delivered')}
                      className="flex-1 px-3 py-2 bg-purple-100 text-purple-800 rounded-lg hover:bg-purple-200 transition-colors text-sm font-arabic"
                    >
                      تم التوصيل
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {orders.length === 0 && (
          <div className="glass-card p-12 text-center">
            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-gray-500 text-2xl">📋</span>
            </div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white font-arabic mb-2">
              لا توجد طلبات
            </h3>
            <p className="text-gray-600 dark:text-gray-400 font-arabic">
              لم يتم استلام أي طلبات جديدة
            </p>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="glass-card p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white font-arabic">
                تفاصيل الطلب #{selectedOrder.id}
              </h3>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 font-arabic mb-2">
                    {t('pos.customerName')}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-arabic">
                    {t('pos.customerName')}: {selectedOrder.customerName}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-arabic">
                    {t('pos.phone')}: {selectedOrder.customerPhone}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 font-arabic mb-2">
                    {t('pos.orderInfo')}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-arabic">
                    {t('pos.orderType')}: {selectedOrder.orderType === 'pickup' ? t('pos.orderType.pickup') : t('pos.orderType.delivery')}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-arabic">
                    {t('pos.time')}: {formatTime(selectedOrder.createdAt)}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-700 dark:text-gray-300 font-arabic mb-2">
                  المنتجات
                </h4>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-800 dark:text-white font-arabic">
                          {item.name}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          الكمية: {item.quantity}
                        </p>
                      </div>
                      <p className="font-bold text-sakura-50">
                        {item.price * item.quantity} ريال
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {selectedOrder.notes && (
                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <h4 className="font-medium text-yellow-800 dark:text-yellow-200 font-arabic mb-2">
                    ملاحظات خاصة
                  </h4>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300 font-arabic">
                    {selectedOrder.notes}
                  </p>
                </div>
              )}

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-800 dark:text-white font-arabic">
                    المجموع الكلي:
                  </span>
                  <span className="text-2xl font-bold text-sakura-50">
                    {selectedOrder.total} ريال
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CashierInterface;
