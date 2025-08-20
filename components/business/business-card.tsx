'use client';

import { useState } from 'react';
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

export function BusinessCard({ business, viewMode }: BusinessCardProps) {
  const [imageError, setImageError] = useState(false);

  const getImageUrl = () => {
    if (business.logo_url && !imageError) {
      return business.logo_url;
    }
    return '/placeholder-business.svg';
  };

  const getLocationText = () => {
    return [business.canton, business.provincia].filter(Boolean).join(', ');
  };

  const businessSlug = generateBusinessSlug(business.name, business.id);

  if (viewMode === 'list') {
    return (
      <Link href={`/businesses/${businessSlug}`} className="block">
        <Card className="hover:shadow-md transition-shadow duration-200 cursor-pointer">
          <div className="flex">
            {/* Image */}
            <div className="relative w-24 sm:w-36 h-20 sm:h-28 flex-shrink-0">
              <div className="relative w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-l-lg flex items-center justify-center overflow-hidden border-r border-gray-200">
                {business.logo_url && !imageError ? (
                  <Image
                    src={getImageUrl()}
                    alt={`Logo de ${business.name}`}
                    fill
                    className="object-contain p-2 sm:p-3 hover:scale-110 transition-transform duration-300 drop-shadow-sm"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <Store className="h-8 w-8 sm:h-10 sm:w-10 text-primary/70" />
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
                  <h3 className="font-semibold text-sm sm:text-base hover:text-primary transition-colors line-clamp-1 mb-1 sm:mb-2">
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
                    {getLocationText() && (
                      <div className="flex items-center gap-0.5 sm:gap-1 text-xs sm:text-sm text-muted-foreground min-w-0 flex-1">
                        <MapPin className="h-2.5 w-2.5 sm:h-3 sm:w-3 flex-shrink-0" />
                        <span className="truncate">{getLocationText()}</span>
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
    <Link href={`/businesses/${businessSlug}`} className="block">
      <Card className="group hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-pointer h-full">
        <div className="relative">
          <div className="relative aspect-square sm:aspect-[4/3] overflow-hidden rounded-t-lg bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center border-b border-gray-200">
            {business.logo_url && !imageError ? (
              <Image
                 src={getImageUrl()}
                 alt={`Logo de ${business.name}`}
                 fill
                 className="object-contain group-hover:scale-110 transition-transform duration-300 p-3 sm:p-4 drop-shadow-sm"
                 onError={() => setImageError(true)}
               />
            ) : (
              <Store className="h-12 w-12 sm:h-16 sm:w-16 text-primary/70" />
            )}
          </div>
        </div>

        <CardContent className="p-1.5 sm:p-2 flex flex-col justify-between flex-1">
          {business.category && (
            <div className="text-[10px] sm:text-xs text-muted-foreground mb-0.5 sm:mb-1 truncate">
              <span>{business.category.name}</span>
            </div>
          )}
          
          <h3 className="font-medium text-xs sm:text-sm hover:text-primary transition-colors line-clamp-2 mb-0.5 sm:mb-1 leading-tight">
            {business.name}
          </h3>

          {getLocationText() && (
            <div className="flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-xs text-muted-foreground mb-0.5 sm:mb-1">
              <MapPin className="h-2 w-2 sm:h-2.5 sm:w-2.5 flex-shrink-0" />
              <span className="truncate">{getLocationText()}</span>
            </div>
          )}

          <div className="flex items-center justify-between mt-auto">
            <Badge variant="outline" className="text-[9px] sm:text-xs px-1 py-0 h-4 sm:h-auto">
              Activo
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
   );
}