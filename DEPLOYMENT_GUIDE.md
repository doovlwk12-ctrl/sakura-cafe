# 🚀 دليل النشر - مقهى ساكورا

## 📋 **متطلبات النشر**

### **الخادم:**
- Node.js 18+ 
- npm أو yarn
- قاعدة بيانات PostgreSQL أو MongoDB
- مساحة تخزين 1GB+

### **النطاق:**
- نطاق مخصص (اختياري)
- شهادة SSL
- CDN (اختياري)

## 🔧 **خطوات النشر**

### **1. إعداد البيئة**

```bash
# استنساخ المشروع
git clone https://github.com/your-username/sakura-cafe.git
cd sakura-cafe

# تثبيت التبعيات
npm install

# إعداد متغيرات البيئة
cp .env.example .env.local
```

### **2. تكوين قاعدة البيانات**

```bash
# إعداد PostgreSQL
createdb sakura_cafe

# تشغيل Migrations
npx prisma migrate dev

# إضافة بيانات تجريبية
npx prisma db seed
```

### **3. بناء المشروع**

```bash
# بناء للإنتاج
npm run build

# اختبار البناء
npm run start
```

### **4. النشر على Vercel**

```bash
# تثبيت Vercel CLI
npm i -g vercel

# تسجيل الدخول
vercel login

# النشر
vercel --prod
```

### **5. النشر على Render**

1. اربط GitHub repository
2. اختر "Web Service"
3. إعداد Environment Variables
4. تشغيل النشر

### **6. النشر على Railway**

```bash
# تثبيت Railway CLI
npm install -g @railway/cli

# تسجيل الدخول
railway login

# إنشاء مشروع
railway init

# النشر
railway up
```

## 🔐 **متغيرات البيئة**

### **مطلوبة:**
```env
DATABASE_URL="postgresql://user:pass@host:port/db"
JWT_SECRET="your-super-secret-jwt-key"
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-nextauth-secret"
```

### **اختيارية:**
```env
STRIPE_PUBLIC_KEY="pk_live_..."
STRIPE_SECRET_KEY="sk_live_..."
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
```

## 📊 **مراقبة الأداء**

### **Vercel Analytics:**
```bash
npm install @vercel/analytics
```

### **Google Analytics:**
```javascript
// في _app.tsx
import { GoogleAnalytics } from '@next/third-parties/google'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <GoogleAnalytics gaId="GA_MEASUREMENT_ID" />
    </>
  )
}
```

## 🔒 **الأمان**

### **HTTPS:**
- تفعيل SSL certificate
- إعادة توجيه HTTP إلى HTTPS

### **Headers الأمان:**
```javascript
// next.config.js
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  }
]
```

## 📱 **PWA Configuration**

### **manifest.json:**
```json
{
  "name": "مقهى ساكورا",
  "short_name": "ساكورا",
  "description": "نظام إدارة مقهى ساكورا",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#fefefe",
  "theme_color": "#e57373",
  "icons": [
    {
      "src": "/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

## 🔄 **CI/CD Pipeline**

### **GitHub Actions:**
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - run: npm run test
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 📈 **تحسين الأداء**

### **Image Optimization:**
```javascript
// next.config.js
module.exports = {
  images: {
    domains: ['your-domain.com'],
    formats: ['image/webp', 'image/avif'],
  },
}
```

### **Bundle Analysis:**
```bash
npm install --save-dev @next/bundle-analyzer
```

## 🧪 **اختبار ما بعد النشر**

### **اختبارات أساسية:**
- [ ] تحميل الصفحة الرئيسية
- [ ] تسجيل دخول المدير
- [ ] تسجيل دخول الكاشير
- [ ] إضافة منتج للسلة
- [ ] إنشاء طلب جديد

### **اختبارات الأداء:**
- [ ] PageSpeed Insights
- [ ] GTmetrix
- [ ] WebPageTest

### **اختبارات الأمان:**
- [ ] SSL Labs
- [ ] Security Headers
- [ ] OWASP ZAP

## 📞 **الدعم والصيانة**

### **مراقبة الأخطاء:**
```bash
npm install @sentry/nextjs
```

### **النسخ الاحتياطية:**
- نسخ احتياطية يومية لقاعدة البيانات
- نسخ احتياطية أسبوعية للملفات
- اختبار استرداد النسخ الاحتياطية

### **التحديثات:**
- تحديثات أمنية فورية
- تحديثات الميزات شهرياً
- مراجعة الأداء ربع سنوية

## 🎯 **التحقق النهائي**

### **قبل النشر:**
- [ ] جميع الاختبارات نجحت
- [ ] متغيرات البيئة محددة
- [ ] قاعدة البيانات جاهزة
- [ ] SSL certificate مفعل
- [ ] النسخ الاحتياطية جاهزة

### **بعد النشر:**
- [ ] الموقع يعمل بشكل صحيح
- [ ] جميع الميزات تعمل
- [ ] الأداء مقبول
- [ ] الأمان محقق
- [ ] المراقبة مفعلة

---

**تاريخ الإنشاء:** 9 يناير 2025  
**الإصدار:** 1.0.0  
**الحالة:** جاهز للنشر
