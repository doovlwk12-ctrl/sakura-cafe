import { NextRequest, NextResponse } from 'next/server';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  isFreeProduct?: boolean;
}

interface Cart {
  userId: string;
  items: CartItem[];
  subtotal: number;
  total: number;
  appliedDiscounts: any[];
  pointsUsed: number;
  rewardsApplied: any[];
}

interface Reward {
  id: string;
  name: string;
  type: 'discount' | 'free_item' | 'points';
  value: number;
  pointsRequired: number;
  description: string;
  isAvailable: boolean;
}

// محاكاة قاعدة البيانات
let cartDatabase: Cart[] = [];
let rewardsDatabase: Reward[] = [
  {
    id: 'reward-001',
    name: 'خصم 10 ريال',
    type: 'discount',
    value: 10,
    pointsRequired: 100,
    description: 'خصم 10 ريال على أي طلب',
    isAvailable: true
  },
  {
    id: 'reward-002',
    name: 'خصم 20 ريال',
    type: 'discount',
    value: 20,
    pointsRequired: 200,
    description: 'خصم 20 ريال على أي طلب',
    isAvailable: true
  },
  {
    id: 'reward-003',
    name: 'قهوة مجانية',
    type: 'free_item',
    value: 15,
    pointsRequired: 150,
    description: 'قهوة مجانية من اختيارك',
    isAvailable: true
  }
];

// GET - جلب سلة التسوق مع المكافآت المتاحة
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = request.headers.get('user-id');
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // البحث عن سلة التسوق
    let userCart = cartDatabase.find(cart => cart.userId === userId);
    
    if (!userCart) {
      // إنشاء سلة تسوق فارغة
      userCart = {
        userId,
        items: [],
        subtotal: 0.00,
        total: 0.00,
        appliedDiscounts: [],
        pointsUsed: 0,
        rewardsApplied: []
      };
      cartDatabase.push(userCart);
    }

    // محاولة قراءة سلة التسوق من localStorage (محاكاة)
    // في التطبيق الحقيقي، سيتم إرسال بيانات السلة من الواجهة الأمامية
    const cartFromFrontend = request.headers.get('cart-data');
    if (cartFromFrontend) {
      try {
        const frontendCart = JSON.parse(cartFromFrontend);
        if (frontendCart.items && frontendCart.items.length > 0) {
          // تحديث سلة التسوق بالبيانات من الواجهة الأمامية
          userCart.items = frontendCart.items.map((item: any) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image || '/images/fallback.svg'
          }));
          
          // إعادة حساب المجموع
          userCart.subtotal = userCart.items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
          userCart.total = userCart.subtotal;
        }
      } catch (error) {
        console.error('Error parsing cart data from frontend:', error);
      }
    }

    // حساب المكافآت المتاحة بناءً على النقاط والسلة
    const availableRewards = rewardsDatabase.filter(reward => {
      // يمكن تحسين هذا المنطق بناءً على النقاط المتاحة للمستخدم
      return reward.isAvailable;
    });

    return NextResponse.json({
      success: true,
      cart: userCart,
      availableRewards,
      summary: {
        totalItems: userCart.items.length,
        subtotal: userCart.subtotal,
        totalDiscounts: userCart.appliedDiscounts.reduce((sum, discount) => sum + discount.value, 0),
        finalTotal: userCart.total,
        pointsUsed: userCart.pointsUsed
      }
    });

  } catch (error) {
    console.error('Error fetching integrated cart:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - تطبيق مكافأة على سلة التسوق
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { userId, rewardId, action } = body;

    if (!userId || !rewardId) {
      return NextResponse.json({ error: 'User ID and Reward ID are required' }, { status: 400 });
    }

    // البحث عن سلة التسوق
    let userCart = cartDatabase.find(cart => cart.userId === userId);
    if (!userCart) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
    }

    // البحث عن المكافأة
    const reward = rewardsDatabase.find(r => r.id === rewardId);
    if (!reward) {
      return NextResponse.json({ error: 'Reward not found' }, { status: 404 });
    }

    if (action === 'apply') {
      // تطبيق المكافأة
      if (reward.type === 'discount') {
        // إضافة خصم
        const discount = {
          id: `discount-${Date.now()}`,
          rewardId: reward.id,
          name: reward.name,
          value: reward.value,
          appliedAt: new Date().toISOString()
        };
        
        userCart.appliedDiscounts.push(discount);
        userCart.rewardsApplied.push({
          rewardId: reward.id,
          type: reward.type,
          appliedAt: new Date().toISOString()
        });
        
        // إعادة حساب المجموع
        const totalDiscounts = userCart.appliedDiscounts.reduce((sum, discount) => sum + discount.value, 0);
        userCart.total = Math.max(0, userCart.subtotal - totalDiscounts);
        
      } else if (reward.type === 'free_item') {
        // إضافة منتج مجاني
        const freeItem = {
          id: `free-${reward.id}`,
          name: reward.name,
          price: 0,
          quantity: 1,
          image: '/images/free-item.jpg',
          isFreeProduct: true
        };
        
        userCart.items.push(freeItem);
        userCart.rewardsApplied.push({
          rewardId: reward.id,
          type: reward.type,
          appliedAt: new Date().toISOString()
        });
        
        // إعادة حساب المجموع
        userCart.subtotal = userCart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const totalDiscounts = userCart.appliedDiscounts.reduce((sum, discount) => sum + discount.value, 0);
        userCart.total = Math.max(0, userCart.subtotal - totalDiscounts);
      }

    } else if (action === 'remove') {
      // إزالة المكافأة
      if (reward.type === 'discount') {
        userCart.appliedDiscounts = userCart.appliedDiscounts.filter(d => d.rewardId !== reward.id);
      } else if (reward.type === 'free_item') {
        userCart.items = userCart.items.filter(item => !(item.isFreeProduct && item.id.includes(reward.id)));
      }
      
      userCart.rewardsApplied = userCart.rewardsApplied.filter(r => r.rewardId !== reward.id);
      
      // إعادة حساب المجموع
      userCart.subtotal = userCart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const totalDiscounts = userCart.appliedDiscounts.reduce((sum, discount) => sum + discount.value, 0);
      userCart.total = Math.max(0, userCart.subtotal - totalDiscounts);
    }

    return NextResponse.json({
      success: true,
      message: `تم ${action === 'apply' ? 'تطبيق' : 'إزالة'} المكافأة بنجاح`,
      cart: userCart,
      summary: {
        totalItems: userCart.items.length,
        subtotal: userCart.subtotal,
        totalDiscounts: userCart.appliedDiscounts.reduce((sum, discount) => sum + discount.value, 0),
        finalTotal: userCart.total,
        pointsUsed: userCart.pointsUsed
      }
    });

  } catch (error) {
    console.error('Error applying reward:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
