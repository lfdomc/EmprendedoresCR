import { getBusinessBySlug, getBusinessById, getProductsByBusinessId, getServicesByBusinessId } from '@/lib/supabase/database';
import { BusinessProfile } from '@/components/business/business-profile';
import { notFound } from 'next/navigation';
import { extractIdFromSlug } from '@/lib/utils/slug';
import { BusinessStructuredData } from '@/components/seo/structured-data';
import type { Metadata } from 'next';

interface BusinessPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BusinessPage({ params }: BusinessPageProps) {
  const { slug } = await params;
  
  try {
    // First try to get business by slug, if not found try by ID (for backward compatibility)
    let business = await getBusinessBySlug(slug);
    
    if (!business) {
      // Try to extract ID from slug for backward compatibility
      const possibleId = extractIdFromSlug(slug);
      business = await getBusinessById(possibleId);
    }
    
    if (!business) {
      notFound();
    }

    // Fetch products and services for this business
    const [products, services] = await Promise.all([
      getProductsByBusinessId(business.id),
      getServicesByBusinessId(business.id)
    ]);

    return (
      <div className="min-h-screen bg-background">
        <BusinessStructuredData business={business} />
        <BusinessProfile 
          business={business} 
          products={products} 
          services={services} 
        />
      </div>
    );
  } catch (error) {
    console.error('Error loading business:', error);
    notFound();
  }
}

export async function generateMetadata({ params }: BusinessPageProps): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    let business = await getBusinessBySlug(slug);
    
    if (!business) {
      const possibleId = extractIdFromSlug(slug);
      business = await getBusinessById(possibleId);
    }
    
    if (!business) {
      return {
        title: 'Emprendimiento no encontrado - Costa Rica Emprende',
        description: 'El emprendimiento que buscas no existe o no está disponible.',
      };
    }

    const location = [business.canton, business.provincia].filter(Boolean).join(', ');
    const locationText = location ? ` en ${location}` : '';
    
    const title = `${business.name}${locationText} | Costa Rica Emprende`;
    const description = business.description 
      ? `${business.description.substring(0, 150)}...${locationText}. Descubre productos y servicios únicos. Contacta vía WhatsApp.`
      : `${business.name} - Emprendimiento costarricense${locationText}. Descubre productos y servicios únicos en nuestro marketplace.`;

    const defaultUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";

    return {
      title,
      description,
      keywords: [
        business.name,
        'emprendimiento',
        'Costa Rica',
        'marketplace',
        'negocio local',
        business.canton || '',
        business.provincia || '',
        'WhatsApp',
        'productos',
        'servicios',
        'pyme',
        'startup',
        'empresa local',
        'comercio local',
        'emprendedor',
        'innovación'
      ].filter(Boolean),
      openGraph: {
        title,
        description,
        type: 'website',
        url: `${defaultUrl}/businesses/${slug}`,
        images: business.logo_url ? [
          {
            url: business.logo_url,
            width: 800,
            height: 600,
            alt: business.name,
          }
        ] : [
          {
            url: '/opengraph-image.png',
            width: 1200,
            height: 630,
            alt: 'Costa Rica Emprende - Marketplace de Emprendimientos',
          }
        ],
        siteName: 'Costa Rica Emprende',
        locale: 'es_CR',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: business.logo_url ? [business.logo_url] : ['/twitter-image.png'],
      },
      alternates: {
        canonical: `${defaultUrl}/businesses/${slug}`,
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
      other: {
        'business:contact_data:locality': business.canton || '',
        'business:contact_data:region': business.provincia || '',
        'business:contact_data:country_name': 'Costa Rica',
        'business:contact_data:phone_number': business.whatsapp || business.phone || '',
        'business:contact_data:website': business.website || '',
      },
    };
  } catch {
    return {
      title: 'Error - Costa Rica Emprende',
      description: 'Ocurrió un error al cargar la información del emprendimiento.',
    };
  }
}