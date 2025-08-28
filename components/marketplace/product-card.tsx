'use client';

import { useState, useCallback, useMemo, memo } from 'react';
import Image from 'next/image';
import { SafeLink } from '@/components/ui/safe-link';
import { Eye } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { Button } from '@/components/ui/button';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Product } from '@/lib/types/database';
import { generateBusinessSlug, generateProductSlug } from '@/lib/utils/slug';
import { recordWhatsAppContact } from '@/lib/supabase/database';

interface ProductCardProps {
  product: Product & {
    business?: {
      id: string;
      name: string;
      logo_url?: string;
      phone?: string;
      whatsapp?: string;
    };
    category?: {
      id: string;
      name: string;
      icon?: string;
    };
  };
  viewMode: 'grid' | 'list';
  priority?: boolean;
}

const ProductCardComponent = ({ product, viewMode, priority = false }: ProductCardProps) => {
  const [imageError, setImageError] = useState(false);

  // Memoize expensive calculations
  const formatPrice = useCallback((price?: number) => {
    if (!price) return 'Precio a consultar';
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: product.currency || 'CRC',
      minimumFractionDigits: 0
    }).format(price);
  }, [product.currency]);

  const businessSlug = useMemo(() => 
    generateBusinessSlug(product.business?.name, product.business?.id),
    [product.business?.name, product.business?.id]
  );
  
  const productSlug = useMemo(() => 
    generateProductSlug(product.business?.name, product.name, product.id),
    [product.business?.name, product.name, product.id]
  );

  const imageUrl = useMemo(() => {
    if (product.image_url && !imageError) {
      return product.image_url;
    }
    return '/placeholder-product.jpg';
  }, [product.image_url, imageError]);

  const formattedPrice = useMemo(() => formatPrice(product.price), [formatPrice, product.price]);

  const handleWhatsAppContact = useCallback(async () => {
    if (!product.business?.id) return;
    
    // Registrar estadística de contacto
    try {
      await recordWhatsAppContact(product.business.id, product.id);
    } catch (error) {
      console.error('Error recording WhatsApp contact:', error);
    }
    
    const productUrl = `${typeof window !== 'undefined' ? window.location.origin : 'https://costaricaemprende.com'}/products/${productSlug}`;
    const now = new Date();
    const dateTime = now.toLocaleString('es-CR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    
    // Construir el mensaje
    let message = ` *¡Hola! Estoy interesado/a en este producto* 

`;
    
    // Agregar imagen si está disponible (solo para que WhatsApp la muestre)
    if (product.image_url && !imageError) {
      message += `${product.image_url}

`;
    }
    
    message += `📦 *Producto:* ${product.name}\n` +
      `💰 *Precio:* ${formattedPrice}\n\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
      `🔗 *Ver detalles completos:*\n${productUrl}\n\n` +
      `📅 *Fecha de consulta:* ${dateTime}\n\n` +
      `¡Espero tu respuesta! 😊`;
    const whatsappNumber = product.business?.whatsapp || product.business?.phone || '';
    if (whatsappNumber) {
      const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
      if (typeof window !== 'undefined') {
        window.open(whatsappUrl, '_blank');
      }
    } else {
      alert('No hay número de WhatsApp disponible para este emprendimiento');
    }
  }, [product.business?.id, product.business?.whatsapp, product.business?.phone, product.id, product.name, productSlug, formattedPrice]);

  if (viewMode === 'list') {
    return (
      <Card className="hover:shadow-md transition-shadow duration-200 h-24 sm:h-28 focus-within:ring-2 focus-within:ring-orange-500 focus-within:ring-offset-2" role="article" aria-labelledby={`product-title-${product.id}`}>
        <div className="flex h-full">
          {/* Image */}
          <SafeLink 
            href={`/products/${productSlug}`}
            className="focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded-l-lg"
            aria-label={`Ver detalles de ${product.name}`}
          >
             <div className="relative w-20 sm:w-24 h-full flex-shrink-0 cursor-pointer bg-white">
               <Image
                 src={imageUrl}
                 alt={`Imagen del producto ${product.name}`}
                 fill
                 className="object-cover rounded-l-lg"
                 onError={() => setImageError(true)}
                 priority={priority}
                 loading={priority ? "eager" : "lazy"}
                 placeholder="blur"
                 blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                 sizes="(max-width: 640px) 80px, (max-width: 768px) 96px, 120px"
               />
               {/* Product badge */}
               <div className="absolute top-1 sm:top-2 left-1 sm:left-2 bg-green-500 text-white px-2.5 py-0.5 rounded-md text-xs font-semibold">
                 Producto
               </div>
             </div>
           </SafeLink>

          {/* Content */}
          <div className="flex-1 p-2 sm:p-3 min-w-0 flex">
            <div className="flex-1 flex flex-col justify-between min-w-0">
              <div className="min-w-0">
                {product.category && (
                  <div className="text-[10px] sm:text-xs text-muted-foreground mb-0.5 sm:mb-1 truncate">
                    <span>{product.category.icon}</span>
                    <span className="ml-1">{product.category.name}</span>
                  </div>
                )}
                <SafeLink 
                  href={`/products/${productSlug}`}
                  className="focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded"
                >
                  <h3 id={`product-title-${product.id}`} className="font-semibold text-sm sm:text-base hover:text-primary transition-colors line-clamp-1 mb-1">
                    {product.name}
                  </h3>
                </SafeLink>
                {product.business && (
                  <SafeLink 
                    href={`/businesses/${businessSlug}`}
                    className="focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded"
                    aria-label={`Ver emprendimiento ${product.business.name}`}
                  >
                    <p className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors truncate">
                      por {product.business.name}
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
                  href={`/products/${productSlug}`}
                  aria-label={`Ver detalles de ${product.name}`}
                >
                  <Eye className="h-5 w-5" />
                </SafeLink>
              </Button>
              <Button 
                size="sm" 
                onClick={handleWhatsAppContact}
                className="bg-green-600 hover:bg-green-700 h-8 w-8 p-1"
                aria-label={`Contactar por WhatsApp sobre ${product.name}`}
              >
                <FaWhatsapp className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1 focus-within:ring-2 focus-within:ring-orange-500 focus-within:ring-offset-2" role="article" aria-labelledby={`product-title-grid-${product.id}`}>
      <div className="relative">
        <SafeLink 
          href={`/products/${productSlug}`}
          className="focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded-t-lg"
          aria-label={`Ver detalles de ${product.name}`}
        >
           <div className="relative aspect-[4/3] overflow-hidden rounded-t-lg cursor-pointer bg-white w-full">
             <Image
               src={imageUrl}
               alt={`Imagen del producto ${product.name}`}
               fill
               sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
               className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
               onError={() => setImageError(true)}
               priority={priority}
               loading={priority ? "eager" : "lazy"}
               placeholder="blur"
               blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
             />
             {/* Product badge */}
             <div className="absolute top-1 sm:top-2 left-1 sm:left-2 bg-green-500 text-white px-2.5 py-0.5 rounded-md text-xs font-semibold">
               Producto
             </div>
           </div>
         </SafeLink>
      </div>

      <CardContent className="p-1.5 sm:p-3">
        {product.category && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
            <span className="text-xs">{product.category.icon}</span>
            <span className="truncate">{product.category.name}</span>
          </div>
        )}
        
        <SafeLink 
          href={`/products/${productSlug}`}
          className="focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded"
        >
          <h3 id={`product-title-${product.id}`} className="font-medium text-xs sm:text-sm hover:text-primary transition-colors line-clamp-2 mb-1 leading-tight h-8 sm:h-10 flex items-start">
            <span className="line-clamp-2">{product.name}</span>
          </h3>
        </SafeLink>
        
        {product.business && (
          <SafeLink 
            href={`/businesses/${businessSlug}`}
            className="focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 rounded"
            aria-label={`Ver emprendimiento ${product.business.name}`}
          >
            <p className="text-xs text-muted-foreground hover:text-primary transition-colors mb-1 truncate">
              por {product.business.name}
            </p>
          </SafeLink>
        )}

        <div className="flex items-center justify-between mb-2">
          <span className="text-sm sm:text-lg font-bold text-primary">
            {formattedPrice}
          </span>
        </div>
      </CardContent>

      <CardFooter className="p-1.5 sm:p-3 pt-0 flex gap-1">
        <Button variant="outline" size="sm" className="flex-1 text-xs px-1 sm:px-3 py-1 sm:py-2" asChild>
          <SafeLink 
            href={`/products/${productSlug}`}
            aria-label={`Ver detalles de ${product.name}`}
          >
            <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-0 sm:mr-1" />
            <span className="hidden sm:inline">Ver</span>
          </SafeLink>
        </Button>
        <Button 
          size="sm" 
          className="flex-1 bg-green-600 hover:bg-green-700 text-xs p-1 sm:p-2"
          onClick={handleWhatsAppContact}
          aria-label={`Contactar por WhatsApp sobre ${product.name}`}
        >
          <FaWhatsapp className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

// Memoize the component for better performance
export const ProductCard = memo(ProductCardComponent);