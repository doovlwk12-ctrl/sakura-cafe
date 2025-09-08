'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '../components/AuthProvider';
import { ordersAPI } from '../utils/apiClient';

export interface OrderItem {
  id: string;
  name: string;
  arabicName: string;
  price: number;
  quantity: number;
  image: string;
  customizations?: {
    size?: 'small' | 'medium' | 'large';
    extras?: string[];
    notes?: string;
  };
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  paymentMethod: 'cash' | 'card' | 'wallet';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  branchId?: string;
  branchName?: string;
  orderType: 'pickup' | 'delivery';
  deliveryAddress?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  estimatedTime?: number; // minutes
  barcode: string;
  loyaltyPointsEarned: number;
  loyaltyPointsUsed: number;
}

interface OrdersContextType {
  orders: Order[];
  createOrder: (orderData: Partial<Order>) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  getOrderById: (orderId: string) => Order | undefined;
  getOrdersByCustomer: (customerId: string) => Order[];
  getOrdersByBranch: (branchId: string) => Order[];
  getPendingOrders: () => Order[];
  generateBarcode: () => string;
  cancelOrder: (orderId: string, reason?: string) => Promise<void>;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export const useOrders = () => {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrdersProvider');
  }
  return context;
};

// Mock orders data
const mockOrders: Order[] = [
  {
    id: 'order-001',
    orderNumber: 'SK001',
    customerId: 'customer-001',
    customerName: 'أحمد سالم',
    customerPhone: '+966501234567',
    items: [
      {
        id: 'latte',
        name: 'Latte',
        arabicName: 'لاتيه',
        price: 18,
        quantity: 2,
        image: '/images/latte.jpg',
        customizations: { size: 'large' }
      }
    ],
    totalAmount: 36,
    status: 'preparing',
    paymentMethod: 'card',
    paymentStatus: 'paid',
    branchId: 'branch-001',
    branchName: 'فرع صديان',
    orderType: 'pickup',
    createdAt: '2025-01-20T10:30:00Z',
    updatedAt: '2025-01-20T10:35:00Z',
    estimatedTime: 15,
    barcode: 'SK001240320103000',
    loyaltyPointsEarned: 18,
    loyaltyPointsUsed: 0
  }
];

interface OrdersProviderProps {
  children: ReactNode;
}

export const OrdersProvider: React.FC<OrdersProviderProps> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const { user, updateUserPoints } = useAuth();

  const generateOrderNumber = (): string => {
    const timestamp = Date.now().toString().slice(-6);
    return `SK${timestamp}`;
  };

  const generateBarcode = (): string => {
    const orderNum = generateOrderNumber();
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const time = new Date().toTimeString().slice(0, 5).replace(':', '');
    return `${orderNum}${date}${time}`;
  };

  const calculateLoyaltyPoints = (totalAmount: number): number => {
    // 1 نقطة لكل 5 ريال
    return Math.floor(totalAmount / 5);
  };

  const createOrder = async (orderData: Partial<Order>): Promise<Order> => {
    try {
      // محاولة إنشاء الطلب عبر الـ API الحقيقي أولاً
      const response = await ordersAPI.create({
        ...orderData,
        customerId: user?.id,
        customerName: user?.fullName || 'عميل',
        customerPhone: user?.phone || '',
      });
      
      const newOrder = response.data;
      setOrders(prev => [newOrder, ...prev]);
      
      // Add loyalty points to user
      if (user && newOrder.loyaltyPointsEarned > 0) {
        updateUserPoints(newOrder.loyaltyPointsEarned);
      }
      
      return newOrder;
    } catch (error) {
      // في حالة فشل الاتصال بالـ API، استخدام البيانات الوهمية كـ fallback
      console.warn('API connection failed, using mock data:', error);
      
      const orderNumber = generateOrderNumber();
      const barcode = generateBarcode();
      const loyaltyPointsEarned = calculateLoyaltyPoints(orderData.totalAmount || 0);

      const newOrder: Order = {
        id: `order-${Date.now()}`,
        orderNumber,
        customerId: user?.id || 'guest',
        customerName: user?.fullName || 'عميل',
        customerPhone: user?.phone || '',
        items: orderData.items || [],
        totalAmount: orderData.totalAmount || 0,
        status: 'pending',
        paymentMethod: orderData.paymentMethod || 'cash',
        paymentStatus: 'pending',
        branchId: orderData.branchId,
        branchName: orderData.branchName,
        orderType: orderData.orderType || 'pickup',
        deliveryAddress: orderData.deliveryAddress,
        notes: orderData.notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        estimatedTime: 20, // Default 20 minutes
        barcode,
        loyaltyPointsEarned,
        loyaltyPointsUsed: orderData.loyaltyPointsUsed || 0,
        ...orderData
      };

      setOrders(prev => [newOrder, ...prev]);

      // Add loyalty points to user
      if (user && loyaltyPointsEarned > 0) {
        updateUserPoints(loyaltyPointsEarned);
      }

      return newOrder;
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']): Promise<void> => {
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId
          ? { ...order, status, updatedAt: new Date().toISOString() }
          : order
      )
    );
  };

  const getOrderById = (orderId: string): Order | undefined => {
    return orders.find(order => order.id === orderId);
  };

  const getOrdersByCustomer = (customerId: string): Order[] => {
    return orders.filter(order => order.customerId === customerId);
  };

  const getOrdersByBranch = (branchId: string): Order[] => {
    return orders.filter(order => order.branchId === branchId);
  };

  const getPendingOrders = (): Order[] => {
    return orders.filter(order => ['pending', 'confirmed', 'preparing'].includes(order.status));
  };

  const cancelOrder = async (orderId: string, reason?: string): Promise<void> => {
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId
          ? { 
              ...order, 
              status: 'cancelled', 
              updatedAt: new Date().toISOString(),
              notes: reason ? `${order.notes || ''}\nسبب الإلغاء: ${reason}` : order.notes
            }
          : order
      )
    );
  };

  const value: OrdersContextType = {
    orders,
    createOrder,
    updateOrderStatus,
    getOrderById,
    getOrdersByCustomer,
    getOrdersByBranch,
    getPendingOrders,
    generateBarcode,
    cancelOrder
  };

  return (
    <OrdersContext.Provider value={value}>
      {children}
    </OrdersContext.Provider>
  );
};
