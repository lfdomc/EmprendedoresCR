'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PageNavigationProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  placeholder?: string;
}

export function PageNavigation({ searchQuery, onSearchChange, placeholder }: PageNavigationProps) {
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
  const handlePageChange = (value: string) => {
    setCurrentPage(value);
    if (value === 'businesses') {
      router.push('/businesses');
    } else {
      router.push('/');
    }
  };

  // Determinar placeholder dinámico
  const getPlaceholder = () => {
    if (placeholder) return placeholder;
    return currentPage === 'businesses' 
      ? 'Buscar emprendimientos...'
      : 'Buscar productos, servicios...';
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        {/* Select para cambiar entre páginas */}
        <div className="w-full sm:w-auto">
          <Select value={currentPage} onValueChange={handlePageChange}>
            <SelectTrigger className="w-full sm:w-[280px] md:w-[320px] h-12 sm:h-14 text-xl sm:text-2xl font-bold border-2 shadow-lg hover:shadow-xl transition-all duration-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="marketplace" className="text-xl sm:text-2xl py-3">Marketplace</SelectItem>
              <SelectItem value="businesses" className="text-xl sm:text-2xl py-3">Emprendimientos</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Input de búsqueda */}
        <div className="flex-1 max-w-lg relative w-full">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5 sm:h-6 sm:w-6" />
          <Input
            type="text"
            placeholder={getPlaceholder()}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-12 sm:pl-14 h-12 sm:h-14 text-lg sm:text-xl w-full border-2 shadow-lg hover:shadow-xl focus:shadow-2xl transition-all duration-200 font-medium"
          />
        </div>
      </div>
    </div>
  );
}