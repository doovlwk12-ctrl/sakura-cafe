import type { Metadata } from 'next'
import { Inter, Tajawal } from 'next/font/google'
import './globals.css'
import './gsap-animations.css'
import { Providers } from '../components/Providers'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter'
})

const tajawal = Tajawal({ 
  subsets: ['arabic'],
  weight: ['200', '300', '400', '500', '700', '800', '900'],
  variable: '--font-tajawal'
})

export const metadata: Metadata = {
  title: 'مقهى ساكورا | SAKURA CAFE',
  description: 'اكتشف أجمل نكهات القهوة والمأكولات الشرقية والغربية في أجواء هادئة ومريحة. 6 فروع في الرياض - Best Cafe in Saudi Arabia',
  keywords: 'cafe, coffee, restaurant, sakura, saudi arabia, مقهى, قهوة, مطعم, الرياض, قهوة تركية, لاتيه',
  authors: [{ name: 'Sakura Cafe Team' }],
  creator: 'Sakura Cafe',
  publisher: 'Sakura Cafe',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://www.sakuraacafe.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Sakura Cafe - مقهى ساكورا',
    description: 'أفضل مقهى في المملكة العربية السعودية',
    url: 'https://www.sakuraacafe.com',
    siteName: 'Sakura Cafe',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'Sakura Cafe - مقهى ساكورا',
      },
    ],
    locale: 'ar_SA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sakura Cafe - مقهى ساكورا',
    description: 'أفضل مقهى في المملكة العربية السعودية',
    images: ['/twitter-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl" className="dark">
      <head>
      </head>
      <body className={`${tajawal.variable} ${inter.variable} font-arabic`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
