'use client';

import { useState } from 'react';
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

export function ServiceCard({ service, viewMode }: ServiceCardProps) {
  const [imageError, setImageError] = useState(false);
  
  const businessSlug = generateBusinessSlug(service.business?.name, service.business?.id);
  const serviceSlug = generateServiceSlug(service.business?.name, service.name, service.id);

  const formatPrice = (price?: number) => {
    if (!price) return 'Precio a consultar';
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: service.currency || 'CRC',
      minimumFractionDigits: 0
    }).format(price);
  };



  const getImageUrl = () => {
    if (service.image_url && !imageError) {
      return service.image_url;
    }
    return '/placeholder-service.svg';
  };

  if (viewMode === 'list') {
    return (
      <Card className="hover:shadow-md transition-shadow duration-200 h-24 sm:h-28">
        <div className="flex h-full">
          {/* Image */}
          <SafeLink href={`/services/${serviceSlug}`}>
             <div className="relative w-20 sm:w-24 h-full flex-shrink-0 cursor-pointer bg-white">
               <Image
                 src={getImageUrl()}
                 alt={service.name}
                 fill
                 className="object-cover rounded-l-lg"
                 onError={() => setImageError(true)}
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
                <SafeLink href={`/services/${serviceSlug}`}>
                  <h3 className="font-semibold text-sm sm:text-base hover:text-primary transition-colors line-clamp-1 mb-1">
                    {service.name}
                  </h3>
                </SafeLink>
                {service.business && (
                  <SafeLink href={`/businesses/${businessSlug}`}>
                    <p className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors truncate">
                      por {service.business.name}
                    </p>
                  </SafeLink>
                )}
              </div>
              
              <div className="flex items-center min-w-0">
                <span className="text-sm sm:text-base font-bold text-primary truncate">
                  {formatPrice(service.price)}
                </span>
              </div>
            </div>
            
            {/* Buttons - Vertical on the right */}
            <div className="flex flex-col gap-1 justify-center ml-2 flex-shrink-0">
              <Button variant="outline" size="sm" className="h-8 w-8 p-1" asChild>
                <SafeLink href={`/services/${serviceSlug}`}>
                  <Eye className="h-5 w-5" />
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
              />
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
      <div className="relative">
        <SafeLink href={`/services/${serviceSlug}`}>
          <div className="relative aspect-[4/3] overflow-hidden rounded-t-lg cursor-pointer bg-white">
            <Image
              src={getImageUrl()}
              alt={service.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-200"
              onError={() => setImageError(true)}
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
        
        <SafeLink href={`/services/${serviceSlug}`}>
          <h3 className="font-medium text-xs sm:text-sm hover:text-primary transition-colors line-clamp-2 mb-1 leading-tight">
            {service.name}
          </h3>
        </SafeLink>
        
        {service.business && (
          <SafeLink href={`/businesses/${businessSlug}`}>
            <p className="text-xs text-muted-foreground hover:text-primary transition-colors mb-1 truncate">
              por {service.business.name}
            </p>
          </SafeLink>
        )}





        <div className="flex items-center justify-between mb-2">
          <span className="text-sm sm:text-lg font-bold text-primary">
            {formatPrice(service.price)}
          </span>
        </div>
      </CardContent>

      <CardFooter className="p-2 sm:p-3 pt-0 flex gap-1">
        <Button variant="outline" size="sm" className="flex-1 text-xs px-1 sm:px-3" asChild>
          <SafeLink href={`/services/${serviceSlug}`}>
            <Eye className="h-5 w-5 mr-0 sm:mr-1" />
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
        />
      </CardFooter>
    </Card>
  );
}