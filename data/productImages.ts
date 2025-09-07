export interface ProductImage {
  id: string;
  englishName: string;
  arabicName: string;
  imagePath: string;
  category: 'drinks' | 'sweets' | 'sandwiches' | 'groups';
  price: number; // السعر بالريال السعودي
  calories: string; // السعرات الحرارية
}

export const productImages: ProductImage[] = [
  // المشروبات - DRINKS
  {
    id: 'hot-coffee-day',
    englishName: 'Hot Coffee Day',
    arabicName: 'قهوة اليوم حار',
    imagePath: '/images/products/Hot coffee day قهوة اليوم حار.jpg',
    category: 'drinks',
    price: 18,
    calories: '120 CAL'
  },
  {
    id: 'ice-coffee-day',
    englishName: 'Ice Coffee Day',
    arabicName: 'قهوة اليوم بارد',
    imagePath: '/images/products/Ice coffee day قهوة اليوم بارد.jpg',
    category: 'drinks',
    price: 20,
    calories: '140 CAL'
  },
  {
    id: 'flat-white',
    englishName: 'Flat White',
    arabicName: 'فلات وايت',
    imagePath: '/images/products/Flat White فلات وايت.jpg',
    category: 'drinks',
    price: 22,
    calories: '160 CAL'
  },
  {
    id: 'cappuccino',
    englishName: 'Cappuccino',
    arabicName: 'كابوتشينو',
    imagePath: '/images/products/Cappuccino  كابتشينو.jpg',
    category: 'drinks',
    price: 20,
    calories: '150 CAL'
  },
  {
    id: 'hot-espresso',
    englishName: 'Hot Espresso',
    arabicName: 'اسبريسو حار',
    imagePath: '/images/products/Hot espresso  اسبريسو حار.jpg',
    category: 'drinks',
    price: 15,
    calories: '80 CAL'
  },
  {
    id: 'ice-espresso',
    englishName: 'Ice Espresso',
    arabicName: 'اسبريسو بارد',
    imagePath: '/images/products/Ice espresso اسبريسو بارد.jpg',
    category: 'drinks',
    price: 17,
    calories: '90 CAL'
  },
  {
    id: 'hot-latte',
    englishName: 'Hot Latte',
    arabicName: 'لاتيه حار',
    imagePath: '/images/products/Hot Latte  لاتيه حار.jpg',
    category: 'drinks',
    price: 22,
    calories: '180 CAL'
  },
  {
    id: 'iced-latte',
    englishName: 'Iced Latte',
    arabicName: 'لاتيه بارد',
    imagePath: '/images/products/Iced Latte  لاتيه بارد.jpg',
    category: 'drinks',
    price: 24,
    calories: '200 CAL'
  },
  {
    id: 'hot-spanish-latte',
    englishName: 'Hot Spanish Latte',
    arabicName: 'اسبانيش لاتيه حار',
    imagePath: '/images/products/Hot Spanish Latte  سبانيش لاتيه حار.jpg',
    category: 'drinks',
    price: 25,
    calories: '220 CAL'
  },
  {
    id: 'iced-spanish-latte',
    englishName: 'Iced Spanish Latte',
    arabicName: 'اسبانيش لاتيه بارد',
    imagePath: '/images/products/Iced Spanish Latt  سبانيش لاتيه بارد.jpg',
    category: 'drinks',
    price: 27,
    calories: '240 CAL'
  },
  {
    id: 'hot-americano',
    englishName: 'Hot Americano',
    arabicName: 'أمريكانو حار',
    imagePath: '/images/products/Hot Amricano أمريكانو حار.jpg',
    category: 'drinks',
    price: 18,
    calories: '100 CAL'
  },
  {
    id: 'ice-americano',
    englishName: 'Ice Americano',
    arabicName: 'أمريكانو بارد',
    imagePath: '/images/products/Ice Amricano  أمريكانو بارد.jpg',
    category: 'drinks',
    price: 20,
    calories: '110 CAL'
  },
  {
    id: 'cortado',
    englishName: 'Cortado',
    arabicName: 'كورتادو',
    imagePath: '/images/products/Cortado كورتادو.jpg',
    category: 'drinks',
    price: 19,
    calories: '120 CAL'
  },
  {
    id: 'tea',
    englishName: 'Tea',
    arabicName: 'شاي',
    imagePath: '/images/products/Tea  شاي.png',
    category: 'drinks',
    price: 12,
    calories: '50 CAL'
  },
  {
    id: 'water',
    englishName: 'Water',
    arabicName: 'ماء',
    imagePath: '/images/products/Water  ماء.jpg',
    category: 'drinks',
    price: 8,
    calories: '0 CAL'
  },
  {
    id: 'hibiscus',
    englishName: 'Hibiscus',
    arabicName: 'كركديه',
    imagePath: '/images/products/Hibiscus  كركديه.jpg',
    category: 'drinks',
    price: 15,
    calories: '80 CAL'
  },

  // الحلويات - SWEETS
  {
    id: 'brownies',
    englishName: 'Brownies',
    arabicName: 'براونيز',
    imagePath: '/images/products/Brownes  براوني.jpg',
    category: 'sweets',
    price: 25,
    calories: '280 CAL'
  },
  {
    id: 'pistachio-bits',
    englishName: 'Pistachio Bits',
    arabicName: 'بستاشيو بايتس',
    imagePath: '/images/products/Pistachio bits  بستاشيو بايتس.jpg',
    category: 'sweets',
    price: 22,
    calories: '200 CAL'
  },
  {
    id: 'english-cake',
    englishName: 'English Cake',
    arabicName: 'انجلش كيك',
    imagePath: '/images/products/English Cake  انقلش كيك.jpg',
    category: 'sweets',
    price: 28,
    calories: '320 CAL'
  },
  {
    id: 'kinder-bites',
    englishName: 'Kinder Bites',
    arabicName: 'كيندر بايتس',
    imagePath: '/images/products/Kinder bits  كندر بايتس.jpg',
    category: 'sweets',
    price: 24,
    calories: '180 CAL'
  },
  {
    id: 'shaireyah-bites',
    englishName: 'Shaireyah Bites',
    arabicName: 'شعيرية بايتس',
    imagePath: '/images/products/Shaireyah Bites  شعيرية بايتس.jpg',
    category: 'sweets',
    price: 26,
    calories: '220 CAL'
  },
  {
    id: 'taco-ice-cream',
    englishName: 'Taco Ice Cream',
    arabicName: 'تاكو آيس كريم',
    imagePath: '/images/products/Taco Ice Cream  تاكو آيس كريم.jpg',
    category: 'sweets',
    price: 30,
    calories: '350 CAL'
  },
  {
    id: 'cookies',
    englishName: 'Cookies',
    arabicName: 'كوكيز',
    imagePath: '/images/products/Cookies  كوكيز.jpg',
    category: 'sweets',
    price: 18,
    calories: '150 CAL'
  },
  {
    id: 'barow-ice-cream',
    englishName: 'Barow Ice Cream',
    arabicName: 'بارو آيس كريم',
    imagePath: '/images/products/Barow Ice Cream  بارو آيس كريم.jpg',
    category: 'sweets',
    price: 32,
    calories: '380 CAL'
  },
  {
    id: 'almond-croissant',
    englishName: 'Almond Croissant',
    arabicName: 'كرواسون لوز',
    imagePath: '/images/products/Almond Croissant  كروسان لوز.jpg',
    category: 'sweets',
    price: 26,
    calories: '280 CAL'
  },
  {
    id: 'lava-pudding',
    englishName: 'Lava Pudding',
    arabicName: 'لافا بودينج',
    imagePath: '/images/products/Lava Pudding لافا بودينج.png',
    category: 'sweets',
    price: 35,
    calories: '420 CAL'
  },
  {
    id: 'fluffy-cake',
    englishName: 'Fluffy Cake',
    arabicName: 'فلفي كيك',
    imagePath: '/images/products/Fluffy Cake  فلافي كيك.jpg',
    category: 'sweets',
    price: 30,
    calories: '350 CAL'
  },

  // الساندويتشات - SANDWICHES
  {
    id: 'halloumi-sandwich',
    englishName: 'Halloumi Sarar Sandwich',
    arabicName: 'ساندويش حلومي صرار',
    imagePath: '/images/products/Halloumi Sarar Sandwich  ساندويش حلومي صرار.jpg',
    category: 'sandwiches',
    price: 28,
    calories: '320 CAL'
  },
  {
    id: 'light-tuna-sandwich',
    englishName: 'Light Tuna Sandwich',
    arabicName: 'ساندويش تونة لايت',
    imagePath: '/images/products/Light Tuna Sandwich ساندويش تونة لايت.jpg',
    category: 'sandwiches',
    price: 32,
    calories: '280 CAL'
  },
  {
    id: 'turkey-truffle-sandwich',
    englishName: 'Turkey Truffle Sandwich',
    arabicName: 'ساندويش تركي ترافل',
    imagePath: '/images/products/Turkey Truffle Sandwich  ساندويش تركي ترافل.jpg',
    category: 'sandwiches',
    price: 35,
    calories: '380 CAL'
  },

  // المجموعات - GROUPS
  {
    id: 'coffee-day-box',
    englishName: 'Coffee Day Box',
    arabicName: 'بوكس قهوة اليوم',
    imagePath: '/images/products/Hot coffee day قهوة اليوم حار.jpg',
    category: 'groups',
    price: 45,
    calories: '500 CAL'
  },
  {
    id: 'cookies-box',
    englishName: 'Cookies Box',
    arabicName: 'بوكس كوكيز',
    imagePath: '/images/products/Cookies Box  كوكيز بوكس.jpg',
    category: 'groups',
    price: 38,
    calories: '400 CAL'
  },
  {
    id: 'almond-croissant-box',
    englishName: 'Almond Croissant Box',
    arabicName: 'بوكس كرواسون لوز',
    imagePath: '/images/products/Almond Croissant  كروسان لوز.jpg',
    category: 'groups',
    price: 42,
    calories: '450 CAL'
  },
  {
    id: 'shaireyah-bites-box',
    englishName: 'Shaireyah Bites Box',
    arabicName: 'بوكس شعيرية بايتس',
    imagePath: '/images/products/Shaireyah Bites Box  شعيرية بايتس بوكس.jpg',
    category: 'groups',
    price: 40,
    calories: '420 CAL'
  },
  {
    id: 'taco-ice-cream-box',
    englishName: 'Taco Ice Cream Box',
    arabicName: 'بوكس تاكو آيس كريم',
    imagePath: '/images/products/Taco Ice Cream  تاكو آيس كريم.jpg',
    category: 'groups',
    price: 48,
    calories: '520 CAL'
  },
  {
    id: 'barow-ice-cream-box',
    englishName: 'Barow Ice Cream Box',
    arabicName: 'بوكس بارو آيس كريم',
    imagePath: '/images/products/Barow Ice Cream  بارو آيس كريم.jpg',
    category: 'groups',
    price: 50,
    calories: '550 CAL'
  },
  {
    id: 'mixed-kinder-pistachio-box',
    englishName: 'Mixed Kinder & Pistachio Bites Box',
    arabicName: 'بوكس مكس كندر وبستاشيو بايتس',
    imagePath: '/images/products/Mixed Kinder & Pistachio Bites  مكس كندر و بستاشيو بايتس.jpg',
    category: 'groups',
    price: 44,
    calories: '480 CAL'
  }
];

// دالة للحصول على معلومات المنتج بالاسم الإنجليزي
export const getProductInfo = (englishName: string) => {
  return productImages.find(item => 
    item.englishName.toLowerCase() === englishName.toLowerCase()
  );
};

// دالة للحصول على المنتجات حسب الفئة
export const getProductsByCategory = (category: 'drinks' | 'sweets' | 'sandwiches' | 'groups') => {
  return productImages.filter(item => item.category === category);
};
