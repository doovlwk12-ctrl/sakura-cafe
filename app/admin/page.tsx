'use client';

import React, { useState, useEffect } from 'react';
import AdminDashboard from '../../components/admin/AdminDashboard';
import AdminLogin from '../../components/admin/AdminLogin';
import { useAuth } from '../../components/AuthProvider';
import '../../styles/theme.css';

export default function AdminPage() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient || isLoading) {
    return (
      <div className="min-h-screen bg-[#fefefe] dark:bg-[#111827] flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#e57373] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#6b7280] dark:text-[#9ca3af] font-arabic">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  // Check if user is authenticated and has admin role
  if (!isAuthenticated || !user || user.role !== 'admin') {
    return <AdminLogin />;
  }

  return <AdminDashboard />;
}
