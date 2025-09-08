'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AdvancedReports from '../../components/admin/AdvancedReports';
import InventoryManagement from '../../components/admin/InventoryManagement';
import RealTimeNotifications from '../../components/RealTimeNotifications';
import { useLanguage } from '../../hooks/LanguageProvider';
import { useTheme } from '../../hooks/useTheme';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import ThemeToggle from '../../components/ThemeToggle';

const TestFeaturesPage: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState('reports');

  const tabs = [
    { id: 'reports', label: 'التقارير المتقدمة', icon: '📊' },
    { id: 'inventory', label: 'إدارة المخزون', icon: '📦' },
    { id: 'notifications', label: 'الإشعارات', icon: '🔔' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'reports':
        return <AdvancedReports />;
      case 'inventory':
        return <InventoryManagement />;
      case 'notifications':
        return (
          <div className="space-y-6">
            <div className="bg-white dark:bg-[#1f2937] border border-gray-200 dark:border-[#374151] rounded-xl p-6">
              <h3 className="text-xl font-bold text-[#1f2937] dark:text-[#f9fafb] font-arabic mb-4">
                اختبار الإشعارات
              </h3>
              <p className="text-[#6b7280] dark:text-[#9ca3af] font-arabic mb-4">
                اضغط على أيقونة الجرس في الشريط العلوي لاختبار الإشعارات
              </p>
              <div className="flex items-center gap-4">
                <RealTimeNotifications userRole="admin" />
                <span className="text-[#6b7280] dark:text-[#9ca3af] font-arabic">
                  ← اضغط هنا لاختبار الإشعارات
                </span>
              </div>
            </div>
          </div>
        );
      default:
        return <AdvancedReports />;
    }
  };

  return (
    <div className="min-h-screen bg-[#fefefe] dark:bg-[#111827] transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-[#1f2937] border-b border-gray-200 dark:border-[#374151] p-4 transition-colors duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-md overflow-hidden">
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
            <div>
              <h1 className="text-xl font-bold text-[#1f2937] dark:text-[#f9fafb] font-arabic">
                اختبار المميزات الجديدة
              </h1>
              <p className="text-[#6b7280] dark:text-[#9ca3af] text-sm font-arabic">
                صفحة اختبار المميزات المتقدمة
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <RealTimeNotifications userRole="admin" />
            <LanguageSwitcher showText={false} />
            <ThemeToggle showText={false} />
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white dark:bg-[#1f2937] border-r border-gray-200 dark:border-[#374151] min-h-screen transition-colors duration-300">
          <nav className="p-4">
            <div className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-right ${
                    activeTab === tab.id
                      ? 'bg-[#e57373] text-white'
                      : 'text-[#6b7280] dark:text-[#9ca3af] hover:bg-[#fce7e7] dark:hover:bg-[#374151]'
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span className="font-arabic">{tab.label}</span>
                </button>
              ))}
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderTabContent()}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TestFeaturesPage;
