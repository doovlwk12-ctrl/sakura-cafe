'use client';

import React, { useEffect, useState } from "react";
import axios from "axios";

const UserManagement = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [form, setForm] = useState({ username: "", email: "", password: "", role: "cashier" });
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const token = localStorage.getItem("admin_token");

  // Fetch all users
  const fetchUsers = async () => {
    if (!token) {
      setError('غير مصرح لك بالوصول');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // محاكاة بيانات المستخدمين إذا لم يكن الخادم متاحاً
      const mockUsers = [
        { _id: '1', username: 'admin', email: 'admin@sakura.com', role: 'admin' },
        { _id: '2', username: 'cashier1', email: 'cashier1@sakura.com', role: 'cashier' },
        { _id: '3', username: 'user1', email: 'user1@sakura.com', role: 'user' }
      ];
      
      setUsers(mockUsers);
      
      // محاولة الاتصال بالخادم الحقيقي
      try {
        const res = await axios.get("http://localhost:5000/api/users", {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 3000
        });
        setUsers(res.data);
      } catch (serverError) {
        console.warn('Backend not available, using mock data');
      }
    } catch (err) {
      console.error(err);
      setError('فشل في تحميل البيانات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Add user
  const handleAddUser = async () => {
    if (!form.username || !form.email) {
      setError('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    try {
      // إضافة المستخدم محلياً أولاً
      const newUser = {
        _id: Date.now().toString(),
        username: form.username,
        email: form.email,
        role: form.role
      };
      
      setUsers(prev => [...prev, newUser]);
      setForm({ username: "", email: "", password: "", role: "cashier" });
      
      // محاولة إرسال للخادم
      try {
        await axios.post("http://localhost:5000/api/users", form, {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 3000
        });
      } catch (serverError) {
        console.warn('Backend not available, user added locally only');
      }
    } catch (err) {
      console.error(err);
      setError('فشل في إضافة المستخدم');
    }
  };

  // Update user
  const handleUpdateUser = async () => {
    if (!editingUser || !form.username || !form.email) {
      setError('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    try {
      // تحديث المستخدم محلياً
      setUsers(prev => prev.map(user => 
        user._id === editingUser._id 
          ? { ...user, username: form.username, email: form.email, role: form.role }
          : user
      ));
      
      setEditingUser(null);
      setForm({ username: "", email: "", password: "", role: "cashier" });
      
      // محاولة إرسال للخادم
      try {
        await axios.put(`http://localhost:5000/api/users/${editingUser._id}`, form, {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 3000
        });
      } catch (serverError) {
        console.warn('Backend not available, user updated locally only');
      }
    } catch (err) {
      console.error(err);
      setError('فشل في تحديث المستخدم');
    }
  };

  // Delete user
  const handleDeleteUser = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
      return;
    }

    try {
      // حذف المستخدم محلياً
      setUsers(prev => prev.filter(user => user._id !== id));
      
      // محاولة إرسال للخادم
      try {
        await axios.delete(`http://localhost:5000/api/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 3000
        });
      } catch (serverError) {
        console.warn('Backend not available, user deleted locally only');
      }
    } catch (err) {
      console.error(err);
      setError('فشل في حذف المستخدم');
    }
  };

  return (
    <div className="p-3 md:p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-deep-50">👤 إدارة المستخدمين</h1>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="mb-4 text-center">
          <div className="inline-flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-sakura-50"></div>
            <span>جاري التحميل...</span>
          </div>
        </div>
      )}

      {/* Form */}
      <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <input
            className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-sakura-50"
            type="text"
            placeholder="اسم المستخدم"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />
          <input
            className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-sakura-50"
            type="email"
            placeholder="البريد الإلكتروني"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-sakura-50"
            type="password"
            placeholder="كلمة المرور"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <select
            className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-sakura-50"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="admin">مدير</option>
            <option value="cashier">كاشير</option>
            <option value="user">مستخدم</option>
          </select>
        </div>

        {editingUser ? (
          <button onClick={handleUpdateUser} className="btn-secondary">
            تحديث المستخدم
          </button>
        ) : (
          <button onClick={handleAddUser} className="btn-primary">
            إضافة مستخدم
          </button>
        )}
      </div>

      {/* User List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-deep-50">قائمة المستخدمين ({users.length})</h3>
        
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-deep-50 text-white">
                <th className="border border-gray-300 p-3 text-right">اسم المستخدم</th>
                <th className="border border-gray-300 p-3 text-right">البريد الإلكتروني</th>
                <th className="border border-gray-300 p-3 text-right">الدور</th>
                <th className="border border-gray-300 p-3 text-right">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 p-3 text-right">{user.username}</td>
                  <td className="border border-gray-300 p-3 text-right">{user.email}</td>
                  <td className="border border-gray-300 p-3 text-right">
                    <span className={`px-2 py-1 rounded text-xs ${
                      user.role === 'admin' ? 'bg-red-100 text-red-800' :
                      user.role === 'cashier' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {user.role === 'admin' ? 'مدير' : 
                       user.role === 'cashier' ? 'كاشير' : 'مستخدم'}
                    </span>
                  </td>
                  <td className="border border-gray-300 p-3 text-right">
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => {
                          setEditingUser(user);
                          setForm({ username: user.username, email: user.email, password: "", role: user.role });
                        }}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                      >
                        تعديل
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                      >
                        حذف
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-3">
          {users.map((user) => (
            <div key={user._id} className="border border-gray-300 rounded-lg p-4 bg-white">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-bold text-gray-800">{user.username}</h4>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${
                  user.role === 'admin' ? 'bg-red-100 text-red-800' :
                  user.role === 'cashier' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {user.role === 'admin' ? 'مدير' : 
                   user.role === 'cashier' ? 'كاشير' : 'مستخدم'}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingUser(user);
                    setForm({ username: user.username, email: user.email, password: "", role: user.role });
                  }}
                  className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded text-sm"
                >
                  تعديل
                </button>
                <button
                  onClick={() => handleDeleteUser(user._id)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded text-sm"
                >
                  حذف
                </button>
              </div>
            </div>
          ))}
        </div>

        {users.length === 0 && !loading && (
          <div className="text-center py-8 text-gray-500">
            لا توجد مستخدمين
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
