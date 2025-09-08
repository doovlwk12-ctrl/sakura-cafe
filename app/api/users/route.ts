import { NextRequest, NextResponse } from 'next/server';

// محاكاة قاعدة البيانات (في التطبيق الحقيقي ستكون قاعدة بيانات حقيقية)
let usersDatabase: any[] = [
  {
    id: 'user-001',
    username: 'ahmed@example.com',
    fullName: 'أحمد سالم',
    email: 'ahmed@example.com',
    phone: '+966501234567',
    role: 'customer',
    joinDate: '2025-01-15',
    loyaltyPoints: 250,
    totalOrders: 12,
    isActive: true,
    createdAt: '2025-01-15T10:30:00Z',
    updatedAt: '2025-01-15T10:30:00Z'
  },
  {
    id: 'user-002',
    username: 'sara@example.com',
    fullName: 'سارة علي',
    email: 'sara@example.com',
    phone: '+966507654321',
    role: 'customer',
    joinDate: '2025-01-20',
    loyaltyPoints: 180,
    totalOrders: 8,
    isActive: true,
    createdAt: '2025-01-20T14:20:00Z',
    updatedAt: '2025-01-20T14:20:00Z'
  }
];

// GET - جلب جميع المستخدمين (للمشرفين فقط)
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    
    // محاكاة التحقق من التوكن
    if (!token || token === 'invalid') {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // إرجاع قائمة المستخدمين
    return NextResponse.json({
      success: true,
      users: usersDatabase,
      total: usersDatabase.length
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - إنشاء مستخدم جديد (التسجيل)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, fullName, email, phone, password } = body;

    // التحقق من البيانات المطلوبة
    if (!username || !fullName || !email || !phone || !password) {
      return NextResponse.json(
        { error: 'جميع الحقول مطلوبة' },
        { status: 400 }
      );
    }

    // التحقق من وجود المستخدم مسبقاً
    const existingUser = usersDatabase.find(user => 
      user.email === email || user.username === username
    );

    if (existingUser) {
      return NextResponse.json(
        { error: 'المستخدم موجود مسبقاً' },
        { status: 409 }
      );
    }

    // إنشاء مستخدم جديد
    const newUser = {
      id: `user-${Date.now()}`,
      username,
      fullName,
      email,
      phone,
      password: password, // في التطبيق الحقيقي يجب تشفير كلمة المرور
      role: 'customer',
      joinDate: new Date().toISOString().split('T')[0],
      loyaltyPoints: 0,
      totalOrders: 0,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // حفظ المستخدم في قاعدة البيانات
    usersDatabase.push(newUser);

    // إرجاع بيانات المستخدم (بدون كلمة المرور)
    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json({
      success: true,
      message: 'تم إنشاء الحساب بنجاح',
      user: userWithoutPassword
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - تحديث بيانات المستخدم
export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const body = await request.json();
    const { userId, ...updateData } = body;

    // البحث عن المستخدم
    const userIndex = usersDatabase.findIndex(user => user.id === userId);
    
    if (userIndex === -1) {
      return NextResponse.json(
        { error: 'المستخدم غير موجود' },
        { status: 404 }
      );
    }

    // تحديث بيانات المستخدم
    usersDatabase[userIndex] = {
      ...usersDatabase[userIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    // إرجاع البيانات المحدثة (بدون كلمة المرور)
    const { password: _, ...updatedUser } = usersDatabase[userIndex];

    return NextResponse.json({
      success: true,
      message: 'تم تحديث البيانات بنجاح',
      user: updatedUser
    });

  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - حذف المستخدم
export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'معرف المستخدم مطلوب' },
        { status: 400 }
      );
    }

    // البحث عن المستخدم وحذفه
    const userIndex = usersDatabase.findIndex(user => user.id === userId);
    
    if (userIndex === -1) {
      return NextResponse.json(
        { error: 'المستخدم غير موجود' },
        { status: 404 }
      );
    }

    // حذف المستخدم
    usersDatabase.splice(userIndex, 1);

    return NextResponse.json({
      success: true,
      message: 'تم حذف المستخدم بنجاح'
    });

  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
