'use client';

import { useState, useEffect, useCallback, memo } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Category } from '@/lib/types/database';

interface FilterSidebarProps {
  categories: Category[];
  filters: {
    category_id?: string;
    min_price?: number;
    max_price?: number;
    provincia?: string;
    canton?: string;
    sort_by?: 'random' | 'popularity' | 'newest';
  };
  onFilterChange: (filters: {
    category_id?: string;
    min_price?: number;
    max_price?: number;
    provincia?: string;
    canton?: string;
    sort_by?: 'random' | 'popularity' | 'newest';
  }) => void;
  onClearFilters: () => void;
  onClose?: () => void;
}

function FilterSidebarComponent({
  categories,
  filters,
  onFilterChange,
  onClearFilters,
  onClose
}: FilterSidebarProps) {
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    location: true,
    price: true,
    sorting: false
  });

  // Set sorting section to expanded after hydration to avoid hydration mismatch
  useEffect(() => {
    setExpandedSections(prev => ({
      ...prev,
      sorting: true
    }));
  }, []);

  const toggleSection = useCallback((section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  }, []);

  const handleCategoryChange = useCallback((categoryId: string) => {
    onFilterChange({
      ...filters,
      category_id: filters.category_id === categoryId ? undefined : categoryId
    });
  }, [filters, onFilterChange]);

  const handlePriceChange = useCallback((type: 'min' | 'max', value: string) => {
    const numValue = value === '' ? undefined : parseFloat(value);
    onFilterChange({
      ...filters,
      [type === 'min' ? 'min_price' : 'max_price']: numValue
    });
  }, [filters, onFilterChange]);



  const handleProvinciaChange = useCallback((provincia: string) => {
    onFilterChange({
      ...filters,
      provincia: filters.provincia === provincia ? undefined : provincia,
      canton: undefined // Reset canton when provincia changes
    });
  }, [filters, onFilterChange]);

  const handleCantonChange = useCallback((canton: string) => {
    onFilterChange({
      ...filters,
      canton: filters.canton === canton ? undefined : canton
    });
  }, [filters, onFilterChange]);

  const handleSortChange = useCallback((sortBy: 'random' | 'popularity' | 'newest') => {
    onFilterChange({
      ...filters,
      sort_by: sortBy
    });
  }, [filters, onFilterChange]);

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="w-[70%] sm:w-80 h-screen overflow-y-auto bg-white shadow-lg lg:shadow-none lg:bg-white lg:rounded-lg lg:border lg:border-gray-100 p-4 sm:p-6 lg:h-fit lg:sticky lg:top-24 lg:overflow-visible">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <h2 className="text-lg sm:text-xl font-medium text-gray-900">
          Filtros
          {activeFiltersCount > 0 && (
            <span className="ml-2 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-900 text-white">
              {activeFiltersCount}
            </span>
          )}
        </h2>
        <div className="flex items-center gap-2 sm:gap-3">
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-sm text-gray-500 hover:text-gray-900 font-medium"
            >
              Limpiar
            </Button>
          )}
          {/* Close button for mobile */}
          {onClose && (
            <Button
              variant="ghost"
              size="lg"
              onClick={onClose}
              className="h-10 w-10 p-0 lg:hidden bg-yellow-800 hover:bg-yellow-900 rounded-full"
            >
              <X className="h-6 w-6 text-white" />
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-6 sm:space-y-8">
        {/* Categories */}
        <div>
          <button
            onClick={() => toggleSection('categories')}
            className="flex items-center justify-between w-full text-left font-medium mb-3 sm:mb-4 hover:text-gray-900 transition-colors py-2"
          >
            <span className="text-base sm:text-lg text-gray-700">Categorías</span>
            {expandedSections.categories ? (
              <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
            ) : (
              <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
            )}
          </button>
          
          {expandedSections.categories && (
            <div className="space-y-2 sm:space-y-3 max-h-48 sm:max-h-64 overflow-y-auto">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-3 py-1">
                  <Checkbox
                    id={`category-${category.id}`}
                    checked={filters.category_id === category.id}
                    onCheckedChange={() => handleCategoryChange(category.id)}
                    className="h-4 w-4 sm:h-5 sm:w-5 border-gray-300 data-[state=checked]:bg-gray-900 data-[state=checked]:border-gray-900"
                  />
                  <Label
                    htmlFor={`category-${category.id}`}
                    className="text-sm sm:text-base font-normal cursor-pointer flex items-center gap-2 sm:gap-3 flex-1 text-gray-700 hover:text-gray-900"
                  >
                    <span className="text-sm sm:text-base">{category.icon}</span>
                    <span>{category.name}</span>
                  </Label>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-gray-100 my-6"></div>

        {/* Location */}
        <div>
          <button
            onClick={() => toggleSection('location')}
            className="flex items-center justify-between w-full text-left font-medium mb-3 sm:mb-4 hover:text-gray-900 transition-colors py-2"
          >
            <span className="text-base sm:text-lg text-gray-700">Ubicación</span>
            {expandedSections.location ? (
              <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
            ) : (
              <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
            )}
          </button>
          
          {expandedSections.location && (
            <div className="space-y-4 sm:space-y-5">
              {/* Provincia */}
              <div>
                <Label className="text-sm sm:text-base text-gray-600 mb-2 sm:mb-3 block font-medium">Provincia</Label>
                <div className="space-y-2 sm:space-y-3 max-h-32 sm:max-h-48 overflow-y-auto">
                  {['San José', 'Alajuela', 'Cartago', 'Heredia', 'Guanacaste', 'Puntarenas', 'Limón'].map((provincia) => (
                    <div key={provincia} className="flex items-center space-x-3 py-1">
                      <Checkbox
                        id={`provincia-${provincia}`}
                        checked={filters.provincia === provincia}
                        onCheckedChange={() => handleProvinciaChange(provincia)}
                        className="h-4 w-4 sm:h-5 sm:w-5 border-gray-300 data-[state=checked]:bg-gray-900 data-[state=checked]:border-gray-900"
                      />
                      <Label
                        htmlFor={`provincia-${provincia}`}
                        className="text-sm sm:text-base font-normal cursor-pointer flex-1 text-gray-700 hover:text-gray-900"
                      >
                        {provincia}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Canton */}
              {filters.provincia && (
                <div>
                  <Label className="text-sm sm:text-base text-gray-600 mb-2 sm:mb-3 block font-medium">Cantón</Label>
                  <div className="space-y-2 sm:space-y-3 max-h-32 sm:max-h-48 overflow-y-auto">
                    {(() => {
                      const cantonesPorProvincia: Record<string, string[]> = {
                        'San José': ['San José', 'Escazú', 'Desamparados', 'Puriscal', 'Tarrazú', 'Aserrí', 'Mora', 'Goicoechea', 'Santa Ana', 'Alajuelita', 'Vásquez de Coronado', 'Acosta', 'Tibás', 'Moravia', 'Montes de Oca', 'Turrubares', 'Dota', 'Curridabat', 'Pérez Zeledón'],
                        'Alajuela': ['Alajuela', 'San Ramón', 'Grecia', 'San Mateo', 'Atenas', 'Naranjo', 'Palmares', 'Poás', 'Orotina', 'San Carlos', 'Zarcero', 'Valverde Vega', 'Upala', 'Los Chiles', 'Guatuso'],
                        'Cartago': ['Cartago', 'Paraíso', 'La Unión', 'Jiménez', 'Turrialba', 'Alvarado', 'Oreamuno', 'El Guarco'],
                        'Heredia': ['Heredia', 'Barva', 'Santo Domingo', 'Santa Bárbara', 'San Rafael', 'San Isidro', 'Belén', 'Flores', 'San Pablo', 'Sarapiquí'],
                        'Guanacaste': ['Liberia', 'Nicoya', 'Santa Cruz', 'Bagaces', 'Carrillo', 'Cañas', 'Abangares', 'Tilarán', 'Nandayure', 'La Cruz', 'Hojancha'],
                        'Puntarenas': ['Puntarenas', 'Esparza', 'Buenos Aires', 'Montes de Oro', 'Osa', 'Quepos', 'Golfito', 'Coto Brus', 'Parrita', 'Corredores', 'Garabito'],
                        'Limón': ['Limón', 'Pococí', 'Siquirres', 'Talamanca', 'Matina', 'Guácimo']
                      };
                      
                      const cantonesDisponibles = cantonesPorProvincia[filters.provincia] || [];
                      
                      return cantonesDisponibles.map((canton) => (
                        <div key={canton} className="flex items-center space-x-3 py-1">
                          <Checkbox
                            id={`canton-${canton}`}
                            checked={filters.canton === canton}
                            onCheckedChange={() => handleCantonChange(canton)}
                            className="h-4 w-4 sm:h-5 sm:w-5 border-gray-300 data-[state=checked]:bg-gray-900 data-[state=checked]:border-gray-900"
                          />
                          <Label
                            htmlFor={`canton-${canton}`}
                            className="text-sm sm:text-base font-normal cursor-pointer flex-1 text-gray-700 hover:text-gray-900"
                          >
                            {canton}
                          </Label>
                        </div>
                      ));
                    })()
                    }
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="border-t border-gray-100 my-6"></div>

        {/* Price Range */}
        <div>
          <button
            onClick={() => toggleSection('price')}
            className="flex items-center justify-between w-full text-left font-medium mb-3 sm:mb-4 hover:text-gray-900 transition-colors py-2"
          >
            <span className="text-base sm:text-lg text-gray-700">Rango de Precio</span>
            {expandedSections.price ? (
              <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
            ) : (
              <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
            )}
          </button>
          
          {expandedSections.price && (
            <div className="space-y-4 sm:space-y-5">
              <div className="space-y-3">
                <div>
                  <Label htmlFor="min-price" className="text-sm sm:text-base text-gray-600 font-medium">
                    Mínimo (₡)
                  </Label>
                  <Input
                    id="min-price"
                    type="number"
                    placeholder="0"
                    value={filters.min_price || ''}
                    onChange={(e) => handlePriceChange('min', e.target.value)}
                    className="mt-2 h-10 sm:h-12 text-sm sm:text-base border-gray-300 focus:border-gray-900 focus:ring-gray-900"
                  />
                </div>
                <div>
                  <Label htmlFor="max-price" className="text-sm sm:text-base text-gray-600 font-medium">
                    Máximo (₡)
                  </Label>
                  <Input
                    id="max-price"
                    type="number"
                    placeholder="Sin límite"
                    value={filters.max_price || ''}
                    onChange={(e) => handlePriceChange('max', e.target.value)}
                    className="mt-2 h-10 sm:h-12 text-sm sm:text-base border-gray-300 focus:border-gray-900 focus:ring-gray-900"
                  />
                </div>
              </div>
              
              {/* Quick Price Filters */}
              <div className="space-y-2 sm:space-y-3 mt-4 sm:mt-5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onFilterChange({ ...filters, min_price: undefined, max_price: 10000 })}
                  className="w-full text-sm h-10 sm:h-11 border-gray-300 hover:border-gray-900 hover:bg-gray-50 text-gray-700 hover:text-gray-900"
                >
                  Hasta ₡10K
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onFilterChange({ ...filters, min_price: 10000, max_price: 50000 })}
                  className="w-full text-sm h-10 sm:h-11 border-gray-300 hover:border-gray-900 hover:bg-gray-50 text-gray-700 hover:text-gray-900"
                >
                  ₡10K - ₡50K
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onFilterChange({ ...filters, min_price: 50000, max_price: 100000 })}
                  className="w-full text-sm h-10 sm:h-11 border-gray-300 hover:border-gray-900 hover:bg-gray-50 text-gray-700 hover:text-gray-900"
                >
                  ₡50K - ₡100K
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onFilterChange({ ...filters, min_price: 100000, max_price: undefined })}
                  className="w-full text-sm h-10 sm:h-11 border-gray-300 hover:border-gray-900 hover:bg-gray-50 text-gray-700 hover:text-gray-900"
                >
                  Más de ₡100K
                </Button>
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Sorting */}
        <div>
          <button
            onClick={() => toggleSection('sorting')}
            className="flex items-center justify-between w-full text-left font-medium mb-3 sm:mb-4 hover:text-gray-900 transition-colors py-2"
          >
            <span className="text-base sm:text-lg text-gray-700">Ordenar por</span>
            {expandedSections.sorting ? (
              <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
            ) : (
              <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
            )}
          </button>
          
          {expandedSections.sorting && (
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center space-x-3 py-1">
                <Checkbox
                  id="sort-random"
                  checked={!filters.sort_by || filters.sort_by === 'random'}
                  onCheckedChange={() => handleSortChange('random')}
                  className="h-4 w-4 sm:h-5 sm:w-5 border-gray-300 data-[state=checked]:bg-gray-900 data-[state=checked]:border-gray-900"
                />
                <Label
                  htmlFor="sort-random"
                  className="text-sm sm:text-base font-normal cursor-pointer flex items-center gap-2 sm:gap-3 text-gray-700 hover:text-gray-900"
                >
                  <span>🎲</span>
                  <span>Aleatorio</span>
                </Label>
              </div>
              <div className="flex items-center space-x-3 py-1">
                <Checkbox
                  id="sort-popularity"
                  checked={filters.sort_by === 'popularity'}
                  onCheckedChange={() => handleSortChange('popularity')}
                  className="h-4 w-4 sm:h-5 sm:w-5 border-gray-300 data-[state=checked]:bg-gray-900 data-[state=checked]:border-gray-900"
                />
                <Label
                  htmlFor="sort-popularity"
                  className="text-sm sm:text-base font-normal cursor-pointer flex items-center gap-2 sm:gap-3 text-gray-700 hover:text-gray-900"
                >
                  <span>📱</span>
                  <span>Más populares</span>
                </Label>
              </div>
              <div className="flex items-center space-x-3 py-1">
                <Checkbox
                  id="sort-newest"
                  checked={filters.sort_by === 'newest'}
                  onCheckedChange={() => handleSortChange('newest')}
                  className="h-4 w-4 sm:h-5 sm:w-5 border-gray-300 data-[state=checked]:bg-gray-900 data-[state=checked]:border-gray-900"
                />
                <Label
                  htmlFor="sort-newest"
                  className="text-sm sm:text-base font-normal cursor-pointer flex items-center gap-2 sm:gap-3 text-gray-700 hover:text-gray-900"
                >
                  <span>🆕</span>
                  <span>Más recientes</span>
                </Label>
              </div>
            </div>
          )}
        </div>



        {/* Clear All Filters */}
        {activeFiltersCount > 0 && (
          <>
            <div className="border-t border-gray-100 my-6"></div>
            <Button
              variant="outline"
              onClick={onClearFilters}
              className="w-full h-11 sm:h-12 text-sm sm:text-base border-gray-300 hover:border-gray-900 hover:bg-gray-50 text-gray-700 hover:text-gray-900 font-medium"
            >
              Limpiar todos los filtros
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

export const FilterSidebar = memo(FilterSidebarComponent);