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

// Mapping of provinces to cantons
const CANTONS_BY_PROVINCE: { [key: string]: string[] } = {
  'San José': [
    'San José', 'Escazú', 'Desamparados', 'Puriscal', 'Tarrazú', 'Aserrí',
    'Mora', 'Goicoechea', 'Santa Ana', 'Alajuelita', 'Vázquez de Coronado',
    'Acosta', 'Tibás', 'Moravia', 'Montes de Oca', 'Turrubares', 'Dota',
    'Curridabat', 'Pérez Zeledón', 'León Cortés Castro'
  ],
  'Alajuela': [
    'Alajuela', 'San Ramón', 'Grecia', 'San Mateo', 'Atenas', 'Naranjo',
    'Palmares', 'Poás', 'Orotina', 'San Carlos', 'Zarcero', 'Sarchí',
    'Upala', 'Los Chiles', 'Guatuso', 'Río Cuarto'
  ],
  'Cartago': [
    'Cartago', 'Paraíso', 'La Unión', 'Jiménez', 'Turrialba',
    'Alvarado', 'Oreamuno', 'El Guarco'
  ],
  'Heredia': [
    'Heredia', 'Barva', 'Santo Domingo', 'Santa Bárbara', 'San Rafael',
    'San Isidro', 'Belén', 'Flores', 'San Pablo', 'Sarapiquí'
  ],
  'Guanacaste': [
    'Liberia', 'Nicoya', 'Santa Cruz', 'Bagaces', 'Carrillo', 'Cañas',
    'Abangares', 'Tilarán', 'Nandayure', 'La Cruz', 'Hojancha'
  ],
  'Puntarenas': [
    'Puntarenas', 'Esparza', 'Buenos Aires', 'Montes de Oro', 'Osa',
    'Quepos', 'Golfito', 'Coto Brus', 'Parrita', 'Corredores',
    'Garabito', 'Monte Verde'
  ],
  'Limón': [
    'Limón', 'Pococí', 'Siquirres', 'Talamanca', 'Matina', 'Guácimo'
  ]
};

interface BusinessFilterSidebarProps {
  categories: Category[];
  filters: {
    category_id: string | undefined;
    search: string | undefined;
    provincia: string | undefined;
    canton: string | undefined;
  };
  onFilterChange: (filters: {
    category_id: string | undefined;
    search: string | undefined;
    provincia: string | undefined;
    canton: string | undefined;
  }) => void;
  onClearFilters: () => void;
  onClose?: () => void;
}

export function BusinessFilterSidebar({
  categories,
  filters,
  onFilterChange,
  onClearFilters,
  onClose
}: BusinessFilterSidebarProps) {
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    location: true,
    search: true
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    onFilterChange({
      ...filters,
      category_id: checked ? categoryId : undefined
    });
  };

  const handleProvinciaChange = (provincia: string, checked: boolean) => {
    onFilterChange({
      ...filters,
      provincia: checked ? provincia : undefined,
      canton: undefined // Reset canton when province changes
    });
  };

  const handleCantonChange = (canton: string, checked: boolean) => {
    onFilterChange({
      ...filters,
      canton: checked ? canton : undefined
    });
  };

  const handleSearchChange = (search: string) => {
    onFilterChange({
      ...filters,
      search: search || undefined
    });
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;
  const availableCantons = filters.provincia ? CANTONS_BY_PROVINCE[filters.provincia] || [] : [];

  return (
    <div className="w-[80%] sm:w-80 bg-card border-r p-4 sm:p-6 space-y-4 sm:space-y-6 h-screen overflow-y-auto shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-base sm:text-lg font-semibold">Filtros</h2>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {activeFiltersCount}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-1">
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-muted-foreground hover:text-foreground text-xs sm:text-sm px-2 sm:px-3"
            >
              <X className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              <span className="hidden sm:inline">Limpiar</span>
            </Button>
          )}
          {onClose && (
            <Button
              variant="ghost"
              size="lg"
              onClick={onClose}
              className="h-12 w-12 p-0 lg:hidden bg-yellow-800 hover:bg-yellow-900 border-2 border-yellow-700 hover:border-yellow-800 rounded-full transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <X className="h-8 w-8 text-white font-bold" />
            </Button>
          )}
        </div>
      </div>

      <Separator />

      {/* Search Section */}
      <div className="space-y-2 sm:space-y-3">
        <Button
          variant="ghost"
          className="w-full justify-between p-0 h-auto font-medium text-sm sm:text-base"
          onClick={() => toggleSection('search')}
        >
          Búsqueda
          {expandedSections.search ? (
            <ChevronUp className="h-3 w-3 sm:h-4 sm:w-4" />
          ) : (
            <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
          )}
        </Button>

        {expandedSections.search && (
          <div className="space-y-2">
            <Input
              placeholder="Buscar emprendimientos..."
              value={filters.search || ''}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="h-12 sm:h-14 text-lg sm:text-xl border-2 shadow-md hover:shadow-lg focus:shadow-xl transition-all duration-200 font-medium"
            />
          </div>
        )}
      </div>

      <Separator />

      {/* Categories Section */}
      <div className="space-y-2 sm:space-y-3">
        <Button
          variant="ghost"
          className="w-full justify-between p-0 h-auto font-medium text-sm sm:text-base"
          onClick={() => toggleSection('categories')}
        >
          Categorías
          {expandedSections.categories ? (
            <ChevronUp className="h-3 w-3 sm:h-4 sm:w-4" />
          ) : (
            <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
          )}
        </Button>

        {expandedSections.categories && (
          <div className="space-y-1 sm:space-y-2 max-h-48 sm:max-h-60 overflow-y-auto">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category.id}`}
                  checked={filters.category_id === category.id}
                  onCheckedChange={(checked) => 
                    handleCategoryChange(category.id, checked as boolean)
                  }
                  className="h-3 w-3 sm:h-4 sm:w-4"
                />
                <Label
                  htmlFor={`category-${category.id}`}
                  className="text-xs sm:text-sm font-normal cursor-pointer flex-1"
                >
                  {category.name}
                </Label>
              </div>
            ))}
          </div>
        )}
      </div>

      <Separator />

      {/* Location Section */}
      <div className="space-y-2 sm:space-y-3">
        <Button
          variant="ghost"
          className="w-full justify-between p-0 h-auto font-medium text-sm sm:text-base"
          onClick={() => toggleSection('location')}
        >
          Ubicación
          {expandedSections.location ? (
            <ChevronUp className="h-3 w-3 sm:h-4 sm:w-4" />
          ) : (
            <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
          )}
        </Button>

        {expandedSections.location && (
          <div className="space-y-3 sm:space-y-4">
            {/* Province Filter */}
            <div className="space-y-2">
              <Label className="text-xs sm:text-sm font-medium">Provincia</Label>
              <div className="space-y-1 sm:space-y-2 max-h-32 sm:max-h-40 overflow-y-auto">
                {Object.keys(CANTONS_BY_PROVINCE).map((provincia) => (
                  <div key={provincia} className="flex items-center space-x-2">
                    <Checkbox
                      id={`provincia-${provincia}`}
                      checked={filters.provincia === provincia}
                      onCheckedChange={(checked) => 
                        handleProvinciaChange(provincia, checked as boolean)
                      }
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

            {/* Canton Filter */}
            {filters.provincia && availableCantons.length > 0 && (
              <div className="space-y-2">
                <Label className="text-xs sm:text-sm font-medium">Cantón</Label>
                <div className="space-y-1 sm:space-y-2 max-h-32 sm:max-h-40 overflow-y-auto">
                  {availableCantons.map((canton) => (
                    <div key={canton} className="flex items-center space-x-2">
                      <Checkbox
                        id={`canton-${canton}`}
                        checked={filters.canton === canton}
                        onCheckedChange={(checked) => 
                          handleCantonChange(canton, checked as boolean)
                        }
                        className="h-3 w-3 sm:h-4 sm:w-4"
                      />
                      <Label
                        htmlFor={`canton-${canton}`}
                        className="text-xs sm:text-sm font-normal cursor-pointer flex-1"
                      >
                        {canton}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Active Filters */}
      {activeFiltersCount > 0 && (
        <>
          <Separator />
          <div className="space-y-2">
            <Label className="text-xs sm:text-sm font-medium">Filtros activos</Label>
            <div className="flex flex-wrap gap-1">
              {filters.category_id && (
                <Badge variant="secondary" className="text-xs">
                  {categories.find(c => c.id === filters.category_id)?.name}
                </Badge>
              )}
              {filters.provincia && (
                <Badge variant="secondary" className="text-xs">
                  {filters.provincia}
                </Badge>
              )}
              {filters.canton && (
                <Badge variant="secondary" className="text-xs">
                  {filters.canton}
                </Badge>
              )}
              {filters.search && (
                <Badge variant="secondary" className="text-xs">
                  &quot;{filters.search}&quot;
                </Badge>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}