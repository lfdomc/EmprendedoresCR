'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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
      <Card className="hover:shadow-md transition-shadow duration-200">
        <div className="flex flex-col sm:flex-row">
          {/* Image */}
          <Link href={`/services/${serviceSlug}`}>
            <div className="relative w-full sm:w-32 md:w-40 h-48 sm:h-24 md:h-32 flex-shrink-0 cursor-pointer">
              <Image
                src={getImageUrl()}
                alt={service.name}
                fill
                className="object-cover rounded-t-lg sm:rounded-l-lg sm:rounded-t-none"
                onError={() => setImageError(true)}
              />
              {/* Featured badge removed - is_featured column no longer exists */}
              <Badge className="absolute top-1 sm:top-2 left-1 sm:left-2 bg-blue-500 text-xs">
                Servicio
              </Badge>
            </div>
          </Link>

          {/* Content */}
          <div className="flex-1 p-3">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                {service.category && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                    <span>{service.category.icon}</span>
                    <span>{service.category.name}</span>
                  </div>
                )}
                <Link href={`/services/${serviceSlug}`}>
                  <h3 className="font-medium text-sm sm:text-base hover:text-primary transition-colors line-clamp-1">
                    {service.name}
                  </h3>
                </Link>
                {service.business && (
                  <Link href={`/businesses/${businessSlug}`}>
                    <p className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      por {service.business.name}
                    </p>
                  </Link>
                )}
              </div>

            </div>





            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <span className="text-base sm:text-lg font-bold text-primary">
                {formatPrice(service.price)}
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 sm:flex-none" asChild>
                  <Link href={`/services/${serviceSlug}`}>
                    <Eye className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Ver</span>
                  </Link>
                </Button>
                <WhatsAppServiceButton
                  whatsappNumber={service.business?.whatsapp}
                  serviceName={service.name}
                  price={service.price}
                  currency={service.currency}
                  className="flex-1 sm:flex-none text-xs px-1 sm:px-3 h-8"
                  showShortText={true}
                  businessId={service.business?.id || ''}
                  serviceId={service.id}
                  serviceSlug={serviceSlug}
                />
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
      <div className="relative">
        <Link href={`/services/${serviceSlug}`}>
          <div className="relative aspect-[4/3] overflow-hidden rounded-t-lg cursor-pointer">
            <Image
              src={getImageUrl()}
              alt={service.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-200"
              onError={() => setImageError(true)}
            />
            {/* Featured badge removed - is_featured column no longer exists */}
            <Badge className="absolute top-1 sm:top-2 left-1 sm:left-2 bg-blue-500 text-xs">
              Servicio
            </Badge>
          </div>
        </Link>
      </div>

      <CardContent className="p-2 sm:p-3">
        {service.category && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1 sm:mb-2">
            <span className="text-xs">{service.category.icon}</span>
            <span className="truncate">{service.category.name}</span>
          </div>
        )}
        
        <Link href={`/services/${serviceSlug}`}>
          <h3 className="font-medium text-xs sm:text-sm hover:text-primary transition-colors line-clamp-2 mb-1 leading-tight">
            {service.name}
          </h3>
        </Link>
        
        {service.business && (
          <Link href={`/businesses/${businessSlug}`}>
            <p className="text-xs text-muted-foreground hover:text-primary transition-colors mb-1 truncate">
              por {service.business.name}
            </p>
          </Link>
        )}





        <div className="flex items-center justify-between mb-2">
          <span className="text-sm sm:text-lg font-bold text-primary">
            {formatPrice(service.price)}
          </span>
        </div>
      </CardContent>

      <CardFooter className="p-2 sm:p-3 pt-0 flex gap-1">
        <Button variant="outline" size="sm" className="flex-1 text-xs px-1 sm:px-3" asChild>
          <Link href={`/services/${serviceSlug}`}>
            <Eye className="h-5 w-5 mr-0 sm:mr-1" />
            <span className="hidden sm:inline">Ver</span>
          </Link>
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