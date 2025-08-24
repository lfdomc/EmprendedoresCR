'use client'

import Script from 'next/script'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, Suspense } from 'react'

// Declaración de tipo para extender Window con gtag
declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
  }
}

// Google Analytics ID - reemplazar con el ID real
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-BJ9XHM171M'

// Función para enviar eventos a Google Analytics
export const gtag = (...args: unknown[]) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag(...args)
  }
}

// Función para rastrear vistas de página
export const pageview = (url: string) => {
  gtag('config', GA_MEASUREMENT_ID, {
    page_path: url,
  })
}

// Función para rastrear eventos personalizados
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string
  category: string
  label?: string
  value?: number
}) => {
  gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  })
}

// Eventos específicos para el marketplace
export const trackProductView = (productId: string, productName: string, businessName: string) => {
  event({
    action: 'view_item',
    category: 'ecommerce',
    label: `${productName} - ${businessName}`,
    value: 1
  })
  
  gtag('event', 'view_item', {
    currency: 'CRC',
    value: 1,
    items: [{
      item_id: productId,
      item_name: productName,
      item_category: 'product',
      item_brand: businessName,
      quantity: 1
    }]
  })
}

export const trackServiceView = (serviceId: string, serviceName: string, businessName: string) => {
  event({
    action: 'view_service',
    category: 'services',
    label: `${serviceName} - ${businessName}`,
    value: 1
  })
}

export const trackBusinessView = (businessId: string, businessName: string, location: string) => {
  event({
    action: 'view_business',
    category: 'business',
    label: `${businessName} - ${location}`,
    value: 1
  })
}

export const trackWhatsAppClick = (type: 'product' | 'service' | 'business', itemName: string, businessName: string) => {
  event({
    action: 'whatsapp_click',
    category: 'engagement',
    label: `${type}: ${itemName} - ${businessName}`,
    value: 1
  })
}

export const trackSearch = (searchTerm: string, resultsCount: number) => {
  event({
    action: 'search',
    category: 'engagement',
    label: searchTerm,
    value: resultsCount
  })
}

// Componente interno que usa useSearchParams
function GoogleAnalyticsTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (pathname) {
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '')
      pageview(url)
    }
  }, [pathname, searchParams])

  return null
}

// Componente principal de Google Analytics
export function GoogleAnalytics() {
  if (!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID === 'G-XXXXXXXXXX') {
    return null
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: typeof window !== 'undefined' ? window.location.pathname : '/',
              send_page_view: false
            });
          `,
        }}
      />
      <Suspense fallback={null}>
        <GoogleAnalyticsTracker />
      </Suspense>
    </>
  )
}

// Hook para usar Google Analytics en componentes
export function useGoogleAnalytics() {
  return {
    trackProductView,
    trackServiceView,
    trackBusinessView,
    trackWhatsAppClick,
    trackSearch,
    event,
    pageview
  }
}