'use client';

import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveGridProps {
  children: ReactNode;
  className?: string;
  variant?: 'products' | 'services' | 'businesses' | 'mixed';
  viewMode?: 'grid' | 'list';
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  minItemWidth?: number;
  maxItemWidth?: number;
}

const ResponsiveGrid = ({ 
  children, 
  className, 
  variant = 'mixed',
  viewMode = 'grid',
  gap = 'md',
  minItemWidth,
  maxItemWidth
}: ResponsiveGridProps) => {
  // Configuraciones de gap responsivas mejoradas para móvil
  const gapClasses = {
    xs: 'gap-1 sm:gap-1.5 md:gap-2 lg:gap-2.5 xl:gap-3',
    sm: 'gap-1.5 sm:gap-2 md:gap-3 lg:gap-4 xl:gap-5',
    md: 'gap-2 sm:gap-3 md:gap-4 lg:gap-5 xl:gap-6',
    lg: 'gap-3 sm:gap-4 md:gap-5 lg:gap-6 xl:gap-8',
    xl: 'gap-4 sm:gap-5 md:gap-6 lg:gap-8 xl:gap-10'
  };

  // Configuraciones de grid optimizadas para móvil y diferentes variantes
  const gridConfigs = {
    products: {
      grid: 'grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6',
      list: 'grid-cols-1'
    },
    services: {
      grid: 'grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6',
      list: 'grid-cols-1'
    },
    businesses: {
      grid: 'grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5',
      list: 'grid-cols-1'
    },
    mixed: {
      grid: 'grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6',
      list: 'grid-cols-1'
    }
  };

  // Configuración dinámica de ancho mínimo y máximo basada en la variante
  const getItemWidths = (variant: NonNullable<ResponsiveGridProps['variant']>, minItemWidth?: number, maxItemWidth?: number) => {
    const defaults = {
      products: { min: 180, max: 280 },
      services: { min: 180, max: 280 },
      businesses: { min: 240, max: 360 },
      mixed: { min: 180, max: 300 }
    };
    
    return {
      minWidth: minItemWidth || defaults[variant].min,
      maxWidth: maxItemWidth || defaults[variant].max
    };
  };

  const { minWidth, maxWidth } = getItemWidths(variant, minItemWidth, maxItemWidth);

  const gridClasses = cn(
    'grid',
    gridConfigs[variant][viewMode],
    gapClasses[gap],
    'w-full',
    // Clases adicionales para mobile-first mejoradas
    'min-h-0', // Previene problemas de altura en flex containers
    'auto-rows-max', // Filas se ajustan al contenido
    'place-items-stretch', // Elementos se estiran para llenar el espacio
    // Mejoras para móvil
    'px-1 sm:px-0', // Padding horizontal en móvil
    className
  );

  return (
    <div 
      className={gridClasses}
      style={viewMode === 'grid' ? { 
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fit, minmax(${minWidth}px, min(${maxWidth}px, 1fr)))`,
        gridAutoRows: 'max-content',
        alignItems: 'stretch',
        justifyContent: 'center'
      } : {}}
      role="grid"
      aria-label={`Grid de ${variant} en modo ${viewMode}`}
    >
      {children}
    </div>
  );
};

// Componente especializado para productos
const ProductsGrid = ({ 
  children, 
  className, 
  viewMode = 'grid', 
  gap = 'md',
  minItemWidth,
  maxItemWidth
}: Omit<ResponsiveGridProps, 'variant'>) => (
  <ResponsiveGrid 
    variant="products" 
    viewMode={viewMode} 
    gap={gap} 
    className={className}
    minItemWidth={minItemWidth}
    maxItemWidth={maxItemWidth}
  >
    {children}
  </ResponsiveGrid>
);

// Componente especializado para servicios
const ServicesGrid = ({ 
  children, 
  className, 
  viewMode = 'grid', 
  gap = 'md',
  minItemWidth,
  maxItemWidth
}: Omit<ResponsiveGridProps, 'variant'>) => (
  <ResponsiveGrid 
    variant="services" 
    viewMode={viewMode} 
    gap={gap} 
    className={className}
    minItemWidth={minItemWidth}
    maxItemWidth={maxItemWidth}
  >
    {children}
  </ResponsiveGrid>
);

// Componente especializado para emprendimientos
const BusinessesGrid = ({ 
  children, 
  className, 
  viewMode = 'grid', 
  gap = 'md',
  minItemWidth,
  maxItemWidth
}: Omit<ResponsiveGridProps, 'variant'>) => (
  <ResponsiveGrid 
    variant="businesses" 
    viewMode={viewMode} 
    gap={gap} 
    className={className}
    minItemWidth={minItemWidth}
    maxItemWidth={maxItemWidth}
  >
    {children}
  </ResponsiveGrid>
);

// Componente para grids mixtos (productos y servicios)
const MixedGrid = ({ 
  children, 
  className, 
  viewMode = 'grid', 
  gap = 'md',
  minItemWidth,
  maxItemWidth
}: Omit<ResponsiveGridProps, 'variant'>) => (
  <ResponsiveGrid 
    variant="mixed" 
    viewMode={viewMode} 
    gap={gap} 
    className={className}
    minItemWidth={minItemWidth}
    maxItemWidth={maxItemWidth}
  >
    {children}
  </ResponsiveGrid>
);

export { 
  ResponsiveGrid, 
  ProductsGrid, 
  ServicesGrid, 
  BusinessesGrid, 
  MixedGrid 
};
export type { ResponsiveGridProps };