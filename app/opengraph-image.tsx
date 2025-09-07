import { ImageResponse } from 'next/og'
 
export const runtime = 'edge'
 
export const alt = 'Sakura Cafe - مقهى ساكورا'
export const contentType = 'image/png'
export const size = {
  width: 1200,
  height: 630,
}
 
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(to bottom right, #e86b6b, #8c5a5a)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: 64,
          fontWeight: 'bold',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 120, marginBottom: 20 }}>🌸</div>
        <div>ساكورا كافيه</div>
        <div style={{ fontSize: 32, marginTop: 10, opacity: 0.8 }}>Sakura Cafe</div>
      </div>
    ),
    {
      ...size,
    }
  )
}
