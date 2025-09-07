'use client';

import React from 'react';
import '../app/about.css';
import { useLanguage } from '../hooks/LanguageProvider';

const About: React.FC = () => {
  const { t, isRTL } = useLanguage();
  
  return (
    <section id="about" className="py-20 bg-gradient-to-br from-[#F6F7F6] via-[#F9F7F6] to-[#F6F7F6] dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* المحتوى النصي */}
          <div className="space-y-8">
            {/* العنوان الرئيسي */}
            <div className="text-right about-title">
              <h2 className="text-4xl lg:text-5xl font-bold mb-4 font-arabic text-[#045B62] dark:text-white">
                {t('about.title')}
              </h2>
              <div className="w-24 h-1 rounded-full mx-auto bg-[#045B62] dark:bg-sakura-50"></div>
            </div>

            {/* النص الوصفي */}
            <div className="space-y-6 text-right about-content">
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-[#045B62] dark:border-sakura-50/30">
                <h4 className="text-xl font-bold mb-3 font-arabic text-[#045B62] dark:text-sakura-50">
                  {t('about.identity')}
                </h4>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-arabic text-lg">
                  {t('about.identityText')}
                </p>
              </div>

              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-[#045B62] dark:border-sakura-50/30">
                <h4 className="text-xl font-bold mb-3 font-arabic text-[#045B62] dark:text-sakura-50">
                  {t('about.mission')}
                </h4>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed font-arabic text-lg">
                  {t('about.missionText')}
                </p>
              </div>

              <div className="rounded-2xl p-6 text-white shadow-xl bg-gradient-to-br from-[#045B62] to-[#02393E]">
                <h4 className="text-xl font-bold mb-3 font-arabic">
                  {t('about.growth')}
                </h4>
                <p className="leading-relaxed font-arabic text-lg">
                  {t('about.growthText')}
                </p>
              </div>
            </div>

          </div>

          {/* الصور والتصميم البصري */}
          <div className="relative about-visual">
            {/* الصورة الرئيسية */}
            <div className="relative z-10">
              <div className="rounded-3xl p-8 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500 bg-gradient-to-br from-[#045B62] to-[#02393E]">
                <div className="bg-white rounded-2xl p-6 text-center">
                  <div className="text-6xl mb-4">☕</div>
                  <h4 className="text-xl font-bold mb-2 font-arabic text-[#045B62]">
                    {t('about.experience')}
                  </h4>
                  <p className="text-gray-600 font-arabic">
                    {t('about.experienceSubtitle')}
                  </p>
                </div>
              </div>
            </div>

            {/* العناصر الزخرفية */}
            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-60 decorative-circle bg-gradient-to-br from-[#045B62] to-[#02393E]"></div>
            <div className="absolute -bottom-6 -left-6 w-20 h-20 rounded-full opacity-60 decorative-circle bg-gradient-to-br from-[#02393E] to-[#0D484E]"></div>
            
            {/* أيقونات إضافية */}
            <div className="absolute top-1/2 -left-8 transform -translate-y-1/2">
              <div className="bg-white rounded-full p-3 shadow-lg border border-[#045B62]">
                <div className="text-2xl text-[#045B62]">🌸</div>
              </div>
            </div>
            
            <div className="absolute top-1/4 -right-8">
              <div className="bg-white rounded-full p-3 shadow-lg border border-[#045B62]">
                <div className="text-2xl text-[#045B62]">🍰</div>
              </div>
            </div>

            {/* نص إضافي */}
            <div className="absolute bottom-8 left-8 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-[#045B62]">
              <p className="text-sm text-gray-600 font-arabic text-center">
                <span className="font-bold text-[#045B62]">{t('about.brandName')}</span><br/>
                {t('about.moreThanCafe')}
              </p>
            </div>
          </div>
        </div>

        {/* قسم إضافي للقيم */}
        <div className="mt-20 text-center about-values">
          <h3 className="text-3xl font-bold mb-12 font-arabic text-[#045B62]">
            {t('about.values')}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg border about-card border-[#045B62]">
              <div className="text-4xl mb-4 card-icon">🌟</div>
              <h4 className="text-xl font-bold mb-3 font-arabic text-[#045B62]">{t('about.excellence')}</h4>
              <p className="text-gray-600 font-arabic">
                {t('about.excellenceText')}
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg border about-card border-[#045B62]">
              <div className="text-4xl mb-4 card-icon">💡</div>
              <h4 className="text-xl font-bold mb-3 font-arabic text-[#045B62]">{t('about.innovation')}</h4>
              <p className="text-gray-600 font-arabic">
                {t('about.innovationText')}
              </p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg border about-card border-[#045B62]">
              <div className="text-4xl mb-4 card-icon">❤️</div>
              <h4 className="text-xl font-bold mb-3 font-arabic text-[#045B62]">{t('about.care')}</h4>
              <p className="text-gray-600 font-arabic">
                {t('about.careText')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
