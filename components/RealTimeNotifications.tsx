'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BellIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import { useLanguage } from '../hooks/LanguageProvider';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface RealTimeNotificationsProps {
  userId?: string;
  userRole?: 'admin' | 'cashier' | 'customer';
}

const RealTimeNotifications: React.FC<RealTimeNotificationsProps> = ({ 
  userId, 
  userRole = 'admin' 
}) => {
  const { t, isRTL } = useLanguage();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const eventSourceRef = useRef<EventSource | null>(null);

  // محاكاة الإشعارات في الوقت الفعلي
  useEffect(() => {
    // إنشاء إشعارات تجريبية
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'info',
        title: 'طلب جديد',
        message: 'تم استلام طلب جديد من العميل أحمد محمد',
        timestamp: new Date(),
        read: false,
        action: {
          label: 'عرض الطلب',
          onClick: () => console.log('عرض الطلب')
        }
      },
      {
        id: '2',
        type: 'success',
        title: 'دفع ناجح',
        message: 'تم استلام دفعة بقيمة 150 ريال',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        read: false
      },
      {
        id: '3',
        type: 'warning',
        title: 'مخزون منخفض',
        message: 'مخزون القهوة منخفض - يرجى إعادة التموين',
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        read: false,
        action: {
          label: 'إدارة المخزون',
          onClick: () => console.log('إدارة المخزون')
        }
      },
      {
        id: '4',
        type: 'error',
        title: 'خطأ في النظام',
        message: 'فشل في الاتصال بخادم الدفع',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        read: true
      }
    ];

    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.read).length);

    // محاكاة إشعارات جديدة
    const interval = setInterval(() => {
      const newNotification: Notification = {
        id: Date.now().toString(),
        type: ['info', 'success', 'warning', 'error'][Math.floor(Math.random() * 4)] as any,
        title: 'إشعار جديد',
        message: 'هذا إشعار تجريبي في الوقت الفعلي',
        timestamp: new Date(),
        read: false
      };

      setNotifications(prev => [newNotification, ...prev]);
      setUnreadCount(prev => prev + 1);

      // إظهار إشعار منبثق
      showToastNotification(newNotification);
    }, 30000); // كل 30 ثانية

    return () => clearInterval(interval);
  }, [userRole]);

  const showToastNotification = (notification: Notification) => {
    // إنشاء عنصر إشعار منبثق
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm transform transition-all duration-300 ${
      notification.type === 'info' ? 'bg-blue-500 text-white' :
      notification.type === 'success' ? 'bg-green-500 text-white' :
      notification.type === 'warning' ? 'bg-yellow-500 text-white' :
      'bg-red-500 text-white'
    }`;
    
    toast.innerHTML = `
      <div class="flex items-start gap-3">
        <div class="flex-shrink-0">
          ${getNotificationIcon(notification.type)}
        </div>
        <div class="flex-1">
          <h4 class="font-semibold text-sm">${notification.title}</h4>
          <p class="text-sm opacity-90">${notification.message}</p>
        </div>
        <button onclick="this.parentElement.parentElement.remove()" class="flex-shrink-0 text-white/70 hover:text-white">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    `;

    document.body.appendChild(toast);

    // إزالة الإشعار بعد 5 ثوان
    setTimeout(() => {
      if (toast.parentElement) {
        toast.remove();
      }
    }, 5000);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'info':
        return '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';
      case 'success':
        return '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';
      case 'warning':
        return '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path></svg>';
      case 'error':
        return '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';
      default:
        return '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5v-5zM4 19h6v-6H4v6z"></path></svg>';
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => {
      const notification = prev.find(n => n.id === notificationId);
      if (notification && !notification.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      return prev.filter(n => n.id !== notificationId);
    });
  };

  const getNotificationTypeColor = (type: string) => {
    switch (type) {
      case 'info':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'success':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'error':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'الآن';
    if (minutes < 60) return `منذ ${minutes} دقيقة`;
    if (hours < 24) return `منذ ${hours} ساعة`;
    return `منذ ${days} يوم`;
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-[#6b7280] dark:text-[#9ca3af] hover:text-[#e57373] transition-colors"
      >
        <BellIcon className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-12 right-0 w-80 bg-white dark:bg-[#1f2937] border border-gray-200 dark:border-[#374151] rounded-xl shadow-xl z-50"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-[#374151]">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[#1f2937] dark:text-[#f9fafb] font-arabic">
                  الإشعارات
                </h3>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-sm text-[#e57373] hover:text-[#d65a5a] transition-colors font-arabic"
                    >
                      تعيين الكل كمقروء
                    </button>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-[#6b7280] dark:text-[#9ca3af] hover:text-[#e57373] transition-colors"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <BellIcon className="w-12 h-12 text-[#6b7280] dark:text-[#9ca3af] mx-auto mb-3" />
                  <p className="text-[#6b7280] dark:text-[#9ca3af] font-arabic">
                    لا توجد إشعارات
                  </p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className={`p-4 border-b border-gray-100 dark:border-[#374151]/50 hover:bg-gray-50 dark:hover:bg-[#374151]/50 transition-colors ${
                      !notification.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${getNotificationTypeColor(notification.type)}`}>
                        {notification.type === 'info' && <InformationCircleIcon className="w-4 h-4" />}
                        {notification.type === 'success' && <CheckCircleIcon className="w-4 h-4" />}
                        {notification.type === 'warning' && <ExclamationTriangleIcon className="w-4 h-4" />}
                        {notification.type === 'error' && <XCircleIcon className="w-4 h-4" />}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <h4 className="text-sm font-semibold text-[#1f2937] dark:text-[#f9fafb] font-arabic">
                            {notification.title}
                          </h4>
                          <div className="flex items-center gap-2">
                            {!notification.read && (
                              <div className="w-2 h-2 bg-[#e57373] rounded-full"></div>
                            )}
                            <button
                              onClick={() => deleteNotification(notification.id)}
                              className="text-[#6b7280] dark:text-[#9ca3af] hover:text-red-500 transition-colors"
                            >
                              <XMarkIcon className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        
                        <p className="text-sm text-[#6b7280] dark:text-[#9ca3af] font-arabic mt-1">
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-[#6b7280] dark:text-[#9ca3af]">
                            {formatTime(notification.timestamp)}
                          </span>
                          
                          <div className="flex items-center gap-2">
                            {!notification.read && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="text-xs text-[#e57373] hover:text-[#d65a5a] transition-colors font-arabic"
                              >
                                تعيين كمقروء
                              </button>
                            )}
                            {notification.action && (
                              <button
                                onClick={notification.action.onClick}
                                className="text-xs text-[#e57373] hover:text-[#d65a5a] transition-colors font-arabic"
                              >
                                {notification.action.label}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-4 border-t border-gray-200 dark:border-[#374151]">
                <button className="w-full text-center text-sm text-[#e57373] hover:text-[#d65a5a] transition-colors font-arabic">
                  عرض جميع الإشعارات
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RealTimeNotifications;
