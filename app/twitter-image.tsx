import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Costa Rica Emprende - Marketplace de Emprendimientos'
export const size = {
  width: 1200,
  height: 600,
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
          backgroundColor: '#f8fafc',
          position: 'relative',
        }}
      >
        {/* Background with Costa Rica colors */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: 'linear-gradient(135deg, #0066CC 0%, #FFFFFF 50%, #CC0000 100%)',
            opacity: 0.1,
          }}
        />

        {/* Main container */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
            borderRadius: 20,
            padding: 60,
            margin: 50,
            width: '90%',
            height: '85%',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          }}
        >
          {/* Header section */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: 40,
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
                marginRight: 30,
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

            {/* Title */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  fontSize: 48,
                  fontWeight: 'bold',
                  color: '#0066CC',
                  marginBottom: 5,
                }}
              >
                Costa Rica Emprende
              </div>
              <div
                style={{
                  fontSize: 20,
                  color: '#6b7280',
                }}
              >
                Marketplace de Emprendimientos Costarricenses
              </div>
            </div>
          </div>

          {/* Features */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-around',
              width: '100%',
              marginBottom: 40,
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: 32,
                  marginBottom: 10,
                }}
              >
                🛍️
              </div>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 'bold',
                  color: '#1f2937',
                  marginBottom: 5,
                }}
              >
                Productos Únicos
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: '#6b7280',
                }}
              >
                Descubre productos locales
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: 32,
                  marginBottom: 10,
                }}
              >
                🔧
              </div>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 'bold',
                  color: '#1f2937',
                  marginBottom: 5,
                }}
              >
                Servicios Profesionales
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: '#6b7280',
                }}
              >
                Conecta con expertos
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  fontSize: 32,
                  marginBottom: 10,
                }}
              >
                💬
              </div>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 'bold',
                  color: '#1f2937',
                  marginBottom: 5,
                }}
              >
                Contacto Directo
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: '#6b7280',
                }}
              >
                WhatsApp integrado
              </div>
            </div>
          </div>

          {/* Call to action */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#059669',
              borderRadius: 30,
              padding: '20px 60px',
              marginBottom: 20,
            }}
          >
            <div
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: 'white',
                textAlign: 'center',
              }}
            >
              🇨🇷 Apoya el Emprendimiento Costarricense
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

          {/* Footer */}
          <div
            style={{
              fontSize: 14,
              color: '#9ca3af',
              textAlign: 'center',
              fontWeight: '500',
            }}
          >
            @costaricaemprende
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}