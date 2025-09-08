'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { EyeIcon, EyeSlashIcon, UserIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '../../hooks/LanguageProvider';

const CashierLogin: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    branch: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const branches = [
    { id: 'branch-001', name: 'فرع صديان', nameAr: 'فرع صديان' },
    { id: 'branch-002', name: 'فرع النقرة', nameAr: 'فرع النقرة' },
    { id: 'branch-003', name: 'فرع الجامعيين', nameAr: 'فرع الجامعيين' },
    { id: 'branch-004', name: 'فرع طريق المدينة', nameAr: 'فرع طريق المدينة' },
    { id: 'branch-005', name: 'فرع شارع الراجحي', nameAr: 'فرع شارع الراجحي' },
    { id: 'branch-006', name: 'فرع فجر', nameAr: 'فرع فجر' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock authentication
      if (formData.username === 'cashier' && formData.password === '123456' && formData.branch) {
        // Store cashier session
        localStorage.setItem('cashierSession', JSON.stringify({
          username: formData.username,
          branch: formData.branch,
          branchName: branches.find(b => b.id === formData.branch)?.nameAr,
          loginTime: new Date().toISOString()
        }));
        
        // Redirect to cashier interface
        router.push('/pos');
      } else {
        setError('بيانات تسجيل الدخول غير صحيحة');
      }
    } catch (err) {
      setError('حدث خطأ في تسجيل الدخول');
    } finally {
      setIsLoading(false);
    }
  };

  const getBranchName = (branchId: string) => {
    const branch = branches.find(b => b.id === branchId);
    return isRTL ? branch?.nameAr : branch?.name;
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
              <span className="text-white text-2xl">☕</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white font-arabic mb-2">
              تسجيل دخول الكاشير
            </h1>
            <p className="text-gray-600 dark:text-gray-400 font-arabic">
              أدخل بياناتك للوصول إلى واجهة الكاشير
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

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Branch Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 font-arabic mb-2">
                الفرع
              </label>
              <div className="relative">
                <select
                  name="branch"
                  value={formData.branch}
                  onChange={handleInputChange}
                  required
                  className="input-field pr-10"
                >
                  <option value="">اختر الفرع</option>
                  {branches.map(branch => (
                    <option key={branch.id} value={branch.id}>
                      {isRTL ? branch.nameAr : branch.name}
                    </option>
                  ))}
                </select>
                <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 font-arabic mb-2">
                اسم المستخدم
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  className="input-field pr-10"
                  placeholder="أدخل اسم المستخدم"
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
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="input-field pr-10"
                  placeholder="أدخل كلمة المرور"
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="button-primary w-full"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span className="font-arabic">جاري تسجيل الدخول...</span>
                </div>
              ) : (
                <span className="font-arabic">تسجيل الدخول</span>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400 font-arabic">
              للوصول إلى لوحة الإدارة،{' '}
              <a 
                href="/admin" 
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
              <p>اسم المستخدم: cashier</p>
              <p>كلمة المرور: 123456</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CashierLogin;
