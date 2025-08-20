import { getBusinesses, getCategories } from '@/lib/supabase/database';
import { Card, CardContent } from '@/components/ui/card';
import { Store } from 'lucide-react';
import { BusinessesWithFilters } from '@/components/business/businesses-with-filters';
import { Suspense } from 'react';

interface BusinessesPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
  }>;
}

async function BusinessesContent({ searchParams }: { searchParams: Promise<{ search?: string; category?: string; }> }) {
  const params = await searchParams;
  
  try {
    
    // Fetch businesses and categories in parallel
    const [businesses, categories] = await Promise.all([
      getBusinesses({
        search: params.search,
      }),
      getCategories()
    ]);

    return (
      <div className="min-h-screen bg-background">
        {/* Main Content with Filters */}
        <BusinessesWithFilters
          initialBusinesses={businesses}
          categories={categories}
          initialFilters={{
            search: params.search,
            category: params.category
          }}
        />
      </div>
    );
  } catch (error) {
    console.error('Error loading businesses:', error);
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Store className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Error al cargar emprendimientos</h3>
            <p className="text-muted-foreground text-center">
              Ocurrió un error al cargar la lista de emprendimientos. Por favor, intenta de nuevo.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }
}

export default function BusinessesPage({ searchParams }: BusinessesPageProps) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    }>
      <BusinessesContent searchParams={searchParams} />
    </Suspense>
  );
}

export async function generateMetadata() {
  return {
    title: 'Emprendimientos - Costa Rica Emprende',
    description: 'Descubre emprendimientos locales y apoya a los negocios de tu comunidad',
  };
}