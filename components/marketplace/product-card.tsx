'use client';

import { useState } from 'react';
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

export function ProductCard({ product, viewMode, priority = false }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);

  const formatPrice = (price?: number) => {
    if (!price) return 'Precio a consultar';
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: product.currency || 'CRC',
      minimumFractionDigits: 0
    }).format(price);
  };

  const businessSlug = generateBusinessSlug(product.business?.name, product.business?.id);
  const productSlug = generateProductSlug(product.business?.name, product.name, product.id);

  const getImageUrl = () => {
    if (product.image_url && !imageError) {
      return product.image_url;
    }
    return '/placeholder-product.jpg';
  };

  const handleWhatsAppContact = async () => {
    if (!product.business?.id) return;
    
    // Registrar estadística de contacto
    try {
      await recordWhatsAppContact(product.business.id, product.id);
    } catch (error) {
      console.error('Error recording WhatsApp contact:', error);
    }
    
    const productUrl = `${window.location.origin}/products/${productSlug}`;
    const now = new Date();
    const dateTime = now.toLocaleString('es-CR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    
    const message = ` ¡Hola! Estoy interesado/a en este producto \n\n` +
      `📦 *Producto:* ${product.name}\n` +
      `💰 *Precio:* ${formatPrice(product.price)}\n\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n` +
      `🔗 *Ver detalles completos:*\n${productUrl}\n\n` +
      `📅 *Fecha de consulta:* ${dateTime}\n\n` +
      `¡Espero tu respuesta! 😊`;
    const whatsappNumber = product.business?.whatsapp || product.business?.phone || '';
    if (whatsappNumber) {
      const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    } else {
      alert('No hay número de WhatsApp disponible para este emprendimiento');
    }
  };

  if (viewMode === 'list') {
    return (
      <Card className="hover:shadow-md transition-shadow duration-200 h-24 sm:h-28">
        <div className="flex h-full">
          {/* Image */}
          <SafeLink href={`/products/${productSlug}`}>
             <div className="relative w-20 sm:w-24 h-full flex-shrink-0 cursor-pointer bg-white">
               <Image
                 src={getImageUrl()}
                 alt={product.name}
                 fill
                 className="object-cover rounded-l-lg"
                 onError={() => setImageError(true)}
                 priority={priority}
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
                <SafeLink href={`/products/${productSlug}`}>
                  <h3 className="font-semibold text-sm sm:text-base hover:text-primary transition-colors line-clamp-1 mb-1">
                    {product.name}
                  </h3>
                </SafeLink>
                {product.business && (
                  <SafeLink href={`/businesses/${businessSlug}`}>
                    <p className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors truncate">
                      por {product.business.name}
                    </p>
                  </SafeLink>
                )}
              </div>
              
              <div className="flex items-center min-w-0">
                <span className="text-sm sm:text-base font-bold text-primary truncate">
                  {formatPrice(product.price)}
                </span>
              </div>
            </div>
            
            {/* Buttons - Vertical on the right */}
            <div className="flex flex-col gap-1 justify-center ml-2 flex-shrink-0">
              <Button variant="outline" size="sm" className="h-8 w-8 p-1" asChild>
                <SafeLink href={`/products/${productSlug}`}>
                  <Eye className="h-5 w-5" />
                </SafeLink>
              </Button>
              <Button 
                size="sm" 
                onClick={handleWhatsAppContact}
                className="bg-green-600 hover:bg-green-700 h-8 w-8 p-1"
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
    <Card className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
      <div className="relative">
        <SafeLink href={`/products/${productSlug}`}>
           <div className="relative aspect-[4/3] overflow-hidden rounded-t-lg cursor-pointer bg-white w-full">
             <Image
               src={getImageUrl()}
               alt={product.name}
               fill
               sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
               className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
               onError={() => setImageError(true)}
               priority={priority}
             />
             {/* Product badge */}
             <div className="absolute top-1 sm:top-2 left-1 sm:left-2 bg-green-500 text-white px-2.5 py-0.5 rounded-md text-xs font-semibold">
               Producto
             </div>
           </div>
         </SafeLink>
      </div>

      <CardContent className="p-2 sm:p-3">
        {product.category && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
            <span className="text-xs">{product.category.icon}</span>
            <span className="truncate">{product.category.name}</span>
          </div>
        )}
        
        <SafeLink href={`/products/${productSlug}`}>
          <h3 className="font-medium text-xs sm:text-sm hover:text-primary transition-colors line-clamp-2 mb-1 leading-tight">
            {product.name}
          </h3>
        </SafeLink>
        
        {product.business && (
          <SafeLink href={`/businesses/${businessSlug}`}>
            <p className="text-xs text-muted-foreground hover:text-primary transition-colors mb-1 truncate">
              por {product.business.name}
            </p>
          </SafeLink>
        )}

        <div className="flex items-center justify-between mb-2">
          <span className="text-sm sm:text-lg font-bold text-primary">
            {formatPrice(product.price)}
          </span>
        </div>
      </CardContent>

      <CardFooter className="p-2 sm:p-3 pt-0 flex gap-1">
        <Button variant="outline" size="sm" className="flex-1 text-xs px-1 sm:px-3" asChild>
          <SafeLink href={`/products/${productSlug}`}>
            <Eye className="h-5 w-5 mr-0 sm:mr-1" />
            <span className="hidden sm:inline">Ver</span>
          </SafeLink>
        </Button>
        <Button 
          size="sm" 
          className="flex-1 bg-green-600 hover:bg-green-700 text-xs p-1"
          onClick={handleWhatsAppContact}
        >
          <FaWhatsapp className="h-5 w-5" />
        </Button>
      </CardFooter>
    </Card>
  );
}