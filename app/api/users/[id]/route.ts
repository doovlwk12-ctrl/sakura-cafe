import { NextRequest, NextResponse } from 'next/server';

// محاكاة قاعدة البيانات (نفس البيانات من الملف الرئيسي)
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

// GET - جلب بيانات مستخدم محدد
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const userId = params.id;

    // البحث عن المستخدم
    const user = usersDatabase.find(u => u.id === userId);
    
    if (!user) {
      return NextResponse.json(
        { error: 'المستخدم غير موجود' },
        { status: 404 }
      );
    }

    // إرجاع بيانات المستخدم (بدون كلمة المرور)
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      success: true,
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - تحديث بيانات مستخدم محدد
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const userId = params.id;
    const body = await request.json();

    // البحث عن المستخدم
    const userIndex = usersDatabase.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return NextResponse.json(
        { error: 'المستخدم غير موجود' },
        { status: 404 }
      );
    }

    // تحديث بيانات المستخدم
    usersDatabase[userIndex] = {
      ...usersDatabase[userIndex],
      ...body,
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

// DELETE - حذف مستخدم محدد
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const userId = params.id;

    // البحث عن المستخدم
    const userIndex = usersDatabase.findIndex(u => u.id === userId);
    
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
