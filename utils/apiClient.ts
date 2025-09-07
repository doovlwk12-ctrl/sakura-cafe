import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

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
  (config: AxiosRequestConfig) => {
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

export default apiClient;
