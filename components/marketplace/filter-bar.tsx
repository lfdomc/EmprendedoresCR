'use client';

import { useState, useCallback, memo } from 'react';
import { X, Filter, ChevronDown, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Category } from '@/lib/types/database';

const COSTA_RICA_LOCATIONS = [
  {
    provincia: 'San José',
    cantones: ['San José', 'Escazú', 'Desamparados', 'Puriscal', 'Tarrazú', 'Aserrí', 'Mora', 'Goicoechea', 'Santa Ana', 'Alajuelita', 'Vásquez de Coronado', 'Acosta', 'Tibás', 'Moravia', 'Montes de Oca', 'Turrubares', 'Dota', 'Curridabat', 'Pérez Zeledón', 'León Cortés Castro']
  },
  {
    provincia: 'Alajuela',
    cantones: ['Alajuela', 'San Ramón', 'Grecia', 'San Mateo', 'Atenas', 'Naranjo', 'Palmares', 'Poás', 'Orotina', 'San Carlos', 'Zarcero', 'Sarchí', 'Upala', 'Los Chiles', 'Guatuso']
  },
  {
    provincia: 'Cartago',
    cantones: ['Cartago', 'Paraíso', 'La Unión', 'Jiménez', 'Turrialba', 'Alvarado', 'Oreamuno', 'El Guarco']
  },
  {
    provincia: 'Heredia',
    cantones: ['Heredia', 'Barva', 'Santo Domingo', 'Santa Bárbara', 'San Rafael', 'San Isidro', 'Belén', 'Flores', 'San Pablo', 'Sarapiquí']
  },
  {
    provincia: 'Guanacaste',
    cantones: ['Liberia', 'Nicoya', 'Santa Cruz', 'Bagaces', 'Carrillo', 'Cañas', 'Abangares', 'Tilarán', 'Nandayure', 'La Cruz', 'Hojancha']
  },
  {
    provincia: 'Puntarenas',
    cantones: ['Puntarenas', 'Esparza', 'Buenos Aires', 'Montes de Oro', 'Osa', 'Quepos', 'Golfito', 'Coto Brus', 'Parrita', 'Corredores', 'Garabito']
  },
  {
    provincia: 'Limón',
    cantones: ['Limón', 'Pococí', 'Siquirres', 'Talamanca', 'Matina', 'Guácimo']
  }
];

type ContentType = 'all' | 'products' | 'services';

interface FilterBarProps {
  categories: Category[];
  filters: {
    category_id?: string | string[];
    min_price?: number;
    max_price?: number;
    provincia?: string | string[];
    canton?: string | string[];
    sort_by?: 'random' | 'popularity' | 'newest';
    search?: string;
  };
  onFiltersChange: (filters: FilterBarProps['filters']) => void;
  onClearFilters: () => void;
  contentType?: ContentType;
  onContentTypeChange?: (type: ContentType) => void;
  currentPage?: 'marketplace' | 'businesses';
  onPageChange?: (page: 'marketplace' | 'businesses') => void;
}

const QUICK_PRICE_RANGES = [
  { label: '₡0 - ₡10,000', min: 0, max: 10000 },
  { label: '₡10,000 - ₡50,000', min: 10000, max: 50000 },
  { label: '₡50,000 - ₡100,000', min: 50000, max: 100000 },
  { label: '₡100,000+', min: 100000, max: undefined },
];

function FilterBarComponent({ categories, filters, onFiltersChange, onClearFilters, contentType = 'all', onContentTypeChange, currentPage = 'marketplace', onPageChange }: FilterBarProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [customMinPrice, setCustomMinPrice] = useState(filters.min_price?.toString() || '');
  const [customMaxPrice, setCustomMaxPrice] = useState(filters.max_price?.toString() || '');


  const handleCategoryChange = useCallback((categoryId: string) => {
    onFiltersChange({
      ...filters,
      category_id: categoryId === 'all' ? undefined : categoryId
    });
    setShowMobileMenu(false);
  }, [filters, onFiltersChange]);

  const handleProvinciaChange = useCallback((provincia: string) => {
    onFiltersChange({
      ...filters,
      provincia: provincia === 'all' ? undefined : provincia,
      canton: undefined // Reset canton when provincia changes
    });
    setShowMobileMenu(false);
  }, [filters, onFiltersChange]);

  const handleCantonChange = useCallback((canton: string) => {
    onFiltersChange({
      ...filters,
      canton: canton === 'all' ? undefined : canton
    });
    setShowMobileMenu(false);
  }, [filters, onFiltersChange]);

  const handlePriceRangeChange = (rangeValue: string) => {
    if (rangeValue === 'all') {
      onFiltersChange({
        ...filters,
        min_price: undefined,
        max_price: undefined
      });
      setCustomMinPrice('');
      setCustomMaxPrice('');
      setShowMobileMenu(false);
    } else if (rangeValue === 'custom') {
      // Keep current custom values
      return;
    } else {
      const range = QUICK_PRICE_RANGES.find(r => r.label === rangeValue);
      if (range) {
        onFiltersChange({
          ...filters,
          min_price: range.min,
          max_price: range.max
        });
        setCustomMinPrice(range.min.toString());
        setCustomMaxPrice(range.max?.toString() || '');
        setShowMobileMenu(false);
      }
    }
  };

  const handleCustomPriceApply = () => {
    const minPrice = customMinPrice ? parseInt(customMinPrice) : undefined;
    const maxPrice = customMaxPrice ? parseInt(customMaxPrice) : undefined;
    
    onFiltersChange({
      ...filters,
      min_price: minPrice,
      max_price: maxPrice
    });
    setShowMobileMenu(false);
  };

  const handleSortChange = (value: string) => {
    onFiltersChange({
      ...filters,
      sort_by: value === 'all' ? undefined : value as 'random' | 'popularity' | 'newest'
    });
    setShowMobileMenu(false);
  };



  const selectedProvincia = typeof filters.provincia === 'string' ? filters.provincia : undefined;
  const availableCantones = selectedProvincia ? 
    COSTA_RICA_LOCATIONS.find(loc => loc.provincia === selectedProvincia)?.cantones || [] : [];

  const activeFiltersCount = Object.values(filters).filter(value => 
    value !== undefined && value !== '' && 
    !(Array.isArray(value) && value.length === 0)
  ).length;

  const getCurrentCategoryValue = () => {
    if (!filters.category_id) return 'all';
    return typeof filters.category_id === 'string' ? filters.category_id : filters.category_id[0];
  };

  const getCurrentProvinciaValue = () => {
    if (!filters.provincia) return 'all';
    return typeof filters.provincia === 'string' ? filters.provincia : filters.provincia[0];
  };

  const getCurrentCantonValue = () => {
    if (!filters.canton) return 'all';
    return typeof filters.canton === 'string' ? filters.canton : filters.canton[0];
  };

  const getCurrentPriceRangeValue = () => {
    if (!filters.min_price && !filters.max_price) return 'all';
    
    const currentRange = QUICK_PRICE_RANGES.find(range => 
      range.min === filters.min_price && range.max === filters.max_price
    );
    
    return currentRange ? currentRange.label : 'custom';
  };

  const getCurrentSortValue = () => {
    return filters.sort_by || 'all';
  };

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
        {/* Desktop Layout */}
        <div className="hidden md:block">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full">
              <div className="flex flex-wrap items-center gap-3 w-full">
                {/* Selector de tipo de contenido - Ocultar en página de emprendimientos */}
                {onContentTypeChange && contentType && currentPage !== 'businesses' && (
                  <div className="w-auto flex-shrink-0">
                    <Select value={contentType} onValueChange={onContentTypeChange}>
                      <SelectTrigger className="w-40 h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="border-gray-200">
                        <SelectItem value="all" className="text-xs">Todo</SelectItem>
                        <SelectItem value="products" className="text-xs">Productos</SelectItem>
                        <SelectItem value="services" className="text-xs">Servicios</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Categorías Dropdown */}
                <Select value={getCurrentCategoryValue()} onValueChange={handleCategoryChange}>
                  <SelectTrigger className="w-40 h-8 text-xs">
                    <SelectValue placeholder="Categorías" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Categorías</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        <span className="mr-2">{category.icon}</span>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Provincia Dropdown */}
                <Select value={getCurrentProvinciaValue()} onValueChange={handleProvinciaChange}>
                  <SelectTrigger className="w-40 h-8 text-xs">
                    <SelectValue placeholder="Provincias" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Provincias</SelectItem>
                    {COSTA_RICA_LOCATIONS.map((location) => (
                      <SelectItem key={location.provincia} value={location.provincia}>
                        {location.provincia}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Cantón Dropdown */}
                {availableCantones.length > 0 && (
                  <Select value={getCurrentCantonValue()} onValueChange={handleCantonChange}>
                    <SelectTrigger className="w-40 h-8 text-xs">
                      <SelectValue placeholder="Cantón" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Cantón</SelectItem>
                      {availableCantones.map((canton) => (
                        <SelectItem key={canton} value={canton}>
                          {canton}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
              {/* Ocultar botón "Más filtros" en página de emprendimientos */}
              {currentPage !== 'businesses' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className={`text-xs h-8 w-40 border-gray-300 text-gray-700 hover:bg-gray-50 ${
                    showAdvanced ? 'bg-gray-100' : ''
                  }`}
                >
                  <Filter className="h-4 w-4 mr-1" />
                  Más filtros
                  <ChevronDown className={`ml-1 h-3 w-3 transition-transform ${
                    showAdvanced ? 'rotate-180' : ''
                  }`} />
                </Button>
              )}



              {activeFiltersCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClearFilters}
                  className="text-xs h-7 text-red-600 hover:text-red-700 hover:bg-red-50 w-full sm:w-auto"
                >
                  Limpiar filtros ({activeFiltersCount})
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden">
          <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 xs:gap-0">
            <div className="flex flex-wrap items-center gap-2 w-full xs:w-auto">
              {/* Selector de página móvil - Oculto */}
              {onPageChange && currentPage && (
                <div className="hidden">
                  <Select value={currentPage} onValueChange={onPageChange}>
                    <SelectTrigger className="w-32 h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-gray-200">
                      <SelectItem value="marketplace" className="text-xs">Marketplace</SelectItem>
                      <SelectItem value="businesses" className="text-xs">Emprendimientos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              {/* Selector de tipo de contenido móvil - Ocultar en página de emprendimientos */}
              {onContentTypeChange && contentType && currentPage !== 'businesses' && (
                <Select value={contentType} onValueChange={onContentTypeChange}>
                  <SelectTrigger className="w-20 h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-gray-200">
                    <SelectItem value="all" className="text-xs">Todo</SelectItem>
                    <SelectItem value="products" className="text-xs">Productos</SelectItem>
                    <SelectItem value="services" className="text-xs">Servicios</SelectItem>
                  </SelectContent>
                </Select>
              )}
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="h-8 px-3 text-xs border-gray-300"
              >
                <Menu className="h-4 w-4 mr-1" />
                Filtros
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-2 h-4 px-1 text-xs">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </div>
            
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFilters}
                className="text-xs h-7 text-red-600 hover:text-red-700 hover:bg-red-50 flex items-center gap-1"
              >
                <X className="h-4 w-4" />
                <span className="inline">Limpiar filtros</span>
              </Button>
            )}
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-4">
              {/* Categorías Dropdown */}
              <div>
                <Label className="text-xs font-medium text-gray-700 mb-2 block">Categoría</Label>
                <Select value={getCurrentCategoryValue()} onValueChange={handleCategoryChange}>
                  <SelectTrigger className="w-full h-8 text-xs">
                    <SelectValue placeholder="Categorías" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las categorías</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        <span className="mr-2">{category.icon}</span>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Provincia Dropdown */}
              <div>
                <Label className="text-xs font-medium text-gray-700 mb-2 block">Provincia</Label>
                <Select value={getCurrentProvinciaValue()} onValueChange={handleProvinciaChange}>
                  <SelectTrigger className="w-full h-8 text-xs">
                    <SelectValue placeholder="Provincias" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las provincias</SelectItem>
                    {COSTA_RICA_LOCATIONS.map((location) => (
                      <SelectItem key={location.provincia} value={location.provincia}>
                        {location.provincia}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Cantón Dropdown */}
              {availableCantones.length > 0 && (
                <div>
                  <Label className="text-xs font-medium text-gray-700 mb-2 block">Cantón</Label>
                  <Select value={getCurrentCantonValue()} onValueChange={handleCantonChange}>
                    <SelectTrigger className="w-full h-8 text-xs">
                      <SelectValue placeholder="Cantón" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los cantones</SelectItem>
                      {availableCantones.map((canton) => (
                        <SelectItem key={canton} value={canton}>
                          {canton}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Precio Dropdown - Ocultar en página de emprendimientos */}
              {currentPage !== 'businesses' && (
                <div>
                  <Label className="text-xs font-medium text-gray-700 mb-2 block">Precio</Label>
                  <Select value={getCurrentPriceRangeValue()} onValueChange={handlePriceRangeChange}>
                    <SelectTrigger className="w-full h-8 text-xs">
                      <SelectValue placeholder="Rango de Precios" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los precios</SelectItem>
                      {QUICK_PRICE_RANGES.map((range) => (
                        <SelectItem key={range.label} value={range.label}>
                          {range.label}
                        </SelectItem>
                      ))}
                      <SelectItem value="custom">Personalizado</SelectItem>
                    </SelectContent>
                  </Select>

                  {getCurrentPriceRangeValue() === 'custom' && (
                    <div className="flex items-center gap-2 mt-2">
                      <Input
                        type="number"
                        placeholder="Mín"
                        value={customMinPrice}
                        onChange={(e) => setCustomMinPrice(e.target.value)}
                        className="flex-1 h-7 text-xs"
                      />
                      <span className="text-xs text-gray-500">-</span>
                      <Input
                        type="number"
                        placeholder="Máx"
                        value={customMaxPrice}
                        onChange={(e) => setCustomMaxPrice(e.target.value)}
                        className="flex-1 h-7 text-xs"
                      />
                      <Button
                        size="sm"
                        onClick={handleCustomPriceApply}
                        className="h-7 text-xs px-2"
                      >
                        OK
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Ordenar Dropdown - Ocultar en página de emprendimientos */}
              {currentPage !== 'businesses' && (
                <div>
                  <Label className="text-xs font-medium text-gray-700 mb-2 block">Ordenar por</Label>
                  <Select value={getCurrentSortValue()} onValueChange={handleSortChange}>
                    <SelectTrigger className="w-full h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Por defecto</SelectItem>
                      <SelectItem value="random">Aleatorio</SelectItem>
                      <SelectItem value="popularity">Popularidad</SelectItem>
                      <SelectItem value="newest">Más recientes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowMobileMenu(false)}
                  className="flex-1 h-8 text-xs"
                >
                  Cerrar
                </Button>
                {activeFiltersCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      onClearFilters();
                      setShowMobileMenu(false);
                    }}
                    className="flex-1 h-8 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    Limpiar todo
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Filtros Avanzados - Solo Desktop - Ocultar en página de emprendimientos */}
        {showAdvanced && currentPage !== 'businesses' && (
          <div className="hidden md:block mt-4 pt-4 border-t border-gray-100">
            <div className="flex flex-wrap items-center gap-3">
              {/* Precio Dropdown */}
              <div className="flex flex-col">
                <Select value={getCurrentPriceRangeValue()} onValueChange={handlePriceRangeChange}>
                  <SelectTrigger className="w-40 h-8 text-xs">
                    <SelectValue placeholder="Rango de Precios" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Rango de Precios</SelectItem>
                    {QUICK_PRICE_RANGES.map((range) => (
                      <SelectItem key={range.label} value={range.label}>
                        {range.label}
                      </SelectItem>
                    ))}
                    <SelectItem value="custom">Personalizado</SelectItem>
                  </SelectContent>
                </Select>

                {getCurrentPriceRangeValue() === 'custom' && (
                  <div className="flex items-center gap-2 mt-2">
                    <Input
                      type="number"
                      placeholder="Precio mín"
                      value={customMinPrice}
                      onChange={(e) => setCustomMinPrice(e.target.value)}
                      className="w-24 h-7 text-xs"
                    />
                    <span className="text-xs text-gray-500">-</span>
                    <Input
                      type="number"
                      placeholder="Precio máx"
                      value={customMaxPrice}
                      onChange={(e) => setCustomMaxPrice(e.target.value)}
                      className="w-24 h-7 text-xs"
                    />
                    <Button
                      size="sm"
                      onClick={handleCustomPriceApply}
                      className="h-7 text-xs"
                    >
                      Aplicar
                    </Button>
                  </div>
                )}
              </div>

              {/* Ordenar Dropdown */}
              <Select value={getCurrentSortValue()} onValueChange={handleSortChange}>
                <SelectTrigger className="w-40 h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Por defecto</SelectItem>
                  <SelectItem value="random">Aleatorio</SelectItem>
                  <SelectItem value="popularity">Popularidad</SelectItem>
                  <SelectItem value="newest">Más recientes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Active Filters Summary */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-gray-100">
            <span className="text-xs text-gray-500">Filtros activos:</span>
            {filters.category_id && (
              <Badge variant="secondary" className="text-xs">
                {categories.find(c => c.id === (typeof filters.category_id === 'string' ? filters.category_id : filters.category_id?.[0]))?.name}
              </Badge>
            )}
            {filters.provincia && (
              <Badge variant="secondary" className="text-xs">
                {typeof filters.provincia === 'string' ? filters.provincia : filters.provincia[0]}
              </Badge>
            )}
            {filters.canton && (
              <Badge variant="secondary" className="text-xs">
                {typeof filters.canton === 'string' ? filters.canton : filters.canton[0]}
              </Badge>
            )}
            {(filters.min_price || filters.max_price) && (
              <Badge variant="secondary" className="text-xs">
                {filters.min_price && filters.max_price ? 
                  `₡${filters.min_price.toLocaleString()} - ₡${filters.max_price.toLocaleString()}` :
                  filters.min_price ? 
                    `₡${filters.min_price.toLocaleString()}+` :
                    `Hasta ₡${filters.max_price?.toLocaleString()}`
                }
              </Badge>
            )}
            {filters.sort_by && (
              <Badge variant="secondary" className="text-xs">
                {filters.sort_by === 'random' ? 'Aleatorio' :
                 filters.sort_by === 'popularity' ? 'Popularidad' :
                 filters.sort_by === 'newest' ? 'Más recientes' : filters.sort_by}
              </Badge>
            )}

          </div>
        )}
      </div>
    </div>
  );
}

export const FilterBar = memo(FilterBarComponent);