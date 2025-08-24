'use client';

import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


type ContentType = 'all' | 'products' | 'services';

interface PageNavigationProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  placeholder?: string;
  contentType?: ContentType;
  onContentTypeChange?: (type: ContentType) => void;
  showContentFilter?: boolean;
}

function PageNavigationComponent({ 
  searchQuery, 
  onSearchChange, 
  placeholder,
  contentType = 'all',
  onContentTypeChange,
  showContentFilter = false
}: PageNavigationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [currentPage, setCurrentPage] = useState<string>('marketplace');

  // Determinar la página actual basada en la ruta
  useEffect(() => {
    if (pathname === '/businesses') {
      setCurrentPage('businesses');
    } else {
      setCurrentPage('marketplace');
    }
  }, [pathname]);

  // Manejar cambio de página
  const handlePageChange = useCallback((value: string) => {
    setCurrentPage(value);
    if (value === 'businesses') {
      router.push('/businesses');
    } else {
      router.push('/');
    }
  }, [router]);

  // Determinar placeholder dinámico
  const dynamicPlaceholder = useMemo(() => {
    if (placeholder) return placeholder;
    return currentPage === 'businesses' 
      ? 'Buscar emprendimientos...'
      : 'Buscar productos, servicios...';
  }, [placeholder, currentPage]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  }, [onSearchChange]);

  return (
    <div className="w-full">
      {/* Layout para pantallas grandes */}
      <div className="hidden lg:flex items-center justify-center w-full px-4">
        <div className="flex items-center gap-3 max-w-4xl w-full justify-center">
          {/* Filtros de contenido - Solo en marketplace */}
          {showContentFilter && onContentTypeChange && (
            <div className="w-auto flex-shrink-0">
              <Select value={contentType} onValueChange={onContentTypeChange}>
                <SelectTrigger className="w-48 h-9 text-sm font-medium border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-150 bg-white shadow-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-gray-200">
                  <SelectItem value="all" className="text-sm">Todo</SelectItem>
                  <SelectItem value="products" className="text-sm">Productos</SelectItem>
                  <SelectItem value="services" className="text-sm">Servicios</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          
          {/* Select para cambiar entre páginas - Oculto en móviles */}
          <div className="hidden">
            <Select value={currentPage} onValueChange={handlePageChange}>
              <SelectTrigger className="w-48 h-9 text-sm font-medium border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-150 bg-white shadow-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-gray-200">
                <SelectItem value="marketplace" className="text-sm">Marketplace</SelectItem>
                <SelectItem value="businesses" className="text-sm">Emprendimientos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Input de búsqueda */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder={dynamicPlaceholder}
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-9 h-9 text-sm w-full border-gray-400 hover:border-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-150 bg-white shadow-sm placeholder:text-gray-400 rounded-lg"
            />
          </div>
        </div>
      </div>
      
      {/* Layout para móviles y tablets */}
      <div className="lg:hidden w-full px-4 flex justify-center">
        <div className="flex flex-col gap-3 w-full max-w-4xl justify-center">
          {/* Contenedor de selectores - Removido el selector de páginas */}

          {/* Input de búsqueda */}
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder={dynamicPlaceholder}
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-9 h-9 text-sm w-full border-gray-400 hover:border-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-150 bg-white shadow-sm placeholder:text-gray-400 rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export const PageNavigation = memo(PageNavigationComponent);