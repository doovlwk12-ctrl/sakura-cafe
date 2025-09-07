'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../hooks/LanguageProvider';

interface LoadingPageProps {
  onLoadingComplete?: () => void;
  loadingTime?: number; // الوقت بالمللي ثانية
}

const LoadingPage: React.FC<LoadingPageProps> = ({ 
  onLoadingComplete, 
  loadingTime = 3000 
}) => {
  const { t, isRTL } = useLanguage();
  const [progress, setProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // محاكاة تقدم التحميل
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    // إخفاء صفحة التحميل بعد انتهاء الوقت
    const timer = setTimeout(() => {
      setShowContent(true);
      setTimeout(() => {
        onLoadingComplete?.();
      }, 500);
    }, loadingTime);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [loadingTime, onLoadingComplete]);

  if (showContent) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-sakura-50 to-accent-50 dark:from-deep-50 dark:to-accent-50 loading-container">
      {/* خلفية متحركة */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-sakura-50 to-accent-50 rounded-full opacity-20 background-shapes"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-accent-50 to-deep-50 rounded-full opacity-20 background-shapes"></div>
      </div>

      {/* المحتوى الرئيسي */}
      <div className="relative z-10 text-center">
        {/* الشعار */}
        <div className="mb-8 loading-logo">
          <div className="w-32 h-32 mx-auto bg-background-white rounded-full shadow-2xl flex items-center justify-center border-4 border-sakura-50">
            <img 
              src="/images/logo.png" 
              alt="Sakura Cafe Logo" 
              className="w-20 h-20 object-contain"
              onError={(e) => {
                // في حالة عدم وجود الشعار، نستخدم أيقونة بديلة
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const fallback = target.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'flex';
              }}
            />
            <div className="w-20 h-20 flex items-center justify-center text-4xl text-sakura-50 font-bold" style={{ display: 'none' }}>
              ☕
            </div>
          </div>
        </div>

        {/* اسم المقهى */}
        <div className="loading-text">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-text-dark to-text-light bg-clip-text text-transparent">
            {t('brand.name')}
          </h1>
          <h2 className="text-2xl font-medium text-text-light mb-8">
            {t('brand.name')}
          </h2>
        </div>

        {/* نص التحميل */}
        <div className="mb-6">
          <p className="text-lg text-gray-200 mb-2">{t('loading')}</p>
          <p className="text-sm text-gray-300">{t('loading')}</p>
        </div>

        {/* شريط التقدم */}
        <div className="w-64 mx-auto mb-6">
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-white to-gray-200 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="text-center mt-2">
            <span className="text-sm text-gray-200">{Math.round(progress)}%</span>
          </div>
        </div>

        {/* رسالة ترحيب */}
        <div className="text-center">
          <p className="text-sm text-gray-200 mb-2">أهلاً وسهلاً بك في أجمل مقهى</p>
          <p className="text-xs text-gray-300">Welcome to the most beautiful cafe</p>
        </div>

        {/* تأثيرات إضافية */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 pointer-events-none">
          <div className="absolute top-0 left-0 w-4 h-4 bg-white rounded-full animate-ping opacity-75"></div>
          <div className="absolute top-1/4 right-0 w-3 h-3 bg-gray-200 rounded-full animate-ping opacity-75" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute bottom-1/4 left-0 w-2 h-2 bg-white rounded-full animate-ping opacity-75" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-0 right-1/4 w-3 h-3 bg-gray-200 rounded-full animate-ping opacity-75" style={{ animationDelay: '1.5s' }}></div>
        </div>
      </div>

      {/* تأثير التلاشي عند الانتهاء */}
      <div 
        className={`absolute inset-0 bg-white transition-opacity duration-500 ${
          progress >= 100 ? 'opacity-100' : 'opacity-0'
        }`}
      ></div>
    </div>
  );
};

export default LoadingPage;
