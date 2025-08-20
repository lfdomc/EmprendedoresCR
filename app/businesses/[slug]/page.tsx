import { getBusinessBySlug, getBusinessById, getProductsByBusinessId, getServicesByBusinessId } from '@/lib/supabase/database';
import { BusinessProfile } from '@/components/business/business-profile';
import { notFound } from 'next/navigation';
import { extractIdFromSlug } from '@/lib/utils/slug';

interface BusinessPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BusinessPage({ params }: BusinessPageProps) {
  const { slug } = await params;
  
  try {
    // First try to get business by slug, if not found try by ID (for backward compatibility)
    let business = await getBusinessBySlug(slug);
    
    if (!business) {
      // Try to extract ID from slug for backward compatibility
      const possibleId = extractIdFromSlug(slug);
      business = await getBusinessById(possibleId);
    }
    
    if (!business) {
      notFound();
    }

    // Fetch products and services for this business
    const [products, services] = await Promise.all([
      getProductsByBusinessId(business.id),
      getServicesByBusinessId(business.id)
    ]);

    return (
      <div className="min-h-screen bg-background">
        <BusinessProfile 
          business={business} 
          products={products} 
          services={services} 
        />
      </div>
    );
  } catch (error) {
    console.error('Error loading business:', error);
    notFound();
  }
}

export async function generateMetadata({ params }: BusinessPageProps) {
  const { slug } = await params;
  
  try {
    let business = await getBusinessBySlug(slug);
    
    if (!business) {
      const possibleId = extractIdFromSlug(slug);
      business = await getBusinessById(possibleId);
    }
    
    if (!business) {
      return {
        title: 'Emprendimiento no encontrado - EmprendimientosCR',
        description: 'El emprendimiento que buscas no existe o no está disponible.',
      };
    }

    return {
      title: `${business.name} - EmprendimientosCR`,
      description: business.description || `Conoce más sobre ${business.name} y sus productos y servicios.`,
    };
  } catch {
    return {
      title: 'Error - EmprendimientosCR',
      description: 'Ocurrió un error al cargar la información del emprendimiento.',
    };
  }
}