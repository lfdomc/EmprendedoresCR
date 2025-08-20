import { getServiceBySlug, getServiceById } from '@/lib/supabase/database';
import { notFound } from 'next/navigation';
import { extractIdFromSlug } from '@/lib/utils/slug';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Wrench, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { generateBusinessSlug } from '@/lib/utils/slug';
import { WhatsAppServiceButton } from '@/components/ui/whatsapp-service-button';
import { ShareServiceButton } from '@/components/ui/share-service-button';
import { ServiceWithDetails } from '@/lib/types/database';
import { ServiceStructuredData } from '@/components/seo/structured-data';
import type { Metadata } from 'next';

interface ServicePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params;
  
  try {
    // First try to get service by slug, if not found try by ID (for backward compatibility)
    let service: ServiceWithDetails | null = await getServiceBySlug(slug);
    
    if (!service) {
      // Try to extract ID from slug for backward compatibility
      const possibleId = extractIdFromSlug(slug);
      service = await getServiceById(possibleId);
    }
    
    if (!service) {
      notFound();
    }

    const businessSlug = generateBusinessSlug(service.business?.name, service.business?.id);

    const formatPrice = (price?: number) => {
      if (!price) return 'Precio a consultar';
      return new Intl.NumberFormat('es-CR', {
        style: 'currency',
        currency: service.currency || 'CRC',
        minimumFractionDigits: 0
      }).format(price);
    };





    return (
      <div className="min-h-screen bg-background">
        <ServiceStructuredData service={service} business={service.business} />
        <div className="container mx-auto px-4 py-8">
          {/* Back button */}
          <div className="mb-6">
            <Button variant="ghost" asChild>
              <Link href="/" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Volver al marketplace
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Service Image */}
            <div className="space-y-4">
              <div className="relative aspect-video overflow-hidden rounded-lg bg-white">
                {service.image_url ? (
                  <Image
                    src={service.image_url}
                    alt={service.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Wrench className="h-16 w-16 text-muted-foreground" />
                  </div>
                )}
              </div>
            </div>

            {/* Service Details */}
            <div className="space-y-6">
              <div>
                {service.category && (
                  <Badge variant="outline" className="mb-2">
                    {service.category.name}
                  </Badge>
                )}
                <h1 className="text-3xl font-bold">{service.name}</h1>
                <p className="text-2xl font-bold text-primary mt-2">
                  {formatPrice(service.price)}
                </p>
              </div>

              {service.description && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Descripción</h3>
                  <p className="text-muted-foreground">{service.description}</p>
                </div>
              )}



              {/* Business Info */}
              {service.business && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Ofrecido por</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      {service.business.logo_url && (
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-white border border-gray-200 shadow-sm">
                          <Image
                            src={service.business.logo_url}
                            alt={service.business.name}
                            fill
                            className="object-contain p-2 hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <Link href={`/businesses/${businessSlug}`}>
                          <h4 className="font-semibold hover:text-primary transition-colors">
                            {service.business.name}
                          </h4>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <ShareServiceButton 
                  serviceName={service.name}
                  serviceDescription={service.description || ''}
                />
                
                <WhatsAppServiceButton 
                  whatsappNumber={service.business?.whatsapp}
                  serviceName={service.name}
                  price={service.price}
                  currency={service.currency}
                  className="w-full"
                  businessId={service.business?.id || ''}
                  serviceId={service.id}
                  serviceSlug={slug}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading service:', error);
    notFound();
  }
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    let service = await getServiceBySlug(slug);
    
    if (!service) {
      const possibleId = extractIdFromSlug(slug);
      service = await getServiceById(possibleId);
    }
    
    if (!service) {
      return {
        title: 'Servicio no encontrado - Costa Rica Emprende',
        description: 'El servicio que buscas no existe o no está disponible.',
      };
    }

    const formatPrice = (price?: number) => {
      if (!price) return 'Precio a consultar';
      return new Intl.NumberFormat('es-CR', {
        style: 'currency',
        currency: service.currency || 'CRC',
        minimumFractionDigits: 0
      }).format(price);
    };

    const priceText = formatPrice(service.price);
    const businessName = service.business?.name || 'Emprendimiento';
    const location = [service.canton, service.provincia].filter(Boolean).join(', ');
    const locationText = location ? ` en ${location}` : '';
    const title = `${service.name} - ${priceText} | ${businessName} - Costa Rica Emprende`;
    const description = service.description 
      ? `${service.description.substring(0, 150)}... Disponible${locationText}. Contacta al proveedor vía WhatsApp.`
      : `${service.name} disponible por ${priceText}${locationText}. Contacta a ${businessName} vía WhatsApp para más información.`;

    const defaultUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";

    // Get the service image
    const serviceImage = service.image_url || null;

    return {
      title,
      description,
      keywords: [
        service.name,
        businessName,
        'servicio',
        'Costa Rica',
        'emprendimiento',
        'marketplace',
        service.category?.name || '',
        service.canton || '',
        service.provincia || '',
        'WhatsApp',
        'contratar',
        'profesional',
        'local',
        'especializado',
        'pyme',
        'freelancer',
        'consultoría'
      ].filter(Boolean),
      openGraph: {
        title,
        description,
        type: 'website',
        url: `${defaultUrl}/services/${slug}`,
        images: serviceImage ? [
          {
            url: serviceImage,
            width: 800,
            height: 600,
            alt: service.name,
          }
        ] : [
          {
            url: '/cremprende-logo.png',
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
        images: serviceImage ? [serviceImage] : ['/cremprende-logo.png'],
      },
      alternates: {
        canonical: `${defaultUrl}/services/${slug}`,
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
        'service:price:amount': service.price?.toString() || '0',
        'service:price:currency': service.currency || 'CRC',
        'service:availability': 'available',
        'service:area_served': `${service.canton}, ${service.provincia}, Costa Rica`,
        'service:provider': businessName,
      },
    };
  } catch {
    return {
      title: 'Error - Costa Rica Emprende',
      description: 'Ocurrió un error al cargar la información del servicio.',
    };
  }
}