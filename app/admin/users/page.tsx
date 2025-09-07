'use client';

import React from 'react';
import { useAuth } from '../../../components/AuthProvider';
import ProtectedRoute from '../../../components/ProtectedRoute';
import UserManagement from '../../../components/admin/UserManagement';

const AdminUsersPage = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-deep-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">يرجى تسجيل الدخول</h1>
          <p className="text-white/80">تحتاج إلى تسجيل الدخول للوصول إلى هذه الصفحة</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="min-h-screen bg-deep-50">
        <div className="container mx-auto px-4 py-8">
          <UserManagement />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default AdminUsersPage;
