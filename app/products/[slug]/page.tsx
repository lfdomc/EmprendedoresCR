import { getProductBySlug, getProductById } from '@/lib/supabase/database';
import { notFound } from 'next/navigation';
import { extractIdFromSlug } from '@/lib/utils/slug';
import type { Metadata } from 'next';
import { ProductWithDetails } from '@/lib/types/database';
import ProductClient from './product-client';

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

    return <ProductClient product={product} />;
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
            url: '/cremprende-logo.png',
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
        images: product.image_url ? [product.image_url] : ['/cremprende-logo.png'],
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