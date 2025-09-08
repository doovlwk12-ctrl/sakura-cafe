'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CartItem {
  id: string;
  name: string;
  arabicName: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
  customizations?: {
    size?: 'small' | 'medium' | 'large';
    extras?: string[];
    notes?: string;
  };
}

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addToCart: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Load cart from database on mount
  useEffect(() => {
    const loadCartFromDatabase = async () => {
      try {
        const token = localStorage.getItem('user_token');
        const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
        
        if (token && userData.id) {
          // جلب السلة من قاعدة البيانات
          const response = await fetch('/api/cart/items', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'user-id': userData.id
            }
          });

          if (response.ok) {
            const data = await response.json();
            console.log('✅ تم جلب سلة التسوق من قاعدة البيانات:', data);
            // تحويل البيانات من قاعدة البيانات إلى تنسيق الواجهة الأمامية
            const formattedItems = data.items.map((item: any) => ({
              id: item.product_id,
              name: item.product_name,
              arabicName: item.product_arabic_name || item.product_name || 'منتج',
              price: item.price,
              quantity: item.quantity,
              image: item.image,
              category: item.category,
              customizations: item.customizations
            }));
            setItems(formattedItems);
            
            // تحديث بيانات المستخدم في localStorage
            const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
            if (userData.id === userData.id) {
              const updatedUserData = {
                ...userData,
                loyaltyPoints: data.userPoints || 0,
                pointsExpiryDate: data.pointsExpiryDate
              };
              localStorage.setItem('user_data', JSON.stringify(updatedUserData));
              console.log('✅ تم تحديث نقاط المكافآت:', data.userPoints);
            }
          } else {
            console.log('⚠️ لم يتم العثور على سلة تسوق في قاعدة البيانات، جاري تحميل من localStorage');
            // العودة إلى localStorage كبديل
            const savedCart = localStorage.getItem('sakura_cart');
            if (savedCart) {
              const localItems = JSON.parse(savedCart);
              setItems(localItems);
              
              // محاولة رفع السلة المحلية إلى قاعدة البيانات
              try {
                for (const item of localItems) {
                  await fetch('/api/cart/items', {
                    method: 'POST',
                    headers: {
                      'Authorization': `Bearer ${token}`,
                      'user-id': userData.id,
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                      product_id: item.id,
                      product_name: item.name,
                      product_arabic_name: item.arabicName,
                      price: item.price,
                      quantity: item.quantity,
                      image: item.image,
                      category: item.category,
                      customizations: item.customizations
                    })
                  });
                }
                console.log('✅ تم رفع السلة المحلية إلى قاعدة البيانات');
              } catch (syncError) {
                console.error('❌ فشل في رفع السلة المحلية:', syncError);
              }
            }
          }
        } else {
          // إذا لم يكن المستخدم مسجل دخول، جلب من localStorage
          const savedCart = localStorage.getItem('sakura_cart');
          if (savedCart) {
            setItems(JSON.parse(savedCart));
          }
        }
      } catch (error) {
        console.error('Error loading cart:', error);
        // في حالة الخطأ، جرب localStorage
        try {
          const savedCart = localStorage.getItem('sakura_cart');
          if (savedCart) {
            setItems(JSON.parse(savedCart));
          }
        } catch (localError) {
          console.error('Error loading cart from localStorage:', localError);
        }
      }
    };

    loadCartFromDatabase();
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    try {
      localStorage.setItem('sakura_cart', JSON.stringify(items));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [items]);

  const addToCart = async (newItem: Omit<CartItem, 'quantity'>, quantity = 1) => {
    try {
      // التحقق من تسجيل الدخول
      const token = localStorage.getItem('user_token');
      const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
      
      if (!token || !userData.id) {
        // إذا لم يكن المستخدم مسجل دخول، استخدم localStorage
        console.log('⚠️ المستخدم غير مسجل دخول، استخدام localStorage');
        const existingItemIndex = items.findIndex(item => 
          item.id === newItem.id && 
          JSON.stringify(item.customizations) === JSON.stringify(newItem.customizations)
        );
        
        if (existingItemIndex !== -1) {
          // تحديث الكمية
          const updatedItems = [...items];
          updatedItems[existingItemIndex].quantity += quantity;
          setItems(updatedItems);
        } else {
          // إضافة منتج جديد مع التأكد من وجود arabicName
          const itemToAdd = {
            ...newItem,
            quantity,
            arabicName: newItem.arabicName || newItem.name || 'منتج'
          };
          setItems([...items, itemToAdd]);
        }
        return;
      }

      // إرسال طلب إلى API
      const response = await fetch('/api/cart/items', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'user-id': userData.id,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          product_id: newItem.id,
          product_name: newItem.name,
          product_arabic_name: newItem.arabicName,
          price: newItem.price,
          quantity: quantity,
          image: newItem.image,
          category: newItem.category,
          customizations: newItem.customizations
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ تم إضافة المنتج إلى سلة التسوق:', data);
        
        // تحديث السلة المحلية - تحويل البيانات من قاعدة البيانات إلى تنسيق الواجهة الأمامية
        const formattedItems = data.cart.items.map((item: any) => ({
          id: item.product_id,
          name: item.product_name,
          arabicName: item.product_arabic_name || item.product_name || 'منتج',
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          category: item.category,
          customizations: item.customizations
        }));
        setItems(formattedItems);
        
        // إظهار رسالة نجاح
        console.log('تم إضافة المنتج إلى سلة التسوق بنجاح');
      } else {
        const errorData = await response.json();
        console.error('❌ فشل في إضافة المنتج:', errorData);
        alert(`فشل في إضافة المنتج: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('حدث خطأ في إضافة المنتج إلى سلة التسوق');
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      const token = localStorage.getItem('user_token');
      const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
      
      if (!token || !userData.id) {
        // إذا لم يكن المستخدم مسجل دخول، استخدم localStorage
        console.log('⚠️ المستخدم غير مسجل دخول، استخدام localStorage');
        setItems(items.filter(item => item.id !== itemId));
        return;
      }

      // البحث عن العنصر في السلة للحصول على ID الحقيقي
      const cartItem = items.find(item => item.id === itemId);
      if (!cartItem) {
        console.error('❌ لم يتم العثور على العنصر في السلة');
        return;
      }

      const response = await fetch(`/api/cart/items/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'user-id': userData.id
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ تم حذف المنتج من سلة التسوق:', data);
        // تحويل البيانات من قاعدة البيانات إلى تنسيق الواجهة الأمامية
        const formattedItems = data.cart.items.map((item: any) => ({
          id: item.product_id,
          name: item.product_name,
          arabicName: item.product_arabic_name || item.product_name || 'منتج',
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          category: item.category,
          customizations: item.customizations
        }));
        setItems(formattedItems);
      } else {
        const errorData = await response.json();
        console.error('❌ فشل في حذف المنتج:', errorData);
        alert(`فشل في حذف المنتج: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      alert('حدث خطأ في حذف المنتج من سلة التسوق');
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      const token = localStorage.getItem('user_token');
      const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
      
      if (!token || !userData.id) {
        // إذا لم يكن المستخدم مسجل دخول، استخدم localStorage
        console.log('⚠️ المستخدم غير مسجل دخول، استخدام localStorage');
        if (quantity <= 0) {
          setItems(items.filter(item => item.id !== itemId));
        } else {
          setItems(items.map(item => 
            item.id === itemId ? { ...item, quantity } : item
          ));
        }
        return;
      }

      // البحث عن العنصر في السلة للحصول على ID الحقيقي
      const cartItem = items.find(item => item.id === itemId);
      if (!cartItem) {
        console.error('❌ لم يتم العثور على العنصر في السلة');
        return;
      }

      const response = await fetch(`/api/cart/items/${itemId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'user-id': userData.id,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quantity })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ تم تحديث كمية المنتج:', data);
        // تحويل البيانات من قاعدة البيانات إلى تنسيق الواجهة الأمامية
        const formattedItems = data.cart.items.map((item: any) => ({
          id: item.product_id,
          name: item.product_name,
          arabicName: item.product_arabic_name || item.product_name || 'منتج',
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          category: item.category,
          customizations: item.customizations
        }));
        setItems(formattedItems);
      } else {
        const errorData = await response.json();
        console.error('❌ فشل في تحديث الكمية:', errorData);
        alert(`فشل في تحديث الكمية: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      alert('حدث خطأ في تحديث كمية المنتج');
    }
  };

  const clearCart = async () => {
    try {
      const token = localStorage.getItem('user_token');
      const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
      
      if (!token || !userData.id) {
        alert('الرجاء تسجيل الدخول أولاً');
        return;
      }

      const response = await fetch('/api/cart/items', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'user-id': userData.id
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ تم حذف جميع المنتجات من سلة التسوق:', data);
        setItems([]);
      } else {
        const errorData = await response.json();
        console.error('❌ فشل في حذف سلة التسوق:', errorData);
        alert(`فشل في حذف سلة التسوق: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      alert('حدث خطأ في حذف سلة التسوق');
    }
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const value: CartContextType = {
    items,
    totalItems,
    totalPrice,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isOpen,
    setIsOpen
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
