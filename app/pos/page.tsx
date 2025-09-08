'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import POSSystem from '../../components/pos/POSSystem';
import { useLanguage } from '../../hooks/LanguageProvider';

export default function POSPage() {
  const { t, isRTL } = useLanguage();
  const router = useRouter();
  const [cashierSession, setCashierSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for cashier session
    const session = localStorage.getItem('cashierSession');
    if (session) {
      try {
        const parsedSession = JSON.parse(session);
        setCashierSession(parsedSession);
      } catch (error) {
        console.error('Error parsing cashier session:', error);
        localStorage.removeItem('cashierSession');
      }
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fefefe] dark:bg-[#111827] flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#e57373] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#6b7280] dark:text-[#9ca3af] font-arabic">
            جاري التحميل...
          </p>
        </div>
      </div>
    );
  }

  // If no session, show login prompt
  if (!cashierSession) {
    return (
      <div className="min-h-screen bg-[#fefefe] dark:bg-[#111827] flex items-center justify-center p-4 transition-colors duration-300">
        <div className="bg-white dark:bg-[#1f2937] border border-gray-200 dark:border-[#374151] rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-[#e57373] to-[#f28b82] rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-white text-2xl">☕</span>
          </div>
          
          <h1 className="text-2xl font-bold text-[#1f2937] dark:text-[#f9fafb] font-arabic mb-4">
            نقطة البيع
          </h1>
          
          <p className="text-[#6b7280] dark:text-[#9ca3af] font-arabic mb-6">
            يرجى تسجيل الدخول للوصول إلى واجهة الكاشير
          </p>
          
          <button
            onClick={() => router.push('/cashier-login')}
            className="w-full px-6 py-3 bg-[#e57373] text-white rounded-lg font-medium hover:bg-[#d65a5a] transition-all duration-300 font-arabic"
          >
            تسجيل دخول الكاشير
          </button>
          
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
      </div>
    );
  }

  return (
    <POSSystem 
      cashierName={cashierSession.username}
      branchId={cashierSession.branch}
    />
  );
}
