'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CubeIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ArrowPathIcon,
  ChartBarIcon,
  TruckIcon,
  ShoppingCartIcon
} from '@heroicons/react/24/outline';
import { useLanguage } from '../hooks/LanguageProvider';

interface InventoryItem {
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

interface InventoryManagementProps {
  onStockAlert?: (item: InventoryItem) => void;
}

const InventoryManagement: React.FC<InventoryManagementProps> = ({ onStockAlert }) => {
  const { t, isRTL } = useLanguage();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [filteredInventory, setFilteredInventory] = useState<InventoryItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [newItem, setNewItem] = useState<Partial<InventoryItem>>({});

  // بيانات تجريبية للمخزون
  const mockInventory: InventoryItem[] = [
    {
      id: '1',
      name: 'Coffee Beans',
      arabicName: 'حبوب القهوة',
      category: 'beverages',
      currentStock: 15,
      minStock: 20,
      maxStock: 100,
      unit: 'kg',
      cost: 45,
      price: 0,
      supplier: 'مورد القهوة الممتاز',
      lastRestocked: new Date('2024-01-10'),
      status: 'low_stock'
    },
    {
      id: '2',
      name: 'Milk',
      arabicName: 'الحليب',
      category: 'beverages',
      currentStock: 8,
      minStock: 10,
      maxStock: 50,
      unit: 'liter',
      cost: 12,
      price: 0,
      supplier: 'شركة الألبان الوطنية',
      lastRestocked: new Date('2024-01-12'),
      expiryDate: new Date('2024-01-20'),
      status: 'low_stock'
    },
    {
      id: '3',
      name: 'Sugar',
      arabicName: 'السكر',
      category: 'ingredients',
      currentStock: 25,
      minStock: 5,
      maxStock: 50,
      unit: 'kg',
      cost: 8,
      price: 0,
      supplier: 'مورد السكر المحلي',
      lastRestocked: new Date('2024-01-08'),
      status: 'in_stock'
    },
    {
      id: '4',
      name: 'Croissant',
      arabicName: 'الكرواسون',
      category: 'pastries',
      currentStock: 0,
      minStock: 10,
      maxStock: 30,
      unit: 'piece',
      cost: 3,
      price: 12,
      supplier: 'مخبز الصباح',
      lastRestocked: new Date('2024-01-05'),
      expiryDate: new Date('2024-01-15'),
      status: 'out_of_stock'
    },
    {
      id: '5',
      name: 'Brownie',
      arabicName: 'البراونيز',
      category: 'pastries',
      currentStock: 12,
      minStock: 5,
      maxStock: 25,
      unit: 'piece',
      cost: 4,
      price: 15,
      supplier: 'مخبز الحلويات',
      lastRestocked: new Date('2024-01-11'),
      expiryDate: new Date('2024-01-18'),
      status: 'in_stock'
    }
  ];

  const categories = [
    { id: 'all', label: 'الكل', icon: '📦' },
    { id: 'beverages', label: 'المشروبات', icon: '☕' },
    { id: 'ingredients', label: 'المكونات', icon: '🧂' },
    { id: 'pastries', label: 'الحلويات', icon: '🥐' },
    { id: 'equipment', label: 'المعدات', icon: '🔧' }
  ];

  useEffect(() => {
    setInventory(mockInventory);
    setFilteredInventory(mockInventory);
  }, []);

  useEffect(() => {
    let filtered = inventory;

    // تصفية حسب الفئة
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // تصفية حسب البحث
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.arabicName.includes(searchTerm)
      );
    }

    setFilteredInventory(filtered);
  }, [inventory, selectedCategory, searchTerm]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in_stock':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'low_stock':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'out_of_stock':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'expired':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'in_stock':
        return 'متوفر';
      case 'low_stock':
        return 'مخزون منخفض';
      case 'out_of_stock':
        return 'نفد المخزون';
      case 'expired':
        return 'منتهي الصلاحية';
      default:
        return 'غير محدد';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'in_stock':
        return <CheckCircleIcon className="w-4 h-4" />;
      case 'low_stock':
        return <ExclamationTriangleIcon className="w-4 h-4" />;
      case 'out_of_stock':
        return <ExclamationTriangleIcon className="w-4 h-4" />;
      case 'expired':
        return <ExclamationTriangleIcon className="w-4 h-4" />;
      default:
        return <CubeIcon className="w-4 h-4" />;
    }
  };

  const handleAddItem = () => {
    if (newItem.name && newItem.arabicName && newItem.category) {
      const item: InventoryItem = {
        id: Date.now().toString(),
        name: newItem.name || '',
        arabicName: newItem.arabicName || '',
        category: newItem.category || '',
        currentStock: newItem.currentStock || 0,
        minStock: newItem.minStock || 0,
        maxStock: newItem.maxStock || 0,
        unit: newItem.unit || 'piece',
        cost: newItem.cost || 0,
        price: newItem.price || 0,
        supplier: newItem.supplier || '',
        lastRestocked: new Date(),
        status: 'in_stock'
      };

      setInventory(prev => [...prev, item]);
      setNewItem({});
      setShowAddModal(false);
    }
  };

  const handleEditItem = (item: InventoryItem) => {
    setSelectedItem(item);
    setShowEditModal(true);
  };

  const handleUpdateItem = () => {
    if (selectedItem) {
      setInventory(prev =>
        prev.map(item =>
          item.id === selectedItem.id ? selectedItem : item
        )
      );
      setShowEditModal(false);
      setSelectedItem(null);
    }
  };

  const handleDeleteItem = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا العنصر؟')) {
      setInventory(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleRestock = (id: string) => {
    const item = inventory.find(i => i.id === id);
    if (item) {
      const updatedItem = {
        ...item,
        currentStock: item.maxStock,
        lastRestocked: new Date(),
        status: 'in_stock' as const
      };
      setInventory(prev =>
        prev.map(i => i.id === id ? updatedItem : i)
      );
    }
  };

  const getInventoryStats = () => {
    const totalItems = inventory.length;
    const lowStockItems = inventory.filter(item => item.status === 'low_stock').length;
    const outOfStockItems = inventory.filter(item => item.status === 'out_of_stock').length;
    const totalValue = inventory.reduce((sum, item) => sum + (item.currentStock * item.cost), 0);

    return { totalItems, lowStockItems, outOfStockItems, totalValue };
  };

  const stats = getInventoryStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1f2937] dark:text-[#f9fafb] font-arabic">
            إدارة المخزون
          </h2>
          <p className="text-[#6b7280] dark:text-[#9ca3af] font-arabic">
            إدارة وتتبع المخزون والمواد الخام
          </p>
        </div>
        
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#e57373] text-white rounded-lg hover:bg-[#d65a5a] transition-colors font-arabic"
        >
          <PlusIcon className="w-5 h-5" />
          إضافة عنصر
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-[#1f2937] border border-gray-200 dark:border-[#374151] rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <CubeIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-[#1f2937] dark:text-[#f9fafb]">
                {stats.totalItems}
              </h3>
              <p className="text-sm text-[#6b7280] dark:text-[#9ca3af] font-arabic">
                إجمالي العناصر
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1f2937] border border-gray-200 dark:border-[#374151] rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
              <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-[#1f2937] dark:text-[#f9fafb]">
                {stats.lowStockItems}
              </h3>
              <p className="text-sm text-[#6b7280] dark:text-[#9ca3af] font-arabic">
                مخزون منخفض
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1f2937] border border-gray-200 dark:border-[#374151] rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
              <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-[#1f2937] dark:text-[#f9fafb]">
                {stats.outOfStockItems}
              </h3>
              <p className="text-sm text-[#6b7280] dark:text-[#9ca3af] font-arabic">
                نفد المخزون
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1f2937] border border-gray-200 dark:border-[#374151] rounded-xl p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <ChartBarIcon className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-[#1f2937] dark:text-[#f9fafb]">
                {stats.totalValue.toLocaleString()}
              </h3>
              <p className="text-sm text-[#6b7280] dark:text-[#9ca3af] font-arabic">
                قيمة المخزون (ريال)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="البحث في المخزون..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-3 border border-gray-300 dark:border-[#374151] rounded-lg bg-white dark:bg-[#1f2937] text-[#1f2937] dark:text-[#f9fafb] focus:ring-2 focus:ring-[#e57373] focus:border-transparent transition-all duration-300 font-arabic"
        />
        
        <div className="flex gap-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all duration-200 ${
                selectedCategory === category.id
                  ? 'bg-[#e57373] text-white'
                  : 'bg-white dark:bg-[#1f2937] text-[#6b7280] dark:text-[#9ca3af] hover:bg-[#fce7e7] dark:hover:bg-[#374151] border border-gray-200 dark:border-[#374151]'
              }`}
            >
              <span>{category.icon}</span>
              <span className="font-arabic">{category.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white dark:bg-[#1f2937] border border-gray-200 dark:border-[#374151] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-[#374151]">
              <tr>
                <th className="text-right py-4 px-6 text-[#1f2937] dark:text-[#f9fafb] font-arabic">العنصر</th>
                <th className="text-right py-4 px-6 text-[#1f2937] dark:text-[#f9fafb] font-arabic">المخزون الحالي</th>
                <th className="text-right py-4 px-6 text-[#1f2937] dark:text-[#f9fafb] font-arabic">الحد الأدنى</th>
                <th className="text-right py-4 px-6 text-[#1f2937] dark:text-[#f9fafb] font-arabic">التكلفة</th>
                <th className="text-right py-4 px-6 text-[#1f2937] dark:text-[#f9fafb] font-arabic">المورد</th>
                <th className="text-right py-4 px-6 text-[#1f2937] dark:text-[#f9fafb] font-arabic">الحالة</th>
                <th className="text-right py-4 px-6 text-[#1f2937] dark:text-[#f9fafb] font-arabic">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.map((item, index) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-gray-100 dark:border-[#374151]/50 hover:bg-gray-50 dark:hover:bg-[#374151]/50 transition-colors"
                >
                  <td className="py-4 px-6">
                    <div>
                      <h4 className="font-semibold text-[#1f2937] dark:text-[#f9fafb] font-arabic">
                        {item.arabicName}
                      </h4>
                      <p className="text-sm text-[#6b7280] dark:text-[#9ca3af]">
                        {item.name}
                      </p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-[#1f2937] dark:text-[#f9fafb] font-medium">
                      {item.currentStock} {item.unit}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-[#1f2937] dark:text-[#f9fafb]">
                      {item.minStock} {item.unit}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-[#1f2937] dark:text-[#f9fafb]">
                      {item.cost} ريال
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-[#1f2937] dark:text-[#f9fafb] font-arabic">
                      {item.supplier}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(item.status)}`}>
                      {getStatusIcon(item.status)}
                      {getStatusText(item.status)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditItem(item)}
                        className="p-2 text-[#6b7280] dark:text-[#9ca3af] hover:text-[#e57373] transition-colors"
                        title="تعديل"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleRestock(item.id)}
                        className="p-2 text-[#6b7280] dark:text-[#9ca3af] hover:text-green-600 transition-colors"
                        title="إعادة تموين"
                      >
                        <TruckIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-2 text-[#6b7280] dark:text-[#9ca3af] hover:text-red-600 transition-colors"
                        title="حذف"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-[#1f2937] rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-[#1f2937] dark:text-[#f9fafb] font-arabic mb-4">
              إضافة عنصر جديد
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#1f2937] dark:text-[#f9fafb] font-arabic mb-2">
                  اسم العنصر (عربي)
                </label>
                <input
                  type="text"
                  value={newItem.arabicName || ''}
                  onChange={(e) => setNewItem(prev => ({ ...prev, arabicName: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-[#374151] rounded-lg bg-white dark:bg-[#1f2937] text-[#1f2937] dark:text-[#f9fafb] focus:ring-2 focus:ring-[#e57373] focus:border-transparent transition-all duration-300 font-arabic"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#1f2937] dark:text-[#f9fafb] font-arabic mb-2">
                  اسم العنصر (إنجليزي)
                </label>
                <input
                  type="text"
                  value={newItem.name || ''}
                  onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-[#374151] rounded-lg bg-white dark:bg-[#1f2937] text-[#1f2937] dark:text-[#f9fafb] focus:ring-2 focus:ring-[#e57373] focus:border-transparent transition-all duration-300"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#1f2937] dark:text-[#f9fafb] font-arabic mb-2">
                  الفئة
                </label>
                <select
                  value={newItem.category || ''}
                  onChange={(e) => setNewItem(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-[#374151] rounded-lg bg-white dark:bg-[#1f2937] text-[#1f2937] dark:text-[#f9fafb] focus:ring-2 focus:ring-[#e57373] focus:border-transparent transition-all duration-300 font-arabic"
                >
                  <option value="">اختر الفئة</option>
                  {categories.slice(1).map(category => (
                    <option key={category.id} value={category.id}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#1f2937] dark:text-[#f9fafb] font-arabic mb-2">
                    المخزون الحالي
                  </label>
                  <input
                    type="number"
                    value={newItem.currentStock || ''}
                    onChange={(e) => setNewItem(prev => ({ ...prev, currentStock: parseInt(e.target.value) || 0 }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-[#374151] rounded-lg bg-white dark:bg-[#1f2937] text-[#1f2937] dark:text-[#f9fafb] focus:ring-2 focus:ring-[#e57373] focus:border-transparent transition-all duration-300"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#1f2937] dark:text-[#f9fafb] font-arabic mb-2">
                    الحد الأدنى
                  </label>
                  <input
                    type="number"
                    value={newItem.minStock || ''}
                    onChange={(e) => setNewItem(prev => ({ ...prev, minStock: parseInt(e.target.value) || 0 }))}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-[#374151] rounded-lg bg-white dark:bg-[#1f2937] text-[#1f2937] dark:text-[#f9fafb] focus:ring-2 focus:ring-[#e57373] focus:border-transparent transition-all duration-300"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#1f2937] dark:text-[#f9fafb] font-arabic mb-2">
                  التكلفة (ريال)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={newItem.cost || ''}
                  onChange={(e) => setNewItem(prev => ({ ...prev, cost: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-[#374151] rounded-lg bg-white dark:bg-[#1f2937] text-[#1f2937] dark:text-[#f9fafb] focus:ring-2 focus:ring-[#e57373] focus:border-transparent transition-all duration-300"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleAddItem}
                className="flex-1 px-4 py-3 bg-[#e57373] text-white rounded-lg hover:bg-[#d65a5a] transition-colors font-arabic"
              >
                إضافة
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-3 bg-gray-200 dark:bg-[#374151] text-[#1f2937] dark:text-[#f9fafb] rounded-lg hover:bg-gray-300 dark:hover:bg-[#4b5563] transition-colors font-arabic"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryManagement;
