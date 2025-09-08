'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { EyeIcon, EyeSlashIcon, UserIcon, LockClosedIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '../../hooks/LanguageProvider';

const AdminLogin: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const router = useRouter();
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
    twoFactorCode: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLocked) {
      setError('تم قفل الحساب مؤقتاً بسبب محاولات تسجيل دخول متعددة فاشلة');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock authentication with enhanced security
      if (credentials.username === 'admin' && credentials.password === 'admin123') {
        if (!showTwoFactor) {
          // First step: username/password correct, show 2FA
          setShowTwoFactor(true);
          setError('');
        } else {
          // Second step: 2FA verification
          if (credentials.twoFactorCode === '123456') {
            // Store admin session
            localStorage.setItem('adminSession', JSON.stringify({
              username: credentials.username,
              role: 'admin',
              loginTime: new Date().toISOString(),
              permissions: ['dashboard', 'products', 'orders', 'users', 'reports', 'settings']
            }));
            
            // Reset attempts
            setLoginAttempts(0);
            
            // Redirect to admin dashboard
            router.push('/admin');
          } else {
            setError('رمز التحقق غير صحيح');
            setLoginAttempts(prev => prev + 1);
          }
        }
      } else {
        setError('بيانات تسجيل الدخول غير صحيحة');
        setLoginAttempts(prev => prev + 1);
        
        if (loginAttempts >= 4) {
          setIsLocked(true);
          setError('تم قفل الحساب مؤقتاً. حاول مرة أخرى بعد 15 دقيقة');
          setTimeout(() => {
            setIsLocked(false);
            setLoginAttempts(0);
          }, 15 * 60 * 1000); // 15 minutes
        }
      }
    } catch (err) {
      setError('حدث خطأ في تسجيل الدخول');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setShowTwoFactor(false);
    setCredentials(prev => ({ ...prev, twoFactorCode: '' }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sakura-50/10 to-deep-50/10 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="glass-card p-8 rounded-2xl shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-sakura-50 to-deep-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheckIcon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white font-arabic mb-2">
              لوحة الإدارة
            </h1>
            <p className="text-gray-600 dark:text-gray-400 font-arabic">
              {showTwoFactor ? 'أدخل رمز التحقق' : 'تسجيل دخول آمن'}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
            >
              <p className="text-red-600 dark:text-red-400 text-sm font-arabic text-center">
                {error}
              </p>
            </motion.div>
          )}

          {/* Login Attempts Warning */}
          {loginAttempts > 0 && loginAttempts < 5 && (
            <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-yellow-600 dark:text-yellow-400 text-sm font-arabic text-center">
                محاولات فاشلة: {loginAttempts}/5
              </p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {!showTwoFactor ? (
              <>
                {/* Username */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 font-arabic mb-2">
                    اسم المستخدم
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="username"
                      value={credentials.username}
                      onChange={handleInputChange}
                      required
                      className="input-field pr-10"
                      placeholder="أدخل اسم المستخدم"
                      disabled={isLoading}
                    />
                    <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 font-arabic mb-2">
                    كلمة المرور
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={credentials.password}
                      onChange={handleInputChange}
                      required
                      className="input-field pr-10"
                      placeholder="أدخل كلمة المرور"
                      disabled={isLoading}
                    />
                    <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
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
              </>
            ) : (
              <>
                {/* Two Factor Authentication */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 font-arabic mb-2">
                    رمز التحقق
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="twoFactorCode"
                      value={credentials.twoFactorCode}
                      onChange={handleInputChange}
                      required
                      className="input-field pr-10 text-center text-lg tracking-widest"
                      placeholder="000000"
                      maxLength={6}
                      disabled={isLoading}
                    />
                    <ShieldCheckIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-arabic mt-2 text-center">
                    أدخل الرمز المكون من 6 أرقام
                  </p>
                </div>
              </>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || isLocked}
              className="button-primary w-full"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span className="font-arabic">جاري التحقق...</span>
                </div>
              ) : (
                <span className="font-arabic">
                  {showTwoFactor ? 'تحقق' : 'تسجيل الدخول'}
                </span>
              )}
            </button>
          </form>

          {/* Back Button for 2FA */}
          {showTwoFactor && (
            <div className="mt-4 text-center">
              <button
                onClick={handleBackToLogin}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 font-arabic"
              >
                ← العودة لتسجيل الدخول
              </button>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 font-arabic">
              للوصول إلى واجهة الكاشير،{' '}
              <a 
                href="/cashier-login" 
                className="text-sakura-50 hover:text-sakura-100 font-medium"
              >
                اضغط هنا
              </a>
            </p>
          </div>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 font-arabic mb-2">
              بيانات تجريبية:
            </h3>
            <div className="text-xs text-blue-700 dark:text-blue-300 font-arabic space-y-1">
              <p>اسم المستخدم: admin</p>
              <p>كلمة المرور: admin123</p>
              <p>رمز التحقق: 123456</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
