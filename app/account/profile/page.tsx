'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../../hooks/LanguageProvider';
import { useAuth } from '../../../components/AuthProvider';
import Link from 'next/link';
import { UserIcon, EnvelopeIcon, PhoneIcon, MapPinIcon, CalendarIcon, StarIcon, PencilIcon, CheckIcon, XMarkIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

export default function ProfilePage() {
  const { language } = useLanguage();
  const { user } = useAuth();
  
  // States for editing
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  // معلومات افتراضية للمستخدم
  const [userInfo, setUserInfo] = useState({
    fullName: user?.fullName || 'عبدالسلام أحمد',
    email: user?.email || 'abdusalam@example.com',
    phone: user?.phone || '+966 50 123 4567',
    address: (user as any)?.address || 'حائل، المملكة العربية السعودية',
    joinDate: 'يناير 2025',
    loyaltyPoints: user?.loyaltyPoints || 50,
    memberLevel: user?.role === 'customer' ? 'عضو مميز' : 'عضو عادي'
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInfo({
      ...userInfo,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value
    });
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    setMessage('');
    
    try {
      // محاكاة حفظ البيانات
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage(language === 'ar' ? 'تم حفظ التغييرات بنجاح!' : 'Changes saved successfully!');
      setIsEditing(false);
    } catch (error) {
      setMessage(language === 'ar' ? 'حدث خطأ أثناء الحفظ' : 'Error saving changes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage(language === 'ar' ? 'كلمة المرور الجديدة غير متطابقة' : 'New passwords do not match');
      return;
    }

    setIsLoading(true);
    setMessage('');
    
    try {
      // محاكاة تغيير كلمة المرور
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage(language === 'ar' ? 'تم تغيير كلمة المرور بنجاح!' : 'Password changed successfully!');
      setShowPasswordForm(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setMessage(language === 'ar' ? 'حدث خطأ أثناء تغيير كلمة المرور' : 'Error changing password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sakura-50/20 via-white to-deep-50/20 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
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
              <UserIcon className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-arabic mb-2">
              {language === 'ar' ? 'الملف الشخصي' : 'Profile'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 font-arabic">
              {language === 'ar' ? 'معلوماتك الشخصية' : 'Your personal information'}
            </p>
          </div>

          {/* User Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Info */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white font-arabic mb-4">
                {language === 'ar' ? 'المعلومات الشخصية' : 'Personal Information'}
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <UserIcon className="w-5 h-5 text-sakura-50" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-arabic">
                      {language === 'ar' ? 'الاسم الكامل' : 'Full Name'}
                    </p>
                    {isEditing ? (
                      <input
                        type="text"
                        name="fullName"
                        value={userInfo.fullName}
                        onChange={handleInputChange}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sakura-50 font-arabic"
                      />
                    ) : (
                      <p className="font-semibold text-gray-900 dark:text-white font-arabic">
                        {userInfo.fullName}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <EnvelopeIcon className="w-5 h-5 text-sakura-50" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-arabic">
                      {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                    </p>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={userInfo.email}
                        onChange={handleInputChange}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sakura-50"
                      />
                    ) : (
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {userInfo.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <PhoneIcon className="w-5 h-5 text-sakura-50" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-arabic">
                      {language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
                    </p>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={userInfo.phone}
                        onChange={handleInputChange}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sakura-50 font-arabic"
                      />
                    ) : (
                      <p className="font-semibold text-gray-900 dark:text-white font-arabic">
                        {userInfo.phone}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <MapPinIcon className="w-5 h-5 text-sakura-50" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-arabic">
                      {language === 'ar' ? 'العنوان' : 'Address'}
                    </p>
                    {isEditing ? (
                      <input
                        type="text"
                        name="address"
                        value={userInfo.address}
                        onChange={handleInputChange}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sakura-50 font-arabic"
                      />
                    ) : (
                      <p className="font-semibold text-gray-900 dark:text-white font-arabic">
                        {userInfo.address}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Account Info */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white font-arabic mb-4">
                {language === 'ar' ? 'معلومات الحساب' : 'Account Information'}
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-sakura-50/10 to-sakura-100/10 rounded-xl border border-sakura-50/20">
                  <StarIcon className="w-5 h-5 text-yellow-500" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-arabic">
                      {language === 'ar' ? 'نقاط المكافآت' : 'Reward Points'}
                    </p>
                    <p className="font-bold text-sakura-50 text-lg">
                      {userInfo.loyaltyPoints} {language === 'ar' ? 'نقطة' : 'points'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <UserIcon className="w-5 h-5 text-sakura-50" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-arabic">
                      {language === 'ar' ? 'مستوى العضوية' : 'Membership Level'}
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white font-arabic">
                      {userInfo.memberLevel}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <CalendarIcon className="w-5 h-5 text-sakura-50" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-arabic">
                      {language === 'ar' ? 'تاريخ الانضمام' : 'Join Date'}
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white font-arabic">
                      {userInfo.joinDate}
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-700">
                  <div className="text-center">
                    <p className="text-sm text-green-600 dark:text-green-400 font-arabic mb-1">
                      {language === 'ar' ? 'حالة الحساب' : 'Account Status'}
                    </p>
                    <p className="font-bold text-green-700 dark:text-green-300 font-arabic">
                      {language === 'ar' ? 'نشط' : 'Active'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Message */}
          {message && (
            <div className={`mt-6 p-4 rounded-xl text-center font-arabic ${
              message.includes('نجاح') || message.includes('success') 
                ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300' 
                : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300'
            }`}>
              {message}
            </div>
          )}

          {/* Password Change Form */}
          {showPasswordForm && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-6 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600"
            >
              <h3 className="text-lg font-bold text-gray-900 dark:text-white font-arabic mb-4">
                {language === 'ar' ? 'تغيير كلمة المرور' : 'Change Password'}
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-arabic">
                    {language === 'ar' ? 'كلمة المرور الحالية' : 'Current Password'}
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      name="currentPassword"
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sakura-50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showCurrentPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-arabic">
                    {language === 'ar' ? 'كلمة المرور الجديدة' : 'New Password'}
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      name="newPassword"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sakura-50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showNewPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 font-arabic">
                    {language === 'ar' ? 'تأكيد كلمة المرور الجديدة' : 'Confirm New Password'}
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-600 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sakura-50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleChangePassword}
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-arabic flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {language === 'ar' ? 'جاري الحفظ...' : 'Saving...'}
                    </>
                  ) : (
                    <>
                      <CheckIcon className="w-5 h-5" />
                      {language === 'ar' ? 'تغيير كلمة المرور' : 'Change Password'}
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowPasswordForm(false);
                    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  }}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 dark:text-gray-300 rounded-lg font-semibold transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-600 font-arabic flex items-center gap-2"
                >
                  <XMarkIcon className="w-5 h-5" />
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
              </div>
            </motion.div>
          )}

          {/* Action Buttons */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-600">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-3 bg-gradient-to-r from-sakura-50 to-sakura-100 text-white rounded-xl font-semibold transition-all duration-300 hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] font-arabic flex items-center justify-center gap-2"
                  >
                    <PencilIcon className="w-5 h-5" />
                    {language === 'ar' ? 'تعديل الملف الشخصي' : 'Edit Profile'}
                  </button>
                  <button
                    onClick={() => setShowPasswordForm(true)}
                    className="px-6 py-3 border-2 border-sakura-50 text-sakura-50 rounded-xl font-semibold transition-all duration-300 hover:bg-sakura-50 hover:text-white font-arabic flex items-center justify-center gap-2"
                  >
                    <EyeIcon className="w-5 h-5" />
                    {language === 'ar' ? 'تغيير كلمة المرور' : 'Change Password'}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleSaveProfile}
                    disabled={isLoading}
                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-arabic flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {language === 'ar' ? 'جاري الحفظ...' : 'Saving...'}
                      </>
                    ) : (
                      <>
                        <CheckIcon className="w-5 h-5" />
                        {language === 'ar' ? 'حفظ التغييرات' : 'Save Changes'}
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 dark:text-gray-300 rounded-lg font-semibold transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-600 font-arabic flex items-center gap-2"
                  >
                    <XMarkIcon className="w-5 h-5" />
                    {language === 'ar' ? 'إلغاء' : 'Cancel'}
                  </button>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
