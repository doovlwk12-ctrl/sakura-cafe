'use client';

import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
      setMessage(data.message);
    } catch (err: any) {
      setMessage(err.response?.data?.message || '❌ Failed to send reset link');
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
          <h1 className="text-2xl font-bold text-deep-50 mb-2">نسيت كلمة المرور؟</h1>
          <p className="text-gray-600">أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة التعيين</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              id="email"
              placeholder="أدخل بريدك الإلكتروني"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sakura-50 focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'جاري الإرسال...' : 'إرسال رابط إعادة التعيين'}
          </button>
        </form>

        {message && (
          <div className={`mt-6 p-4 rounded-lg text-center ${
            message.includes('✅') 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            {message}
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

export default ForgotPassword;
