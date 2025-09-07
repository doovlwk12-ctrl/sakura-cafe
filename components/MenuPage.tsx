'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { getProductsByCategory, productImages } from '../data/productImages';
import SkeletonLoader from './SkeletonLoader';
import LoadingSpinner from './LoadingSpinner';

interface ProductCardProps {
  product: {
    id: string;
    englishName: string;
    arabicName: string;
    imagePath: string;
    category: 'drinks' | 'sweets' | 'sandwiches' | 'groups';
    price: number;
    calories: string;
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
      <div className="relative h-52 overflow-hidden bg-gradient-to-br from-pink-50 to-rose-50">
        {imageLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <LoadingSpinner size="lg" color="primary" />
          </div>
        )}
        
        {imageError ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-pink-100 to-rose-100">
            <div className="w-16 h-16 bg-gradient-to-r from-rose-400 to-pink-400 rounded-full flex items-center justify-center mb-3">
              <span className="text-white text-2xl font-bold">☕</span>
            </div>
            <p className="text-rose-600 text-sm font-medium text-center px-2">
              {product.englishName}
            </p>
          </div>
        ) : (
          <img
            src={product.imagePath}
            alt={product.englishName}
            className={`w-full h-full object-cover hover:scale-110 transition-transform duration-500 ${
              imageLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onError={handleImageError}
            onLoad={handleImageLoad}
          />
        )}
        
        <div className="absolute top-3 right-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
          {product.calories}
        </div>
        <div className="absolute top-3 left-3 bg-gradient-to-r from-pink-400 to-rose-400 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
          {product.category.toUpperCase()}
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-800 mb-2 text-right font-arabic">
          {product.arabicName}
        </h3>
        <h4 className="text-sm text-gray-600 mb-3 text-left font-english">
          {product.englishName}
        </h4>
        
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
            {product.price} SR
          </span>
          <button className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-5 py-2.5 rounded-lg hover:from-rose-600 hover:to-pink-600 transition-all duration-300 text-sm font-medium hover:shadow-lg transform hover:scale-105">
            أضف للسلة
          </button>
        </div>
      </div>
    </div>
  );
};

const MenuPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'drinks' | 'sweets' | 'sandwiches' | 'groups'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'calories'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isLoading, setIsLoading] = useState(true);

  const categories = [
    { id: 'all', name: 'الكل', englishName: 'ALL', count: productImages.length },
    { id: 'drinks', name: 'المشروبات', englishName: 'DRINKS', count: productImages.filter(p => p.category === 'drinks').length },
    { id: 'sweets', name: 'الحلويات', englishName: 'SWEET', count: productImages.filter(p => p.category === 'sweets').length },
    { id: 'sandwiches', name: 'ساندويتشات', englishName: 'SANDWICHES', count: productImages.filter(p => p.category === 'sandwiches').length },
    { id: 'groups', name: 'المجموعات', englishName: 'GROUPS', count: productImages.filter(p => p.category === 'groups').length }
  ];

  // محاكاة وقت التحميل
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // تصفية وترتيب المنتجات
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = productImages;
    
    // تصفية حسب الفئة
    if (activeCategory !== 'all') {
      filtered = filtered.filter(product => product.category === activeCategory);
    }
    
    // تصفية حسب البحث
    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.englishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.arabicName.includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // ترتيب المنتجات
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'name':
          aValue = a.englishName.toLowerCase();
          bValue = b.englishName.toLowerCase();
          break;
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'calories':
          aValue = parseInt(a.calories);
          bValue = parseInt(b.calories);
          break;
        default:
          aValue = a.englishName.toLowerCase();
          bValue = b.englishName.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    return filtered;
  }, [activeCategory, searchTerm, sortBy, sortOrder]);

  const handleSort = (field: 'name' | 'price' | 'calories') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-4 font-english">
              Our Menu
            </h1>
            <h2 className="text-3xl font-semibold text-rose-500 mb-2 font-arabic">
              قائمة الطعام
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto font-arabic">
              اكتشف أجمل نكهات القهوة والمأكولات الشرقية والغربية في أجواء هادئة ومريحة
            </p>
          </div>
          <SkeletonLoader count={12} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-4 font-english">
            Our Menu
          </h1>
          <h2 className="text-3xl font-semibold text-rose-500 mb-2 font-arabic">
            قائمة الطعام
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto font-arabic">
            اكتشف أجمل نكهات القهوة والمأكولات الشرقية والغربية في أجواء هادئة ومريحة
          </p>
        </div>

        {/* Search and Sort Controls */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8 animate-slide-in border border-pink-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="ابحث عن منتج..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border border-pink-200 rounded-xl focus:ring-2 focus:ring-rose-400 focus:border-transparent pr-10 transition-all duration-300"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Sort Controls */}
            <div className="flex gap-2">
              <button
                onClick={() => handleSort('name')}
                className={`px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                  sortBy === 'name' ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg' : 'bg-pink-50 text-gray-700 hover:bg-pink-100'
                }`}
              >
                الاسم {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
              </button>
              <button
                onClick={() => handleSort('price')}
                className={`px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                  sortBy === 'price' ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg' : 'bg-pink-50 text-gray-700 hover:bg-pink-100'
                }`}
              >
                السعر {sortBy === 'price' && (sortOrder === 'asc' ? '↑' : '↓')}
              </button>
            </div>

            {/* Results Count */}
            <div className="text-center text-gray-600 font-medium">
              {filteredAndSortedProducts.length} منتج
            </div>
          </div>
        </div>

        {/* Category Navigation */}
        <div className="flex justify-center mb-8 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl p-3 flex flex-wrap justify-center gap-3 border border-pink-100">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id as any)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  activeCategory === category.id
                    ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg transform scale-105'
                    : 'text-gray-600 hover:text-rose-500 hover:bg-pink-50'
                }`}
              >
                <div className="text-center">
                  <div className="text-sm font-bold">{category.englishName}</div>
                  <div className="text-xs">{category.name}</div>
                  <div className="text-xs opacity-75">({category.count})</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Category Title */}
        {activeCategory !== 'all' && (
          <div className="text-center mb-8 animate-fade-in">
            <h3 className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-2 font-english">
              {categories.find(c => c.id === activeCategory)?.englishName}
            </h3>
            <h4 className="text-xl text-rose-500 font-arabic">
              {categories.find(c => c.id === activeCategory)?.name}
            </h4>
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedProducts.map((product, index) => (
            <div key={product.id} style={{ animationDelay: `${index * 0.1}s` }} className="animate-fade-in">
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredAndSortedProducts.length === 0 && (
          <div className="text-center py-16 animate-fade-in">
            <div className="text-pink-400 text-8xl mb-6">🍽️</div>
            <h3 className="text-2xl font-medium text-gray-600 mb-3 font-arabic">
              لا توجد منتجات تطابق البحث
            </h3>
            <p className="text-gray-500 mb-4 font-english">
              No products match your search criteria
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setActiveCategory('all');
              }}
              className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-6 py-3 rounded-xl hover:from-rose-600 hover:to-pink-600 transition-all duration-300 font-medium shadow-lg"
            >
              عرض جميع المنتجات
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-16 pt-8 border-t border-pink-200 animate-fade-in">
          <p className="text-gray-600 mb-2 font-arabic">
            جميع الأسعار تشمل ضريبة القيمة المضافة
          </p>
          <p className="text-gray-500 text-sm font-english">
            All prices include VAT
          </p>
          <div className="mt-4 text-sm text-pink-400">
            تم العثور على {productImages.length} منتج في {categories.length - 1} فئة
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuPage;
