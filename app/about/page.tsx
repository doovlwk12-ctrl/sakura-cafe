'use client'

import React from 'react'
import SimpleNavbar from '../../components/SimpleNavbar'
import About from '../../components/About'
import Footer from '../../components/Footer'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-deep-50">
      <SimpleNavbar />
      <div className="pt-16">
        <About />
        <Footer />
      </div>
    </div>
  )
}
