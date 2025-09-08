// Database configuration and schema for Sakura Cafe
export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  product_name: string;
  product_arabic_name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
  customizations?: {
    size?: 'small' | 'medium' | 'large';
    extras?: string[];
    notes?: string;
  };
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  name_ar: string;
  description: string;
  description_ar: string;
  price: number;
  category: string;
  image: string;
  calories: number;
  stock: number;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  customer_name: string;
  customer_phone: string;
  branch_id: string;
  branch_name: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  order_type: 'pickup' | 'delivery';
  payment_method: string;
  payment_status: 'pending' | 'paid' | 'failed';
  notes?: string;
  estimated_time: number;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  product_name_ar: string;
  price: number;
  quantity: number;
  customizations?: {
    size?: string;
    extras?: string[];
    notes?: string;
  };
}

export interface Branch {
  id: string;
  name: string;
  name_ar: string;
  address: string;
  phone: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  working_hours: {
    open: string;
    close: string;
  };
  is_open: boolean;
  created_at: string;
  updated_at: string;
}

export interface Admin {
  id: string;
  username: string;
  email: string;
  password_hash: string;
  role: 'admin' | 'manager' | 'cashier';
  permissions: string[];
  branch_id?: string;
  is_active: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export interface Cashier {
  id: string;
  username: string;
  password_hash: string;
  name: string;
  branch_id: string;
  is_active: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  loyalty_points: number;
  total_spent: number;
  points_expiry_date?: string;
  created_at: string;
  updated_at: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  arabicName: string;
  category: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  cost: number;
  price: number;
  supplier: string;
  lastRestocked: Date;
  expiryDate?: Date;
  status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'expired';
}

export interface Reward {
  id: string;
  name: string;
  arabic_name: string;
  type: 'discount' | 'free_item' | 'points';
  value: number;
  points_required: number;
  description: string;
  arabic_description: string;
  is_active: boolean;
  min_order_amount?: number;
  max_usage_per_user?: number;
  expiry_days?: number;
  created_at: string;
  updated_at: string;
}

export interface UserReward {
  id: string;
  user_id: string;
  reward_id: string;
  points_used: number;
  status: 'active' | 'used' | 'expired';
  expires_at: string;
  used_at?: string;
  created_at: string;
}

export interface CartReward {
  id: string;
  user_id: string;
  reward_id: string;
  reward_type: 'discount' | 'free_item';
  reward_value: number;
  points_used: number;
  applied_at: string;
}

// محاكاة قاعدة البيانات في الذاكرة (في التطبيق الحقيقي، ستكون قاعدة بيانات حقيقية)
class Database {
  private cartItems: CartItem[] = [];
  private users: User[] = [];
  private rewards: Reward[] = [];
  private userRewards: UserReward[] = [];
  private cartRewards: CartReward[] = [];
  private products: Product[] = [];
  private orders: Order[] = [];
  private branches: Branch[] = [];
  private admins: Admin[] = [];
  private cashiers: Cashier[] = [];
  private inventory: InventoryItem[] = [];

  constructor() {
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    this.initializeDefaultUsers();
    this.initializeDefaultRewards();
    this.initializeDefaultProducts();
    this.initializeDefaultBranches();
    this.initializeDefaultAdmins();
    this.initializeDefaultCashiers();
  }

  private initializeDefaultUsers() {
    // مستخدمين افتراضيين مع نقاط مكافآت
    this.users = [
      {
        id: 'user-001',
        username: 'ahmed_salem',
        email: 'ahmed@example.com',
        phone: '+966501234567',
        full_name: 'أحمد سالم',
        loyalty_points: 250, // نقاط كافية للحصول على مكافآت
        total_spent: 500,
        points_expiry_date: this.calculatePointsExpiryDate(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'user-002',
        username: 'sara_ali',
        email: 'sara@example.com',
        phone: '+966507654321',
        full_name: 'سارة علي',
        loyalty_points: 150, // نقاط متوسطة
        total_spent: 300,
        points_expiry_date: this.calculatePointsExpiryDate(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'user-003',
        username: 'mohammed_khalil',
        email: 'mohammed@example.com',
        phone: '+966509876543',
        full_name: 'محمد خليل',
        loyalty_points: 50, // نقاط قليلة
        total_spent: 100,
        points_expiry_date: this.calculatePointsExpiryDate(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
  }

  private initializeDefaultRewards() {
    // مكافآت افتراضية
    this.rewards = [
      {
        id: 'reward-001',
        name: '10 SAR Discount',
        arabic_name: 'خصم 10 ريال',
        type: 'discount',
        value: 10,
        points_required: 100,
        description: '10 SAR discount on any order',
        arabic_description: 'خصم 10 ريال على أي طلب',
        is_active: true,
        min_order_amount: 50,
        max_usage_per_user: 1,
        expiry_days: 30,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'reward-002',
        name: '20 SAR Discount',
        arabic_name: 'خصم 20 ريال',
        type: 'discount',
        value: 20,
        points_required: 200,
        description: '20 SAR discount on any order',
        arabic_description: 'خصم 20 ريال على أي طلب',
        is_active: true,
        min_order_amount: 100,
        max_usage_per_user: 1,
        expiry_days: 30,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'reward-003',
        name: 'Free Coffee',
        arabic_name: 'قهوة مجانية',
        type: 'free_item',
        value: 20,
        points_required: 150,
        description: 'Free coffee of your choice',
        arabic_description: 'قهوة مجانية من اختيارك',
        is_active: true,
        max_usage_per_user: 1,
        expiry_days: 30,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
  }

  private initializeDefaultProducts() {
    this.products = [
      {
        id: 'product-001',
        name: 'Latte',
        name_ar: 'لاتيه',
        description: 'Rich espresso with steamed milk',
        description_ar: 'إسبريسو غني مع حليب مبخر',
        price: 18,
        category: 'drinks',
        image: '/images/products/latte.jpg',
        calories: 120,
        stock: 50,
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'product-002',
        name: 'Cappuccino',
        name_ar: 'كابتشينو',
        description: 'Classic Italian coffee with foam',
        description_ar: 'قهوة إيطالية كلاسيكية مع رغوة',
        price: 16,
        category: 'drinks',
        image: '/images/products/cappuccino.jpg',
        calories: 100,
        stock: 40,
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'product-003',
        name: 'Croissant',
        name_ar: 'كرواسون',
        description: 'Fresh French croissant',
        description_ar: 'كرواسون فرنسي طازج',
        price: 12,
        category: 'sweet',
        image: '/images/products/croissant.jpg',
        calories: 200,
        stock: 30,
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
  }

  private initializeDefaultBranches() {
    this.branches = [
      {
        id: 'branch-001',
        name: 'Sadiyan Branch',
        name_ar: 'فرع صديان',
        address: 'طريق الملك فهد الدائري المنتزه الشرقي، حائل 55428',
        phone: '+966501234567',
        coordinates: { lat: 27.5114, lng: 41.6901 },
        working_hours: { open: '06:00', close: '24:00' },
        is_open: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'branch-002',
        name: 'Al-Nuqrah Branch',
        name_ar: 'فرع النقرة',
        address: 'فهد العلى العريفي النقرة، حائل 55431',
        phone: '+966501234568',
        coordinates: { lat: 27.5200, lng: 41.7000 },
        working_hours: { open: '06:00', close: '24:00' },
        is_open: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
  }

  private initializeDefaultAdmins() {
    this.admins = [
      {
        id: 'admin-001',
        username: 'admin',
        email: 'admin@sakura.com',
        password_hash: 'hashed_password_here', // في التطبيق الحقيقي، يجب تشفير كلمة المرور
        role: 'admin',
        permissions: ['dashboard', 'products', 'orders', 'users', 'reports', 'settings'],
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
  }

  private initializeDefaultCashiers() {
    this.cashiers = [
      {
        id: 'cashier-001',
        username: 'cashier',
        password_hash: 'hashed_password_here',
        name: 'كاشير صديان',
        branch_id: 'branch-001',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
  }

  // Cart Items Operations
  async addToCart(item: Omit<CartItem, 'id' | 'created_at' | 'updated_at'>): Promise<CartItem> {
    const existingItem = this.cartItems.find(
      cartItem => 
        cartItem.user_id === item.user_id && 
        cartItem.product_id === item.product_id &&
        JSON.stringify(cartItem.customizations) === JSON.stringify(item.customizations)
    );

    if (existingItem) {
      // تحديث الكمية
      existingItem.quantity += item.quantity;
      existingItem.updated_at = new Date().toISOString();
      return existingItem;
    } else {
      // إضافة عنصر جديد
      const newItem: CartItem = {
        ...item,
        id: `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      this.cartItems.push(newItem);
      return newItem;
    }
  }

  async getCartItems(userId: string): Promise<CartItem[]> {
    return this.cartItems.filter(item => item.user_id === userId);
  }

  async updateCartItemQuantity(itemId: string, quantity: number): Promise<CartItem | null> {
    // البحث باستخدام id (معرف العنصر في السلة)
    const item = this.cartItems.find(cartItem => cartItem.id === itemId);
    if (item) {
      if (quantity <= 0) {
        // حذف العنصر إذا كانت الكمية صفر أو أقل
        this.cartItems = this.cartItems.filter(cartItem => cartItem.id !== itemId);
        return null;
      } else {
        item.quantity = quantity;
        item.updated_at = new Date().toISOString();
        return item;
      }
    }
    return null;
  }

  async removeFromCart(itemId: string): Promise<boolean> {
    const initialLength = this.cartItems.length;
    // البحث باستخدام id (معرف العنصر في السلة)
    this.cartItems = this.cartItems.filter(item => item.id !== itemId);
    return this.cartItems.length < initialLength;
  }

  async clearCart(userId: string): Promise<boolean> {
    const initialLength = this.cartItems.length;
    this.cartItems = this.cartItems.filter(item => item.user_id !== userId);
    return this.cartItems.length < initialLength;
  }

  // User Operations
  async getUser(userId: string): Promise<User | null> {
    return this.users.find(user => user.id === userId) || null;
  }

  async createUser(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> {
    const newUser: User = {
      ...userData,
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      points_expiry_date: this.calculatePointsExpiryDate(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.users.push(newUser);
    return newUser;
  }

  // حساب تاريخ انتهاء النقاط (30 يوم من الآن)
  private calculatePointsExpiryDate(): string {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);
    return expiryDate.toISOString();
  }

  // تحديث تاريخ انتهاء النقاط عند إضافة نقاط جديدة
  async addPointsToUser(userId: string, points: number): Promise<User | null> {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      user.loyalty_points += points;
      user.points_expiry_date = this.calculatePointsExpiryDate();
      user.updated_at = new Date().toISOString();
      return user;
    }
    return null;
  }

  async updateUserLoyaltyPoints(userId: string, points: number): Promise<User | null> {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      user.loyalty_points = points;
      user.updated_at = new Date().toISOString();
      return user;
    }
    return null;
  }

  // Rewards Operations
  async getAvailableRewards(userId: string): Promise<Reward[]> {
    const user = await this.getUser(userId);
    if (!user) return [];

    return this.rewards.filter(reward => {
      if (!reward.is_active) return false;
      if (user.loyalty_points < reward.points_required) return false;
      
      // التحقق من الحد الأقصى للاستخدام
      if (reward.max_usage_per_user) {
        const userRewardCount = this.userRewards.filter(
          ur => ur.user_id === userId && ur.reward_id === reward.id && ur.status === 'used'
        ).length;
        if (userRewardCount >= reward.max_usage_per_user) return false;
      }
      
      return true;
    });
  }

  async applyReward(userId: string, rewardId: string): Promise<{ success: boolean; message: string; cartReward?: CartReward }> {
    const user = await this.getUser(userId);
    const reward = this.rewards.find(r => r.id === rewardId);
    
    if (!user || !reward) {
      return { success: false, message: 'المستخدم أو المكافأة غير موجودة' };
    }

    if (user.loyalty_points < reward.points_required) {
      return { success: false, message: 'نقاط غير كافية' };
    }

    // التحقق من وجود مكافأة مطبقة بالفعل
    const existingCartReward = this.cartRewards.find(cr => cr.user_id === userId && cr.reward_id === rewardId);
    if (existingCartReward) {
      return { success: false, message: 'المكافأة مطبقة بالفعل' };
    }

    // إنشاء مكافأة السلة
    const cartReward: CartReward = {
      id: `cart_reward_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      user_id: userId,
      reward_id: rewardId,
      reward_type: reward.type,
      reward_value: reward.value,
      points_used: reward.points_required,
      applied_at: new Date().toISOString()
    };

    this.cartRewards.push(cartReward);

    // خصم النقاط
    user.loyalty_points -= reward.points_required;
    user.updated_at = new Date().toISOString();

    return { 
      success: true, 
      message: 'تم تطبيق المكافأة بنجاح',
      cartReward 
    };
  }

  async removeReward(userId: string, rewardId: string): Promise<{ success: boolean; message: string }> {
    const user = await this.getUser(userId);
    const reward = this.rewards.find(r => r.id === rewardId);
    
    if (!user || !reward) {
      return { success: false, message: 'المستخدم أو المكافأة غير موجودة' };
    }

    const cartRewardIndex = this.cartRewards.findIndex(cr => cr.user_id === userId && cr.reward_id === rewardId);
    if (cartRewardIndex === -1) {
      return { success: false, message: 'المكافأة غير مطبقة' };
    }

    // إزالة المكافأة من السلة
    this.cartRewards.splice(cartRewardIndex, 1);

    // إرجاع النقاط
    user.loyalty_points += reward.points_required;
    user.updated_at = new Date().toISOString();

    return { success: true, message: 'تم إزالة المكافأة بنجاح' };
  }

  async getCartRewards(userId: string): Promise<CartReward[]> {
    return this.cartRewards.filter(cr => cr.user_id === userId);
  }

  async clearCartRewards(userId: string): Promise<void> {
    this.cartRewards = this.cartRewards.filter(cr => cr.user_id !== userId);
  }

  // Products Operations
  async getProducts(category?: string): Promise<Product[]> {
    if (category) {
      return this.products.filter(product => product.category === category && product.status === 'active');
    }
    return this.products.filter(product => product.status === 'active');
  }

  async getProduct(productId: string): Promise<Product | null> {
    return this.products.find(product => product.id === productId) || null;
  }

  async createProduct(productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> {
    const newProduct: Product = {
      ...productData,
      id: `product_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.products.push(newProduct);
    return newProduct;
  }

  async updateProduct(productId: string, updates: Partial<Product>): Promise<Product | null> {
    const product = this.products.find(p => p.id === productId);
    if (product) {
      Object.assign(product, updates, { updated_at: new Date().toISOString() });
      return product;
    }
    return null;
  }

  async deleteProduct(productId: string): Promise<boolean> {
    const initialLength = this.products.length;
    this.products = this.products.filter(p => p.id !== productId);
    return this.products.length < initialLength;
  }

  // Orders Operations
  async createOrder(orderData: Omit<Order, 'id' | 'created_at' | 'updated_at'>): Promise<Order> {
    const newOrder: Order = {
      ...orderData,
      id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.orders.push(newOrder);
    return newOrder;
  }

  async getOrders(branchId?: string, status?: string): Promise<Order[]> {
    let filteredOrders = this.orders;
    
    if (branchId) {
      filteredOrders = filteredOrders.filter(order => order.branch_id === branchId);
    }
    
    if (status) {
      filteredOrders = filteredOrders.filter(order => order.status === status);
    }
    
    return filteredOrders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  async getOrder(orderId: string): Promise<Order | null> {
    return this.orders.find(order => order.id === orderId) || null;
  }

  async updateOrderStatus(orderId: string, status: Order['status']): Promise<Order | null> {
    const order = this.orders.find(o => o.id === orderId);
    if (order) {
      order.status = status;
      order.updated_at = new Date().toISOString();
      return order;
    }
    return null;
  }

  // Branches Operations
  async getBranches(): Promise<Branch[]> {
    return this.branches;
  }

  async getBranch(branchId: string): Promise<Branch | null> {
    return this.branches.find(branch => branch.id === branchId) || null;
  }

  // Admin Operations
  async authenticateAdmin(username: string, password: string): Promise<Admin | null> {
    const admin = this.admins.find(a => a.username === username && a.is_active);
    if (admin && admin.password_hash === password) { // في التطبيق الحقيقي، يجب مقارنة hash
      admin.last_login = new Date().toISOString();
      return admin;
    }
    return null;
  }

  // Cashier Operations
  async authenticateCashier(username: string, password: string): Promise<Cashier | null> {
    const cashier = this.cashiers.find(c => c.username === username && c.is_active);
    if (cashier && cashier.password_hash === password) { // في التطبيق الحقيقي، يجب مقارنة hash
      cashier.last_login = new Date().toISOString();
      return cashier;
    }
    return null;
  }

  // إحصائيات
  getCartStats(userId: string) {
    const userItems = this.cartItems.filter(item => item.user_id === userId);
    const userRewards = this.cartRewards.filter(cr => cr.user_id === userId);
    
    const totalItems = userItems.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = userItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // حساب الخصومات
    const totalDiscounts = userRewards
      .filter(cr => cr.reward_type === 'discount')
      .reduce((sum, cr) => sum + cr.reward_value, 0);
    
    const finalTotal = Math.max(0, subtotal - totalDiscounts);
    
    return {
      totalItems,
      subtotal,
      totalDiscounts,
      finalTotal,
      itemCount: userItems.length,
      appliedRewards: userRewards.length
    };
  }

  // إحصائيات عامة
  getDashboardStats() {
    const today = new Date().toDateString();
    const todayOrders = this.orders.filter(order => 
      new Date(order.created_at).toDateString() === today
    );

    return {
      totalProducts: this.products.filter(p => p.status === 'active').length,
      totalOrders: this.orders.length,
      todayOrders: todayOrders.length,
      totalCustomers: this.users.length,
      pendingOrders: this.orders.filter(o => o.status === 'pending').length,
      preparingOrders: this.orders.filter(o => o.status === 'preparing').length,
      readyOrders: this.orders.filter(o => o.status === 'ready').length,
      totalRevenue: this.orders.reduce((sum, order) => sum + order.total, 0),
      todayRevenue: todayOrders.reduce((sum, order) => sum + order.total, 0)
    };
  }

  // Inventory Management Methods
  getInventory(): InventoryItem[] {
    return this.inventory;
  }

  addInventoryItem(item: Omit<InventoryItem, 'id' | 'status'>): InventoryItem {
    const newItem: InventoryItem = {
      ...item,
      id: Date.now().toString(),
      status: this.calculateInventoryStatus(item.currentStock, item.minStock)
    };
    
    this.inventory.push(newItem);
    return newItem;
  }

  updateInventoryItem(id: string, updates: Partial<InventoryItem>): InventoryItem | null {
    const index = this.inventory.findIndex(item => item.id === id);
    if (index === -1) return null;

    const updatedItem = {
      ...this.inventory[index],
      ...updates,
      status: this.calculateInventoryStatus(
        updates.currentStock ?? this.inventory[index].currentStock,
        updates.minStock ?? this.inventory[index].minStock
      )
    };

    this.inventory[index] = updatedItem;
    return updatedItem;
  }

  deleteInventoryItem(id: string): boolean {
    const index = this.inventory.findIndex(item => item.id === id);
    if (index === -1) return false;

    this.inventory.splice(index, 1);
    return true;
  }

  private calculateInventoryStatus(currentStock: number, minStock: number): InventoryItem['status'] {
    if (currentStock === 0) return 'out_of_stock';
    if (currentStock <= minStock) return 'low_stock';
    return 'in_stock';
  }

  restockInventoryItem(id: string): InventoryItem | null {
    const item = this.inventory.find(i => i.id === id);
    if (!item) return null;

    return this.updateInventoryItem(id, {
      currentStock: item.maxStock,
      lastRestocked: new Date(),
      status: 'in_stock'
    });
  }
}

// إنشاء instance واحد من قاعدة البيانات
export const db = new Database();

// دالة مساعدة للتحقق من صحة البيانات
export const validateCartItem = (item: any): boolean => {
  return !!(
    item.user_id &&
    item.product_id &&
    item.product_name &&
    item.product_arabic_name &&
    typeof item.price === 'number' &&
    typeof item.quantity === 'number' &&
    item.quantity > 0
  );
};

// دالة مساعدة لحساب المجموع
export const calculateCartTotal = (items: CartItem[]): { subtotal: number; totalItems: number } => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  return { subtotal, totalItems };
};
