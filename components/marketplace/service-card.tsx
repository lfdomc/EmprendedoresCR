'use client';

import { useState, useCallback, useMemo, memo } from 'react';
import Image from 'next/image';
import { SafeLink } from '@/components/ui/safe-link';
import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Service } from '@/lib/types/database';
import { generateBusinessSlug, generateServiceSlug } from '@/lib/utils/slug';
import { WhatsAppServiceButton } from '@/components/ui/whatsapp-service-button';

interface ServiceCardProps {
  service: Service & {
    business?: {
      id: string;
      name: string;
      logo_url?: string;
      whatsapp?: string;
    };
    category?: {
      id: string;
      name: string;
      icon?: string;
    };
  };
  viewMode: 'grid' | 'list';
}

const ServiceCardComponent = ({ service, viewMode }: ServiceCardProps) => {
  const [imageError, setImageError] = useState(false);
  
  // Memoize expensive calculations
  const businessSlug = useMemo(() => 
    generateBusinessSlug(service.business?.name, service.business?.id),
    [service.business?.name, service.business?.id]
  );
  
  const serviceSlug = useMemo(() => 
    generateServiceSlug(service.business?.name, service.name, service.id),
    [service.business?.name, service.name, service.id]
  );

  const formatPrice = useCallback((price?: number) => {
    if (!price) return 'Precio a consultar';
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: service.currency || 'CRC',
      minimumFractionDigits: 0
    }).format(price);
  }, [service.currency]);

  const imageUrl = useMemo(() => {
    if (service.image_url && !imageError) {
      return service.image_url;
    }
    return '/placeholder-service.svg';
  }, [service.image_url, imageError]);

  const formattedPrice = useMemo(() => formatPrice(service.price), [formatPrice, service.price]);

  if (viewMode === 'list') {
    return (
      <Card className="hover:shadow-md transition-shadow duration-200 h-24 sm:h-28 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2" role="article" aria-labelledby={`service-title-${service.id}`}>
        <div className="flex h-full">
          {/* Image */}
          <SafeLink 
            href={`/services/${serviceSlug}`}
            className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-l-lg"
            aria-label={`Ver detalles de ${service.name}`}
          >
             <div className="relative w-20 sm:w-24 h-full flex-shrink-0 cursor-pointer bg-white">
               <Image
                 src={imageUrl}
                 alt={`Imagen del servicio ${service.name}`}
                 fill
                 className="object-cover rounded-l-lg"
                 onError={() => setImageError(true)}
                 loading="lazy"
                 placeholder="blur"
                 blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                 sizes="(max-width: 640px) 80px, (max-width: 768px) 96px, 120px"
               />
               {/* Service badge */}
               <div className="absolute top-1 sm:top-2 left-1 sm:left-2 bg-blue-500 text-white px-2.5 py-0.5 rounded-md text-xs font-semibold">
                 Servicio
               </div>
             </div>
           </SafeLink>

          {/* Content */}
          <div className="flex-1 p-2 sm:p-3 min-w-0 flex">
            <div className="flex-1 flex flex-col justify-between min-w-0">
              <div className="min-w-0">
                {service.category && (
                  <div className="text-[10px] sm:text-xs text-muted-foreground mb-0.5 sm:mb-1 truncate">
                    <span>{service.category.icon}</span>
                    <span className="ml-1">{service.category.name}</span>
                  </div>
                )}
                <SafeLink 
                  href={`/services/${serviceSlug}`}
                  className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                >
                  <h3 id={`service-title-${service.id}`} className="font-semibold text-sm sm:text-base hover:text-primary transition-colors line-clamp-1 mb-1">
                    {service.name}
                  </h3>
                </SafeLink>
                {service.business && (
                  <SafeLink 
                    href={`/businesses/${businessSlug}`}
                    className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                    aria-label={`Ver emprendimiento ${service.business.name}`}
                  >
                    <p className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors truncate">
                      por {service.business.name}
                    </p>
                  </SafeLink>
                )}
              </div>
              
              <div className="flex items-center min-w-0">
                <span className="text-sm sm:text-base font-bold text-primary truncate">
                  {formattedPrice}
                </span>
              </div>
            </div>
            
            {/* Buttons - Vertical on the right */}
            <div className="flex flex-col gap-1 justify-center ml-2 flex-shrink-0">
              <Button variant="outline" size="sm" className="h-8 w-8 p-1" asChild>
                <SafeLink 
                  href={`/services/${serviceSlug}`}
                  aria-label={`Ver detalles de ${service.name}`}
                >
                  <Eye className="h-5 w-5" aria-hidden="true" />
                </SafeLink>
              </Button>
              <WhatsAppServiceButton
                whatsappNumber={service.business?.whatsapp}
                serviceName={service.name}
                price={service.price}
                currency={service.currency}
                className="h-8 w-8 p-1 text-xs"
                showShortText={false}
                businessId={service.business?.id || ''}
                serviceId={service.id}
                serviceSlug={serviceSlug}
                aria-label={`Contactar por WhatsApp sobre ${service.name}`}
              />
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2" role="article" aria-labelledby={`service-title-grid-${service.id}`}>
      <div className="relative">
        <SafeLink 
          href={`/services/${serviceSlug}`}
          className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-t-lg"
          aria-label={`Ver detalles de ${service.name}`}
        >
          <div className="relative aspect-[4/3] overflow-hidden rounded-t-lg cursor-pointer bg-white w-full">
            <Image
              src={imageUrl}
              alt={`Imagen del servicio ${service.name}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-200"
              onError={() => setImageError(true)}
              loading="lazy"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
            />
            {/* Featured badge removed - is_featured column no longer exists */}
            <Badge className="absolute top-1 sm:top-2 left-1 sm:left-2 bg-blue-500 text-xs">
              Servicio
            </Badge>
          </div>
        </SafeLink>
      </div>

      <CardContent className="p-2 sm:p-3">
        {service.category && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1 sm:mb-2">
            <span className="text-xs">{service.category.icon}</span>
            <span className="truncate">{service.category.name}</span>
          </div>
        )}
        
        <SafeLink 
          href={`/services/${serviceSlug}`}
          className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
        >
          <h3 id={`service-title-grid-${service.id}`} className="font-medium text-xs sm:text-sm hover:text-primary transition-colors line-clamp-2 mb-1 leading-tight h-10 flex items-start">
            <span className="line-clamp-2">{service.name}</span>
          </h3>
        </SafeLink>
        
        {service.business && (
          <SafeLink 
            href={`/businesses/${businessSlug}`}
            className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
            aria-label={`Ver emprendimiento ${service.business.name}`}
          >
            <p className="text-xs text-muted-foreground hover:text-primary transition-colors mb-1 truncate">
              por {service.business.name}
            </p>
          </SafeLink>
        )}





        <div className="flex items-center justify-between mb-2">
          <span className="text-sm sm:text-lg font-bold text-primary">
            {formattedPrice}
          </span>
        </div>
      </CardContent>

      <CardFooter className="p-2 sm:p-3 pt-0 flex gap-1">
        <Button variant="outline" size="sm" className="flex-1 text-xs px-1 sm:px-3" asChild>
          <SafeLink 
            href={`/services/${serviceSlug}`}
            aria-label={`Ver detalles de ${service.name}`}
          >
            <Eye className="h-5 w-5 mr-0 sm:mr-1" aria-hidden="true" />
            <span className="hidden sm:inline">Ver</span>
          </SafeLink>
        </Button>
        <WhatsAppServiceButton
          whatsappNumber={service.business?.whatsapp}
          serviceName={service.name}
          price={service.price}
          currency={service.currency}
          className="flex-1 text-xs p-1"
          showShortText={false}
          businessId={service.business?.id || ''}
          serviceId={service.id}
          serviceSlug={serviceSlug}
          aria-label={`Contactar por WhatsApp sobre ${service.name}`}
        />
      </CardFooter>
    </Card>
  );
};

// Memoize the component for better performance
export const ServiceCard = memo(ServiceCardComponent);