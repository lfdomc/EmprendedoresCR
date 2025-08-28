'use client';

import { useState, useCallback, useMemo, memo } from 'react';
import Image from 'next/image';
import { SafeLink } from '@/components/ui/safe-link';
import { Eye, MapPin, Store } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Product, Service, Business, Category } from '@/lib/types/database';
import { generateBusinessSlug, generateProductSlug, generateServiceSlug } from '@/lib/utils/slug';
import { recordWhatsAppContact } from '@/lib/supabase/database';
import { WhatsAppServiceButton } from '@/components/ui/whatsapp-service-button';

// Tipos unificados para el componente

interface ProductCardData {
  type: 'product';
  data: Product & {
    business?: {
      id: string;
      name: string;
      logo_url?: string;
      phone?: string;
      whatsapp?: string;
    };
    category?: Category;
  };
}

interface ServiceCardData {
  type: 'service';
  data: Service & {
    business?: {
      id: string;
      name: string;
      logo_url?: string;
      phone?: string;
      whatsapp?: string;
    };
    category?: Category;
  };
}

interface BusinessCardData {
  type: 'business';
  data: Business & {
    category?: Category;
  };
}

type UniversalCardData = ProductCardData | ServiceCardData | BusinessCardData;

interface UniversalCardProps {
  data: UniversalCardData;
  viewMode: 'grid' | 'list';
  priority?: boolean;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
}

const UniversalCardComponent = ({ data: cardData, viewMode, priority = false, isSelected = false, onSelect }: UniversalCardProps) => {
  const [imageError, setImageError] = useState(false);
  
  const handleCardClick = useCallback((e: React.MouseEvent) => {
    // Solo activar selección si no se hizo click en un enlace o botón
    if (onSelect && !e.defaultPrevented) {
      const target = e.target as HTMLElement;
      const isClickableElement = target.closest('a, button, [role="button"]');
      if (!isClickableElement) {
        onSelect(cardData.data.id);
      }
    }
  }, [onSelect, cardData.data.id]);
  
  // Debug: log the data structure
  console.log('UniversalCard received data:', cardData);

  // Funciones de formateo de precio
  const formatPrice = useCallback((price?: number, currency?: string) => {
    if (!price) return 'Precio a consultar';
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: currency || 'CRC',
      minimumFractionDigits: 0
    }).format(price);
  }, []);

  // Generación de URLs y slugs
  const { slug, detailUrl } = useMemo(() => {
    switch (cardData.type) {
      case 'product': {
        const productSlug = generateProductSlug(
          cardData.data.business?.name,
          cardData.data.name,
          cardData.data.id
        );
        return {
          slug: productSlug,
          detailUrl: `/products/${productSlug}`
        };
      }
      case 'service': {
        const serviceSlug = generateServiceSlug(
          cardData.data.business?.name,
          cardData.data.name,
          cardData.data.id
        );
        return {
          slug: serviceSlug,
          detailUrl: `/services/${serviceSlug}`
        };
      }
      case 'business': {
        const businessSlug = generateBusinessSlug(
          cardData.data.name,
          cardData.data.id
        );
        return {
          slug: businessSlug,
          detailUrl: `/businesses/${businessSlug}`
        };
      }
    }
  }, [cardData]);

  // URL de imagen con fallback
  const imageUrl = useMemo(() => {
    // Para productos y servicios, usar image_url
    if ((cardData.type === 'product' || cardData.type === 'service') && cardData.data.image_url && !imageError) {
      return cardData.data.image_url;
    }
    
    // Fallbacks específicos por tipo
    switch (cardData.type) {
      case 'product':
        return '/placeholder-product.jpg';
      case 'service':
        return '/placeholder-service.svg';
      case 'business':
        const businessData = cardData.data as Business;
        return businessData.logo_url && !imageError
        ? businessData.logo_url 
          : '/placeholder-business.svg';
      default:
        return '/placeholder-product.jpg';
    }
  }, [cardData.data, imageError, cardData.type]);

  // Precio formateado
  const formattedPrice = useMemo(() => {
    if (cardData.type === 'product' || cardData.type === 'service') {
      return formatPrice(cardData.data.price, cardData.data.currency);
    }
    return null;
  }, [cardData, formatPrice]);

  // Texto de ubicación para emprendimientos
  const locationText = useMemo(() => {
    if (cardData.type === 'business') {
      return [cardData.data.canton, cardData.data.provincia].filter(Boolean).join(', ');
    }
    return null;
  }, [cardData]);

  // Configuración de colores por tipo
  const typeConfig = useMemo(() => {
    switch (cardData.type) {
      case 'product':
        return {
          badgeColor: 'bg-green-500',
          badgeText: 'Producto',
          ringColor: 'focus:ring-orange-500 focus-within:ring-orange-500'
        };
      case 'service':
        return {
          badgeColor: 'bg-blue-500',
          badgeText: 'Servicio',
          ringColor: 'focus:ring-blue-500 focus-within:ring-blue-500'
        };
      case 'business':
        return {
          badgeColor: 'bg-purple-500',
          badgeText: 'Emprendimiento',
          ringColor: 'focus:ring-orange-500 focus-within:ring-orange-500'
        };
    }
  }, [cardData.type]);

  // Manejo de contacto WhatsApp para productos y servicios
  const handleWhatsAppContact = useCallback(async () => {
    if ((cardData.type !== 'product' && cardData.type !== 'service') || !cardData.data.business?.id) return;
    
    try {
      await recordWhatsAppContact(cardData.data.business.id, cardData.data.id);
    } catch (error) {
      console.error('Error recording WhatsApp contact:', error);
    }
    
    const itemUrl = `${typeof window !== 'undefined' ? window.location.origin : 'https://costaricaemprende.com'}${detailUrl}`;
    const now = new Date();
    const dateTime = now.toLocaleString('es-CR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    
    const itemType = cardData.type === 'product' ? 'producto' : 'servicio';
    const itemIcon = cardData.type === 'product' ? '📦' : '🛠️';
    
    // Construir el mensaje
    let message = ` *¡Hola! Estoy interesado/a en este ${itemType}* \n\n`;
    
    // Agregar imagen si está disponible (solo para que WhatsApp la muestre)
    if (cardData.data.image_url && !imageError) {
      message += `${cardData.data.image_url}\n\n`;
    }
    
    message += `${itemIcon} *${cardData.type === 'product' ? 'Producto' : 'Servicio'}:* ${cardData.data.name}\n` +
      `💰 *Precio:* ${formattedPrice}\n\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
      `🔗 *Ver detalles completos:*\n${itemUrl}\n\n` +
      `📅 *Fecha de consulta:* ${dateTime}\n\n` +
      `¡Espero tu respuesta! 😊`;
    
    const whatsappNumber = cardData.data.business?.whatsapp || cardData.data.business?.phone || '';
    if (whatsappNumber) {
      const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
      if (typeof window !== 'undefined') {
        window.open(whatsappUrl, '_blank');
      }
    } else {
      alert('No hay número de WhatsApp disponible para este emprendimiento');
    }
  }, [cardData, detailUrl, formattedPrice]);

  // Renderizado en modo lista
  if (viewMode === 'list') {
    return (
      <Card 
        className={`group relative overflow-hidden transition-all duration-300 ease-out h-20 sm:h-24 border-0 bg-white/80 backdrop-blur-md cursor-pointer ${
          isSelected 
            ? 'shadow-lg shadow-blue-500/20 ring-1 ring-blue-500/30 scale-[1.02]' 
            : 'hover:shadow-xl hover:shadow-gray-900/10 hover:scale-[1.01] shadow-sm'
        }`} 
        role="article" 
        aria-labelledby={`${cardData.type}-title-${cardData.data.id}`}
        onClick={handleCardClick}
      >
        <div className="flex h-full relative">
          {/* Imagen */}
          <SafeLink 
            href={detailUrl}
            className="focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 rounded-l-lg"
            aria-label={`Ver detalles de ${cardData.data.name}`}
          >
            <div className="relative w-16 sm:w-20 h-full flex-shrink-0 bg-gradient-to-br from-gray-50/50 to-gray-100/50 rounded-l-lg overflow-hidden">
              {cardData.type === 'business' ? (
                <div className="relative w-full h-full bg-gradient-to-br from-white/95 to-gray-50/95 flex items-center justify-center overflow-hidden">
                  {cardData.data.logo_url && !imageError ? (
                    <Image
                      src={imageUrl}
                      alt={`Logo del emprendimiento ${cardData.data.name}`}
                      fill
                      className="object-contain p-1 sm:p-1.5 group-hover:scale-110 transition-transform duration-500 drop-shadow-md"
                      onError={() => setImageError(true)}
                      loading="lazy"
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                      sizes="(max-width: 640px) 96px, (max-width: 768px) 112px, 128px"
                    />
                  ) : (
                    <Store className="h-10 w-10 sm:h-12 sm:w-12 text-primary/70" aria-hidden="true" />
                  )}
                </div>
              ) : (
                <>
                  <Image
                    src={imageUrl}
                    alt={`Imagen ${cardData.type === 'product' ? 'del producto' : 'del servicio'} ${cardData.data.name}`}
                    fill
                    className="object-cover rounded-l-xl group-hover:scale-105 transition-transform duration-500"
                    onError={() => setImageError(true)}
                    priority={priority}
                    loading={priority ? "eager" : "lazy"}
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                    sizes="(max-width: 640px) 96px, (max-width: 768px) 112px, 128px"
                  />
                  {/* Badge de tipo */}
                  <div className={`absolute top-2 left-2 ${typeConfig.badgeColor} text-white px-2 py-1 rounded-lg text-xs font-semibold glass-dark border border-white/30 opacity-90 transition-modern`}>
                    {typeConfig.badgeText}
                  </div>
                </>
              )}
            </div>
          </SafeLink>

          {/* Contenido */}
          <div className="flex-1 p-2 sm:p-3 md:p-4 min-w-0 flex">
            <div className="flex-1 flex flex-col justify-between min-w-0">
              <div className="min-w-0">
                {cardData.data.category && (
                  <div className="text-xs text-primary/70 mb-1 sm:mb-2 truncate font-semibold bg-primary/5 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md inline-block transition-modern hover:shadow-soft tracking-wide uppercase">
                    {cardData.data.category.icon && <span className="mr-1 sm:mr-1.5">{cardData.data.category.icon}</span>}
                    <span>{cardData.data.category.name}</span>
                  </div>
                )}
                <SafeLink 
                  href={detailUrl}
                  className={`focus:outline-none focus:ring-2 ${typeConfig.ringColor.split(' ')[0]} focus:ring-offset-2 rounded-lg`}
                >
                  <h3 id={`${cardData.type}-title-${cardData.data.id}`} className="font-bold text-sm sm:text-base md:text-lg hover:text-primary transition-colors line-clamp-1 mb-1 sm:mb-2 leading-tight text-gray-900 tracking-tight">
                    {cardData.data.name}
                  </h3>
                </SafeLink>
                
                {/* Información específica por tipo */}
                
                {cardData.type === 'business' && cardData.data.description && (
                  <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2 line-clamp-1 sm:line-clamp-2 leading-relaxed font-medium">
                    {cardData.data.description}
                  </p>
                )}
              </div>
              
              <div className="flex items-center justify-between min-w-0 mt-auto">
                {formattedPrice && (
                  <span className="text-sm sm:text-base font-bold text-primary truncate bg-primary/5 px-2 sm:px-3 py-1 sm:py-2 rounded-lg sm:rounded-xl border-modern transition-modern hover:shadow-glow-primary tracking-tight">
                    {formattedPrice}
                  </span>
                )}
                
                {cardData.type === 'business' && locationText && (
                  <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-500 min-w-0 flex-1">
                    <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 text-primary" aria-hidden="true" />
                    <span className="truncate font-medium">{locationText}</span>
                  </div>
                )}
                
                {cardData.type === 'business' && (
                  <Badge variant="outline" className="text-xs px-2 sm:px-3 py-1 sm:py-1.5 flex-shrink-0 ml-1 sm:ml-2 bg-emerald-50 text-emerald-700 border-modern rounded-full font-semibold transition-modern hover:shadow-soft tracking-wide">
                    Activo
                  </Badge>
                )}
              </div>
            </div>
            
            {/* Botones de acción */}
            {(cardData.type === 'product' || cardData.type === 'service') && (
              <div className="flex flex-col gap-1 sm:gap-2 justify-center ml-1.5 sm:ml-3 md:ml-4">
                <Button variant="outline" size="sm" className="h-7 w-7 sm:h-10 sm:w-10 p-0 border-2 hover:border-primary/50 hover:bg-primary/10 hover:shadow-soft transition-modern rounded-lg sm:rounded-xl hover-lift" asChild>
                  <SafeLink 
                    href={detailUrl}
                    aria-label={`Ver detalles de ${cardData.data.name}`}
                  >
                    <Eye className="h-3.5 w-3.5 sm:h-5 sm:w-5" aria-hidden="true" />
                  </SafeLink>
                </Button>
                
                {cardData.type === 'product' && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-7 w-7 sm:h-10 sm:w-10 p-0 border-2 text-green-600 hover:text-green-700 hover:bg-green-50 hover:border-green-300 hover:shadow-soft transition-modern rounded-lg sm:rounded-xl hover-lift"
                    onClick={handleWhatsAppContact}
                    aria-label={`Contactar por WhatsApp sobre ${cardData.data.name}`}
                  >
                    <FaWhatsapp className="h-3.5 w-3.5 sm:h-5 sm:w-5" aria-hidden="true" />
                  </Button>
                )}
                
                {cardData.type === 'service' && (
                  <WhatsAppServiceButton
                    whatsappNumber={cardData.data.business?.whatsapp}
                    serviceName={cardData.data.name}
                    price={cardData.data.price}
                    currency={cardData.data.currency}
                    className="h-7 w-7 sm:h-10 sm:w-10 p-0 border-2 text-xs hover:border-green-300 hover:shadow-soft transition-modern rounded-lg sm:rounded-xl hover-lift"
                    showShortText={false}
                    businessId={cardData.data.business?.id || ''}
                    serviceId={cardData.data.id}
                    serviceSlug={slug}
                    aria-label={`Contactar por WhatsApp sobre ${cardData.data.name}`}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </Card>
    );
  }

  // Renderizado en modo grid
  return (
    <Card 
      className={`group relative transition-modern hover-lift h-full w-full flex flex-col border-modern bg-white/95 backdrop-blur-sm overflow-hidden cursor-pointer rounded-2xl animate-fade-in ${
        isSelected 
          ? 'shadow-glow-primary ring-2 ring-primary/20' 
          : 'hover:shadow-soft-md hover:border-modern-hover shadow-soft'
      }`} 
      role="article" 
      aria-labelledby={`${cardData.type}-title-grid-${cardData.data.id}`}
      onClick={handleCardClick}
    >
        <SafeLink 
          href={detailUrl}
          className={`block focus:outline-none focus:ring-2 ${typeConfig.ringColor.split(' ')[0]} focus:ring-offset-2 rounded-t-2xl`}
          aria-label={`Ver detalles ${cardData.type === 'business' ? 'del emprendimiento' : cardData.type === 'product' ? 'del producto' : 'del servicio'} ${cardData.data.name}`}
        >
          <div className="relative">
            <div className={`relative ${cardData.type === 'business' ? 'aspect-[4/3]' : 'aspect-square'} overflow-hidden rounded-t-2xl bg-gradient-to-br from-gray-50 to-gray-100/50 flex items-center justify-center`}>
            {cardData.type === 'business' ? (
              cardData.data.logo_url && !imageError ? (
                <Image
                  src={imageUrl}
                  alt={`Logo del emprendimiento ${cardData.data.name}`}
                  fill
                  className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                  onError={() => setImageError(true)}
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                />
              ) : (
                <Store className="h-16 w-16 text-gray-400" aria-hidden="true" />
              )
            ) : (
              <>
                <Image
                  src={imageUrl}
                  alt={`Imagen ${cardData.type === 'product' ? 'del producto' : 'del servicio'} ${cardData.data.name}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={() => setImageError(true)}
                  priority={priority}
                  loading={priority ? "eager" : "lazy"}
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                />
                
                {/* Badge de tipo - solo visible en hover */}
                <div className={`absolute top-2 left-2 sm:top-3 sm:left-3 ${typeConfig.badgeColor} text-white px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium glass-dark opacity-0 group-hover:opacity-100 transition-modern`}>
                  {typeConfig.badgeText}
                </div>
                

              </>
            )}
            </div>
          </div>
        </SafeLink>

        <CardContent className="p-1.5 sm:p-3 lg:p-4 flex-1 flex flex-col">
          <SafeLink 
            href={detailUrl}
            className={`block focus:outline-none focus:ring-2 ${typeConfig.ringColor.split(' ')[0]} focus:ring-offset-2 rounded-lg cursor-pointer`}
            aria-label={`Ver detalles ${cardData.type === 'business' ? 'del emprendimiento' : cardData.type === 'product' ? 'del producto' : 'del servicio'} ${cardData.data.name}`}
          >
            {cardData.data.category && (
              <div className="text-xs text-gray-500 mb-1.5 sm:mb-2 truncate font-medium">
                {cardData.data.category.icon && <span className="mr-1.5">{cardData.data.category.icon}</span>}
                <span>{cardData.data.category.name}</span>
              </div>
            )}
            
            <h3 id={`${cardData.type}-title-grid-${cardData.data.id}`} className="font-bold text-xs sm:text-sm lg:text-base hover:text-primary transition-colors line-clamp-2 mb-1 sm:mb-1.5 leading-tight text-gray-900 tracking-tight">
              <span className="line-clamp-2">{cardData.data.name}</span>
            </h3>

            {/* Información específica por tipo */}
            
            {cardData.type === 'business' && cardData.data.description && (
              <p className="text-xs text-gray-600 mb-1.5 sm:mb-2 line-clamp-2 leading-relaxed font-medium">
                {cardData.data.description}
              </p>
            )}
            
            {cardData.type === 'business' && locationText && (
              <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3 font-medium">
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 text-primary" aria-hidden="true" />
                <span className="truncate font-semibold">{locationText}</span>
              </div>
            )}
            
            {cardData.type === 'business' && (
              <Badge variant="outline" className="text-xs px-2 py-1 sm:px-3 sm:py-1.5 self-start mb-2 sm:mb-3 bg-emerald-50 text-emerald-700 border-modern rounded-full transition-modern hover:shadow-soft">
                Activo
              </Badge>
            )}
          </SafeLink>

          {/* Precio */}
          {formattedPrice && (
            <div className="mt-auto">
              <span className="text-xs sm:text-sm font-bold text-gray-700 bg-gray-100 px-2 py-1.5 sm:px-3 sm:py-2 rounded-xl border-modern transition-modern hover:shadow-md tracking-tight">
                {formattedPrice}
              </span>
            </div>
          )}
        </CardContent>

        {/* Botón redondo de WhatsApp - esquina inferior derecha del card, solo visible en hover */}
        {(cardData.type === 'product' || cardData.type === 'service') && cardData.data.business?.whatsapp && (
          <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 z-10">
            <button
              className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-full flex items-center justify-center shadow-soft hover:shadow-glow-primary transition-modern border-2 border-white hover-lift"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleWhatsAppContact();
              }}
              aria-label="Contactar por WhatsApp"
            >
              <FaWhatsapp className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </button>
          </div>
        )}
      </Card>
    );
};

export const UniversalCard = memo(UniversalCardComponent);
export type { UniversalCardData, ProductCardData, ServiceCardData, BusinessCardData };