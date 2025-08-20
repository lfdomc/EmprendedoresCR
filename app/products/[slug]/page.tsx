'use client';

import { useState, useEffect } from 'react';
import { getProductBySlug, getProductById } from '@/lib/supabase/database';
import { notFound } from 'next/navigation';
import { extractIdFromSlug } from '@/lib/utils/slug';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Package, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { generateBusinessSlug } from '@/lib/utils/slug';
import { WhatsAppButton } from '@/components/ui/whatsapp-button';
import { toast } from 'sonner';
import { ProductWithDetails } from '@/lib/types/database';

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const [product, setProduct] = useState<ProductWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [slug, setSlug] = useState<string>('');

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const resolvedParams = await params;
        const productSlug = resolvedParams.slug;
        setSlug(productSlug);
        
        // First try to get product by slug, if not found try by ID (for backward compatibility)
        let productData = await getProductBySlug(productSlug);
        
        if (!productData) {
          // Try to extract ID from slug for backward compatibility
          const possibleId = extractIdFromSlug(productSlug);
          productData = await getProductById(possibleId);
        }
        
        if (!productData) {
          notFound();
        }
        
        setProduct(productData);
      } catch (error) {
        console.error('Error loading product:', error);
        notFound();
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [params]);

  // Función para manejar el compartir
  const handleShare = async () => {
    if (!product) return;
    
    const shareData = {
      title: `${product.name} - Producto en Costa Rica`,
      text: `🛍️ ¡Mira este producto! ${product.name} ${product.description ? '- ' + product.description.substring(0, 100) + '...' : ''} 🇨🇷`,
      url: window.location.href
    };

    try {
      // Verificar si el navegador soporta la Web Share API
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
        toast.success('¡Compartido exitosamente!');
      } else {
        // Fallback: copiar al portapapeles si está disponible
        const shareText = `🛍️ ¡Mira este producto! 🛍️\n\n${product.name}\n${product.description || 'Un increíble producto disponible en Costa Rica.'} 🇨🇷\n\n🔗 Ver más: ${window.location.href}\n\n#ProductosCR #CostaRica`;
        
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(shareText);
          toast.success('¡Enlace copiado al portapapeles! 📋');
        } else {
          // Fallback final: mostrar el texto para copiar manualmente
          toast.info('Copia este enlace: ' + window.location.href);
        }
      }
    } catch (error) {
      console.error('Error sharing:', error);
      // Fallback de emergencia
      toast.info('Copia este enlace: ' + window.location.href);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Cargando producto...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  const businessSlug = generateBusinessSlug(product.business?.name, product.business?.id);

    const formatPrice = (price?: number) => {
      if (!price) return 'Precio a consultar';
      return new Intl.NumberFormat('es-CR', {
        style: 'currency',
        currency: product.currency || 'CRC',
        minimumFractionDigits: 0
      }).format(price);
    };



    return (
      <div className="min-h-screen bg-background">
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
            {/* Product Image */}
            <div className="space-y-4">
              <div className="relative aspect-square overflow-hidden rounded-lg bg-white">
                {product.image_url ? (
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Package className="h-16 w-16 text-muted-foreground" />
                  </div>
                )}
              </div>
              

            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                {product.category && (
                  <Badge variant="outline" className="mb-2">
                    {product.category.name}
                  </Badge>
                )}
                <h1 className="text-3xl font-bold">{product.name}</h1>
                <p className="text-2xl font-bold text-primary mt-2">
                  {formatPrice(product.price)}
                </p>
              </div>

              {product.description && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Descripción</h3>
                  <p className="text-muted-foreground">{product.description}</p>
                </div>
              )}

              {product.sku && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">SKU</h3>
                  <p className="text-muted-foreground">{product.sku}</p>
                </div>
              )}

              {(product.canton || product.provincia) && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>
                    {[product.canton, product.provincia].filter(Boolean).join(', ')}
                  </span>
                </div>
              )}

              {/* Business Info */}
              {product.business && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Vendido por</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      {product.business.logo_url && (
                        <div className="relative w-12 h-12 rounded-full overflow-hidden bg-white">
                          <Image
                            src={product.business.logo_url}
                            alt={product.business.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <Link href={`/businesses/${businessSlug}`}>
                          <h4 className="font-semibold hover:text-primary transition-colors">
                            {product.business.name}
                          </h4>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <WhatsAppButton 
                  whatsappNumber={product.business?.whatsapp}
                  productName={product.name}
                  price={product.price}
                  currency={product.currency}
                  className="w-full"
                  businessId={product.business?.id || ''}
                  productId={product.id}
                  productSlug={slug}
                />
                
                <Button 
                  variant="default" 
                  size="lg" 
                  className="w-full bg-yellow-700 hover:bg-yellow-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  onClick={handleShare}
                >
                  Compartir Producto
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}