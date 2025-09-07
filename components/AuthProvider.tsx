'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../utils/apiClient';

interface User {
  id: string;
  username: string;
  role: 'customer' | 'admin' | 'cashier';
  branchId?: string;
  branchName?: string;
  fullName: string;
  phone?: string;
  email?: string;
  joinDate?: string;
  loyaltyPoints?: number;
  totalOrders?: number;
  favoriteItems?: string[];
  preferences?: {
    notifications: boolean;
    offers: boolean;
    newsletter: boolean;
  };
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  login: (username: string, password: string, userType: 'customer' | 'admin' | 'cashier') => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  updateUserPoints: (points: number) => void;
}

interface RegisterData {
  username: string;
  password: string;
  fullName: string;
  phone: string;
  email: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// قاعدة بيانات وهمية للمستخدمين
const mockUsers: User[] = [
  // الإدمن العام
  {
    id: 'admin-001',
    username: 'admin',
    role: 'admin',
    fullName: 'مدير النظام',
    phone: '+966500000001',
    email: 'admin@sakuracafe.com'
  },
  // كاشيرات الفروع
  {
    id: 'cashier-sadiyan',
    username: 'cashier_sadiyan',
    role: 'cashier',
    branchId: 'branch-001',
    branchName: 'فرع صديان',
    fullName: 'كاشير فرع صديان',
    phone: '+966500000002'
  },
  {
    id: 'cashier-alnuqrah',
    username: 'cashier_alnuqrah',
    role: 'cashier',
    branchId: 'branch-002',
    branchName: 'فرع النقرة',
    fullName: 'كاشير فرع النقرة',
    phone: '+966500000003'
  },
  {
    id: 'cashier-aljameen',
    username: 'cashier_aljameen',
    role: 'cashier',
    branchId: 'branch-003',
    branchName: 'فرع الجامعيين',
    fullName: 'كاشير فرع الجامعيين',
    phone: '+966500000004'
  },
  {
    id: 'cashier-almadina',
    username: 'cashier_almadina',
    role: 'cashier',
    branchId: 'branch-004',
    branchName: 'فرع طريق المدينة',
    fullName: 'كاشير فرع طريق المدينة',
    phone: '+966500000005'
  },
  {
    id: 'cashier-alrajihi',
    username: 'cashier_alrajihi',
    role: 'cashier',
    branchId: 'branch-005',
    branchName: 'فرع شارع الراجحي',
    fullName: 'كاشير فرع شارع الراجحي',
    phone: '+966500000006'
  },
  {
    id: 'cashier-alwadi',
    username: 'cashier_alwadi',
    role: 'cashier',
    branchId: 'branch-006',
    branchName: 'فرع الوادي',
    fullName: 'كاشير فرع الوادي',
    phone: '+966500000007'
  },
  // عملاء تجريبيين
  {
    id: 'customer-001',
    username: 'ahmed_salem',
    role: 'customer',
    fullName: 'أحمد سالم',
    phone: '+966501234567',
    email: 'ahmed@example.com',
    joinDate: '2024-01-15',
    loyaltyPoints: 250,
    totalOrders: 12,
    favoriteItems: ['latte', 'croissant', 'tiramisu'],
    preferences: {
      notifications: true,
      offers: true,
      newsletter: true
    }
  },
  {
    id: 'customer-002',
    username: 'sara_ali',
    role: 'customer',
    fullName: 'سارة علي',
    phone: '+966507654321',
    email: 'sara@example.com',
    joinDate: '2024-02-20',
    loyaltyPoints: 180,
    totalOrders: 8,
    favoriteItems: ['cappuccino', 'cheesecake'],
    preferences: {
      notifications: true,
      offers: false,
      newsletter: true
    }
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // فحص حالة المصادقة المحفوظة
    try {
      const token = localStorage.getItem('user_token');
      const savedUser = localStorage.getItem('user_data');
      if (token && savedUser) {
        const userData = JSON.parse(savedUser);
        setIsAuthenticated(true);
        setUser(userData);
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (username: string, password: string, userType: 'customer' | 'admin' | 'cashier') => {
    try {
      // محاولة الاتصال بالـ API الحقيقي أولاً
      const response = await authAPI.login({ username, password, userType });
      const { token, user } = response.data;
      
      // حفظ بيانات المستخدم
      localStorage.setItem('user_token', token);
      localStorage.setItem('user_data', JSON.stringify(user));
      
      setIsAuthenticated(true);
      setUser(user);
      
      return;
    } catch (error) {
      // في حالة فشل الاتصال بالـ API، استخدام البيانات الوهمية كـ fallback
      console.warn('API connection failed, using mock data:', error);
      
      const foundUser = mockUsers.find(u => 
        u.username === username && u.role === userType
      );

      if (!foundUser) {
        throw new Error('اسم المستخدم غير موجود');
      }

      // كلمات مرور افتراضية (في التطبيق الحقيقي ستكون مشفرة)
      let validPassword = false;
      switch (userType) {
        case 'admin':
          validPassword = password === 'admin123';
          break;
        case 'cashier':
          validPassword = password === 'cashier123';
          break;
        case 'customer':
          validPassword = password === 'customer123';
          break;
      }

      if (!validPassword) {
        throw new Error('كلمة المرور غير صحيحة');
      }

      // حفظ بيانات المستخدم
      const token = `${userType}_token_${Date.now()}`;
      localStorage.setItem('user_token', token);
      localStorage.setItem('user_data', JSON.stringify(foundUser));
      
      setIsAuthenticated(true);
      setUser(foundUser);
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      // محاولة التسجيل عبر الـ API الحقيقي أولاً
      const response = await authAPI.register(userData);
      const { token, user } = response.data;
      
      // حفظ بيانات المستخدم
      localStorage.setItem('user_token', token);
      localStorage.setItem('user_data', JSON.stringify(user));
      
      setIsAuthenticated(true);
      setUser(user);
      
      return;
    } catch (error) {
      // في حالة فشل الاتصال بالـ API، استخدام البيانات الوهمية كـ fallback
      console.warn('API connection failed, using mock data:', error);
      
      // التحقق من عدم وجود المستخدم مسبقاً
      const existingUser = mockUsers.find(u => 
        u.username === userData.username || u.email === userData.email
      );

      if (existingUser) {
        throw new Error('اسم المستخدم أو البريد الإلكتروني موجود مسبقاً');
      }

      // إنشاء مستخدم جديد
      const newUser: User = {
        id: `customer-${Date.now()}`,
        username: userData.username,
        role: 'customer',
        fullName: userData.fullName,
        phone: userData.phone,
        email: userData.email,
        joinDate: new Date().toISOString().split('T')[0],
        loyaltyPoints: 50, // نقاط ترحيب
        totalOrders: 0,
        favoriteItems: [],
        preferences: {
          notifications: true,
          offers: true,
          newsletter: true
        }
      };

      // إضافة المستخدم إلى قاعدة البيانات الوهمية
      mockUsers.push(newUser);

      // تسجيل دخول تلقائي
      const token = `customer_token_${Date.now()}`;
      localStorage.setItem('user_token', token);
      localStorage.setItem('user_data', JSON.stringify(newUser));
      
      setIsAuthenticated(true);
      setUser(newUser);
    }
  };

  const updateUserPoints = (points: number) => {
    if (user && user.role === 'customer') {
      const updatedUser = {
        ...user,
        loyaltyPoints: (user.loyaltyPoints || 0) + points
      };
      setUser(updatedUser);
      localStorage.setItem('user_data', JSON.stringify(updatedUser));
    }
  };

  const logout = () => {
    localStorage.removeItem('user_token');
    localStorage.removeItem('user_data');
    setIsAuthenticated(false);
    setUser(null);
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;

    switch (user.role) {
      case 'admin':
        return true; // الإدمن له كامل الصلاحيات
      case 'cashier':
        // صلاحيات الكاشير
        return [
          'pos_access',
          'view_orders',
          'create_orders',
          'view_products',
          'view_branch_reports'
        ].includes(permission);
      case 'customer':
        // صلاحيات العميل
        return [
          'view_menu',
          'place_order',
          'view_own_orders',
          'update_profile'
        ].includes(permission);
      default:
        return false;
    }
  };

  const value = {
    isAuthenticated,
    isLoading,
    user,
    login,
    register,
    logout,
    hasPermission,
    updateUserPoints
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
