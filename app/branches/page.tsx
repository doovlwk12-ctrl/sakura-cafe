'use client'

import React from 'react'
import SimpleNavbar from '../../components/SimpleNavbar'
import Branches from '../../components/Branches'
import Footer from '../../components/Footer'

export default function BranchesPage() {
  return (
    <div className="min-h-screen bg-deep-50">
      <SimpleNavbar />
      <div className="pt-16">
        <Branches />
        <Footer />
      </div>
    </div>
  )
}
