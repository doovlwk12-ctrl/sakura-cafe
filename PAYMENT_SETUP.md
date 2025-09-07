# دليل إعداد نظام الدفع - مقهى ساكورا

## 🏦 بوابات الدفع المدعومة

### 1. **Tap Payments** (الرئيسية)
- **المدعومة:** مدى، فيزا، ماستركارد، Samsung Wallet، Apple Pay، Google Pay
- **الموقع:** https://www.tap.company/
- **المميزات:** دعم شامل للطرق المحلية والدولية

### 2. **MyFatoorah** (لـ STC Pay)
- **المدعومة:** STC Pay، مدى، فيزا
- **الموقع:** https://www.myfatoorah.com/
- **المميزات:** دعم STC Pay المحلي

## 🔧 متغيرات البيئة المطلوبة

أضف هذه المتغيرات في ملف `.env.local`:

```env
# Tap Payments Configuration
TAP_SECRET_KEY=sk_test_your_tap_secret_key
TAP_API_KEY=pk_test_your_tap_api_key
TAP_MERCHANT_ID=your_tap_merchant_id

# MyFatoorah Configuration (for STC Pay)
MYFATOORAH_API_KEY=your_myfatoorah_api_key
MYFATOORAH_MERCHANT_ID=your_myfatoorah_merchant_id

# Domain Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NEXT_PUBLIC_DOMAIN=localhost:3000

# Environment
NODE_ENV=development
```

## 📱 طرق الدفع المدعومة

### 💳 البطاقات
- **مدى** - البطاقات السعودية المحلية
- **فيزا** - البطاقات الدولية
- **ماستركارد** - البطاقات الدولية

### 📱 المحافظ الرقمية
- **STC Pay** - المحفظة الرقمية السعودية
- **Samsung Wallet** - محفظة سامسونج
- **Apple Pay** - محفظة آبل
- **Google Pay** - محفظة جوجل

### 💵 الدفع النقدي
- **نقداً** - الدفع عند الاستلام

## 🚀 خطوات الإعداد

### 1. التسجيل في بوابات الدفع

#### Tap Payments:
1. قم بزيارة https://www.tap.company/
2. سجل حساب تاجر جديد
3. قدم المستندات المطلوبة (السجل التجاري، الحساب البنكي)
4. احصل على API Keys من لوحة التحكم

#### MyFatoorah:
1. قم بزيارة https://www.myfatoorah.com/
2. سجل حساب تاجر جديد
3. قدم المستندات المطلوبة
4. احصل على API Key من لوحة التحكم

### 2. إعداد المتغيرات
```bash
# انسخ ملف المثال
cp .env.example .env.local

# أضف مفاتيح API الخاصة بك
nano .env.local
```

### 3. اختبار النظام
```bash
# تشغيل المشروع
npm run dev

# اختبار الدفع
# اذهب إلى صفحة سلة التسوق واختبر طرق الدفع المختلفة
```

## 🔒 الأمان

### معالجة آمنة للمدفوعات:
- **تشفير SSL** لجميع المعاملات
- **API Keys محمية** في environment variables
- **التحقق من صحة البيانات** قبل المعالجة
- **معالجة الأخطاء** بشكل آمن

### أفضل الممارسات:
- استخدم **وضع الاختبار** أولاً
- **لا تشارك** API Keys
- **راقب** المعاملات بانتظام
- **حدث** النظام بانتظام

## 📊 مراقبة المعاملات

### لوحات التحكم:
- **Tap Dashboard:** https://dashboard.tap.company/
- **MyFatoorah Dashboard:** https://portal.myfatoorah.com/

### التقارير المتاحة:
- تقارير المعاملات اليومية
- تقارير المبيعات الشهرية
- تقارير الأخطاء
- تقارير الاسترداد

## 🆘 استكشاف الأخطاء

### مشاكل شائعة:

#### 1. فشل في الدفع:
```bash
# تحقق من API Keys
echo $TAP_SECRET_KEY
echo $MYFATOORAH_API_KEY

# تحقق من الاتصال
curl -X GET https://api.tap.company/v2/charges
```

#### 2. خطأ في STC Pay:
- تأكد من صحة رقم الهاتف
- تحقق من تفعيل STC Pay على الهاتف
- تأكد من رصيد المحفظة

#### 3. مشاكل في Apple Pay/Google Pay:
- تأكد من دعم الجهاز
- تحقق من إعدادات المحفظة
- تأكد من الاتصال بالإنترنت

## 📞 الدعم الفني

### Tap Payments:
- **البريد الإلكتروني:** support@tap.company
- **الهاتف:** +966 11 123 4567
- **الدردشة المباشرة:** متاحة في لوحة التحكم

### MyFatoorah:
- **البريد الإلكتروني:** support@myfatoorah.com
- **الهاتف:** +966 11 234 5678
- **الدردشة المباشرة:** متاحة في لوحة التحكم

## 📈 التطوير المستقبلي

### ميزات مخططة:
- **دعم المزيد من المحافظ** (PayPal، Amazon Pay)
- **الدفع بالتقسيط** (Tamara، Tabby)
- **نظام النقاط** المدمج
- **التقارير المتقدمة**

### التحديثات:
- مراقبة تحديثات APIs
- اختبار دوري للنظام
- تحسينات الأداء
- ميزات أمان جديدة

---

## ✅ قائمة التحقق

- [ ] تسجيل في Tap Payments
- [ ] تسجيل في MyFatoorah
- [ ] إضافة API Keys
- [ ] اختبار طرق الدفع
- [ ] إعداد صفحات النجاح/الفشل
- [ ] اختبار على أجهزة مختلفة
- [ ] مراجعة الأمان
- [ ] إعداد المراقبة

**النظام جاهز للاستخدام! 🎉**
