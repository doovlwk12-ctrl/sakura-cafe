'use client'

import { motion } from 'framer-motion'
import { FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt, FaHistory, FaHeart, FaCog } from 'react-icons/fa'

const Profile = () => {
  const userProfile = {
    name: 'أحمد محمد',
    phone: '+966 50 123 4567',
    email: 'ahmed@sakura.com',
    address: 'الرياض، المملكة العربية السعودية',
    memberSince: '2023',
    totalOrders: 45,
    favoriteItems: 12
  }

  const recentOrders = [
    { id: 1, item: 'قهوة تركية', date: '2024-01-15', status: 'مكتمل', points: 15 },
    { id: 2, item: 'برجر لحم', date: '2024-01-14', status: 'مكتمل', points: 35 },
    { id: 3, item: 'لاتيه فانيلا', date: '2024-01-13', status: 'مكتمل', points: 18 }
  ]

  return (
    <section id="profile" className="py-20 bg-gradient-to-br from-sakura-50 to-coffee-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="section-title">
            <span className="text-gradient">حسابي</span>
            <br />
            <span className="text-2xl text-coffee-500 english-text font-medium">My Profile</span>
          </h2>
          <p className="text-lg text-coffee-500 max-w-3xl mx-auto leading-relaxed font-arabic">
            إدارة حسابك الشخصي وعرض سجل الطلبات والمفضلة
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            <div className="card p-8 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-sakura-500 to-coffee-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaUser className="text-3xl text-white" />
              </div>
              <h3 className="text-2xl font-bold text-coffee-800 mb-4 font-arabic">{userProfile.name}</h3>
              
              <div className="space-y-4 text-right">
                <div className="flex items-center gap-3">
                  <FaPhone className="text-sakura-500" />
                  <span className="text-coffee-600 font-arabic">{userProfile.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaEnvelope className="text-sakura-500" />
                  <span className="text-coffee-600 font-arabic">{userProfile.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaMapMarkerAlt className="text-sakura-500" />
                  <span className="text-coffee-600 font-arabic">{userProfile.address}</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-coffee-100">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-sakura-600 font-english">{userProfile.totalOrders}</div>
                    <div className="text-sm text-coffee-600 font-arabic">الطلبات</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-sakura-600 font-english">{userProfile.favoriteItems}</div>
                    <div className="text-sm text-coffee-600 font-arabic">المفضلة</div>
                  </div>
                </div>
              </div>

              <button className="w-full mt-6 bg-gradient-to-r from-sakura-500 to-sakura-600 hover:from-sakura-600 hover:to-sakura-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 font-arabic">
                تعديل الملف الشخصي
              </button>
            </div>
          </motion.div>

          {/* Recent Orders & Stats */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="lg:col-span-2 space-y-8"
          >
            {/* Stats Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="card p-6 text-center">
                <FaHistory className="text-3xl text-sakura-500 mx-auto mb-4" />
                <div className="text-2xl font-bold text-coffee-800 mb-2 font-english">{userProfile.totalOrders}</div>
                <div className="text-coffee-600 font-arabic">إجمالي الطلبات</div>
              </div>
              <div className="card p-6 text-center">
                <FaHeart className="text-3xl text-sakura-500 mx-auto mb-4" />
                <div className="text-2xl font-bold text-coffee-800 mb-2 font-english">{userProfile.favoriteItems}</div>
                <div className="text-coffee-600 font-arabic">العناصر المفضلة</div>
              </div>
              <div className="card p-6 text-center">
                <FaCog className="text-3xl text-sakura-500 mx-auto mb-4" />
                <div className="text-2xl font-bold text-coffee-800 mb-2 font-english">{userProfile.memberSince}</div>
                <div className="text-coffee-600 font-arabic">عضو منذ</div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="card p-6">
              <h4 className="text-xl font-bold text-coffee-800 mb-6 font-arabic">آخر الطلبات</h4>
              <div className="space-y-4">
                {recentOrders.map((order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                    viewport={{ once: true }}
                    className="flex items-center justify-between p-4 bg-coffee-50 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-sakura-100 rounded-full flex items-center justify-center">
                        <FaHistory className="text-sakura-500" />
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-coffee-800 font-arabic">{order.item}</div>
                        <div className="text-sm text-coffee-600 font-arabic">{order.date}</div>
                      </div>
                    </div>
                    <div className="text-left">
                      <div className="text-sm text-sakura-600 font-arabic">{order.status}</div>
                      <div className="text-xs text-coffee-500 font-english">+{order.points} نقطة</div>
                    </div>
                  </motion.div>
                ))}
              </div>
              <button className="w-full mt-6 bg-gradient-to-r from-coffee-500 to-coffee-600 hover:from-coffee-600 hover:to-coffee-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 font-arabic">
                عرض جميع الطلبات
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Profile
