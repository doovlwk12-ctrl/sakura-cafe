'use client';

import React, { useState, useEffect } from 'react';
import AdminDashboard from '../../components/admin/AdminDashboard';
import AdminLogin from '../../components/admin/AdminLogin';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useAuth } from '../../components/AuthProvider';
import '../../styles/theme.css';

export default function AdminPage() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-pink-200 border-t-rose-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <AdminDashboard />
    </ProtectedRoute>
  );
}
