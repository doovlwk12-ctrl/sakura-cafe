'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CashierInterface from '../../components/pos/CashierInterface';
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
        router.push('/cashier-login');
      }
    } else {
      router.push('/cashier-login');
    }
    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('cashierSession');
    router.push('/cashier-login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-sakura-50 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 font-arabic">
            جاري التحميل...
          </p>
        </div>
      </div>
    );
  }

  if (!cashierSession) {
    return null; // Will redirect to login
  }

  return (
    <CashierInterface 
      cashierName={cashierSession.username}
      branchId={cashierSession.branch}
    />
  );
}
