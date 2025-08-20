'use client';

import { useState } from 'react';
import { BusinessFilterSidebar } from './business-filter-sidebar';
import { BusinessCard } from './business-card';
import { Card, CardContent } from '@/components/ui/card';
import { Store, Grid, List, Filter, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
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

export function BusinessesWithFilters({
  initialBusinesses,
  categories,
  initialFilters = {}
}: BusinessesWithFiltersProps) {
  const [businesses, setBusinesses] = useState<Business[]>(initialBusinesses);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category_id: initialFilters.category,
    search: initialFilters.search,
    provincia: undefined as string | undefined,
    canton: undefined as string | undefined
  });

  // Filter businesses based on current filters
  const filteredBusinesses = businesses.filter(business => {
    const matchesSearch = !filters.search || 
      business.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      (business.description && business.description.toLowerCase().includes(filters.search.toLowerCase()));
    
    const matchesCategory = !filters.category_id || business.category_id === filters.category_id;
    const matchesProvincia = !filters.provincia || business.provincia === filters.provincia;
    const matchesCanton = !filters.canton || business.canton === filters.canton;
    
    return matchesSearch && matchesCategory && matchesProvincia && matchesCanton;
  });

  const handleFilterChange = async (newFilters: typeof filters) => {
    setFilters(newFilters);
    
    // If search filter changed, fetch new data from server
    if (newFilters.search !== filters.search) {
      setLoading(true);
      try {
        const fetchedBusinesses = await getBusinesses({
          search: newFilters.search,
          // Add other server-side filters if needed
        });
        setBusinesses(fetchedBusinesses);
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
    try {
      const fetchedBusinesses = await getBusinesses({});
      setBusinesses(fetchedBusinesses);
    } catch (error) {
      console.error('Error fetching businesses:', error);
    } finally {
      setLoading(false);
    }
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Page Navigation */}
      <PageNavigation 
        searchQuery={filters.search || ''}
        onSearchChange={(query) => handleFilterChange({ ...filters, search: query })}
      />
      
      <div className="flex min-h-screen bg-background relative">
      {/* Mobile Filter Overlay */}
      {showFilters && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={() => setShowFilters(false)}
        />
      )}

      {/* Filter Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 lg:z-auto
        transform transition-transform duration-300 ease-in-out lg:transform-none
        ${showFilters ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <BusinessFilterSidebar
          categories={categories}
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          onClose={() => setShowFilters(false)}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-3 sm:p-6 lg:ml-0">
        <div className="space-y-4 sm:space-y-6">
          {/* Mobile Filter Button */}
          <div className="lg:hidden">
            <Button
              variant="outline"
              onClick={() => setShowFilters(true)}
              className="w-full justify-center gap-3 h-12 sm:h-14 text-lg sm:text-xl font-bold border-2 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Filter className="h-5 w-5 sm:h-6 sm:w-6" />
              Filtros
              {Object.values(filters).filter(Boolean).length > 0 && (
                <Badge variant="secondary" className="ml-2 text-sm sm:text-base px-2 py-1">
                  {Object.values(filters).filter(Boolean).length}
                </Badge>
              )}
            </Button>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              {activeFiltersCount > 0 && (
                <p className="text-muted-foreground text-sm sm:text-base">
                  {activeFiltersCount} filtro{activeFiltersCount > 1 ? 's' : ''} aplicado{activeFiltersCount > 1 ? 's' : ''}
                </p>
              )}
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="px-2 sm:px-3"
              >
                <Grid className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline ml-1">Grid</span>
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="px-2 sm:px-3"
              >
                <List className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline ml-1">Lista</span>
              </Button>
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
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2 sm:gap-3 lg:gap-4" 
              : "space-y-3 sm:space-y-4"
            }>
              {filteredBusinesses.map((business) => {
                const category = categories.find(c => c.id === business.category_id);
                
                return (
                  <BusinessCard
                    key={business.id}
                    business={{
                      ...business,
                      category
                    }}
                    viewMode={viewMode}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}