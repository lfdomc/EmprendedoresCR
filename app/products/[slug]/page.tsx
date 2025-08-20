import { getProductBySlug, getProductById } from '@/lib/supabase/database';
import { notFound } from 'next/navigation';
import { extractIdFromSlug } from '@/lib/utils/slug';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Package, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { generateBusinessSlug } from '@/lib/utils/slug';
import { WhatsAppButton } from '@/components/ui/whatsapp-button';
import { ShareProductButton } from '@/components/ui/share-product-button';
import { ProductWithDetails } from '@/lib/types/database';
import { ProductStructuredData } from '@/components/seo/structured-data';
import type { Metadata } from 'next';

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  
  try {
    // First try to get product by slug, if not found try by ID (for backward compatibility)
    let product: ProductWithDetails | null = await getProductBySlug(slug);
    
    if (!product) {
      // Try to extract ID from slug for backward compatibility
      const possibleId = extractIdFromSlug(slug);
      product = await getProductById(possibleId);
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
        <ProductStructuredData product={product} business={product.business} />
        <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <div className="mb-6">
            <Link href="/">
              <Button variant="ghost" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Volver al marketplace
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="space-y-4">
              <div className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden">
                {product.image_url ? (
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Package className="h-24 w-24 text-gray-400" />
                  </div>
                )}
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
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
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-white border border-gray-200 shadow-sm">
                          <Image
                            src={product.business.logo_url}
                            alt={product.business.name}
                            fill
                            className="object-contain p-2 hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <h4 className="font-semibold">{product.business.name}</h4>
                        {product.business.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {product.business.description}
                          </p>
                        )}
                        <div className="flex gap-2 mt-2">
                          <Link href={`/businesses/${businessSlug}`}>
                            <Button variant="outline" size="sm">
                              Ver emprendimiento
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Action Buttons */}
              <div className="space-y-4">
                <ShareProductButton
                  productName={product.name}
                  productDescription={product.description}
                  className="w-full"
                />
                <WhatsAppButton
                  whatsappNumber={product.business?.whatsapp}
                  productName={product.name}
                  price={product.price}
                  currency={product.currency}
                  businessId={product.business?.id || ''}
                  productId={product.id}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading product:', error);
    notFound();
  }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    let product = await getProductBySlug(slug);
    
    if (!product) {
      const possibleId = extractIdFromSlug(slug);
      product = await getProductById(possibleId);
    }
    
    if (!product) {
      return {
        title: 'Producto no encontrado - Costa Rica Emprende',
        description: 'El producto que buscas no existe o no está disponible.',
      };
    }

    const formatPrice = (price?: number) => {
      if (!price) return 'Precio a consultar';
      return new Intl.NumberFormat('es-CR', {
        style: 'currency',
        currency: product.currency || 'CRC',
        minimumFractionDigits: 0
      }).format(price);
    };

    const priceText = formatPrice(product.price);
    const businessName = product.business?.name || 'Emprendimiento';
    const location = [product.canton, product.provincia].filter(Boolean).join(', ');
    const locationText = location ? ` en ${location}` : '';
    
    const title = `${product.name} - ${priceText} | ${businessName} - Costa Rica Emprende`;
    const description = product.description 
      ? `${product.description.substring(0, 150)}... Disponible${locationText}. Contacta al vendedor vía WhatsApp.`
      : `${product.name} disponible por ${priceText}${locationText}. Contacta a ${businessName} vía WhatsApp para más información.`;

    const defaultUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";

    return {
      title,
      description,
      keywords: [
        product.name,
        businessName,
        'producto',
        'Costa Rica',
        'emprendimiento',
        'marketplace',
        product.category?.name || '',
        product.canton || '',
        product.provincia || '',
        'WhatsApp',
        'comprar',
        'local',
        'artesanal',
        'hecho en Costa Rica',
        'pyme',
        'startup'
      ].filter(Boolean),
      openGraph: {
        title,
        description,
        type: 'website',
        url: `${defaultUrl}/products/${slug}`,
        images: product.image_url ? [
          {
            url: product.image_url,
            width: 800,
            height: 600,
            alt: product.name,
          }
        ] : [
          {
            url: '/opengraph-image.png',
            width: 1200,
            height: 630,
            alt: 'Costa Rica Emprende - Marketplace de Emprendimientos',
          }
        ],
        siteName: 'Costa Rica Emprende',
        locale: 'es_CR',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: product.image_url ? [product.image_url] : ['/twitter-image.png'],
      },
      alternates: {
        canonical: `${defaultUrl}/products/${slug}`,
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
      other: {
        'product:price:amount': product.price?.toString() || '0',
        'product:price:currency': product.currency || 'CRC',
        'product:availability': 'in stock',
        'product:condition': 'new',
        'product:retailer_item_id': product.id,
      },
    };
  } catch {
    return {
      title: 'Error - Costa Rica Emprende',
      description: 'Ocurrió un error al cargar la información del producto.',
    };
  }
}