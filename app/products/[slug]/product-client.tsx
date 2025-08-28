'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { generateBusinessSlug, generateProductSlug } from '@/lib/utils/slug';
import { WhatsAppButton } from '@/components/ui/whatsapp-button';
import { ShareProductButton } from '@/components/ui/share-product-button';
import { ProductWithDetails } from '@/lib/types/database';
import { ProductStructuredData } from '@/components/seo/structured-data';

interface ProductClientProps {
  product: ProductWithDetails;
}

// Componente para la galería de imágenes del producto
function ProductImageGallery({ product }: { product: ProductWithDetails }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  // Crear array de todas las imágenes disponibles
  const images = [
    product.image_url,
    product.additional_photo_1,
    product.additional_photo_2,
    product.additional_photo_3
  ].filter(Boolean) as string[];
  
  const selectedImage = images[selectedImageIndex] || product.image_url || '/placeholder-business.svg';
  
  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  };
  
  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };
  
  return (
    <div className="space-y-4">
      {/* Imagen principal */}
      <div className="relative aspect-square w-full max-w-md mx-auto bg-gray-100 rounded-lg overflow-hidden">
        <Image
          src={selectedImage}
          alt={product.name}
          fill
          className="object-cover"
          priority
        />
        
        {/* Controles de navegación - solo mostrar si hay más de una imagen */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
              aria-label="Imagen anterior"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
              aria-label="Siguiente imagen"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            
            {/* Indicador de imagen actual */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 text-white px-2 py-1 rounded text-sm">
              {selectedImageIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>
      
      {/* Miniaturas - solo mostrar si hay más de una imagen */}
      {images.length > 1 && (
        <div className="flex gap-2 justify-center overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImageIndex(index)}
              className={`relative w-16 h-16 rounded-md overflow-hidden border-2 transition-colors ${
                selectedImageIndex === index 
                  ? 'border-blue-500' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Image
                src={image}
                alt={`${product.name} - imagen ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProductClient({ product }: ProductClientProps) {
  const router = useRouter();
  
  const formatPrice = (price?: number) => {
    if (!price) return 'Precio a consultar';
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: product.currency || 'CRC',
      minimumFractionDigits: 0
    }).format(price);
  };

  const businessSlug = product.business ? generateBusinessSlug(product.business.name, product.business.id) : '';
  const productSlug = generateProductSlug(product.business?.name, product.name, product.id);
  const location = [product.canton, product.provincia].filter(Boolean).join(', ');

  return (
    <div className="min-h-screen bg-gray-50">
      <ProductStructuredData product={product} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Botón de regreso */}
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al marketplace
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Galería de imágenes */}
          <div>
            <ProductImageGallery product={product} />
          </div>

          {/* Información del producto */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Package className="h-3 w-3" />
                  {product.category?.name || 'Sin categoría'}
                </Badge>
                {location && (
                  <Badge variant="outline">
                    {location}
                  </Badge>
                )}
              </div>
              <p className="text-3xl font-bold text-blue-600 mb-4">
                {formatPrice(product.price)}
              </p>
            </div>

            {product.description && (
              <div>
                <h2 className="text-xl font-semibold mb-2">Descripción</h2>
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Información del emprendimiento */}
            {product.business && (
              <Card 
                className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
                onClick={() => router.push(`/businesses/${businessSlug}`)}
              >
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-3">
                    {product.business.logo_url && (
                      <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-br from-white via-gray-50/40 to-gray-100/60 border border-gray-200/70 shadow-lg hover:shadow-xl transition-all duration-300 relative group">
                        {/* Decorative background pattern */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_40%,rgba(59,130,246,0.04),transparent_65%)] rounded-full" />
                        <Image
                          src={product.business.logo_url}
                          alt={`Logo de ${product.business.name}`}
                          width={64}
                          height={64}
                          className="w-full h-full object-contain p-1 rounded-full hover:scale-110 transition-all duration-500 ease-out drop-shadow-lg filter hover:brightness-110 hover:contrast-105"
                        />
                        {/* Subtle overlay on hover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-400 rounded-full" />
                      </div>
                    )}
                    <div>
                      <span>Sobre el emprendimiento</span>
                      <p className="text-base font-semibold text-gray-900 mt-1">{product.business.name}</p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {product.business.description && (
                      <p className="text-gray-600 text-sm leading-relaxed">{product.business.description}</p>
                    )}
                    
                    {/* Información de contacto */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      {product.business?.email && (
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-500">Email:</span>
                          <span 
                            className="text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.location.href = `mailto:${product.business?.email}`;
                            }}
                          >
                            {product.business?.email}
                          </span>
                        </div>
                      )}
                      {product.business?.phone && (
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-500">Teléfono:</span>
                          <span 
                            className="text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.location.href = `tel:${product.business?.phone}`;
                            }}
                          >
                            {product.business?.phone}
                          </span>
                        </div>
                      )}
                      {product.business?.website && (
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-500">Sitio web:</span>
                          <span 
                            className="text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(product.business?.website, '_blank', 'noopener,noreferrer');
                            }}
                          >
                            Visitar sitio
                          </span>
                        </div>
                      )}
                      {product.business?.whatsapp && (
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-500">WhatsApp:</span>
                          <span 
                            className="text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(`https://wa.me/${product.business?.whatsapp?.replace(/[^\d]/g, '')}`, '_blank', 'noopener,noreferrer');
                            }}
                          >
                            {product.business?.whatsapp}
                          </span>
                        </div>
                      )}
                      {(product.business?.provincia || product.business?.canton) && (
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-500">Ubicación:</span>
                          <span className="text-gray-700">
                            {[product.business?.canton, product.business?.provincia].filter(Boolean).join(', ')}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Redes sociales */}
                    {(product.business?.facebook || product.business?.instagram) && (
                      <div className="space-y-2">
                        <span className="font-medium text-gray-500 text-sm">Redes sociales:</span>
                        <div className="flex gap-3">
                          {product.business?.facebook && (
                            <span 
                              className="text-blue-600 hover:text-blue-800 transition-colors text-sm cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(product.business?.facebook, '_blank', 'noopener,noreferrer');
                              }}
                            >
                              Facebook
                            </span>
                          )}
                          {product.business?.instagram && (
                            <span 
                              className="text-pink-600 hover:text-pink-800 transition-colors text-sm cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(product.business?.instagram, '_blank', 'noopener,noreferrer');
                              }}
                            >
                              Instagram
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    
                    <span className="inline-block text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors">
                      Ver más productos de este emprendimiento →
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Botones de acción */}
            <div className="space-y-3">
              <WhatsAppButton 
                whatsappNumber={product.business?.whatsapp}
                productName={product.name}
                price={product.price}
                currency={product.currency}
                businessId={product.business?.id || ''}
                productId={product.id}
                productSlug={productSlug}
                className="w-full"
              />
              <ShareProductButton 
                productName={product.name}
                productDescription={product.description}
                className="w-full"
              />
            </div>


          </div>
        </div>
      </div>
    </div>
  );
}