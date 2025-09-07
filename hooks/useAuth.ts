import { useState, useEffect, createContext, useContext } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useAuthProvider = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    // فحص حالة المصادقة المحفوظة
    const token = localStorage.getItem('admin_token');
    if (token) {
      // هنا يمكن إضافة التحقق من صحة التوكن
      setIsAuthenticated(true);
      setUser({ username: 'admin' });
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    // محاكاة عملية تسجيل الدخول
    if (username === 'admin' && password === 'admin123') {
      const token = 'mock_jwt_token_' + Date.now();
      localStorage.setItem('admin_token', token);
      setIsAuthenticated(true);
      setUser({ username });
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    setIsAuthenticated(false);
    setUser(null);
  };

  return {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout
  };
};
