import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Costa Rica Emprende - Marketplace de Emprendimientos'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function Image() {
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
        {/* Logo circle with enhanced design */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 140,
            height: 140,
            borderRadius: '50%',
            backgroundColor: '#fbbf24',
            border: '8px solid #f59e0b',
            marginBottom: 40,
            boxShadow: '0 20px 40px rgba(251, 191, 36, 0.3)',
          }}
        >
          <div
            style={{
              fontSize: 52,
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
            fontSize: 64,
            fontWeight: 'bold',
            color: '#ffffff',
            marginBottom: 20,
            textAlign: 'center',
          }}
        >
          Costa Rica Emprende
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 36,
            fontWeight: '600',
            color: '#fbbf24',
            marginBottom: 30,
            textAlign: 'center',
          }}
        >
          Marketplace de Emprendimientos
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: 24,
            color: '#cbd5e1',
            textAlign: 'center',
            marginBottom: 40,
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
            borderRadius: 25,
            padding: '15px 40px',
          }}
        >
          <div
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: '#0f172a',
            }}
          >
            Explorar Emprendimientos
          </div>
        </div>

        {/* Features badges */}
        <div
          style={{
            display: 'flex',
            gap: 20,
            marginTop: 30,
            marginBottom: 20,
          }}
        >
          <div
            style={{
              backgroundColor: 'rgba(251, 191, 36, 0.2)',
              border: '2px solid #fbbf24',
              borderRadius: 15,
              padding: '8px 16px',
              fontSize: 16,
              color: '#fbbf24',
              fontWeight: '600',
            }}
          >
            🛍️ Productos
          </div>
          <div
            style={{
              backgroundColor: 'rgba(251, 191, 36, 0.2)',
              border: '2px solid #fbbf24',
              borderRadius: 15,
              padding: '8px 16px',
              fontSize: 16,
              color: '#fbbf24',
              fontWeight: '600',
            }}
          >
            🔧 Servicios
          </div>
          <div
            style={{
              backgroundColor: 'rgba(251, 191, 36, 0.2)',
              border: '2px solid #fbbf24',
              borderRadius: 15,
              padding: '8px 16px',
              fontSize: 16,
              color: '#fbbf24',
              fontWeight: '600',
            }}
          >
            💬 WhatsApp
          </div>
        </div>

        {/* Website URL */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            fontSize: 18,
            color: '#94a3b8',
            fontWeight: '500',
          }}
        >
          costaricaemprende.com
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}