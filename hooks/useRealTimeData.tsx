'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface RealTimeDataContextType {
  products: any[];
  orders: any[];
  stats: any;
  refreshProducts: () => Promise<void>;
  refreshOrders: () => Promise<void>;
  refreshStats: () => Promise<void>;
  addProduct: (product: any) => Promise<boolean>;
  updateProduct: (id: string, data: any) => Promise<boolean>;
  deleteProduct: (id: string) => Promise<boolean>;
  addOrder: (order: any) => Promise<boolean>;
  updateOrderStatus: (id: string, status: string) => Promise<boolean>;
}

const RealTimeDataContext = createContext<RealTimeDataContextType | undefined>(undefined);

export const useRealTimeData = () => {
  const context = useContext(RealTimeDataContext);
  if (!context) {
    throw new Error('useRealTimeData must be used within a RealTimeDataProvider');
  }
  return context;
};

interface RealTimeDataProviderProps {
  children: ReactNode;
}

export const RealTimeDataProvider: React.FC<RealTimeDataProviderProps> = ({ children }) => {
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({
    totalSales: 0,
    totalProducts: 0,
    todayOrders: 0,
    totalCustomers: 0,
    pendingOrders: 0,
    completedOrders: 0,
    revenue: 0,
    growth: 0
  });

  // جلب المنتجات
  const refreshProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const result = await response.json();
      
      if (result.success) {
        setProducts(result.data);
      }
    } catch (error) {
      console.error('خطأ في جلب المنتجات:', error);
    }
  };

  // جلب الطلبات
  const refreshOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      const result = await response.json();
      
      if (result.success) {
        setOrders(result.data);
      }
    } catch (error) {
      console.error('خطأ في جلب الطلبات:', error);
    }
  };

  // جلب الإحصائيات
  const refreshStats = async () => {
    try {
      const response = await fetch('/api/dashboard/stats');
      const result = await response.json();
      
      if (result.success) {
        setStats(result.data);
      }
    } catch (error) {
      console.error('خطأ في جلب الإحصائيات:', error);
    }
  };

  // إضافة منتج
  const addProduct = async (productData: any): Promise<boolean> => {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setProducts([...products, result.data]);
        await refreshStats(); // تحديث الإحصائيات
        return true;
      }
      return false;
    } catch (error) {
      console.error('خطأ في إضافة المنتج:', error);
      return false;
    }
  };

  // تحديث منتج
  const updateProduct = async (id: string, data: any): Promise<boolean> => {
    try {
      const response = await fetch('/api/products', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, ...data }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setProducts(products.map(product => 
          product.id === id ? result.data : product
        ));
        return true;
      }
      return false;
    } catch (error) {
      console.error('خطأ في تحديث المنتج:', error);
      return false;
    }
  };

  // حذف منتج
  const deleteProduct = async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/products?id=${id}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      
      if (result.success) {
        setProducts(products.filter(product => product.id !== id));
        await refreshStats(); // تحديث الإحصائيات
        return true;
      }
      return false;
    } catch (error) {
      console.error('خطأ في حذف المنتج:', error);
      return false;
    }
  };

  // إضافة طلب
  const addOrder = async (orderData: any): Promise<boolean> => {
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setOrders([result.data, ...orders]);
        await refreshStats(); // تحديث الإحصائيات
        return true;
      }
      return false;
    } catch (error) {
      console.error('خطأ في إضافة الطلب:', error);
      return false;
    }
  };

  // تحديث حالة الطلب
  const updateOrderStatus = async (id: string, status: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/orders', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, status }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setOrders(orders.map(order => 
          order.id === id ? { ...order, status } : order
        ));
        await refreshStats(); // تحديث الإحصائيات
        return true;
      }
      return false;
    } catch (error) {
      console.error('خطأ في تحديث حالة الطلب:', error);
      return false;
    }
  };

  // تحديث البيانات عند التحميل الأولي
  useEffect(() => {
    refreshProducts();
    refreshOrders();
    refreshStats();
    
    // تحديث دوري كل دقيقة
    const interval = setInterval(() => {
      refreshProducts();
      refreshOrders();
      refreshStats();
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const value = {
    products,
    orders,
    stats,
    refreshProducts,
    refreshOrders,
    refreshStats,
    addProduct,
    updateProduct,
    deleteProduct,
    addOrder,
    updateOrderStatus,
  };

  return (
    <RealTimeDataContext.Provider value={value}>
      {children}
    </RealTimeDataContext.Provider>
  );
};
