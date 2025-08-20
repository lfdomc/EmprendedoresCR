import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0f172a',
          backgroundImage: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
        }}
      >
        {/* Logo circle */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 200,
            height: 200,
            borderRadius: '50%',
            backgroundColor: '#fbbf24',
            border: '12px solid #f59e0b',
            marginBottom: 60,
            boxShadow: '0 20px 40px rgba(251, 191, 36, 0.3)',
          }}
        >
          <div
            style={{
              fontSize: 80,
              fontWeight: 'bold',
              color: '#0f172a',
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            CR
          </div>
        </div>

        {/* Main title */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 'bold',
            color: '#ffffff',
            marginBottom: 30,
            textAlign: 'center',
          }}
        >
          Costa Rica Emprende
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 42,
            fontWeight: '600',
            color: '#fbbf24',
            marginBottom: 40,
            textAlign: 'center',
          }}
        >
          Marketplace de Emprendimientos
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: 28,
            color: '#cbd5e1',
            textAlign: 'center',
            marginBottom: 50,
          }}
        >
          Descubre y conecta con emprendimientos locales
        </div>

        {/* Call to action button */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#fbbf24',
            backgroundImage: 'linear-gradient(90deg, #fbbf24 0%, #f59e0b 100%)',
            borderRadius: 40,
            padding: '20px 40px',
            fontSize: 28,
            fontWeight: '600',
            color: '#0f172a',
            boxShadow: '0 10px 20px rgba(251, 191, 36, 0.3)',
          }}
        >
          Explorar Emprendimientos
        </div>

        {/* Decorative elements */}
        <div
          style={{
            position: 'absolute',
            top: 100,
            left: 100,
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: '#fbbf24',
            opacity: 0.6,
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 150,
            right: 120,
            width: 12,
            height: 12,
            borderRadius: '50%',
            backgroundColor: '#fbbf24',
            opacity: 0.4,
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 100,
            left: 80,
            width: 10,
            height: 10,
            borderRadius: '50%',
            backgroundColor: '#fbbf24',
            opacity: 0.5,
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 80,
            right: 100,
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: '#fbbf24',
            opacity: 0.6,
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 1200,
    }
  )
}