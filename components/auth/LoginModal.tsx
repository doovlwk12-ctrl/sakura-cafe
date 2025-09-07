'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, UserIcon, KeyIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../AuthProvider';
import { useLanguage } from '../../hooks/LanguageProvider';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  userType: 'customer' | 'admin' | 'cashier';
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, userType }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const { t, isRTL } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(formData.username, formData.password, userType);
      onClose();
      setFormData({ username: '', password: '' });
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getModalTitle = () => {
    switch (userType) {
      case 'admin':
        return 'تسجيل دخول الإدارة';
      case 'cashier':
        return 'تسجيل دخول الكاشير';
      case 'customer':
        return 'تسجيل دخول العميل';
      default:
        return 'تسجيل الدخول';
    }
  };

  const getExampleCredentials = () => {
    switch (userType) {
      case 'admin':
        return {
          username: 'admin',
          password: 'admin123',
          description: 'مدير النظام العام'
        };
      case 'cashier':
        return {
          username: 'cashier_sadiyan',
          password: 'cashier123',
          description: 'كاشير فرع صديان (مثال)'
        };
      case 'customer':
        return {
          username: 'ahmed_salem',
          password: 'customer123',
          description: 'عميل مسجل (مثال)'
        };
      default:
        return null;
    }
  };

  const exampleCreds = getExampleCredentials();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-sakura-50 to-deep-50 px-6 py-4 relative">
              <button
                onClick={onClose}
                className="absolute top-4 left-4 text-white hover:text-gray-200 transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-bold text-white font-arabic text-center">
                {getModalTitle()}
              </h2>
            </div>

            {/* Body */}
            <div className="p-6">
              {/* Example Credentials */}
              {exampleCreds && (
                <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                  <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2 font-arabic">
                    بيانات تجريبية:
                  </h4>
                  <p className="text-xs text-blue-600 dark:text-blue-300 mb-2 font-arabic">
                    {exampleCreds.description}
                  </p>
                  <div className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                    <div><strong>اسم المستخدم:</strong> {exampleCreds.username}</div>
                    <div><strong>كلمة المرور:</strong> {exampleCreds.password}</div>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg">
                  <p className="text-sm text-red-600 dark:text-red-400 font-arabic">{error}</p>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Username */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-arabic">
                    اسم المستخدم
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sakura-50 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="أدخل اسم المستخدم"
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-arabic">
                    كلمة المرور
                  </label>
                  <div className="relative">
                    <KeyIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-sakura-50 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="أدخل كلمة المرور"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="w-5 h-5" />
                      ) : (
                        <EyeIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-sakura-50 to-deep-50 text-white py-3 px-4 rounded-lg font-medium transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-arabic"
                >
                  {isLoading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;
