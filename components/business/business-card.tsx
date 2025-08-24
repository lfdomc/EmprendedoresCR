'use client';

import { useState, useMemo, memo } from 'react';
import Image from 'next/image';
import { SafeLink as Link } from '@/components/ui/safe-link';
import { MapPin, Store } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Business, Category } from '@/lib/types/database';
import { generateBusinessSlug } from '@/lib/utils/slug';

interface BusinessCardProps {
  business: Business & {
    category?: Category;
  };
  viewMode: 'grid' | 'list';
}

const BusinessCardComponent = ({ business, viewMode }: BusinessCardProps) => {
  const [imageError, setImageError] = useState(false);

  // Memoize expensive calculations
  const imageUrl = useMemo(() => {
    if (business.logo_url && !imageError) {
      return business.logo_url;
    }
    return '/placeholder-business.svg';
  }, [business.logo_url, imageError]);

  const locationText = useMemo(() => {
    return [business.canton, business.provincia].filter(Boolean).join(', ');
  }, [business.canton, business.provincia]);

  const businessSlug = useMemo(() => 
    generateBusinessSlug(business.name, business.id),
    [business.name, business.id]
  );

  if (viewMode === 'list') {
    return (
      <Link 
        href={`/businesses/${businessSlug}`} 
        className="block focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded-lg"
        aria-label={`Ver detalles del emprendimiento ${business.name}`}
      >
        <Card className="hover:shadow-md transition-shadow duration-200 cursor-pointer" role="article" aria-labelledby={`business-title-${business.id}`}>
          <div className="flex">
            {/* Image */}
            <div className="relative w-24 sm:w-36 h-20 sm:h-28 flex-shrink-0">
              <div className="relative w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-l-lg flex items-center justify-center overflow-hidden border-r border-gray-200">
                {business.logo_url && !imageError ? (
                  <Image
                    src={imageUrl}
                    alt={`Logo del emprendimiento ${business.name}`}
                    fill
                    className="object-contain p-2 sm:p-3 hover:scale-110 transition-transform duration-300 drop-shadow-sm"
                    onError={() => setImageError(true)}
                    loading="lazy"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                    sizes="(max-width: 640px) 80px, (max-width: 768px) 96px, 120px"
                  />
                ) : (
                  <Store className="h-8 w-8 sm:h-10 sm:w-10 text-primary/70" aria-hidden="true" />
                )}
              </div>
              {/* Featured badge removed - is_featured column no longer exists */}
            </div>

            {/* Content */}
            <div className="flex-1 p-2 sm:p-3 min-w-0">
              <div className="flex flex-col h-full justify-between">
                <div className="min-w-0">
                  {business.category && (
                    <div className="text-[10px] sm:text-xs text-muted-foreground mb-0.5 sm:mb-1 truncate">
                      <span>{business.category.name}</span>
                    </div>
                  )}
                  <h3 id={`business-title-${business.id}`} className="font-semibold text-sm sm:text-base hover:text-primary transition-colors line-clamp-1 mb-1 sm:mb-2">
                    {business.name}
                  </h3>
                  {business.description && (
                    <p className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2 line-clamp-1 sm:line-clamp-2">
                      {business.description}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center justify-between min-w-0">
                  <div className="flex items-center gap-1 sm:gap-3 min-w-0 flex-1">
                    {locationText && (
                      <div className="flex items-center gap-0.5 sm:gap-1 text-xs sm:text-sm text-muted-foreground min-w-0 flex-1">
                        <MapPin className="h-2.5 w-2.5 sm:h-3 sm:w-3 flex-shrink-0" aria-hidden="true" />
                        <span className="truncate">{locationText}</span>
                      </div>
                    )}
                    <Badge variant="outline" className="text-[9px] sm:text-xs px-1 sm:px-2 py-0 flex-shrink-0">
                      Activo
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </Link>
    );
  }

  return (
    <Link 
      href={`/businesses/${businessSlug}`} 
      className="block focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded-lg"
      aria-label={`Ver detalles del emprendimiento ${business.name}`}
    >
      <Card className="group hover:shadow-xl hover:shadow-black/10 shadow-md transition-all duration-500 hover:-translate-y-2 cursor-pointer h-full w-full flex flex-col border-0 bg-white/90 backdrop-blur-sm overflow-hidden" role="article" aria-labelledby={`business-title-grid-${business.id}`}>
        <div className="relative">
          <div className="relative aspect-square sm:aspect-[4/3] md:aspect-[3/2] lg:aspect-[4/3] overflow-hidden rounded-t-xl bg-gradient-to-br from-white/80 to-gray-50/80 flex items-center justify-center cursor-pointer border border-gray-200">
            {business.logo_url && !imageError ? (
              <Image
                 src={imageUrl}
                 alt={`Logo del emprendimiento ${business.name}`}
                 fill
                 className="object-contain group-hover:scale-110 transition-transform duration-500 p-3 sm:p-4 md:p-5 lg:p-6 drop-shadow-lg"
                 onError={() => setImageError(true)}
                 loading="lazy"
                 placeholder="blur"
                 blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                 sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
               />
            ) : (
              <Store className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 lg:h-18 lg:w-18 text-primary/50" aria-hidden="true" />
            )}
          </div>
        </div>

        <CardContent className="p-2 sm:p-3 md:p-3 lg:p-4 flex flex-col justify-between flex-1">
          {business.category && (
            <div className="text-xs text-muted-foreground/80 mb-1 truncate font-medium">
              {business.category.icon && <span className="mr-1.5">{business.category.icon}</span>}
              <span>{business.category.name}</span>
            </div>
          )}
          
          <h3 id={`business-title-grid-${business.id}`} className="font-semibold text-sm sm:text-base md:text-lg hover:text-primary transition-colors line-clamp-2 mb-1 leading-tight min-h-[2rem] sm:min-h-[2.5rem] flex items-start">
            <span className="line-clamp-2">{business.name}</span>
          </h3>

          {business.description && (
            <p className="text-sm text-muted-foreground/80 mb-1 line-clamp-2 leading-relaxed">
              {business.description}
            </p>
          )}

          {locationText && (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-1">
              <MapPin className="h-4 w-4 flex-shrink-0 text-primary/60" aria-hidden="true" />
              <span className="truncate font-medium">{locationText}</span>
            </div>
          )}

          <Badge variant="outline" className="text-xs px-3 py-1 self-start mb-1 bg-green-50 text-green-700 border-green-200">
            Activo
          </Badge>
        </CardContent>
      </Card>
    </Link>
   );
};

// Memoize the component for better performance
export const BusinessCard = memo(BusinessCardComponent);