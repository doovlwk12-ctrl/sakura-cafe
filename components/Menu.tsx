'use client';

import React, { useState } from 'react';
import { getProductInfo } from '../data/productImages';
import { useLanguage } from '../hooks/LanguageProvider';
import { useCart } from '../hooks/useCart';

interface MenuItem {
  id: string;
  name: string;
  arabicName: string;
  description: string;
  price: string;
  calories: string;
  category: 'drinks' | 'sweets' | 'sandwiches' | 'groups';
  image: string;
  popular?: boolean;
}

const menuItems: MenuItem[] = [
  // المشروبات - DRINKS
  {
    id: 'hot-coffee-day',
    name: 'Hot Coffee Day',
    arabicName: 'قهوة اليوم حار',
    description: 'قهوة تركية تقليدية مع الهيل والزعفران',
    price: '18 SR',
    calories: '120 CAL',
    category: 'drinks',
    image: getProductInfo('Hot Coffee Day')?.imagePath || '/images/coffee.svg',
    popular: true
  },
  {
    id: 'ice-coffee-day',
    name: 'Ice Coffee Day',
    arabicName: 'قهوة اليوم بارد',
    description: 'قهوة تركية باردة منعشة مع الهيل',
    price: '20 SR',
    calories: '140 CAL',
    category: 'drinks',
    image: getProductInfo('Ice Coffee Day')?.imagePath || '/images/coffee.svg',
    popular: true
  },
  {
    id: 'flat-white',
    name: 'Flat White',
    arabicName: 'فلات وايت',
    description: 'قهوة إيطالية مع حليب مبخر ناعم',
    price: '22 SR',
    calories: '160 CAL',
    category: 'drinks',
    image: getProductInfo('Flat White')?.imagePath || '/images/coffee.svg'
  },
  {
    id: 'cappuccino',
    name: 'Cappuccino',
    arabicName: 'كابوتشينو',
    description: 'قهوة إيطالية كلاسيكية مع رغوة الحليب',
    price: '20 SR',
    calories: '150 CAL',
    category: 'drinks',
    image: getProductInfo('Cappuccino')?.imagePath || '/images/cappuccino.svg'
  },
  {
    id: 'hot-espresso',
    name: 'Hot Espresso',
    arabicName: 'اسبريسو حار',
    description: 'قهوة إيطالية مركزة ونقية',
    price: '15 SR',
    calories: '80 CAL',
    category: 'drinks',
    image: getProductInfo('Hot Espresso')?.imagePath || '/images/coffee.svg'
  },
  {
    id: 'ice-espresso',
    name: 'Ice Espresso',
    arabicName: 'اسبريسو بارد',
    description: 'اسبريسو باردة منعشة',
    price: '17 SR',
    calories: '90 CAL',
    category: 'drinks',
    image: getProductInfo('Ice Espresso')?.imagePath || '/images/coffee.svg'
  },
  {
    id: 'hot-latte',
    name: 'Hot Latte',
    arabicName: 'لاتيه حار',
    description: 'قهوة مع حليب دافئ ورغوة ناعمة',
    price: '22 SR',
    calories: '180 CAL',
    category: 'drinks',
    image: getProductInfo('Hot Latte')?.imagePath || '/images/latte.svg'
  },
  {
    id: 'iced-latte',
    name: 'Iced Latte',
    arabicName: 'لاتيه بارد',
    description: 'لاتيه باردة مع ثلج',
    price: '24 SR',
    calories: '200 CAL',
    category: 'drinks',
    image: getProductInfo('Iced Latte')?.imagePath || '/images/latte.svg'
  },
  {
    id: 'hot-spanish-latte',
    name: 'Hot Spanish Latte',
    arabicName: 'اسبانيش لاتيه حار',
    description: 'لاتيه مع الحليب المكثف المحلى',
    price: '25 SR',
    calories: '220 CAL',
    category: 'drinks',
    image: getProductInfo('Hot Spanish Latte')?.imagePath || '/images/latte.svg'
  },
  {
    id: 'iced-spanish-latte',
    name: 'Iced Spanish Latte',
    arabicName: 'اسبانيش لاتيه بارد',
    description: 'اسبانيش لاتيه باردة منعشة',
    price: '27 SR',
    calories: '240 CAL',
    category: 'drinks',
    image: getProductInfo('Iced Spanish Latte')?.imagePath || '/images/latte.svg'
  },
  {
    id: 'hot-americano',
    name: 'Hot Americano',
    arabicName: 'أمريكانو حار',
    description: 'قهوة أمريكية مع ماء ساخن',
    price: '18 SR',
    calories: '100 CAL',
    category: 'drinks',
    image: getProductInfo('Hot Americano')?.imagePath || '/images/coffee.svg'
  },
  {
    id: 'ice-americano',
    name: 'Ice Americano',
    arabicName: 'أمريكانو بارد',
    description: 'أمريكانو باردة مع ثلج',
    price: '20 SR',
    calories: '110 CAL',
    category: 'drinks',
    image: getProductInfo('Ice Americano')?.imagePath || '/images/coffee.svg'
  },
  {
    id: 'cortado',
    name: 'Cortado',
    arabicName: 'كورتادو',
    description: 'قهوة إسبانية مع حليب مبخر',
    price: '19 SR',
    calories: '120 CAL',
    category: 'drinks',
    image: getProductInfo('Cortado')?.imagePath || '/images/coffee.svg'
  },
  {
    id: 'tea',
    name: 'Tea',
    arabicName: 'شاي',
    description: 'شاي أسود تقليدي',
    price: '12 SR',
    calories: '60 CAL',
    category: 'drinks',
    image: getProductInfo('Tea')?.imagePath || '/images/hibiscus.svg'
  },
  {
    id: 'water',
    name: 'Water',
    arabicName: 'ماء',
    description: 'ماء معدني طبيعي',
    price: '5 SR',
    calories: '0 CAL',
    category: 'drinks',
    image: getProductInfo('Water')?.imagePath || '/images/coffee.svg'
  },
  {
    id: 'hibiscus',
    name: 'Hibiscus',
    arabicName: 'هيبسكس',
    description: 'مشروب كركديه منعش',
    price: '15 SR',
    calories: '80 CAL',
    category: 'drinks',
    image: getProductInfo('Hibiscus')?.imagePath || '/images/hibiscus.svg'
  },

  // الحلويات - SWEET
  {
    id: 'brownies',
    name: 'Brownies',
    arabicName: 'براونيز',
    description: 'براونيز شوكولاتة غنية',
    price: '18 SR',
    calories: '280 CAL',
    category: 'sweets',
    image: getProductInfo('Brownies')?.imagePath || '/images/brownie.svg'
  },
  {
    id: 'pistachio-bits',
    name: 'Pistachio Bits',
    arabicName: 'بستاشيو بايتس',
    description: 'حلويات بستاشيو لذيذة',
    price: '22 SR',
    calories: '320 CAL',
    category: 'sweets',
    image: getProductInfo('Pistachio Bits')?.imagePath || '/images/dessert.svg'
  },
  {
    id: 'english-cake',
    name: 'English Cake',
    arabicName: 'انجلش كيك',
    description: 'كيك إنجليزي تقليدي',
    price: '25 SR',
    calories: '350 CAL',
    category: 'sweets',
    image: getProductInfo('English Cake')?.imagePath || '/images/dessert.svg'
  },
  {
    id: 'kinder-bits',
    name: 'Kinder Bits',
    arabicName: 'كيندر بايتس',
    description: 'حلويات كندر لذيذة',
    price: '20 SR',
    calories: '300 CAL',
    category: 'sweets',
    image: getProductInfo('Kinder Bites')?.imagePath || '/images/dessert.svg'
  },
  {
    id: 'shaireyah-bites',
    name: 'Shaireyah Bites',
    arabicName: 'شعيرية بايتس',
    description: 'حلويات شعيرية تقليدية',
    price: '18 SR',
    calories: '260 CAL',
    category: 'sweets',
    image: getProductInfo('Shaireyah Bites')?.imagePath || '/images/dessert.svg'
  },
  {
    id: 'taco-ice-cream',
    name: 'Taco Ice Cream',
    arabicName: 'تاكو آيس كريم',
    description: 'آيس كريم على شكل تاكو',
    price: '28 SR',
    calories: '400 CAL',
    category: 'sweets',
    image: getProductInfo('Taco Ice Cream')?.imagePath || '/images/ice-cream.svg'
  },
  {
    id: 'cookies',
    name: 'Cookies',
    arabicName: 'كوكيز',
    description: 'كوكيز شوكولاتة طازجة',
    price: '15 SR',
    calories: '220 CAL',
    category: 'sweets',
    image: getProductInfo('Cookies')?.imagePath || '/images/cookies.svg'
  },
  {
    id: 'barow-ice-cream',
    name: 'Barow Ice Cream',
    arabicName: 'بارو آيس كريم',
    description: 'آيس كريم بارو لذيذ',
    price: '30 SR',
    calories: '450 CAL',
    category: 'sweets',
    image: getProductInfo('Barow Ice Cream')?.imagePath || '/images/ice-cream.svg'
  },
  {
    id: 'almond-croissant',
    name: 'Almond Croissant',
    arabicName: 'كرواسون لوز',
    description: 'كرواسون لوز طازج',
    price: '20 SR',
    calories: '320 CAL',
    category: 'sweets',
    image: getProductInfo('Almond Croissant')?.imagePath || '/images/croissant.svg'
  },
  {
    id: 'lava-pudding',
    name: 'Lava Pudding',
    arabicName: 'لافا بودينج',
    description: 'بودينج شوكولاتة مع مركز سائل',
    price: '25 SR',
    calories: '380 CAL',
    category: 'sweets',
    image: getProductInfo('Lava Pudding')?.imagePath || '/images/dessert.svg'
  },
  {
    id: 'fluffy-cake',
    name: 'Fluffy Cake',
    arabicName: 'فلفي كيك',
    description: 'كيك خفيف وناعم',
    price: '22 SR',
    calories: '340 CAL',
    category: 'sweets',
    image: getProductInfo('Fluffy Cake')?.imagePath || '/images/dessert.svg'
  },

  // الساندويتشات - SANDWICHES
  {
    id: 'halloumi-sarar-sandwich',
    name: 'Halloumi Sarar Sandwich',
    arabicName: 'ساندويش حلومي حار',
    description: 'ساندويش حلومي مع خبز صرار',
    price: '35 SR',
    calories: '450 CAL',
    category: 'sandwiches',
    image: getProductInfo('Halloumi Sarar Sandwich')?.imagePath || '/images/food.svg'
  },
  {
    id: 'light-tuna-sandwich',
    name: 'Light Tuna Sandwich',
    arabicName: 'ساندويش تونة لايت',
    description: 'ساندويش تونة خفيف وصحي',
    price: '32 SR',
    calories: '380 CAL',
    category: 'sandwiches',
    image: getProductInfo('Light Tuna Sandwich')?.imagePath || '/images/food.svg'
  },
  {
    id: 'turkey-truffle-sandwich',
    name: 'Turkey Truffle Sandwich',
    arabicName: 'ساندويش تركي ترافل',
    description: 'ساندويش ديك رومي مع صلصة ترافل',
    price: '38 SR',
    calories: '420 CAL',
    category: 'sandwiches',
    image: getProductInfo('Turkey Truffle Sandwich')?.imagePath || '/images/food.svg'
  },

  // المجموعات - GROUPS
  {
    id: 'coffee-day-box',
    name: 'Coffee Day Box',
    arabicName: 'قهوة اليوم بوكس',
    description: 'بوكس قهوة اليوم مع حلويات',
    price: '45 SR',
    calories: '600 CAL',
    category: 'groups',
    image: getProductInfo('Coffee Day Box')?.imagePath || '/images/coffee.svg'
  },
  {
    id: 'cookies-box',
    name: 'Cookies Box',
    arabicName: 'كوكيز بوكس',
    description: 'بوكس كوكيز متنوعة',
    price: '35 SR',
    calories: '480 CAL',
    category: 'groups',
    image: getProductInfo('Cookies Box')?.imagePath || '/images/cookies.svg'
  },
  {
    id: 'croissant-box',
    name: 'Croissant Box',
    arabicName: 'كرواسون لوز بوكس',
    description: 'بوكس كرواسون لوز طازج',
    price: '40 SR',
    calories: '520 CAL',
    category: 'groups',
    image: getProductInfo('Almond Croissant Box')?.imagePath || '/images/croissant.svg'
  },
  {
    id: 'shaireyah-box',
    name: 'Shaireyah Box',
    arabicName: 'شعيرية بايتس بوكس',
    description: 'بوكس شعيرية بايتس',
    price: '38 SR',
    calories: '500 CAL',
    category: 'groups',
    image: getProductInfo('Shaireyah Bites Box')?.imagePath || '/images/dessert.svg'
  },
  {
    id: 'taco-ice-cream-box',
    name: 'Taco Ice Cream Box',
    arabicName: 'تاكو آيس كريم بوكس',
    description: 'بوكس تاكو آيس كريم',
    price: '50 SR',
    calories: '700 CAL',
    category: 'groups',
    image: getProductInfo('Taco Ice Cream Box')?.imagePath || '/images/ice-cream.svg'
  },
  {
    id: 'barow-ice-cream-box',
    name: 'Barow Ice Cream Box',
    arabicName: 'بارو آيس كريم بوكس',
    description: 'بوكس بارو آيس كريم',
    price: '55 SR',
    calories: '750 CAL',
    category: 'groups',
    image: getProductInfo('Barow Ice Cream Box')?.imagePath || '/images/ice-cream.svg'
  },
  {
    id: 'mixed-kinder-pistachio-box',
    name: 'Mixed Kinder & Pistachio Box',
    arabicName: 'مكس كندر و بستاشيو بايتس',
    description: 'بوكس مكس كندر وبستاشيو',
    price: '42 SR',
    calories: '580 CAL',
    category: 'groups',
    image: getProductInfo('Mixed Kinder & Pistachio Bites Box')?.imagePath || '/images/dessert.svg'
  }
];

const Menu: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const { addToCart } = useCart();
  const [activeCategory, setActiveCategory] = useState<'all' | 'drinks' | 'sweets' | 'sandwiches' | 'groups'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { id: 'all', name: 'الكل', englishName: 'ALL' },
    { id: 'drinks', name: 'المشروبات', englishName: 'DRINKS' },
    { id: 'sweets', name: 'الحلويات', englishName: 'SWEET' },
    { id: 'sandwiches', name: 'ساندويتشات', englishName: 'SANDWICHES' },
    { id: 'groups', name: 'المجموعات', englishName: 'GROUPS' }
  ];

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.arabicName.includes(searchTerm);
    return matchesCategory && matchesSearch;
  });

  const popularItems = menuItems.filter(item => item.popular);

  const handleAddToCart = (item: MenuItem) => {
    addToCart({
      id: item.id,
      name: item.name,
      arabicName: item.arabicName,
      price: typeof item.price === 'string' ? parseFloat(item.price) : item.price,
      image: item.image,
      category: item.category
    });
    
    // Show success message
    alert(`تم إضافة ${item.arabicName} إلى السلة!`);
  };

  return (
    <div id="menu" className="bg-[#F6F7F6] dark:bg-gray-900 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#045B62] dark:text-white mb-4">
            Our Menu
          </h1>
          <h2 className="text-2xl font-semibold text-[#045B62] dark:text-gray-200 mb-2">
            قائمة الطعام
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            اكتشف أجمل نكهات القهوة والمأكولات الشرقية والغربية
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="ابحث عن منتج..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Category Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-full shadow-lg p-2 flex space-x-2 rtl:space-x-reverse">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id as any)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                  activeCategory === category.id
                    ? 'bg-[#045B62] text-white shadow-lg'
                    : 'text-gray-600 hover:text-[#045B62] hover:bg-[#F6F7F6]'
                }`}
              >
                <div className="text-center">
                  <div className="text-sm font-bold">{category.englishName}</div>
                  <div className="text-xs">{category.name}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Popular Items */}
        {activeCategory === 'all' && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-[#045B62] mb-6 text-center">
              Popular Items - المنتجات الشائعة
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularItems.map((item) => (
                <div key={item.id} className="menu-card bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/images/fallback.svg';
                      }}
                    />
                    <div className="absolute top-2 right-2 bg-[#045B62] text-white px-2 py-1 rounded-full text-xs font-bold">
                      {item.calories}
                    </div>
                    <div className="absolute top-2 left-2 bg-[#02393E] text-white px-2 py-1 rounded-full text-xs font-bold">
                      شعبي
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-800 mb-1 text-right">
                      {item.arabicName}
                    </h3>
                    <h4 className="text-sm text-gray-600 mb-2 text-left">
                      {item.name}
                    </h4>
                    <p className="text-gray-500 text-sm mb-3 text-right">
                      {item.description}
                    </p>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-[#045B62]">
                        {item.price}
                      </span>
                      <button 
                        onClick={() => handleAddToCart(item)}
                        className="bg-[#045B62] text-white px-4 py-2 rounded-lg hover:bg-[#02393E] transition-colors duration-200 text-sm font-medium"
                      >
                        أضف للسلة
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Category Title */}
        {activeCategory !== 'all' && (
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-[#045B62] mb-2">
              {categories.find(c => c.id === activeCategory)?.englishName}
            </h3>
            <h4 className="text-xl text-[#045B62]">
              {categories.find(c => c.id === activeCategory)?.name}
            </h4>
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div key={item.id} className="menu-card bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="relative h-48 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/fallback.svg';
                  }}
                />
                <div className="absolute top-2 right-2 bg-[#045B62] text-white px-2 py-1 rounded-full text-xs font-bold">
                  {item.calories}
                </div>
                {item.popular && (
                  <div className="absolute top-2 left-2 bg-[#02393E] text-white px-2 py-1 rounded-full text-xs font-bold">
                    شعبي
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-800 mb-1 text-right">
                  {item.arabicName}
                </h3>
                <h4 className="text-sm text-gray-600 mb-2 text-left">
                  {item.name}
                </h4>
                <p className="text-gray-500 text-sm mb-3 text-right">
                  {item.description}
                </p>
                
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-[#045B62]">
                    {item.price}
                  </span>
                  <button 
                    onClick={() => handleAddToCart(item)}
                    className="bg-[#045B62] text-white px-4 py-2 rounded-lg hover:bg-[#02393E] transition-colors duration-200 text-sm font-medium"
                  >
                    أضف للسلة
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🍽️</div>
            <h3 className="text-xl font-medium text-gray-600 mb-2">
              لا توجد منتجات تطابق البحث
            </h3>
            <p className="text-gray-500">
              No products match your search
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-16 pt-8 border-t border-gray-200">
          <p className="text-gray-600 mb-2">
            جميع الأسعار تشمل ضريبة القيمة المضافة
          </p>
          <p className="text-gray-500 text-sm">
            All prices include VAT
          </p>
        </div>
      </div>
    </div>
  );
};

export default Menu;
