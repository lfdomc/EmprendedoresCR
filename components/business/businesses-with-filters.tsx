'use client';

import { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react';
import { FilterBar } from '@/components/marketplace/filter-bar';
import { UniversalCard } from '@/components/ui/universal-card';
import { ResponsiveGrid } from '@/components/ui/responsive-grid';
import { Card, CardContent } from '@/components/ui/card';
import { Store, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageNavigation } from '@/components/layout/page-navigation';


import Link from 'next/link';
import { Business, Category } from '@/lib/types/database';
import { getBusinesses } from '@/lib/supabase/database';

interface BusinessesWithFiltersProps {
  initialBusinesses: Business[];
  categories: Category[];
  initialFilters?: {
    search?: string;
    city?: string;
    state?: string;
    country?: string;
    category?: string;
  };
}

function BusinessesWithFiltersComponent({
  initialBusinesses,
  categories,
  initialFilters = {}
}: BusinessesWithFiltersProps) {
  const [businesses, setBusinesses] = useState<Business[]>(initialBusinesses);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMoreBusinesses, setHasMoreBusinesses] = useState(true);
  const [paginationPage, setPaginationPage] = useState(1);


  const observerRef = useRef<HTMLDivElement>(null);
  const [filters, setFilters] = useState({
    category_id: initialFilters.category as string | string[] | undefined,
    search: initialFilters.search,
    provincia: undefined as string | string[] | undefined,
    canton: undefined as string | string[] | undefined
  });

  // Estado para la página actual
  const [activePage, setActivePage] = useState<'marketplace' | 'businesses'>('businesses');

  // Función para manejar el cambio de página
  const handlePageChange = (page: 'marketplace' | 'businesses') => {
    setActivePage(page);
    if (page === 'marketplace') {
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    }
  };

  // Filter businesses based on current filters
  const filteredBusinesses = useMemo(() => 
    businesses.filter(business => {
      const matchesSearch = !filters.search || 
        business.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        (business.description && business.description.toLowerCase().includes(filters.search.toLowerCase()));
      
      const matchesCategory = !filters.category_id || business.category_id === filters.category_id;
      const matchesProvincia = !filters.provincia || business.provincia === filters.provincia;
      const matchesCanton = !filters.canton || business.canton === filters.canton;
      
      return matchesSearch && matchesCategory && matchesProvincia && matchesCanton;
    }), 
    [businesses, filters.search, filters.category_id, filters.provincia, filters.canton]
  );

  const handleFilterChange = async (newFilters: typeof filters) => {
    setFilters(newFilters);
    
    // If search filter changed, fetch new data from server
    if (newFilters.search !== filters.search) {
      setLoading(true);
      setPaginationPage(1);
      setHasMoreBusinesses(true);
      try {
        const fetchedBusinesses = await getBusinesses({
          search: newFilters.search,
          provincia: newFilters.provincia,
          canton: newFilters.canton,
          category_id: newFilters.category_id,
          page: 1,
          limit: 50
        });
        setBusinesses(fetchedBusinesses);
        setHasMoreBusinesses(fetchedBusinesses.length === 50);
      } catch (error) {
        console.error('Error fetching businesses:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleClearFilters = async () => {
    const clearedFilters = {
      category_id: undefined,
      search: undefined,
      provincia: undefined,
      canton: undefined
    };
    
    setFilters(clearedFilters);
    
    // Reload all businesses when filters are cleared
    setLoading(true);
    setPaginationPage(1);
    setHasMoreBusinesses(true);
    try {
      const fetchedBusinesses = await getBusinesses({
        page: 1,
        limit: 50
      });
      setBusinesses(fetchedBusinesses);
      setHasMoreBusinesses(fetchedBusinesses.length === 50);
    } catch (error) {
      console.error('Error fetching businesses:', error);
    } finally {
      setLoading(false);
    }
  };

  // Función para cargar más emprendimientos
  const loadMoreBusinesses = useCallback(async () => {
    if (loadingMore || !hasMoreBusinesses) return;

    setLoadingMore(true);
    try {
      const nextPage = paginationPage + 1;
      const moreBusinesses = await getBusinesses({
        search: filters.search,
        provincia: filters.provincia,
        canton: filters.canton,
        category_id: filters.category_id,
        page: nextPage,
        limit: 50
      });

      if (moreBusinesses.length > 0) {
        setBusinesses(prev => [...prev, ...moreBusinesses]);
        setPaginationPage(nextPage);
        setHasMoreBusinesses(moreBusinesses.length === 50);
      } else {
        setHasMoreBusinesses(false);
      }
    } catch (error) {
      console.error('Error loading more businesses:', error);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMoreBusinesses, paginationPage, filters]);

  // Resetear paginación cuando cambien los filtros
  useEffect(() => {
    setPaginationPage(1);
    setHasMoreBusinesses(true);
  }, [filters.category_id, filters.provincia, filters.canton]);

  // Intersection Observer para scroll infinito
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMoreBusinesses && !loading && !loadingMore) {
          loadMoreBusinesses();
        }
      },
      { threshold: 0.1 }
    );

    const currentObserverRef = observerRef.current;
    if (currentObserverRef) {
      observer.observe(currentObserverRef);
    }

    return () => {
      if (currentObserverRef) {
        observer.unobserve(currentObserverRef);
      }
    };
  }, [hasMoreBusinesses, loading, loadingMore, filters, paginationPage, loadMoreBusinesses]);

  const activeFiltersCount = useMemo(() => 
    Object.values(filters).filter(Boolean).length, 
    [filters]
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Page Navigation */}
      <PageNavigation 
        searchQuery={filters.search || ''}
        onSearchChange={(query) => handleFilterChange({ ...filters, search: query })}
      />
      
      {/* Filter Bar */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-0">
          <FilterBar
             categories={categories}
             filters={{
               category_id: filters.category_id,
               provincia: filters.provincia,
               canton: filters.canton,
               search: filters.search
             }}
             onFiltersChange={(newFilters) => handleFilterChange({
               ...filters,
               ...newFilters
             })}
             onClearFilters={handleClearFilters}
             currentPage={activePage}
             onPageChange={handlePageChange}
           />
        </div>
      </div>
      
      <div className="bg-background">
      {/* Main Content */}
      <div className="container mx-auto p-3 sm:p-6">
        <div className="space-y-4 sm:space-y-6">


          {/* Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              {activeFiltersCount > 0 && (
                <p className="text-muted-foreground text-sm sm:text-base">
                  {activeFiltersCount} filtro{activeFiltersCount > 1 ? 's' : ''} aplicado{activeFiltersCount > 1 ? 's' : ''}
                </p>
              )}
            </div>
            

          </div>

          {/* Results Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="h-40 sm:h-48 animate-pulse">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-muted rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 sm:h-4 bg-muted rounded w-3/4" />
                        <div className="h-2 sm:h-3 bg-muted rounded w-full" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 sm:h-3 bg-muted rounded w-1/2" />
                      <div className="h-2 sm:h-3 bg-muted rounded w-1/4" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredBusinesses.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8 sm:py-12">
                <Store className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-center">No se encontraron emprendimientos</h3>
                <p className="text-muted-foreground text-center mb-4 sm:mb-6 text-sm sm:text-base px-4">
                  No hay emprendimientos que coincidan con tus criterios de búsqueda.
                </p>
                {activeFiltersCount > 0 && (
                  <Button 
                    variant="outline" 
                    onClick={handleClearFilters}
                    className="mb-4 gap-2"
                  >
                    <X className="h-4 w-4" />
                    Quitar filtros
                  </Button>
                )}
                <Link 
                  href="/dashboard" 
                  className="text-primary hover:underline text-sm sm:text-base"
                >
                  ¿Tienes un emprendimiento? ¡Regístralo aquí!
                </Link>
              </CardContent>
            </Card>
          ) : (
            <>
              <ResponsiveGrid variant="businesses">
                {filteredBusinesses.map((business) => {
                  const category = categories.find(c => c.id === business.category_id);
                  
                  return (
                    <UniversalCard
                       key={business.id}
                       data={{
                         type: 'business',
                         data: {
                           ...business,
                           category
                         }
                       }}
                       viewMode="grid"
                     />
                  );
                })}
              </ResponsiveGrid>
              
              {/* Elemento observador para scroll infinito */}
              {hasMoreBusinesses && (
                <div ref={observerRef} className="flex justify-center py-8">
                  {loadingMore && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Cargando más emprendimientos...</span>
                    </div>
                  )}
                </div>
              )}


            </>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}

export const BusinessesWithFilters = memo(BusinessesWithFiltersComponent);