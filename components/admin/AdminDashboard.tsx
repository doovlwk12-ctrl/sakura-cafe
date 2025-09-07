

'use client';

import React, { useState } from 'react';
import { useAuth } from '../AuthProvider';
import LanguageSwitcher from '../LanguageSwitcher';
import ThemeToggle from '../ThemeToggle';
import UserManagement from './UserManagement';
import { useLanguage } from '../../hooks/LanguageProvider';

const AdminDashboard: React.FC = () => {
  const { logout, user } = useAuth();
  const { t, isRTL } = useLanguage();
  const [activeTab, setActiveTab] = useState('dashboard');

  const tabs = [
    { id: 'dashboard', label: t('admin.dashboard'), icon: '📊' },
    { id: 'products', label: t('admin.products'), icon: '☕' },
    { id: 'orders', label: t('admin.orders'), icon: '📋' },
    { id: 'users', label: t('admin.users'), icon: '👥' },
    { id: 'reports', label: t('admin.reports'), icon: '📈' },
    { id: 'settings', label: t('admin.settings'), icon: '⚙️' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardContent />;
      case 'products':
        return <ProductsContent />;
      case 'orders':
        return <OrdersContent />;
      case 'users':
        return <UsersManagementContent />;
      case 'reports':
        return <ReportsContent />;
      case 'settings':
        return <SettingsContent />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="min-h-screen new-system bg-[#1D453E]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 p-3 md:p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-4">
            <div className="w-6 h-6 md:w-8 md:h-8 rounded-md overflow-hidden">
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
              <h1 className="text-lg md:text-2xl font-bold text-deep-50">مقهى ساكورا</h1>
              <p className="text-deep-50 text-xs md:text-sm">لوحة الإدارة</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1 md:gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <LanguageSwitcher showText={false} />
              <ThemeToggle showText={false} />
            </div>
            <div className="flex items-center gap-1 md:gap-2 text-deep-50">
              <span className="hidden md:inline">مرحباً، {user?.username}</span>
              <button
                onClick={logout}
                className="btn-secondary text-xs md:text-sm px-2 py-1 md:px-4 md:py-2"
              >
                {t('admin.logout')}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-col md:flex-row">
        {/* Mobile Tab Bar */}
        <div className="md:hidden bg-[#254740] overflow-x-auto">
          <nav className="flex space-x-1 p-2" style={{ minWidth: 'max-content' }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-[#C36C72] text-white'
                    : 'text-gray-300 hover:bg-[#2A4842] hover:text-white'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span className="font-medium text-xs">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 bg-[#254740] min-h-screen p-4">
          <nav className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-[#C36C72] text-white'
                    : 'text-gray-300 hover:bg-[#2A4842] hover:text-white'
                }`}
              >
                <span className="text-xl">{tab.icon}</span>
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-3 md:p-6">
          {renderTabContent()}
        </main>
      </div>
    </div>
  );
};

// مكونات المحتوى
const DashboardContent: React.FC = () => (
  <div className="space-y-4 md:space-y-6">
    <h2 className="text-xl md:text-3xl font-bold text-white mb-4 md:mb-6">لوحة التحكم</h2>
    
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
      <div className="card text-center p-3 md:p-6">
        <div className="text-2xl md:text-3xl mb-2">📊</div>
        <h3 className="text-sm md:text-xl font-bold mb-2 text-gray-800">إجمالي المبيعات</h3>
        <p className="text-lg md:text-2xl font-bold text-[#C36C72]">12,450 ريال</p>
      </div>
      
      <div className="card text-center p-3 md:p-6">
        <div className="text-2xl md:text-3xl mb-2">☕</div>
        <h3 className="text-sm md:text-xl font-bold mb-2 text-gray-800">المنتجات</h3>
        <p className="text-lg md:text-2xl font-bold text-[#C36C72]">47</p>
      </div>
      
      <div className="card text-center p-3 md:p-6">
        <div className="text-2xl md:text-3xl mb-2">📋</div>
        <h3 className="text-sm md:text-xl font-bold mb-2 text-gray-800">الطلبات اليوم</h3>
        <p className="text-lg md:text-2xl font-bold text-[#C36C72]">23</p>
      </div>
      
      <div className="card text-center p-3 md:p-6">
        <div className="text-2xl md:text-3xl mb-2">👥</div>
        <h3 className="text-sm md:text-xl font-bold mb-2 text-gray-800">العملاء</h3>
        <p className="text-lg md:text-2xl font-bold text-[#C36C72]">156</p>
      </div>
    </div>

    {/* إضافة قسم الطلبات الحديثة للجوال */}
    <div className="mt-6">
      <h3 className="text-lg md:text-2xl font-bold text-white mb-4">الطلبات الحديثة</h3>
      <div className="card p-4">
        <div className="space-y-3">
          <div className="flex justify-between items-center border-b pb-2">
            <div>
              <p className="font-medium text-gray-800">طلب #1234</p>
              <p className="text-sm text-gray-600">لاتيه + كرواسون</p>
            </div>
            <div className="text-left">
              <p className="font-bold text-[#C36C72]">25 ريال</p>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">جاهز</span>
            </div>
          </div>
          <div className="flex justify-between items-center border-b pb-2">
            <div>
              <p className="font-medium text-gray-800">طلب #1235</p>
              <p className="text-sm text-gray-600">كابتشينو + براوني</p>
            </div>
            <div className="text-left">
              <p className="font-bold text-[#C36C72]">30 ريال</p>
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">قيد التحضير</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const ProductsContent: React.FC = () => (
  <div className="space-y-4 md:space-y-6">
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <h2 className="text-xl md:text-3xl font-bold text-white">إدارة المنتجات</h2>
      <button className="btn-primary w-full sm:w-auto text-sm md:text-base px-4 py-2">إضافة منتج جديد</button>
    </div>
    
    <div className="card p-4 md:p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* منتج تجريبي */}
        <div className="border rounded-lg p-3 hover:shadow-md transition-shadow">
          <div className="w-full h-32 bg-gray-200 rounded mb-3 flex items-center justify-center">
            <span className="text-gray-500">☕</span>
          </div>
          <h4 className="font-bold text-gray-800 mb-1">لاتيه</h4>
          <p className="text-sm text-gray-600 mb-2">قهوة لاتيه مع حليب مبخر</p>
          <div className="flex justify-between items-center">
            <span className="font-bold text-[#C36C72]">18 ريال</span>
            <div className="flex gap-1">
              <button className="text-blue-600 text-sm">تعديل</button>
              <button className="text-red-600 text-sm">حذف</button>
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg p-3 hover:shadow-md transition-shadow">
          <div className="w-full h-32 bg-gray-200 rounded mb-3 flex items-center justify-center">
            <span className="text-gray-500">🥐</span>
          </div>
          <h4 className="font-bold text-gray-800 mb-1">كرواسون</h4>
          <p className="text-sm text-gray-600 mb-2">كرواسون فرنسي طازج</p>
          <div className="flex justify-between items-center">
            <span className="font-bold text-[#C36C72]">12 ريال</span>
            <div className="flex gap-1">
              <button className="text-blue-600 text-sm">تعديل</button>
              <button className="text-red-600 text-sm">حذف</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const OrdersContent: React.FC = () => (
  <div className="space-y-6">
    <h2 className="text-3xl font-bold text-white">إدارة الطلبات</h2>
    
    <div className="card">
      <p className="text-center text-gray-500 py-8">
        قائمة الطلبات ستظهر هنا
      </p>
    </div>
  </div>
);

const UsersContent: React.FC = () => (
  <div className="space-y-6">
    <h2 className="text-3xl font-bold text-white">إدارة المستخدمين</h2>
    
    <div className="card">
      <p className="text-center text-gray-500 py-8">
        قائمة المستخدمين ستظهر هنا
      </p>
    </div>
  </div>
);

const ReportsContent: React.FC = () => (
  <div className="space-y-6">
    <h2 className="text-3xl font-bold text-white">التقارير</h2>
    
    <div className="card">
      <p className="text-center text-gray-500 py-8">
        التقارير ستظهر هنا
      </p>
    </div>
  </div>
);

const UsersManagementContent: React.FC = () => (
  <div className="space-y-6">
    <UserManagement />
  </div>
);

const SettingsContent: React.FC = () => (
  <div className="space-y-6">
    <h2 className="text-3xl font-bold text-white">الإعدادات</h2>
    
    <div className="card">
      <p className="text-center text-gray-500 py-8">
        إعدادات النظام ستظهر هنا
      </p>
    </div>
  </div>
);

export default AdminDashboard;
