'use client';

import dynamic from 'next/dynamic';

// Lazy loading de componentes del marketplace
const Marketplace = dynamic(() => import('@/components/marketplace/marketplace').then(mod => ({ default: mod.Marketplace })), {
  loading: () => (
    <div className="flex min-h-screen items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
    </div>
  ),
  ssr: false,
});

const FilterSidebar = dynamic(() => import('@/components/marketplace/filter-sidebar').then(mod => ({ default: mod.FilterSidebar })), {
  loading: () => (
    <div className="w-80 h-96 bg-gray-100 animate-pulse rounded-lg"></div>
  ),
  ssr: false,
});

const FilterBar = dynamic(() => import('@/components/marketplace/filter-bar').then(mod => ({ default: mod.FilterBar })), {
  loading: () => (
    <div className="h-16 bg-gray-100 animate-pulse rounded-lg"></div>
  ),
  ssr: false,
});

const ProductCard = dynamic(() => import('@/components/marketplace/product-card').then(mod => ({ default: mod.ProductCard })), {
  loading: () => (
    <div className="w-full h-96 bg-gray-100 animate-pulse rounded-lg"></div>
  ),
  ssr: false,
});

const ServiceCard = dynamic(() => import('@/components/marketplace/service-card').then(mod => ({ default: mod.ServiceCard })), {
  loading: () => (
    <div className="w-full h-96 bg-gray-100 animate-pulse rounded-lg"></div>
  ),
  ssr: false,
});

export { Marketplace, FilterSidebar, FilterBar, ProductCard, ServiceCard };