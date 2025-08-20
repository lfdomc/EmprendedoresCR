'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Search, Filter, Grid, List, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FilterSidebar } from '@/components/marketplace/filter-sidebar';
import { ProductCard } from '@/components/marketplace/product-card';
import { ServiceCard } from '@/components/marketplace/service-card';
import { PageNavigation } from '@/components/layout/page-navigation';
import { getProducts, getServices, getCategories } from '@/lib/supabase/database';
import { Product, Service, Category } from '@/lib/types/database';

type ViewMode = 'grid' | 'list';
type ContentType = 'all' | 'products' | 'services';

export function Marketplace() {
  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMoreProducts, setHasMoreProducts] = useState(true);
  const [hasMoreServices, setHasMoreServices] = useState(true);
  const [currentProductPage, setCurrentProductPage] = useState(1);
  const [currentServicePage, setCurrentServicePage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [contentType, setContentType] = useState<ContentType>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<{
    category_id?: string;
    min_price?: number;
    max_price?: number;
    // is_featured filter removed
    provincia?: string;
    canton?: string;
  }>({});
  const observerRef = useRef<HTMLDivElement>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setCurrentProductPage(1);
      setCurrentServicePage(1);
      setHasMoreProducts(true);
      setHasMoreServices(true);

      const limit = 50;

      const [productsData, servicesData, categoriesData] = await Promise.all([
        getProducts({ ...filters, search: searchQuery, page: 1, limit }),
        getServices({ ...filters, search: searchQuery, page: 1, limit }),
        getCategories()
      ]);
      
      setProducts(productsData);
      setServices(servicesData);
      setCategories(categoriesData);

      // Check if we have more data
      setHasMoreProducts(productsData.length === limit);
      setHasMoreServices(servicesData.length === limit);
    } catch (error) {
      console.error('Error loading data:', error);
      // Set empty arrays to prevent crashes when Supabase is not configured
      setProducts([]);
      setServices([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, [filters, searchQuery]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Reset pagination when content type changes
  useEffect(() => {
    setCurrentProductPage(1);
    setCurrentServicePage(1);
    setHasMoreProducts(true);
    setHasMoreServices(true);
  }, [contentType]);

  const loadMoreData = useCallback(async () => {
    if (loadingMore) return;

    const hasMore = (contentType === 'all' && (hasMoreProducts || hasMoreServices)) ||
                   (contentType === 'products' && hasMoreProducts) ||
                   (contentType === 'services' && hasMoreServices);

    if (!hasMore) return;

    try {
      setLoadingMore(true);
      const limit = 50;
      
      let newProducts: Product[] = [];
      let newServices: Service[] = [];

      // Load more products if needed
      if ((contentType === 'all' || contentType === 'products') && hasMoreProducts) {
        const nextProductPage = currentProductPage + 1;
        newProducts = await getProducts({ 
          ...filters, 
          search: searchQuery, 
          page: nextProductPage, 
          limit 
        });
        setCurrentProductPage(nextProductPage);
        setProducts(prev => [...prev, ...newProducts]);
        setHasMoreProducts(newProducts.length === limit);
      }

      // Load more services if needed
      if ((contentType === 'all' || contentType === 'services') && hasMoreServices) {
        const nextServicePage = currentServicePage + 1;
        newServices = await getServices({ 
          ...filters, 
          search: searchQuery, 
          page: nextServicePage, 
          limit 
        });
        setCurrentServicePage(nextServicePage);
        setServices(prev => [...prev, ...newServices]);
        setHasMoreServices(newServices.length === limit);
      }
    } catch (error) {
      console.error('Error loading more data:', error);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, contentType, hasMoreProducts, hasMoreServices, currentProductPage, currentServicePage, filters, searchQuery]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && !loadingMore) {
          loadMoreData();
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
  }, [loading, loadingMore, loadMoreData]);

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
    setSearchQuery('');
  };

  const filteredProducts = contentType === 'services' ? [] : products;
  const filteredServices = contentType === 'products' ? [] : services;
  const totalItems = filteredProducts.length + filteredServices.length;

  const activeFiltersCount = Object.values(filters).filter(Boolean).length + (searchQuery ? 1 : 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Page Navigation */}
      <PageNavigation 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

    <div className="flex min-h-screen bg-background relative">
      {/* Filter Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 lg:z-auto
        transform transition-transform duration-300 ease-in-out lg:transform-none
        ${showFilters ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <FilterSidebar
           categories={categories}
           filters={filters}
           onFilterChange={handleFilterChange}
           onClearFilters={clearFilters}
           onClose={() => setShowFilters(false)}
         />
      </div>

      {/* Mobile Filter Overlay */}
      {showFilters && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={() => setShowFilters(false)}
          onDoubleClick={() => setShowFilters(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 p-3 sm:p-6 lg:ml-0">
        <div className="max-w-7xl mx-auto">
          {/* Mobile Filter Button */}
          <div className="lg:hidden mb-4">
            <Button
              variant="outline"
              onClick={() => setShowFilters(true)}
              className="w-full justify-center gap-3 h-12 sm:h-14 text-lg sm:text-xl font-bold border-2 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Filter className="h-5 w-5 sm:h-6 sm:w-6" />
              Filtros
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-2 text-sm sm:text-base px-2 py-1">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              {activeFiltersCount > 0 && (
                <p className="text-muted-foreground text-sm sm:text-base">
                  {activeFiltersCount} filtro{activeFiltersCount > 1 ? 's' : ''} aplicado{activeFiltersCount > 1 ? 's' : ''}
                </p>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Content Type Filters */}
              <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto">
                <Button
                  variant={contentType === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setContentType('all')}
                  className="whitespace-nowrap text-xs sm:text-sm"
                >
                  Todos ({totalItems})
                </Button>
                <Button
                  variant={contentType === 'products' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setContentType('products')}
                  className="whitespace-nowrap text-xs sm:text-sm"
                >
                  Productos ({products.length})
                </Button>
                <Button
                  variant={contentType === 'services' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setContentType('services')}
                  className="whitespace-nowrap text-xs sm:text-sm"
                >
                  Servicios ({services.length})
                </Button>
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
          </div>

          {/* Results */}
          {loading ? (
            <div className={`grid gap-4 sm:gap-6 ${
              viewMode === 'grid'
                ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6'
                : 'grid-cols-1'
            }`}>
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="bg-card rounded-lg p-4 animate-pulse">
                    <div className="bg-muted h-40 sm:h-48 rounded-md mb-4"></div>
                    <div className="bg-muted h-4 rounded mb-2"></div>
                    <div className="bg-muted h-4 rounded w-2/3 mb-2"></div>
                    <div className="bg-muted h-6 rounded w-1/3"></div>
                  </div>
                ))}
              </div>
            ) : totalItems === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <div className="text-muted-foreground mb-4">
                  <Search className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-base sm:text-lg font-medium">No se encontraron resultados</p>
                  <p className="text-sm text-muted-foreground mt-2">Intenta ajustar tus filtros o términos de búsqueda</p>
                </div>
                {activeFiltersCount > 0 && (
                  <Button onClick={clearFilters} variant="outline" size="sm">
                    Limpiar filtros
                  </Button>
                )}
              </div>
            ) : (
              <div className={viewMode === 'grid' 
                ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2 sm:gap-3 lg:gap-4" 
                : "space-y-3 sm:space-y-4"
              }>
                {/* Products */}
                {filteredProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    viewMode={viewMode}
                    priority={index === 0}
                  />
                ))}
                
                {/* Services */}
                {filteredServices.map((service) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            )}

            {/* Infinite Scroll Observer */}
            {!loading && totalItems > 0 && (
              <div ref={observerRef} className="w-full py-8 flex justify-center">
                {loadingMore && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Cargando más...</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
   );
 }