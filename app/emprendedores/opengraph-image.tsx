import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Costa Rica Emprende - Emprendedores';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '40px',
          }}
        >
          <img
            src={`${process.env.NODE_ENV === 'production' ? 'https://www.costaricaemprende.com' : 'http://localhost:3000'}/logonew.jpeg`}
            alt="Costa Rica Emprende Logo"
            width={120}
            height={120}
            style={{
              borderRadius: '60px',
              border: '4px solid #fbbf24',
            }}
          />
        </div>
        
        {/* Title */}
        <div
          style={{
            fontSize: '48px',
            fontWeight: 'bold',
            color: '#ffffff',
            marginBottom: '20px',
            textAlign: 'center',
          }}
        >
          Costa Rica Emprende
        </div>
        
        {/* Subtitle */}
        <div
          style={{
            fontSize: '32px',
            fontWeight: '600',
            color: '#fbbf24',
            marginBottom: '30px',
            textAlign: 'center',
          }}
        >
          Directorio de Emprendedores
        </div>
        
        {/* Description */}
        <div
          style={{
            fontSize: '20px',
            color: '#cbd5e1',
            textAlign: 'center',
            maxWidth: '800px',
            lineHeight: '1.4',
          }}
        >
          Descubre emprendedores costarricenses, sus historias de éxito y conecta con la comunidad empresarial local
        </div>
        
        {/* Website URL */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            fontSize: '16px',
            color: '#94a3b8',
          }}
        >
          costaricaemprende.com/emprendedores
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}