'use client';

import { useLanguage } from '../../hooks/LanguageProvider';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function TermsPage() {
  const { t, language } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-sakura-50 to-sakura-100 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-xl p-8 md:p-12"
        >
          {/* Back Button */}
          <div className="mb-6">
            <Link
              href="/auth/register"
              className="inline-flex items-center text-sakura-600 hover:text-sakura-700 transition-colors font-arabic"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {language === 'ar' ? 'العودة إلى صفحة التسجيل' : 'Back to Registration'}
            </Link>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-sakura-600 mb-4 font-arabic">
              {language === 'ar' ? 'الشروط والأحكام' : 'Terms and Conditions'}
            </h1>
            <div className="w-24 h-1 bg-sakura-300 mx-auto rounded-full"></div>
          </div>

          <div className="prose prose-lg max-w-none">
            {language === 'ar' ? (
              <div className="space-y-6 text-gray-700 leading-relaxed">
                <section>
                  <h2 className="text-2xl font-bold text-sakura-600 mb-4">1. قبول الشروط</h2>
                  <p>
                    بوصولك واستخدامك لموقع مقهى ساكورا، فإنك توافق على الالتزام بهذه الشروط والأحكام. 
                    إذا كنت لا توافق على أي من هذه الشروط، يرجى عدم استخدام الموقع.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-sakura-600 mb-4">2. استخدام الموقع</h2>
                  <p>
                    يمكنك استخدام موقعنا لتصفح المنتجات وطلب الطعام والشراب. 
                    يجب أن تكون جميع المعلومات التي تقدمها صحيحة ومحدثة.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-sakura-600 mb-4">3. الطلبات والدفع</h2>
                  <p>
                    جميع الطلبات تخضع للتأكيد والتوفر. نحتفظ بالحق في رفض أي طلب. 
                    يجب أن تكون جميع معلومات الدفع صحيحة ومحدثة.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-sakura-600 mb-4">4. الخصوصية</h2>
                  <p>
                    نحن نحترم خصوصيتك ونلتزم بحماية معلوماتك الشخصية وفقاً لسياسة الخصوصية الخاصة بنا.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-sakura-600 mb-4">5. المسؤولية</h2>
                  <p>
                    نحن غير مسؤولين عن أي أضرار قد تنتج عن استخدام الموقع أو المنتجات. 
                    استخدامك للموقع على مسؤوليتك الخاصة.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-sakura-600 mb-4">6. التعديلات</h2>
                  <p>
                    نحتفظ بالحق في تعديل هذه الشروط والأحكام في أي وقت. 
                    سيتم إشعارك بأي تغييرات مهمة.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-sakura-600 mb-4">7. الاتصال</h2>
                  <p>
                    إذا كان لديك أي أسئلة حول هذه الشروط والأحكام، يرجى الاتصال بنا عبر:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>البريد الإلكتروني: info@sakura-cafe.com</li>
                    <li>الهاتف: +966 50 123 4567</li>
                    <li>العنوان: حائل، المملكة العربية السعودية</li>
                  </ul>
                </section>
              </div>
            ) : (
              <div className="space-y-6 text-gray-700 leading-relaxed">
                <section>
                  <h2 className="text-2xl font-bold text-sakura-600 mb-4">1. Acceptance of Terms</h2>
                  <p>
                    By accessing and using the Sakura Cafe website, you agree to be bound by these terms and conditions. 
                    If you do not agree to any of these terms, please do not use the website.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-sakura-600 mb-4">2. Use of Website</h2>
                  <p>
                    You may use our website to browse products and order food and beverages. 
                    All information you provide must be accurate and up-to-date.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-sakura-600 mb-4">3. Orders and Payment</h2>
                  <p>
                    All orders are subject to confirmation and availability. We reserve the right to refuse any order. 
                    All payment information must be accurate and up-to-date.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-sakura-600 mb-4">4. Privacy</h2>
                  <p>
                    We respect your privacy and are committed to protecting your personal information in accordance with our privacy policy.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-sakura-600 mb-4">5. Liability</h2>
                  <p>
                    We are not responsible for any damages that may result from the use of the website or products. 
                    Your use of the website is at your own risk.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-sakura-600 mb-4">6. Modifications</h2>
                  <p>
                    We reserve the right to modify these terms and conditions at any time. 
                    You will be notified of any significant changes.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-bold text-sakura-600 mb-4">7. Contact</h2>
                  <p>
                    If you have any questions about these terms and conditions, please contact us at:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Email: info@sakura-cafe.com</li>
                    <li>Phone: +966 50 123 4567</li>
                    <li>Address: Hail, Saudi Arabia</li>
                  </ul>
                </section>
              </div>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-500">
              {language === 'ar' 
                ? 'آخر تحديث: يناير 2025' 
                : 'Last updated: January 2025'
              }
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
