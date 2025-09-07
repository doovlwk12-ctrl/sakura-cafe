'use client'

import { motion } from 'framer-motion'
import { FaMapMarkerAlt, FaPhone, FaClock } from 'react-icons/fa'
import { useLanguage } from '../hooks/LanguageProvider'
import { useState, useEffect } from 'react'

const Branches = () => {
  const { t, isRTL } = useLanguage()
  const [selectedBranch, setSelectedBranch] = useState<any>(null)
  
  // Center coordinates for Hail city
  const hailCenter = { lat: 27.5236, lng: 41.6901 }
  
  const branches = [
    {
      id: 1,
      name: 'فرع صديان',
      english: 'SADIYAN BRANCH',
      address: 'طريق الملك فهد الدائري، المنتزه الشرقي، حائل 55428',
      phone: '+966 50 123 4567',
      hours: 'مفتوح على مدار الساعة',
      coordinates: { lat: 27.5236, lng: 41.6901 },
      image: '/images/sadiyan branchفرع صديان1.jpg'
    },
    {
      id: 2,
      name: 'فرع النقرة',
      english: 'ALNUQRAH BRANCH',
      address: 'فهد العلى العريفي، النقرة، حائل 55431',
      phone: '+966 50 123 4568',
      hours: 'مفتوح على مدار الساعة',
      coordinates: { lat: 27.5089, lng: 41.7021 },
      image: '/images/alnugrah branch   فرع النقرة1.jpg'
    },
    {
      id: 3,
      name: 'فرع الجامعيين',
      english: 'ALJAMEEN BRANCH',
      address: 'المطار، حائل 55421',
      phone: '+966 50 123 4569',
      hours: 'مفتوح على مدار الساعة',
      coordinates: { lat: 27.4379, lng: 41.6862 },
      image: '/images/aljameen branch   فرع الجامعيين1.jpg'
    },
    {
      id: 4,
      name: 'فرع طريق المدينة',
      english: 'ALMADINA BRANCH',
      address: 'طريق المدينة, An Nuqrah, Hail 55433',
      phone: '+966 50 123 4570',
      hours: 'مفتوح على مدار الساعة',
      coordinates: { lat: 27.5156, lng: 41.7156 },
      image: '/images/alnugrah ( almadenah street ) branch.jpg'
    },
    {
      id: 5,
      name: 'فرع فجر',
      english: 'FAJER BRANCH',
      address: 'GJ4P+QW9 حائل',
      phone: '+966 50 123 4571',
      hours: 'مفتوح على مدار الساعة',
      coordinates: { lat: 27.5070, lng: 41.6870 },
      image: '/images/fajir branch   فرع فجر1.jpg'
    },
    {
      id: 6,
      name: 'فرع الراجحي',
      english: 'AL-RAJHI BRANCH',
      address: '3335 خليفة رسول الله ابو بكر الصديق, حي النقرة, HAGB7493، 7493, حائل 55433',
      phone: '+966 50 123 4572',
      hours: 'مفتوح على مدار الساعة',
      coordinates: { lat: 27.5123, lng: 41.7089 },
      image: '/images/alrajihi street branch.jpg'
    }
  ]

  // Function to get directions
  const getDirections = (branch: any) => {
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${branch.coordinates.lat},${branch.coordinates.lng}&destination_place_id=${encodeURIComponent(branch.name)}`
    window.open(googleMapsUrl, '_blank')
  }

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (selectedBranch && !event.target.closest('.branch-popup')) {
        setSelectedBranch(null)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [selectedBranch])

  return (
    <section id="branches" className="py-24 bg-gradient-to-br from-[#F6F7F6] to-[#F9F7F6] dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="section-title">
            <span className="text-gradient">{t('branches.title')}</span>
            <br />
            <span className="text-2xl text-[#045B62] dark:text-gray-200 english-text font-medium">{t('branches.subtitle')}</span>
          </h2>
          <p className="text-lg text-[#045B62] dark:text-gray-300 max-w-3xl mx-auto leading-relaxed font-arabic">
            {t('branches.description')}
          </p>
        </motion.div>

        {/* Branches Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 mb-20">
          {branches.map((branch, index) => (
            <motion.div
              key={branch.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              className="card overflow-hidden group hover:shadow-2xl transition-all duration-500 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-white/20 dark:border-gray-600/20"
            >
              {/* Image */}
              <div className="relative overflow-hidden">
                <img
                  src={branch.image}
                  alt={`صورة ${branch.name}`}
                  className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-700"
                  onError={(e) => {
                    e.currentTarget.src = '/images/fallback.svg';
                    e.currentTarget.alt = 'صورة الفرع';
                  }}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                
                {/* Branch Name Overlay */}
                <div className="absolute bottom-6 right-6 text-white">
                  <h4 className="text-2xl font-bold mb-2 font-arabic text-shadow-strong">{branch.name}</h4>
                  <p className="text-sm opacity-95 english-text font-medium">{branch.english}</p>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                {/* Address */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="bg-[#F6F7F6] p-2 rounded-lg flex-shrink-0">
                    <FaMapMarkerAlt className="text-[#045B62] text-lg" />
                  </div>
                  <p className="text-[#045B62] text-sm leading-relaxed font-arabic">{branch.address}</p>
                </div>

                {/* Phone */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-[#F6F7F6] p-2 rounded-lg">
                    <FaPhone className="text-[#045B62] text-lg" />
                  </div>
                  <a 
                    href={`tel:${branch.phone}`}
                    className="text-[#045B62] hover:text-[#02393E] transition-colors font-medium font-arabic"
                  >
                    {branch.phone}
                  </a>
                </div>

                {/* Hours */}
                <div className="flex items-center gap-4 mb-8">
                  <div className="bg-[#F6F7F6] p-2 rounded-lg">
                    <FaClock className="text-[#045B62] text-lg" />
                  </div>
                  <span className="text-[#045B62] text-sm font-arabic font-medium">{branch.hours}</span>
                </div>

                {/* Action Button - Directions */}
                <div className="flex justify-center">
                  <button 
                    onClick={() => getDirections(branch)}
                    className="w-full bg-gradient-to-r from-[#045B62] to-[#02393E] hover:from-[#02393E] hover:to-[#0D484E] text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl font-arabic text-sm hover:scale-105"
                  >
                    🗺️ {t('branches.getDirections')}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Map Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-[#F6F7F6] to-[#F9F7F6] rounded-3xl p-12 border border-[#045B62]/20"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-[#045B62] mb-6 font-arabic">{t('branches.mapTitle')}</h3>
            <p className="text-[#045B62] text-lg font-arabic">
              {t('branches.mapDescription')}
            </p>
          </div>

          {/* Interactive Google Maps */}
          <div className="bg-white rounded-2xl h-96 overflow-hidden border border-white/50 shadow-lg">
            <iframe
              src={`https://www.google.com/maps/embed/v1/view?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dpoWMguhWKBKz0&center=${hailCenter.lat},${hailCenter.lng}&zoom=12&maptype=roadmap`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="خريطة فروع مقهى ساكورا في حائل"
            ></iframe>
            
            {/* Overlay with branch markers */}
            <div className="relative -mt-96 h-96 pointer-events-none">
              {branches.map((branch) => (
                <div
                  key={branch.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
                  style={{
                    left: `${((branch.coordinates.lng - 41.6) / 0.2) * 100}%`,
                    top: `${100 - ((branch.coordinates.lat - 27.4) / 0.2) * 100}%`
                  }}
                >
                  <div 
                    className="bg-sakura-50 text-white p-2 rounded-full shadow-lg hover:bg-deep-50 transition-all duration-300 cursor-pointer hover:scale-110"
                    onClick={() => setSelectedBranch(branch)}
                    title={branch.name}
                  >
                    <FaMapMarkerAlt className="text-lg" />
                  </div>
                  
                  {/* Branch info popup */}
                  {selectedBranch?.id === branch.id && (
                    <div className="branch-popup absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white p-3 rounded-lg shadow-xl border border-gray-200 min-w-48 z-10">
                      <div className="text-center">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-deep-50 font-arabic text-sm">{branch.name}</h4>
                          <button 
                            onClick={() => setSelectedBranch(null)}
                            className="text-gray-400 hover:text-gray-600 ml-2"
                          >
                            ✕
                          </button>
                        </div>
                        <p className="text-xs text-gray-600 mb-3 font-arabic">{branch.address}</p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => getDirections(branch)}
                            className="bg-sakura-50 text-white px-3 py-1 rounded-md text-xs hover:bg-deep-50 transition-colors font-arabic flex-1"
                          >
                            🗺️ {t('branches.directions')}
                          </button>
                          <a 
                            href={`tel:${branch.phone}`}
                            className="bg-deep-50 text-white px-3 py-1 rounded-md text-xs hover:bg-sakura-50 transition-colors font-arabic flex-1"
                          >
                            📞 {t('branches.call')}
                          </a>
                        </div>
                      </div>
                      {/* Arrow */}
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="text-4xl font-bold text-sakura-500 mb-3 font-english">6</div>
              <div className="text-coffee-600 font-arabic text-lg">{t('branches.branchesCount')}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-sakura-500 mb-3 font-english">24/7</div>
              <div className="text-coffee-600 font-arabic text-lg">{t('branches.customerService')}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-sakura-500 mb-3 font-english">100%</div>
              <div className="text-coffee-600 font-arabic text-lg">{t('branches.customerSatisfaction')}</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Branches
