'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthProvider';
import LanguageSwitcher from '../LanguageSwitcher';
import ThemeToggle from '../ThemeToggle';
import UserManagement from './UserManagement';
import AdvancedReports from './AdvancedReports';
import InventoryManagement from './InventoryManagement';
import RealTimeNotifications from '../RealTimeNotifications';
import { useLanguage } from '../../hooks/LanguageProvider';
import { useProducts } from '../../hooks/useProducts';
import { productImages } from '../../data/productImages';

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
    { id: 'inventory', label: t('admin.inventory'), icon: '📦' },
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
        return <AdvancedReports />;
      case 'inventory':
        return <InventoryManagement />;
      case 'settings':
        return <SettingsContent />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="min-h-screen bg-[#fefefe] dark:bg-[#111827] transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-[#1f2937] border-b border-gray-200 dark:border-[#374151] p-3 md:p-4 transition-colors duration-300">
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
              <h1 className="text-lg md:text-2xl font-bold text-[#1f2937] dark:text-[#f9fafb] font-arabic">مقهى ساكورا</h1>
              <p className="text-[#6b7280] dark:text-[#9ca3af] text-xs md:text-sm font-arabic">لوحة الإدارة</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1 md:gap-3">
            <div className="hidden sm:flex items-center gap-2">
              <RealTimeNotifications userRole="admin" />
              <LanguageSwitcher showText={false} />
              <ThemeToggle showText={false} />
            </div>
            <div className="flex items-center gap-1 md:gap-2 text-[#1f2937] dark:text-[#f9fafb]">
              <span className="hidden md:inline font-arabic">مرحباً، {user?.username}</span>
              <button
                onClick={logout}
                className="bg-[#e57373] hover:bg-[#f28b82] text-white text-xs md:text-sm px-2 py-1 md:px-4 md:py-2 rounded-lg transition-colors duration-300 font-arabic"
              >
                {t('admin.logout')}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-col md:flex-row">
        {/* Mobile Tab Bar */}
        <div className="md:hidden bg-[#ffffff] dark:bg-[#1f2937] border-b border-gray-200 dark:border-[#374151] overflow-x-auto transition-colors duration-300">
          <nav className="flex space-x-1 p-2" style={{ minWidth: 'max-content' }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-[#e57373] text-white'
                    : 'text-[#6b7280] dark:text-[#9ca3af] hover:bg-[#fce7e7] dark:hover:bg-[#374151] hover:text-[#1f2937] dark:hover:text-[#f9fafb]'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span className="font-medium text-xs font-arabic">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 bg-[#ffffff] dark:bg-[#1f2937] border-r border-gray-200 dark:border-[#374151] min-h-screen p-4 transition-colors duration-300">
          <nav className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-[#e57373] text-white'
                    : 'text-[#6b7280] dark:text-[#9ca3af] hover:bg-[#fce7e7] dark:hover:bg-[#374151] hover:text-[#1f2937] dark:hover:text-[#f9fafb]'
                }`}
              >
                <span className="text-xl">{tab.icon}</span>
                <span className="font-medium font-arabic">{tab.label}</span>
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
const DashboardContent: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const [stats, setStats] = useState({
    totalSales: 12450,
    totalProducts: 47,
    todayOrders: 23,
    totalCustomers: 156,
    pendingOrders: 8,
    completedOrders: 15,
    revenue: 3450,
    growth: 12.5
  });

  const [recentOrders, setRecentOrders] = useState([
    {
      id: '1234',
      customer: 'أحمد محمد',
      items: 'لاتيه + كرواسون',
      amount: 25,
      status: 'ready',
      time: '10:30 ص'
    },
    {
      id: '1235',
      customer: 'فاطمة علي',
      items: 'كابتشينو + براوني',
      amount: 30,
      status: 'preparing',
      time: '10:15 ص'
    },
    {
      id: '1236',
      customer: 'محمد السعد',
      items: 'أمريكانو + كيك',
      amount: 22,
      status: 'pending',
      time: '10:00 ص'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready':
        return 'bg-green-100 text-green-800';
      case 'preparing':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ready':
        return 'جاهز';
      case 'preparing':
        return 'قيد التحضير';
      case 'pending':
        return 'في الانتظار';
      default:
        return 'غير محدد';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#1f2937] dark:text-[#f9fafb] font-arabic">
            لوحة التحكم
          </h2>
          <p className="text-[#6b7280] dark:text-[#9ca3af] font-arabic">
            نظرة عامة على أداء المقهى
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-sm text-[#6b7280] dark:text-[#9ca3af] font-arabic">
            آخر تحديث: {new Date().toLocaleTimeString('ar-SA')}
          </div>
          <button className="px-3 py-1 bg-[#e57373] hover:bg-[#f28b82] text-white rounded-lg text-sm transition-colors font-arabic">
            تحديث
          </button>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#1f2937] border border-gray-200 dark:border-[#374151] rounded-xl p-4 hover:shadow-lg transition-all duration-300 text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-white text-xl">💰</span>
          </div>
          <h3 className="text-sm font-bold mb-2 text-[#1f2937] dark:text-[#f9fafb] font-arabic">
            إجمالي المبيعات
          </h3>
          <p className="text-xl font-bold text-[#e57373]">
            {stats.totalSales.toLocaleString()} ريال
          </p>
          <p className="text-xs text-green-600 mt-1">
            +{stats.growth}% من الشهر الماضي
          </p>
        </div>
        
        <div className="bg-white dark:bg-[#1f2937] border border-gray-200 dark:border-[#374151] rounded-xl p-4 hover:shadow-lg transition-all duration-300 text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-white text-xl">☕</span>
          </div>
          <h3 className="text-sm font-bold mb-2 text-[#1f2937] dark:text-[#f9fafb] font-arabic">
            المنتجات
          </h3>
          <p className="text-xl font-bold text-[#e57373]">
            {stats.totalProducts}
          </p>
          <p className="text-xs text-[#6b7280] dark:text-[#9ca3af] mt-1">
            منتج نشط
          </p>
        </div>
        
        <div className="bg-white dark:bg-[#1f2937] border border-gray-200 dark:border-[#374151] rounded-xl p-4 hover:shadow-lg transition-all duration-300 text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-white text-xl">📋</span>
          </div>
          <h3 className="text-sm font-bold mb-2 text-[#1f2937] dark:text-[#f9fafb] font-arabic">
            الطلبات اليوم
          </h3>
          <p className="text-xl font-bold text-[#e57373]">
            {stats.todayOrders}
          </p>
          <p className="text-xs text-[#6b7280] dark:text-[#9ca3af] mt-1">
            {stats.pendingOrders} في الانتظار
          </p>
        </div>
        
        <div className="bg-white dark:bg-[#1f2937] border border-gray-200 dark:border-[#374151] rounded-xl p-4 hover:shadow-lg transition-all duration-300 text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-white text-xl">👥</span>
          </div>
          <h3 className="text-sm font-bold mb-2 text-[#1f2937] dark:text-[#f9fafb] font-arabic">
            العملاء
          </h3>
          <p className="text-xl font-bold text-[#e57373]">
            {stats.totalCustomers}
          </p>
          <p className="text-xs text-[#6b7280] dark:text-[#9ca3af] mt-1">
            عميل مسجل
          </p>
        </div>
      </div>
      
      {/* Charts and Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white font-arabic mb-4">
            الإيرادات اليومية
          </h3>
          <div className="h-64 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-sakura-50/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-sakura-50 text-2xl">📈</span>
              </div>
              <p className="text-gray-500 font-arabic">
                مخطط الإيرادات سيظهر هنا
              </p>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white font-arabic">
              الطلبات الحديثة
            </h3>
            <button className="text-sakura-50 hover:text-sakura-100 text-sm font-arabic">
              عرض الكل
            </button>
          </div>
          
          <div className="space-y-3">
            {recentOrders.map((order, index) => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-gray-800 dark:text-white">
                      #{order.id}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-arabic">
                    {order.customer}
                  </p>
                  <p className="text-xs text-gray-500 font-arabic">
                    {order.items}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sakura-50">
                    {order.amount} ريال
                  </p>
                  <p className="text-xs text-gray-500">
                    {order.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white font-arabic mb-4">
          إجراءات سريعة
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-lg hover:from-green-500 hover:to-green-700 transition-all duration-300 hover:scale-105">
            <div className="text-2xl mb-2">➕</div>
            <div className="text-sm font-arabic">إضافة منتج</div>
          </button>
          <button className="p-4 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-lg hover:from-blue-500 hover:to-blue-700 transition-all duration-300 hover:scale-105">
            <div className="text-2xl mb-2">📋</div>
            <div className="text-sm font-arabic">طلب جديد</div>
          </button>
          <button className="p-4 bg-gradient-to-r from-purple-400 to-purple-600 text-white rounded-lg hover:from-purple-500 hover:to-purple-700 transition-all duration-300 hover:scale-105">
            <div className="text-2xl mb-2">👥</div>
            <div className="text-sm font-arabic">إدارة العملاء</div>
          </button>
          <button className="p-4 bg-gradient-to-r from-orange-400 to-orange-600 text-white rounded-lg hover:from-orange-500 hover:to-orange-700 transition-all duration-300 hover:scale-105">
            <div className="text-2xl mb-2">📊</div>
            <div className="text-sm font-arabic">التقارير</div>
          </button>
        </div>
      </div>
    </div>
  );
};

const ProductsContent: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // جلب المنتجات من قاعدة البيانات أو استخدام المنتجات المحلية
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // تحويل منتجات productImages إلى تنسيق مناسب للإدارة
        const formattedProducts = productImages.map(product => ({
          id: product.id,
          name: product.englishName,
          nameAr: product.arabicName,
          description: `Delicious ${product.englishName}`,
          descriptionAr: `${product.arabicName} لذيذ`,
          category: product.category,
          price: product.price,
          calories: product.calories,
          imagePath: product.imagePath,
          status: 'active',
          stock: Math.floor(Math.random() * 100) + 10, // مخزون عشوائي للعرض
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }));
        
        setProducts(formattedProducts);
      } catch (error) {
        console.error('خطأ في جلب المنتجات:', error);
        setError('فشل في تحميل المنتجات');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All', nameAr: 'الكل' },
    { id: 'drinks', name: 'Drinks', nameAr: 'المشروبات' },
    { id: 'sweets', name: 'Sweets', nameAr: 'الحلويات' },
    { id: 'sandwiches', name: 'Sandwiches', nameAr: 'الساندويتشات' },
    { id: 'groups', name: 'Groups', nameAr: 'المجموعات' }
  ];

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  const getCategoryName = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return isRTL ? cat?.nameAr : cat?.name;
  };

  const getProductName = (product: any) => {
    return isRTL ? product.nameAr : product.name;
  };

  const getProductDescription = (product: any) => {
    return isRTL ? product.descriptionAr : product.description;
  };

  // حالة التحميل
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e57373] mx-auto mb-4"></div>
            <p className="text-[#6b7280] dark:text-[#9ca3af] font-arabic">{t('admin.products.loading')}</p>
          </div>
        </div>
      </div>
    );
  }

  // حالة الخطأ
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <p className="text-red-500 font-arabic">{t('admin.products.error')}: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
          <h2 className="text-2xl md:text-3xl font-bold text-white font-arabic">
            {t('admin.products.manage')}
          </h2>
          <p className="text-gray-300 font-arabic">
            {t('admin.products.addNew')} ({products.length} {t('admin.products.count')})
          </p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="button-primary w-full sm:w-auto"
        >
          {t('admin.products.addNew')}
        </button>
      </div>

      {/* Filters */}
      <div className="glass-card p-4">
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-sakura-50 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {isRTL ? category.nameAr : category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div key={product.id} className="glass-card p-4 hover-lift">
            <div className="relative">
              <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                {product.imagePath ? (
                  <img 
                    src={product.imagePath} 
                    alt={getProductName(product)}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/images/fallback.svg';
                    }}
                  />
                ) : (
                  <span className="text-gray-500 text-4xl">☕</span>
                )}
              </div>
              
              {/* Status Badge */}
              <div className="absolute top-2 right-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  product.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {product.status === 'active' ? t('admin.products.status.active') : t('admin.products.status.inactive')}
                </span>
              </div>

              {/* Stock Badge */}
              <div className="absolute top-2 left-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                  {product.stock} {t('admin.products.stock')}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <h4 className="font-bold text-gray-800 dark:text-white text-lg font-arabic">
                  {getProductName(product)}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-arabic">
                  {getProductDescription(product)}
                </p>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 font-arabic">
                  {getCategoryName(product.category)}
                </span>
                <span className="text-gray-500">
                  {product.calories} {t('admin.products.calories')}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-sakura-50">
                  {product.price} {t('admin.products.price')}
                </span>
                <div className="flex gap-2">
                  <button className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors">
                    <span className="text-sm">✏️</span>
                  </button>
                  <button className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors">
                    <span className="text-sm">🗑️</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="glass-card p-12 text-center">
          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-gray-500 text-2xl">☕</span>
          </div>
          <h3 className="text-lg font-bold text-gray-800 dark:text-white font-arabic mb-2">
            لا توجد منتجات
          </h3>
          <p className="text-gray-600 dark:text-gray-400 font-arabic mb-4">
            {selectedCategory === 'all' 
              ? 'لم يتم إضافة أي منتجات بعد'
              : `لا توجد منتجات في فئة ${getCategoryName(selectedCategory)}`
            }
          </p>
          <button 
            onClick={() => setShowAddModal(true)}
            className="button-primary"
          >
            إضافة منتج جديد
          </button>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="glass-card p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white font-arabic">
                إضافة منتج جديد
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 font-arabic mb-2">
                    اسم المنتج (عربي)
                  </label>
                  <input 
                    type="text" 
                    className="input-field"
                    placeholder="أدخل اسم المنتج بالعربية"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 font-arabic mb-2">
                    اسم المنتج (إنجليزي)
                  </label>
                  <input 
                    type="text" 
                    className="input-field"
                    placeholder="Enter product name in English"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 font-arabic mb-2">
                    الفئة
                  </label>
                  <select className="input-field">
                    <option value="">اختر الفئة</option>
                    {categories.slice(1).map(category => (
                      <option key={category.id} value={category.id}>
                        {isRTL ? category.nameAr : category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 font-arabic mb-2">
                    السعر (ريال)
                  </label>
                  <input 
                    type="number" 
                    className="input-field"
                    placeholder="0.00"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 font-arabic mb-2">
                    السعرات الحرارية
                  </label>
                  <input 
                    type="number" 
                    className="input-field"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 font-arabic mb-2">
                    الكمية المتوفرة
                  </label>
                  <input 
                    type="number" 
                    className="input-field"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 font-arabic mb-2">
                  الوصف (عربي)
                </label>
                <textarea 
                  className="input-field"
                  rows={3}
                  placeholder="أدخل وصف المنتج بالعربية"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 font-arabic mb-2">
                  الوصف (إنجليزي)
                </label>
                <textarea 
                  className="input-field"
                  rows={3}
                  placeholder="Enter product description in English"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 font-arabic mb-2">
                  صورة المنتج
                </label>
                <input 
                  type="file" 
                  accept="image/*"
                  className="input-field"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="button-outline flex-1"
                >
                  إلغاء
                </button>
                <button 
                  type="submit"
                  className="button-primary flex-1"
                >
                  إضافة المنتج
                </button>
            </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const OrdersContent: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const [orders, setOrders] = useState([
    {
      id: '1234',
      customerName: 'أحمد محمد',
      customerPhone: '+966501234567',
      items: [
        { name: 'لاتيه', quantity: 2, price: 18 },
        { name: 'كرواسون', quantity: 1, price: 12 }
      ],
      total: 48,
      status: 'preparing',
      orderType: 'pickup',
      branch: 'فرع صديان',
      createdAt: new Date('2024-01-15T10:30:00'),
      estimatedTime: 15
    },
    {
      id: '1235',
      customerName: 'فاطمة علي',
      customerPhone: '+966501234568',
      items: [
        { name: 'كابتشينو', quantity: 1, price: 16 },
        { name: 'براوني', quantity: 1, price: 14 }
      ],
      total: 30,
      status: 'ready',
      orderType: 'delivery',
      branch: 'فرع النقرة',
      createdAt: new Date('2024-01-15T10:15:00'),
      estimatedTime: 0
    },
    {
      id: '1236',
      customerName: 'محمد السعد',
      customerPhone: '+966501234569',
      items: [
        { name: 'أمريكانو', quantity: 1, price: 14 },
        { name: 'كيك', quantity: 1, price: 8 }
      ],
      total: 22,
      status: 'pending',
      orderType: 'pickup',
      branch: 'فرع الجامعيين',
      createdAt: new Date('2024-01-15T10:00:00'),
      estimatedTime: 20
    }
  ]);

  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const statuses = [
    { id: 'all', name: 'الكل', nameAr: 'الكل', color: 'gray' },
    { id: 'pending', name: 'في الانتظار', nameAr: 'في الانتظار', color: 'blue' },
    { id: 'preparing', name: 'قيد التحضير', nameAr: 'قيد التحضير', color: 'yellow' },
    { id: 'ready', name: 'جاهز', nameAr: 'جاهز', color: 'green' },
    { id: 'delivered', name: 'تم التوصيل', nameAr: 'تم التوصيل', color: 'purple' },
    { id: 'cancelled', name: 'ملغي', nameAr: 'ملغي', color: 'red' }
  ];

  const filteredOrders = selectedStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === selectedStatus);

  const getStatusColor = (status: string) => {
    const statusObj = statuses.find(s => s.id === status);
    switch (statusObj?.color) {
      case 'blue':
        return 'bg-blue-100 text-blue-800';
      case 'yellow':
        return 'bg-yellow-100 text-yellow-800';
      case 'green':
        return 'bg-green-100 text-green-800';
      case 'purple':
        return 'bg-purple-100 text-purple-800';
      case 'red':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusName = (status: string) => {
    const statusObj = statuses.find(s => s.id === status);
    return isRTL ? statusObj?.nameAr : statusObj?.name;
  };

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ar-SA', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-white font-arabic">
            إدارة الطلبات
          </h2>
          <p className="text-gray-300 font-arabic">
            تتبع وإدارة جميع الطلبات
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-300 font-arabic">
            إجمالي الطلبات: {orders.length}
          </span>
        </div>
      </div>

      {/* Status Filters */}
      <div className="glass-card p-4">
        <div className="flex flex-wrap gap-2">
          {statuses.map(status => (
            <button
              key={status.id}
              onClick={() => setSelectedStatus(status.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedStatus === status.id
                  ? 'bg-sakura-50 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {isRTL ? status.nameAr : status.name}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <div key={order.id} className="glass-card p-6 hover-lift">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                      #{order.id}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-arabic">
                      {order.customerName}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {getStatusName(order.status)}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 font-arabic">
                      <span className="font-medium">الهاتف:</span> {order.customerPhone}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 font-arabic">
                      <span className="font-medium">الفرع:</span> {order.branch}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 font-arabic">
                      <span className="font-medium">نوع الطلب:</span> {order.orderType === 'pickup' ? 'استلام' : 'توصيل'}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 font-arabic">
                      <span className="font-medium">الوقت:</span> {formatTime(order.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 font-arabic mb-2">
                    المنتجات:
                  </p>
                  <div className="space-y-1">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400 font-arabic">
                          {item.quantity}x {item.name}
                        </span>
                        <span className="text-gray-800 dark:text-white">
                          {item.price * item.quantity} ريال
                        </span>
                      </div>
                    ))}
      </div>
    </div>
  </div>

              <div className="flex flex-col items-end gap-3">
                <div className="text-right">
                  <p className="text-2xl font-bold text-sakura-50">
                    {order.total} ريال
                  </p>
                  {order.estimatedTime > 0 && (
                    <p className="text-sm text-gray-500 font-arabic">
                      متوقع خلال {order.estimatedTime} دقيقة
                    </p>
                  )}
    </div>
    
                <div className="flex gap-2">
                  {order.status === 'pending' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'preparing')}
                      className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-lg text-sm hover:bg-yellow-200 transition-colors font-arabic"
                    >
                      بدء التحضير
                    </button>
                  )}
                  {order.status === 'preparing' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'ready')}
                      className="px-3 py-1 bg-green-100 text-green-800 rounded-lg text-sm hover:bg-green-200 transition-colors font-arabic"
                    >
                      جاهز
                    </button>
                  )}
                  {order.status === 'ready' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'delivered')}
                      className="px-3 py-1 bg-purple-100 text-purple-800 rounded-lg text-sm hover:bg-purple-200 transition-colors font-arabic"
                    >
                      تم التوصيل
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm hover:bg-blue-200 transition-colors font-arabic"
                  >
                    تفاصيل
                  </button>
                </div>
          </div>
            </div>
          </div>
        ))}
        </div>
        
      {/* Empty State */}
      {filteredOrders.length === 0 && (
        <div className="glass-card p-12 text-center">
          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-gray-500 text-2xl">📋</span>
          </div>
          <h3 className="text-lg font-bold text-gray-800 dark:text-white font-arabic mb-2">
            لا توجد طلبات
          </h3>
          <p className="text-gray-600 dark:text-gray-400 font-arabic">
            {selectedStatus === 'all' 
              ? 'لم يتم إضافة أي طلبات بعد'
              : `لا توجد طلبات بحالة ${getStatusName(selectedStatus)}`
            }
          </p>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="glass-card p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white font-arabic">
                تفاصيل الطلب #{selectedOrder.id}
              </h3>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 font-arabic mb-2">
                    معلومات العميل
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-arabic">
                    الاسم: {selectedOrder.customerName}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-arabic">
                    الهاتف: {selectedOrder.customerPhone}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 font-arabic mb-2">
                    معلومات الطلب
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-arabic">
                    الفرع: {selectedOrder.branch}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-arabic">
                    النوع: {selectedOrder.orderType === 'pickup' ? 'استلام' : 'توصيل'}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-700 dark:text-gray-300 font-arabic mb-2">
                  المنتجات
                </h4>
                <div className="space-y-2">
                  {selectedOrder.items.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-800 dark:text-white font-arabic">
                          {item.name}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          الكمية: {item.quantity}
                        </p>
                      </div>
                      <p className="font-bold text-sakura-50">
                        {item.price * item.quantity} ريال
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-800 dark:text-white font-arabic">
                    المجموع الكلي:
                  </span>
                  <span className="text-2xl font-bold text-sakura-50">
                    {selectedOrder.total} ريال
                  </span>
            </div>
          </div>
        </div>
      </div>
    </div>
      )}
  </div>
);
};

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
