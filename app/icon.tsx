import { ImageResponse } from 'next/og'
 
export const runtime = 'edge'
 
export const alt = 'Sakura Cafe Icon'
export const contentType = 'image/png'
export const size = {
  width: 32,
  height: 32,
}
 
export default async function Icon() {
  // استخدام الشعار الحقيقي من مجلد الصور
  const logoImage = await fetch(new URL('/images/logo.png', 'http://localhost:3000')).then(
    (res) => res.arrayBuffer()
  )
  
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img 
          src={logoImage as any} 
          alt="Sakura Cafe Logo"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain'
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  )
}
