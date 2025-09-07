'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';

const ResetPassword: React.FC = () => {
  const params = useParams();
  const token = params?.token as string;
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setMessage('❌ كلمات المرور غير متطابقة');
      return;
    }

    if (newPassword.length < 6) {
      setMessage('❌ كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }

    setIsLoading(true);
    
    try {
      const { data } = await axios.put(`http://localhost:5000/api/auth/reset-password/${token}`, {
        newPassword,
      });
      setMessage(data.message);
      
      // إعادة توجيه لتسجيل الدخول بعد 3 ثوان
      setTimeout(() => {
        window.location.href = '/admin';
      }, 3000);
    } catch (err: any) {
      setMessage(err.response?.data?.message || '❌ Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-deep-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full overflow-hidden">
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
          <h1 className="text-2xl font-bold text-deep-50 mb-2">إعادة تعيين كلمة المرور</h1>
          <p className="text-gray-600">أدخل كلمة المرور الجديدة</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
              كلمة المرور الجديدة
            </label>
            <input
              type="password"
              id="newPassword"
              placeholder="أدخل كلمة المرور الجديدة"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sakura-50 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              تأكيد كلمة المرور
            </label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="أعد إدخال كلمة المرور"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sakura-50 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'جاري التحديث...' : 'تحديث كلمة المرور'}
          </button>
        </form>

        {message && (
          <div className={`mt-6 p-4 rounded-lg text-center ${
            message.includes('✅') 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            {message}
            {message.includes('✅') && (
              <p className="text-sm mt-2">سيتم توجيهك لصفحة تسجيل الدخول خلال 3 ثوان...</p>
            )}
          </div>
        )}

        <div className="mt-6 text-center">
          <a 
            href="/admin" 
            className="text-sakura-50 hover:text-sakura-100 font-medium"
          >
            ← العودة لتسجيل الدخول
          </a>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
