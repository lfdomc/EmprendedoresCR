'use client';

import { useState, useEffect, useCallback, useRef, useMemo, memo } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FilterBar } from './filter-bar';
import { UniversalCard } from '@/components/ui/universal-card';
import { ResponsiveGrid } from '@/components/ui/responsive-grid';
import { PageNavigation } from '@/components/layout/page-navigation';
import { getProducts, getServices, getCategories } from '@/lib/supabase/database';
import { Product, Service, Category } from '@/lib/types/database';

type ContentType = 'all' | 'products' | 'services';

function MarketplaceComponent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMoreProducts, setHasMoreProducts] = useState(true);
  const [hasMoreServices, setHasMoreServices] = useState(true);
  const [currentProductPage, setCurrentProductPage] = useState(1);
  const [currentServicePage, setCurrentServicePage] = useState(1);

  const [contentType, setContentType] = useState<ContentType>('all');
  const [currentPage, setCurrentPage] = useState<'marketplace' | 'businesses'>('marketplace');
  const [filters, setFilters] = useState<{
    category_id?: string | string[];
    min_price?: number;
    max_price?: number;
    provincia?: string | string[];
    canton?: string | string[];
    sort_by?: 'random' | 'popularity' | 'newest';
    search?: string;
  }>({});
  const observerRef = useRef<HTMLDivElement>(null);

  const handlePageChange = (page: 'marketplace' | 'businesses') => {
    setCurrentPage(page);
    if (page === 'businesses') {
      if (typeof window !== 'undefined') {
        window.location.href = '/businesses';
      }
    }
  };

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setCurrentProductPage(1);
      setCurrentServicePage(1);
      setHasMoreProducts(true);
      setHasMoreServices(true);

      const limit = 50;

      const [productsData, servicesData, categoriesData] = await Promise.all([
        getProducts({ ...filters, page: 1, limit }),
        getServices({ ...filters, page: 1, limit }),
        getCategories()
      ]);
      
      setProducts(productsData);
      setServices(servicesData);
      setCategories(categoriesData);

      setHasMoreProducts(productsData.length === limit);
      setHasMoreServices(servicesData.length === limit);
    } catch (error) {
      console.error('Error loading data:', error);
      setProducts([]);
      setServices([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadData();
  }, [loadData]);

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

      if ((contentType === 'all' || contentType === 'products') && hasMoreProducts) {
        const nextProductPage = currentProductPage + 1;
        newProducts = await getProducts({ 
          ...filters, 
          page: nextProductPage, 
          limit 
        });
        setCurrentProductPage(nextProductPage);
        setProducts(prev => [...prev, ...newProducts]);
        setHasMoreProducts(newProducts.length === limit);
      }

      if ((contentType === 'all' || contentType === 'services') && hasMoreServices) {
        const nextServicePage = currentServicePage + 1;
        newServices = await getServices({ 
          ...filters, 
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
  }, [loadingMore, contentType, hasMoreProducts, hasMoreServices, currentProductPage, currentServicePage, filters]);

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

  // Filter change handler removed - filters are managed by FilterBar component

  const clearFilters = () => {
    setFilters({});
  };

  const filteredProducts = useMemo(() => 
    contentType === 'services' ? [] : products, 
    [contentType, products]
  );
  
  const filteredServices = useMemo(() => 
    contentType === 'products' ? [] : services, 
    [contentType, services]
  );
  
  // Combine items for unified display
  const combinedItems = useMemo(() => {
    const items: Array<{ type: 'product' | 'service'; data: Product | Service }> = [];
    
    if (contentType === 'all' || contentType === 'products') {
      filteredProducts.forEach(product => {
        items.push({ type: 'product', data: product });
      });
    }
    
    if (contentType === 'all' || contentType === 'services') {
      filteredServices.forEach(service => {
        items.push({ type: 'service', data: service });
      });
    }
    
    return items;
  }, [filteredProducts, filteredServices, contentType]);

  const totalItems = useMemo(() => 
    combinedItems.length, 
    [combinedItems.length]
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <PageNavigation 
        searchQuery={filters.search || ''}
        onSearchChange={(search) => setFilters(prev => ({ ...prev, search }))}
      />

      <FilterBar
        categories={categories}
        filters={filters}
        onFiltersChange={setFilters}
        onClearFilters={clearFilters}
        contentType={contentType}
        onContentTypeChange={setContentType}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />

      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">


          {loading ? (
            <ResponsiveGrid variant="mixed" gap="md">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-3 sm:p-4 shadow-sm animate-pulse h-full flex flex-col">
                  <div className="bg-gray-200 aspect-square rounded-lg mb-3 sm:mb-4"></div>
                  <div className="bg-gray-200 h-3 sm:h-4 rounded mb-2"></div>
                  <div className="bg-gray-200 h-3 sm:h-4 rounded w-2/3 mb-2"></div>
                  <div className="bg-gray-200 h-5 sm:h-6 rounded w-1/3 mt-auto"></div>
                </div>
              ))}
            </ResponsiveGrid>
          ) : totalItems === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
              <div className="text-gray-500 mb-6">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium text-gray-900">No se encontraron resultados</p>
                <p className="text-sm text-gray-500 mt-2">Intenta ajustar tus filtros o términos de búsqueda</p>
              </div>
              {(Object.keys(filters).length > 0 || filters.search) && (
                <Button onClick={clearFilters} variant="outline" size="sm" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                  Limpiar filtros
                </Button>
              )}
            </div>
          ) : (
            <ResponsiveGrid variant="mixed">
              {combinedItems.map((item, index) => (
                <UniversalCard
                   key={`${item.type}-${item.data.id}`}
                   data={{
                     type: item.type,
                     data: item.data
                   }}
                   viewMode="grid"
                   priority={index === 0}
                 />
              ))}
            </ResponsiveGrid>
          )}

          {!loading && totalItems > 0 && (
            <div ref={observerRef} className="w-full py-8 flex justify-center">
              {loadingMore && (
                <div className="flex items-center gap-2 text-gray-500">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Cargando más...</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export const Marketplace = memo(MarketplaceComponent);