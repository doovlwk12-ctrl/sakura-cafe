import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

// إنشاء instance من axios مع الإعدادات الأساسية
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  timeout: 10000, // 10 ثواني timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor لإضافة التوكن
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // إضافة التوكن من localStorage
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('user_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    // إضافة timestamp للطلبات
    if (config.headers) {
      config.headers['X-Request-Time'] = new Date().toISOString();
    }
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor لمعالجة الأخطاء
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // تسجيل الطلبات الناجحة في development
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ API Success: ${response.config.method?.toUpperCase()} ${response.config.url}`);
    }
    return response;
  },
  (error) => {
    // معالجة الأخطاء المختلفة
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // غير مصرح - إعادة توجيه لصفحة تسجيل الدخول
          if (typeof window !== 'undefined') {
            localStorage.removeItem('user_token');
            localStorage.removeItem('user_data');
            window.location.href = '/login';
          }
          break;
          
        case 403:
          // ممنوع - عرض رسالة خطأ
          console.error('❌ Access forbidden:', data.message);
          break;
          
        case 404:
          // غير موجود
          console.error('❌ Resource not found:', data.message);
          break;
          
        case 422:
          // خطأ في التحقق من البيانات
          console.error('❌ Validation error:', data.errors);
          break;
          
        case 429:
          // تجاوز الحد المسموح
          console.error('❌ Rate limit exceeded:', data.message);
          break;
          
        case 500:
          // خطأ في الخادم
          console.error('❌ Server error:', data.message);
          break;
          
        default:
          console.error(`❌ API Error ${status}:`, data.message);
      }
    } else if (error.request) {
      // خطأ في الشبكة
      console.error('❌ Network error:', error.message);
    } else {
      // خطأ آخر
      console.error('❌ Request setup error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// دوال مساعدة للـ API calls
export const api = {
  // GET request
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return apiClient.get(url, config);
  },
  
  // POST request
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return apiClient.post(url, data, config);
  },
  
  // PUT request
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return apiClient.put(url, data, config);
  },
  
  // PATCH request
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return apiClient.patch(url, data, config);
  },
  
  // DELETE request
  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
    return apiClient.delete(url, config);
  },
};

// دوال خاصة بـ API endpoints
export const authAPI = {
  login: (credentials: { username: string; password: string; userType: string }) =>
    api.post('/auth/login', credentials),
    
  register: (userData: { username: string; password: string; fullName: string; phone: string; email: string }) =>
    api.post('/auth/register', userData),
    
  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }),
    
  resetPassword: (token: string, newPassword: string) =>
    api.put(`/auth/reset-password/${token}`, { newPassword }),
    
  logout: () =>
    api.post('/auth/logout'),
};

export const productsAPI = {
  getAll: () => api.get('/products'),
  getById: (id: string) => api.get(`/products/${id}`),
  create: (product: any) => api.post('/products', product),
  update: (id: string, product: any) => api.put(`/products/${id}`, product),
  delete: (id: string) => api.delete(`/products/${id}`),
};

export const ordersAPI = {
  getAll: () => api.get('/orders'),
  getById: (id: string) => api.get(`/orders/${id}`),
  create: (order: any) => api.post('/orders', order),
  update: (id: string, order: any) => api.put(`/orders/${id}`, order),
  getByUser: (userId: string) => api.get(`/orders/user/${userId}`),
  getByBranch: (branchId: string) => api.get(`/orders/branch/${branchId}`),
};

export const usersAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (userData: any) => api.put('/users/profile', userData),
  getAll: () => api.get('/users'),
  getById: (id: string) => api.get(`/users/${id}`),
  update: (id: string, userData: any) => api.put(`/users/${id}`, userData),
  delete: (id: string) => api.delete(`/users/${id}`),
};

export const branchesAPI = {
  getAll: () => api.get('/branches'),
  getById: (id: string) => api.get(`/branches/${id}`),
  create: (branch: any) => api.post('/branches', branch),
  update: (id: string, branch: any) => api.put(`/branches/${id}`, branch),
  delete: (id: string) => api.delete(`/branches/${id}`),
};

export const cartAPI = {
  getItems: (userId: string) => api.get('/cart/items', {
    headers: { 'user-id': userId }
  }),
  addItem: (userId: string, item: any) => api.post('/cart/items', item, {
    headers: { 'user-id': userId }
  }),
  updateItem: (userId: string, itemId: string, quantity: number) => 
    api.put(`/cart/items/${itemId}`, { quantity }, {
      headers: { 'user-id': userId }
    }),
  removeItem: (userId: string, itemId: string) => 
    api.delete(`/cart/items/${itemId}`, {
      headers: { 'user-id': userId }
    }),
  clearCart: (userId: string) => api.delete('/cart/items', {
    headers: { 'user-id': userId }
  }),
  applyReward: (userId: string, rewardId: string) => 
    api.post('/cart/rewards', { rewardId }, {
      headers: { 'user-id': userId }
    }),
  removeReward: (userId: string, rewardId: string) => 
    api.delete(`/cart/rewards/${rewardId}`, {
      headers: { 'user-id': userId }
    }),
};

export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getRecentOrders: (limit?: number) => 
    api.get(`/dashboard/recent-orders${limit ? `?limit=${limit}` : ''}`),
  getSalesReport: (startDate: string, endDate: string, branchId?: string) => {
    const params = new URLSearchParams({ startDate, endDate });
    if (branchId) params.append('branchId', branchId);
    return api.get(`/dashboard/sales-report?${params}`);
  },
};

export const rewardsAPI = {
  getAvailable: (userId: string) => api.get(`/rewards/available`, {
    headers: { 'user-id': userId }
  }),
  getHistory: (userId: string) => api.get(`/rewards/history`, {
    headers: { 'user-id': userId }
  }),
  apply: (userId: string, rewardId: string) => 
    api.post('/rewards/apply', { rewardId }, {
      headers: { 'user-id': userId }
    }),
};

export const adminAPI = {
  authenticate: (credentials: { username: string; password: string; twoFactorCode?: string }) =>
    api.post('/admin/auth', credentials),
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: () => api.get('/admin/users'),
  updateUser: (id: string, userData: any) => api.put(`/admin/users/${id}`, userData),
  deleteUser: (id: string) => api.delete(`/admin/users/${id}`),
  getReports: (type: string, params?: any) => 
    api.get(`/admin/reports/${type}`, { params }),
};

export const cashierAPI = {
  authenticate: (credentials: { username: string; password: string; branchId: string }) =>
    api.post('/cashier/auth', credentials),
  getOrders: (branchId: string, status?: string) => 
    api.get(`/cashier/orders?branch_id=${branchId}${status ? `&status=${status}` : ''}`),
  updateOrderStatus: (orderId: string, status: string) =>
    api.put(`/cashier/orders/${orderId}`, { status }),
  printInvoice: (orderId: string) =>
    api.post(`/cashier/orders/${orderId}/print`),
};

// دوال مساعدة للمزامنة
export const syncAPI = {
  // مزامنة البيانات المحلية مع الخادم
  syncCart: async (userId: string, localCart: any[]) => {
    try {
      const serverCart = await cartAPI.getItems(userId);
      // مقارنة وتحديث البيانات
      return serverCart.data;
    } catch (error) {
      console.error('Error syncing cart:', error);
      return localCart;
    }
  },

  // مزامنة حالة الطلبات
  syncOrders: async (branchId?: string) => {
    try {
      const response = await ordersAPI.getAll();
      return response.data.orders;
    } catch (error) {
      console.error('Error syncing orders:', error);
      return [];
    }
  },

  // مزامنة المنتجات
  syncProducts: async () => {
    try {
      const response = await productsAPI.getAll();
      return response.data.products;
    } catch (error) {
      console.error('Error syncing products:', error);
      return [];
    }
  },

  // مزامنة الإحصائيات
  syncStats: async () => {
    try {
      const response = await dashboardAPI.getStats();
      return response.data.stats;
    } catch (error) {
      console.error('Error syncing stats:', error);
      return null;
    }
  }
};

// نظام إعادة المحاولة للطلبات الفاشلة
export const retryAPI = {
  retry: async <T>(
    apiCall: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> => {
    let lastError: any;
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await apiCall();
      } catch (error) {
        lastError = error;
        if (i < maxRetries - 1) {
          console.log(`Retry attempt ${i + 1}/${maxRetries} after ${delay}ms`);
          await new Promise(resolve => setTimeout(resolve, delay));
          delay *= 2; // زيادة التأخير تدريجياً
        }
      }
    }
    
    throw lastError;
  }
};

// نظام التخزين المؤقت
export const cacheAPI = {
  set: (key: string, data: any, ttl: number = 300000) => { // 5 دقائق افتراضياً
    if (typeof window !== 'undefined') {
      const item = {
        data,
        timestamp: Date.now(),
        ttl
      };
      localStorage.setItem(`cache_${key}`, JSON.stringify(item));
    }
  },

  get: (key: string) => {
    if (typeof window !== 'undefined') {
      const item = localStorage.getItem(`cache_${key}`);
      if (item) {
        const parsed = JSON.parse(item);
        if (Date.now() - parsed.timestamp < parsed.ttl) {
          return parsed.data;
        } else {
          localStorage.removeItem(`cache_${key}`);
        }
      }
    }
    return null;
  },

  clear: (key?: string) => {
    if (typeof window !== 'undefined') {
      if (key) {
        localStorage.removeItem(`cache_${key}`);
      } else {
        // مسح جميع عناصر التخزين المؤقت
        Object.keys(localStorage).forEach(k => {
          if (k.startsWith('cache_')) {
            localStorage.removeItem(k);
          }
        });
      }
    }
  }
};

export default apiClient;
