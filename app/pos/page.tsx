'use client';

import React from 'react';
import { useAuth } from '../../components/AuthProvider';
import ProtectedRoute from '../../components/ProtectedRoute';
import POSSystem from '../../components/pos/POSSystem';
import { useLanguage } from '../../hooks/LanguageProvider';
import '../../styles/theme.css';

export default function POSPage() {
  const { isAuthenticated } = useAuth();
  const { t, isRTL } = useLanguage();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-deep-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">{t('login')}</h1>
          <p className="text-white/80">{t('pos_system')}</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["admin", "cashier"]}>
      <POSSystem />
    </ProtectedRoute>
  );
}
