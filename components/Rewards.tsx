'use client'

import { motion } from 'framer-motion'
import { FaGift, FaStar, FaCrown, FaTrophy, FaCoins } from 'react-icons/fa'

const Rewards = () => {
  const rewards = [
    {
      id: 1,
      title: 'نقاط الولاء',
      description: 'احصل على نقطة واحدة مقابل كل ريال تنفقه',
      icon: <FaCoins className="text-3xl text-yellow-500" />,
      points: '150 نقطة'
    },
    {
      id: 2,
      title: 'خصم 20%',
      description: 'خصم على جميع المشروبات الساخنة كل يوم أحد',
      icon: <FaGift className="text-3xl text-sakura-500" />,
      points: 'متاح الآن'
    },
    {
      id: 3,
      title: 'قهوة مجانية',
      description: 'احصل على قهوة مجانية بعد كل 10 مشتريات',
      icon: <FaStar className="text-3xl text-coffee-500" />,
      points: '3/10'
    },
    {
      id: 4,
      title: 'عضو VIP',
      description: 'احصل على عروض حصرية وخدمة متميزة',
      icon: <FaCrown className="text-3xl text-purple-500" />,
      points: '50 نقطة إضافية'
    }
  ]

  return (
    <section id="rewards" className="py-20 bg-gradient-to-br from-purple-50 to-sakura-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="section-title">
            <span className="text-gradient">نظام المكافآت</span>
            <br />
            <span className="text-2xl text-coffee-500 english-text font-medium">Rewards System</span>
          </h2>
          <p className="text-lg text-coffee-500 max-w-3xl mx-auto leading-relaxed font-arabic">
            اكتسب نقاط مع كل مشتارية واحصل على مكافآت حصرية وخصومات خاصة
          </p>
        </motion.div>

        {/* Rewards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {rewards.map((reward, index) => (
            <motion.div
              key={reward.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              className="card p-6 text-center group hover:bg-white/95 transition-all duration-300"
            >
              <div className="mb-4 group-hover:scale-110 transition-transform duration-300">
                {reward.icon}
              </div>
              <h4 className="text-xl font-bold text-coffee-800 mb-3 font-arabic">{reward.title}</h4>
              <p className="text-coffee-600 mb-4 leading-relaxed font-arabic">{reward.description}</p>
              <div className="bg-gradient-to-r from-sakura-100 to-coffee-100 px-4 py-2 rounded-full">
                <span className="font-bold text-coffee-700 font-english">{reward.points}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Current Points Status */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-sakura-600 to-coffee-600 rounded-3xl p-12 text-center text-white"
        >
          <div className="mb-8">
            <FaTrophy className="text-6xl mx-auto mb-4 text-yellow-300" />
            <h3 className="text-3xl font-bold mb-4 font-arabic">نقاطك الحالية</h3>
            <div className="text-6xl font-bold text-yellow-300 mb-2 font-english">1,250</div>
            <p className="text-xl opacity-90 font-arabic">نقطة</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2 font-english">5</div>
              <div className="text-sm opacity-90 font-arabic">مكافآت متاحة</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2 font-english">3</div>
              <div className="text-sm opacity-90 font-arabic">خصومات نشطة</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2 font-english">VIP</div>
              <div className="text-sm opacity-90 font-arabic">مستوى العضوية</div>
            </div>
          </div>

          <button className="mt-8 bg-white text-sakura-600 hover:bg-gray-100 font-bold py-4 px-8 rounded-xl transition-all duration-300 font-arabic text-lg">
            استبدل نقاطك
          </button>
        </motion.div>
      </div>
    </section>
  )
}

export default Rewards
