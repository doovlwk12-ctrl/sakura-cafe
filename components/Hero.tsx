'use client'

import { motion } from 'framer-motion'
import { useLanguage } from '../hooks/LanguageProvider'

const Hero = () => {
  const { t, isRTL } = useLanguage()
  
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 md:pt-24">
      {/* Animated Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <motion.img
          src="/images/sadiyan branchفرع صديان1.jpg"
          alt="مقهى ساكورا"
          className="w-full h-full object-cover"
          initial={{ scale: 1.1 }}
          animate={{ 
            scale: [1.1, 1.05, 1.1],
            opacity: [0.8, 1, 0.8]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          onError={(e) => {
            e.currentTarget.src = '/images/fallback.svg';
            e.currentTarget.alt = 'مقهى ساكورا';
          }}
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60 dark:from-black/80 dark:via-black/60 dark:to-black/80"></div>
        {/* Pattern Overlay */}
        <div className="absolute inset-0 bg-pattern opacity-10"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8 xl:px-12 relative z-1">
        <div className="text-center max-w-4xl xl:max-w-6xl mx-auto">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="mb-12"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 1 }}
              className="mb-8 md:mb-12"
            >
              <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-4 md:mb-6 lg:mb-8 leading-tight font-arabic">
                <motion.span 
                  className="block text-white drop-shadow-2xl"
                  initial={{ opacity: 0, x: -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                >
                  {t('brand.name')}
                </motion.span>
                <motion.span 
                  className="block text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-sakura-50 drop-shadow-2xl mt-2"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                >
                  {t('brand.tagline')}
                </motion.span>
              </h1>
              <motion.p 
                className="text-sm sm:text-base md:text-lg lg:text-xl text-white mb-6 md:mb-8 lg:mb-10 leading-relaxed font-arabic drop-shadow-lg max-w-2xl lg:max-w-3xl mx-auto px-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.8 }}
              >
                {t('welcome')}
              </motion.p>
            </motion.div>

          </motion.div>

        </div>
      </div>

    </section>
  )
}

export default Hero
