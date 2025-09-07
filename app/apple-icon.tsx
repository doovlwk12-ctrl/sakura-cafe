import { ImageResponse } from 'next/og'
 
export const runtime = 'edge'
 
export const alt = 'Sakura Cafe Apple Icon'
export const contentType = 'image/png'
export const size = {
  width: 180,
  height: 180,
}
 
export default async function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(to bottom right, #e86b6b, #8c5a5a)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: 80,
          fontWeight: 'bold',
          borderRadius: '50%',
        }}
      >
        س
      </div>
    ),
    {
      ...size,
    }
  )
}
