// Configuración de URLs según el entorno
export const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // En el cliente, usar la URL actual
    return window.location.origin
  }
  
  // En el servidor
  if (process.env.NODE_ENV === 'production') {
    // Usar siempre la URL de Vercel para producción
    return 'https://emprendedores-cr.vercel.app'
  }
  
  // En desarrollo
  return process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
}

export const getImageUrl = (path: string) => {
  // En desarrollo, usar rutas relativas para imágenes estáticas
  if (process.env.NODE_ENV !== 'production') {
    return path.startsWith('/') ? path : `/${path}`
  }
  
  // En producción, usar URLs absolutas
  const baseUrl = getBaseUrl()
  return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`
}

// Configuración de metadatos
export const siteConfig = {
  name: 'Costa Rica Emprende',
  title: 'Costa Rica Emprende - Marketplace de Emprendimientos',
  description: 'Descubre y conecta con emprendimientos locales en Costa Rica. Encuentra productos únicos, servicios especializados y apoya a emprendedores costarricenses.',
  url: getBaseUrl(),
  ogImage: `${getBaseUrl()}/logosmall.jpg`,
  logo: getImageUrl('/logo.png'),
  logoWebp: getImageUrl('/logo.webp'),
  logoJpeg: getImageUrl('/logosmall.jpg'),
}