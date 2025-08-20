'use client';

import { useState } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Category } from '@/lib/types/database';

interface FilterSidebarProps {
  categories: Category[];
  filters: {
    category_id?: string;
    min_price?: number;
    max_price?: number;
    provincia?: string;
    canton?: string;
  };
  onFilterChange: (filters: {
    category_id?: string;
    min_price?: number;
    max_price?: number;
    provincia?: string;
    canton?: string;
  }) => void;
  onClearFilters: () => void;
  onClose?: () => void;
}

export function FilterSidebar({
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
    features: true
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleCategoryChange = (categoryId: string) => {
    onFilterChange({
      ...filters,
      category_id: filters.category_id === categoryId ? undefined : categoryId
    });
  };

  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    const numValue = value === '' ? undefined : parseFloat(value);
    onFilterChange({
      ...filters,
      [type === 'min' ? 'min_price' : 'max_price']: numValue
    });
  };

  const handleFeaturedChange = () => {
    onFilterChange({
      ...filters,
      // is_featured filter removed
    });
  };

  const handleProvinciaChange = (provincia: string) => {
    onFilterChange({
      ...filters,
      provincia: filters.provincia === provincia ? undefined : provincia,
      canton: undefined // Reset canton when provincia changes
    });
  };

  const handleCantonChange = (canton: string) => {
    onFilterChange({
      ...filters,
      canton: filters.canton === canton ? undefined : canton
    });
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="w-[70%] sm:w-80 h-screen overflow-y-auto bg-background shadow-lg lg:shadow-none lg:bg-card lg:rounded-lg lg:border p-3 sm:p-4 lg:h-fit lg:sticky lg:top-24 lg:overflow-visible">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h3 className="font-semibold text-base sm:text-lg">Filtros</h3>
        <div className="flex items-center gap-1 sm:gap-2">
          {activeFiltersCount > 0 && (
            <>
              <Badge variant="secondary" className="text-xs">
                {activeFiltersCount}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                className="h-5 w-5 sm:h-6 sm:w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </>
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

      <div className="space-y-4 sm:space-y-6">
        {/* Categories */}
        <div>
          <button
            onClick={() => toggleSection('categories')}
            className="flex items-center justify-between w-full text-left font-medium mb-2 sm:mb-3 hover:text-primary transition-colors"
          >
            <span className="text-sm sm:text-base">Categorías</span>
            {expandedSections.categories ? (
              <ChevronUp className="h-3 w-3 sm:h-4 sm:w-4" />
            ) : (
              <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
            )}
          </button>
          
          {expandedSections.categories && (
            <div className="space-y-1 sm:space-y-2 max-h-48 sm:max-h-64 overflow-y-auto">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category.id}`}
                    checked={filters.category_id === category.id}
                    onCheckedChange={() => handleCategoryChange(category.id)}
                    className="h-3 w-3 sm:h-4 sm:w-4"
                  />
                  <Label
                    htmlFor={`category-${category.id}`}
                    className="text-xs sm:text-sm font-normal cursor-pointer flex items-center gap-1 sm:gap-2 flex-1"
                  >
                    <span className="text-xs sm:text-sm">{category.icon}</span>
                    <span>{category.name}</span>
                  </Label>
                </div>
              ))}
            </div>
          )}
        </div>

        <Separator />

        {/* Location */}
        <div>
          <button
            onClick={() => toggleSection('location')}
            className="flex items-center justify-between w-full text-left font-medium mb-2 sm:mb-3 hover:text-primary transition-colors"
          >
            <span className="text-sm sm:text-base">Ubicación</span>
            {expandedSections.location ? (
              <ChevronUp className="h-3 w-3 sm:h-4 sm:w-4" />
            ) : (
              <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
            )}
          </button>
          
          {expandedSections.location && (
            <div className="space-y-2 sm:space-y-3">
              {/* Provincia */}
              <div>
                <Label className="text-xs sm:text-sm font-medium mb-1 sm:mb-2 block">Provincia</Label>
                <div className="space-y-1 sm:space-y-2 max-h-32 sm:max-h-48 overflow-y-auto">
                  {['San José', 'Alajuela', 'Cartago', 'Heredia', 'Guanacaste', 'Puntarenas', 'Limón'].map((provincia) => (
                    <div key={provincia} className="flex items-center space-x-1 sm:space-x-2">
                      <Checkbox
                        id={`provincia-${provincia}`}
                        checked={filters.provincia === provincia}
                        onCheckedChange={() => handleProvinciaChange(provincia)}
                        className="h-3 w-3 sm:h-4 sm:w-4"
                      />
                      <Label
                        htmlFor={`provincia-${provincia}`}
                        className="text-xs sm:text-sm font-normal cursor-pointer flex-1"
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
                  <Label className="text-xs sm:text-sm font-medium mb-1 sm:mb-2 block">Cantón</Label>
                  <div className="space-y-1 sm:space-y-2 max-h-32 sm:max-h-48 overflow-y-auto">
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
                        <div key={canton} className="flex items-center space-x-1 sm:space-x-2">
                          <Checkbox
                            id={`canton-${canton}`}
                            checked={filters.canton === canton}
                            onCheckedChange={() => handleCantonChange(canton)}
                            className="h-3 w-3 sm:h-4 sm:w-4"
                          />
                          <Label
                            htmlFor={`canton-${canton}`}
                            className="text-xs sm:text-sm font-normal cursor-pointer flex-1"
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

        <Separator />

        {/* Price Range */}
        <div>
          <button
            onClick={() => toggleSection('price')}
            className="flex items-center justify-between w-full text-left font-medium mb-2 sm:mb-3 hover:text-primary transition-colors"
          >
            <span className="text-sm sm:text-base">Rango de Precio</span>
            {expandedSections.price ? (
              <ChevronUp className="h-3 w-3 sm:h-4 sm:w-4" />
            ) : (
              <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
            )}
          </button>
          
          {expandedSections.price && (
            <div className="space-y-2 sm:space-y-3">
              <div className="space-y-2">
                <div>
                  <Label htmlFor="min-price" className="text-xs sm:text-sm text-muted-foreground">
                    Mínimo (₡)
                  </Label>
                  <Input
                    id="min-price"
                    type="number"
                    placeholder="0"
                    value={filters.min_price || ''}
                    onChange={(e) => handlePriceChange('min', e.target.value)}
                    className="mt-1 h-8 sm:h-10 text-xs sm:text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="max-price" className="text-xs sm:text-sm text-muted-foreground">
                    Máximo (₡)
                  </Label>
                  <Input
                    id="max-price"
                    type="number"
                    placeholder="Sin límite"
                    value={filters.max_price || ''}
                    onChange={(e) => handlePriceChange('max', e.target.value)}
                    className="mt-1 h-8 sm:h-10 text-xs sm:text-sm"
                  />
                </div>
              </div>
              
              {/* Quick Price Filters */}
              <div className="space-y-1 sm:space-y-2 mt-2 sm:mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onFilterChange({ ...filters, min_price: undefined, max_price: 10000 })}
                  className="w-full text-xs h-7 sm:h-8"
                >
                  Hasta ₡10K
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onFilterChange({ ...filters, min_price: 10000, max_price: 50000 })}
                  className="w-full text-xs h-7 sm:h-8"
                >
                  ₡10K - ₡50K
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onFilterChange({ ...filters, min_price: 50000, max_price: 100000 })}
                  className="w-full text-xs h-7 sm:h-8"
                >
                  ₡50K - ₡100K
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onFilterChange({ ...filters, min_price: 100000, max_price: undefined })}
                  className="w-full text-xs h-7 sm:h-8"
                >
                  Más de ₡100K
                </Button>
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Features */}
        <div>
          <button
            onClick={() => toggleSection('features')}
            className="flex items-center justify-between w-full text-left font-medium mb-2 sm:mb-3 hover:text-primary transition-colors"
          >
            <span className="text-sm sm:text-base">Características</span>
            {expandedSections.features ? (
              <ChevronUp className="h-3 w-3 sm:h-4 sm:w-4" />
            ) : (
              <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
            )}
          </button>
          
          {expandedSections.features && (
            <div className="space-y-1 sm:space-y-2">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Checkbox
                  id="featured"
                  checked={false}
                  onCheckedChange={handleFeaturedChange}
                  className="h-3 w-3 sm:h-4 sm:w-4"
                />
                <Label
                  htmlFor="featured"
                  className="text-xs sm:text-sm font-normal cursor-pointer flex items-center gap-1 sm:gap-2"
                >
                  <span>⭐</span>
                  <span>Destacados</span>
                </Label>
              </div>
            </div>
          )}
        </div>

        {/* Clear All Filters */}
        {activeFiltersCount > 0 && (
          <>
            <Separator />
            <Button
              variant="outline"
              onClick={onClearFilters}
              className="w-full"
            >
              Limpiar todos los filtros
            </Button>
          </>
        )}
      </div>
    </div>
  );
}