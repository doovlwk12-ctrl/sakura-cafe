'use client'

import React from 'react'
import SimpleNavbar from '../../components/SimpleNavbar'
import Contact from '../../components/Contact'
import Footer from '../../components/Footer'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-deep-50">
      <SimpleNavbar />
      <div className="pt-16">
        <Contact />
        <Footer />
      </div>
    </div>
  )
}
