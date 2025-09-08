'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Cog6ToothIcon, ShoppingCartIcon, UserIcon } from '@heroicons/react/24/outline';
import LoginModal from '../../components/auth/LoginModal';
import { useAuth } from '../../components/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminAccessPage() {
  const [selectedUserType, setSelectedUserType] = useState<'admin' | 'cashier' | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // إعادة توجيه المستخدمين المصادق عليهم
    if (isAuthenticated && user) {
      if (user.role === 'admin') {
        router.push('/admin');
      } else if (user.role === 'cashier') {
        router.push('/pos');
      } else {
        // العملاء لا يمكنهم الوصول لهذه الصفحة
        router.push('/');
      }
    }
  }, [isAuthenticated, user, router]);

  const handleAccessRequest = (userType: 'admin' | 'cashier') => {
    setSelectedUserType(userType);
    setShowLoginModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-deep-50 to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-24 h-24 mx-auto mb-6 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
            <img 
              src="/images/logo+next+too-13-1920w.png" 
              alt="Sakura Cafe Logo" 
              className="w-16 h-16 object-contain filter brightness-110"
            />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4 font-arabic">
            نظام الإدارة الداخلي
          </h1>
          <p className="text-xl text-gray-300 font-arabic">
            مقهى ساكورا - دخول المصرح لهم فقط
          </p>
        </motion.div>

        {/* Access Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Admin Access */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer group"
            onClick={() => handleAccessRequest('admin')}
          >
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-sakura-50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Cog6ToothIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3 font-arabic">
                لوحة الإدارة
              </h3>
              <p className="text-gray-300 font-arabic mb-4">
                إدارة شاملة للنظام والفروع والمنتجات والتقارير
              </p>
              <div className="space-y-2 text-sm text-gray-400 font-arabic">
                <div>• إدارة المنتجات والأسعار</div>
                <div>• تقارير المبيعات والأرباح</div>
                <div>• إدارة الفروع والموظفين</div>
                <div>• إعدادات النظام</div>
              </div>
              <div className="mt-6">
                <span className="bg-red-500/20 text-red-300 px-3 py-1 rounded-full text-xs font-arabic">
                  مدير النظام فقط
                </span>
              </div>
            </div>
          </motion.div>

          {/* Cashier Access */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer group"
            onClick={() => handleAccessRequest('cashier')}
          >
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-deep-50 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <ShoppingCartIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3 font-arabic">
                نقطة البيع
              </h3>
              <p className="text-gray-300 font-arabic mb-4">
                نظام البيع والطلبات الخاص بكل فرع
              </p>
              <div className="space-y-2 text-sm text-gray-400 font-arabic">
                <div>• إنشاء وإدارة الطلبات</div>
                <div>• معالجة المدفوعات</div>
                <div>• طباعة الفواتير</div>
                <div>• تقارير الفرع اليومية</div>
              </div>
              <div className="mt-6">
                <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-xs font-arabic">
                  كاشير الفرع
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Warning */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 text-center"
        >
          <div className="flex items-center justify-center mb-2">
            <UserIcon className="w-5 h-5 text-yellow-400 ml-2" />
            <span className="text-yellow-400 font-arabic font-medium">تنبيه مهم</span>
          </div>
          <p className="text-yellow-300 text-sm font-arabic">
            هذه الأنظمة مخصصة للموظفين المصرح لهم فقط. 
            <br />
            العملاء يمكنهم التسجيل والطلب من الصفحة الرئيسية.
          </p>
        </motion.div>

        {/* Back to Home */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-8"
        >
          <button
            onClick={() => router.push('/')}
            className="text-gray-400 hover:text-white transition-colors font-arabic"
          >
            ← العودة للصفحة الرئيسية
          </button>
        </motion.div>
      </div>

      {/* Login Modal */}
      {showLoginModal && selectedUserType && (
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => {
            setShowLoginModal(false);
            setSelectedUserType(null);
          }}
          userType={selectedUserType}
        />
      )}
    </div>
  );
}
