import { useState, useEffect, createContext, useContext } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any | null;
  login: (email: string, password: string) => Promise<boolean>;
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

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // محاكاة عملية تسجيل الدخول
      if (email === 'admin@sakura.com' && password === 'admin123') {
        const token = 'mock_jwt_token_' + Date.now();
        localStorage.setItem('admin_token', token);
        setIsAuthenticated(true);
        setUser({ email, username: 'admin' });
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
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
