'use client';

import React, { useState } from 'react';
import { useAuth } from '../AuthProvider';

const AdminLogin: React.FC = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(credentials.username, credentials.password);
    } catch (err) {
      setError('بيانات تسجيل الدخول غير صحيحة');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen new-system flex items-center justify-center bg-gradient-to-br from-sakura-50 to-accent-50 dark:from-deep-50 dark:to-accent-50 p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-sakura-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl text-white">☕</span>
          </div>
          <h1 className="text-3xl font-bold text-text-light dark:text-text-dark mb-2">مقهى ساكورا</h1>
          <p className="text-text-light dark:text-text-dark">لوحة الإدارة</p>
        </div>

        {/* Login Form */}
        <div className="card">
          <h2 className="text-2xl font-bold text-center mb-6" style={{ color: 'var(--text-primary)' }}>
            تسجيل الدخول
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                اسم المستخدم
              </label>
              <input
                type="text"
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                className="input w-full"
                placeholder="أدخل اسم المستخدم"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                كلمة المرور
              </label>
              <input
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                className="input w-full"
                placeholder="أدخل كلمة المرور"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full"
            >
              {isLoading ? 'جاري التحميل...' : 'تسجيل الدخول'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              للوصول إلى لوحة الإدارة
            </p>
            <a 
              href="/admin/forgot-password" 
              className="text-sakura-50 hover:text-sakura-100 font-medium text-sm mt-2 block"
            >
              نسيت كلمة المرور؟
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
