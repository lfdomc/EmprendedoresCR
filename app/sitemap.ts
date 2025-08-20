import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'
import { generateBusinessSlug, generateProductSlug, generateServiceSlug } from '@/lib/utils/slug'

type BusinessInfo = {
  id: string
  name: string
}

type ProductWithBusiness = {
  id: string
  name: string
  updated_at: string
  business: BusinessInfo[] | null
}

type ServiceWithBusiness = {
  id: string
  name: string
  updated_at: string
  business: BusinessInfo[] | null
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()
  
  const defaultUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000"

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: defaultUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${defaultUrl}/businesses`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ]

  try {
    // Get all active businesses
    const { data: businesses } = await supabase
      .from('businesses')
      .select('id, name, updated_at')
      .eq('is_active', true)

    const businessPages: MetadataRoute.Sitemap = businesses?.map((business) => ({
      url: `${defaultUrl}/businesses/${generateBusinessSlug(business.name, business.id)}`,
      lastModified: new Date(business.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })) || []

    // Get all active products with business info
    const { data: products } = await supabase
      .from('products')
      .select(`
        id,
        name,
        updated_at,
        business:businesses(id, name)
      `)
      .eq('is_active', true)

    const productPages: MetadataRoute.Sitemap = products?.map((product: ProductWithBusiness) => ({
      url: `${defaultUrl}/products/${generateProductSlug(product.business?.[0]?.name, product.name, product.id)}`,
      lastModified: new Date(product.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    })) || []

    // Get all active services with business info
    const { data: services } = await supabase
      .from('services')
      .select(`
        id,
        name,
        updated_at,
        business:businesses(id, name)
      `)
      .eq('is_active', true)

    const servicePages: MetadataRoute.Sitemap = services?.map((service: ServiceWithBusiness) => ({
      url: `${defaultUrl}/services/${generateServiceSlug(service.business?.[0]?.name, service.name, service.id)}`,
      lastModified: new Date(service.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    })) || []

    return [...staticPages, ...businessPages, ...productPages, ...servicePages]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return staticPages
  }
}