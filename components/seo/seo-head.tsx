import Head from 'next/head'

interface SEOHeadProps {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  url?: string
  type?: 'website' | 'article' | 'product' | 'service'
  locale?: string
  siteName?: string
  twitterHandle?: string
  publishedTime?: string
  modifiedTime?: string
  author?: string
  price?: number
  currency?: string
  availability?: string
  location?: string
}

export function SEOHead({
  title = 'Costa Rica Emprende - Marketplace de Emprendimientos',
  description = 'Descubre y conecta con emprendimientos locales en Costa Rica. Encuentra productos únicos, servicios especializados y apoya a emprendedores costarricenses.',
  keywords = [],
  image = '/cremprende-logo.png',
  url,
  type = 'website',
  locale = 'es_CR',
  siteName = 'Costa Rica Emprende',
  twitterHandle = '@costaricaemprende',
  publishedTime,
  modifiedTime,
  author,
  price,
  currency = 'CRC',
  availability,
  location
}: SEOHeadProps) {
  const defaultUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000"

  const fullUrl = url || defaultUrl
  const fullImageUrl = image.startsWith('http') ? image : `${defaultUrl}${image}`

  const allKeywords = [
    ...keywords,
    'Costa Rica',
    'emprendimientos',
    'marketplace',
    'productos locales',
    'servicios',
    'WhatsApp',
    'pymes',
    'startups',
    'comercio local'
  ].filter(Boolean).join(', ')

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={allKeywords} />
      <meta name="author" content={author || siteName} />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      
      {/* Language and Locale */}
      <meta httpEquiv="content-language" content="es-CR" />
      <meta name="language" content="Spanish" />
      <meta name="geo.region" content="CR" />
      <meta name="geo.country" content="Costa Rica" />
      {location && <meta name="geo.placename" content={location} />}
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />
      
      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={locale} />
      
      {/* Article specific */}
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {author && <meta property="article:author" content={author} />}
      
      {/* Product specific */}
      {type === 'product' && price && (
        <>
          <meta property="product:price:amount" content={price.toString()} />
          <meta property="product:price:currency" content={currency} />
          <meta property="product:availability" content={availability || 'in stock'} />
          <meta property="product:condition" content="new" />
        </>
      )}
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={twitterHandle} />
      <meta name="twitter:creator" content={twitterHandle} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      <meta name="twitter:image:alt" content={title} />
      
      {/* Additional SEO Meta Tags */}
      <meta name="theme-color" content="#fbbf24" />
      <meta name="msapplication-TileColor" content="#fbbf24" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content={siteName} />
      
      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* DNS Prefetch */}
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      <link rel="dns-prefetch" href="//www.googletagmanager.com" />
      
      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      
      {/* Structured Data for better SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: siteName,
            description,
            url: fullUrl,
            potentialAction: {
              '@type': 'SearchAction',
              target: {
                '@type': 'EntryPoint',
                urlTemplate: `${fullUrl}/search?q={search_term_string}`
              },
              'query-input': 'required name=search_term_string'
            },
            publisher: {
              '@type': 'Organization',
              name: siteName,
              logo: {
                '@type': 'ImageObject',
                url: `${defaultUrl}/logo.png`
              }
            }
          })
        }}
      />
    </Head>
  )
}