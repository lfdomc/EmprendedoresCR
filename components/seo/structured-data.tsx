'use client'

import Script from 'next/script'
import { Business, Product, Service } from '@/lib/types/database'

interface StructuredDataProps {
  type: 'website' | 'product' | 'service' | 'organization' | 'localBusiness'
  data: Record<string, unknown>
}

export function StructuredData({ type, data }: StructuredDataProps) {
  const generateStructuredData = () => {
    const baseData = {
      '@context': 'https://schema.org',
      '@type': type === 'website' ? 'WebSite' : 
               type === 'product' ? 'Product' : 
               type === 'service' ? 'Service' : 
               type === 'organization' ? 'Organization' : 
               'LocalBusiness',
      ...data
    }

    return JSON.stringify(baseData)
  }

  return (
    <Script
      id={`structured-data-${type}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: generateStructuredData()
      }}
    />
  )
}

// Datos estructurados para la página principal
export function WebsiteStructuredData() {
  const websiteData = {
    name: 'Costa Rica Emprende',
    description: 'Marketplace de emprendimientos locales en Costa Rica. Descubre productos únicos, servicios especializados y apoya a emprendedores costarricenses.',
    url: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'}/search?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Costa Rica Emprende',
      logo: {
        '@type': 'ImageObject',
        url: `${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'}/logo.png`
      }
    },
    sameAs: [
      'https://www.facebook.com/costaricaemprende',
      'https://www.instagram.com/costaricaemprende',
      'https://twitter.com/costaricaemprende'
    ]
  }

  return <StructuredData type="website" data={websiteData} />
}

// Datos estructurados para productos
export function ProductStructuredData({ product, business }: { product: Product & { business?: Business }, business?: Business }) {
  const productData = {
    name: product.name,
    description: product.description,
    image: product.image_url,
    brand: {
      '@type': 'Brand',
      name: business?.name || 'Costa Rica Emprende'
    },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: product.currency || 'CRC',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: business?.name || 'Emprendimiento'
      }
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.5',
      reviewCount: '10'
    }
  }

  return <StructuredData type="product" data={productData} />
}

// Datos estructurados para servicios
export function ServiceStructuredData({ service, business }: { service: Service & { business?: Business }, business?: Business }) {
  const serviceData = {
    name: service.name,
    description: service.description,
    image: service.image_url,
    provider: {
      '@type': 'LocalBusiness',
      name: business?.name || 'Emprendimiento',
      address: {
        '@type': 'PostalAddress',
        addressLocality: service.canton,
        addressRegion: service.provincia,
        addressCountry: 'CR'
      }
    },
    offers: {
      '@type': 'Offer',
      price: service.price,
      priceCurrency: service.currency || 'CRC',
      availability: 'https://schema.org/Available'
    },
    areaServed: {
      '@type': 'Place',
      name: `${service.canton}, ${service.provincia}, Costa Rica`
    }
  }

  return <StructuredData type="service" data={serviceData} />
}

// Datos estructurados para emprendimientos
export function BusinessStructuredData({ business }: { business: Business }) {
  const businessData = {
    name: business.name,
    description: business.description,
    image: business.logo_url,
    '@type': 'LocalBusiness',
    address: {
      '@type': 'PostalAddress',
      addressLocality: business.canton,
      addressRegion: business.provincia,
      addressCountry: 'CR'
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: business.whatsapp || business.phone || '',
      contactType: 'customer service',
      availableLanguage: 'Spanish'
    },
    url: `${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'}/businesses/${business.id}`,
    sameAs: business.website ? [business.website] : []
  }

  return <StructuredData type="localBusiness" data={businessData} />
}