'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Filter } from 'lucide-react';
import { DISTRITOS_PT, TipologiaPT, CertificadoEnergetico } from '@/types/property-pt';
import { PropertyType } from '@/types/property';

export interface AdvancedFilters {
  priceRange: [number, number];
  propertyTypes: PropertyType[];
  districts: string[];
  bedrooms: number | null;
  bathrooms: number | null;
  areaRange: [number, number];
  amenities: {
    pool: boolean;
    garage: boolean;
    elevator: boolean;
    airConditioning: boolean;
  };
  energyCertificate: CertificadoEnergetico | null;
  typology: TipologiaPT | null;
}

interface PropertyFiltersAdvancedProps {
  onFilterChange: (filters: AdvancedFilters) => void;
  className?: string;
}

const INITIAL_FILTERS: AdvancedFilters = {
  priceRange: [0, 5000000],
  propertyTypes: [],
  districts: [],
  bedrooms: null,
  bathrooms: null,
  areaRange: [0, 1000],
  amenities: {
    pool: false,
    garage: false,
    elevator: false,
    airConditioning: false,
  },
  energyCertificate: null,
  typology: null,
};

const STORAGE_KEY = 'property-filters-advanced';

export default function PropertyFiltersAdvanced({
  onFilterChange,
  className = '',
}: PropertyFiltersAdvancedProps) {
  const [filters, setFilters] = useState<AdvancedFilters>(INITIAL_FILTERS);
  const [isExpanded, setIsExpanded] = useState(false);
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);

  // Load filters from localStorage on mount
  useEffect(() => {
    const savedFilters = localStorage.getItem(STORAGE_KEY);
    if (savedFilters) {
      try {
        const parsed = JSON.parse(savedFilters);
        setFilters(parsed);
        onFilterChange(parsed);
      } catch (error) {
        console.error('Error loading saved filters:', error);
      }
    }
  }, []);

  // Debounced filter change handler
  const debouncedFilterChange = useCallback(
    (newFilters: AdvancedFilters) => {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }

      const timeout = setTimeout(() => {
        onFilterChange(newFilters);
        // Save to localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newFilters));
      }, 500);

      setDebounceTimeout(timeout);
    },
    [debounceTimeout, onFilterChange]
  );

  const updateFilter = (key: keyof AdvancedFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    debouncedFilterChange(newFilters);
  };

  const togglePropertyType = (type: PropertyType) => {
    const newTypes = filters.propertyTypes.includes(type)
      ? filters.propertyTypes.filter((t) => t !== type)
      : [...filters.propertyTypes, type];
    updateFilter('propertyTypes', newTypes);
  };

  const toggleDistrict = (district: string) => {
    const newDistricts = filters.districts.includes(district)
      ? filters.districts.filter((d) => d !== district)
      : [...filters.districts, district];
    updateFilter('districts', newDistricts);
  };

  const toggleAmenity = (amenity: keyof AdvancedFilters['amenities']) => {
    updateFilter('amenities', {
      ...filters.amenities,
      [amenity]: !filters.amenities[amenity],
    });
  };

  const clearAllFilters = () => {
    setFilters(INITIAL_FILTERS);
    onFilterChange(INITIAL_FILTERS);
    localStorage.removeItem(STORAGE_KEY);
  };

  // Calculate active filters count
  const getActiveFiltersCount = (): number => {
    let count = 0;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 5000000) count++;
    if (filters.propertyTypes.length > 0) count++;
    if (filters.districts.length > 0) count++;
    if (filters.bedrooms !== null) count++;
    if (filters.bathrooms !== null) count++;
    if (filters.areaRange[0] > 0 || filters.areaRange[1] < 1000) count++;
    if (Object.values(filters.amenities).some((v) => v)) count++;
    if (filters.energyCertificate) count++;
    if (filters.typology) count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros Avançados
            </CardTitle>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary">{activeFiltersCount}</Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="h-8 px-2 text-xs"
              >
                Limpar Tudo
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Ocultar' : 'Mostrar'}
            </Button>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-6">
          {/* Price Range */}
          <div className="space-y-3">
            <Label>
              Preço: €{filters.priceRange[0].toLocaleString()} - €
              {filters.priceRange[1].toLocaleString()}
            </Label>
            <Slider
              min={0}
              max={5000000}
              step={50000}
              value={filters.priceRange}
              onValueChange={(value) => updateFilter('priceRange', value as [number, number])}
              className="w-full"
            />
          </div>

          {/* Property Types */}
          <div className="space-y-3">
            <Label>Tipo de Imóvel</Label>
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'apartment' as PropertyType, label: 'Apartamento' },
                { value: 'house' as PropertyType, label: 'Moradia' },
                { value: 'condo' as PropertyType, label: 'Condomínio' },
                { value: 'land' as PropertyType, label: 'Terreno' },
                { value: 'commercial' as PropertyType, label: 'Comercial' },
              ].map((type) => (
                <Button
                  key={type.value}
                  variant={filters.propertyTypes.includes(type.value) ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => togglePropertyType(type.value)}
                >
                  {type.label}
                  {filters.propertyTypes.includes(type.value) && (
                    <X className="ml-1 h-3 w-3" />
                  )}
                </Button>
              ))}
            </div>
          </div>

          {/* Districts */}
          <div className="space-y-3">
            <Label>Distrito</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-48 overflow-y-auto">
              {DISTRITOS_PT.map((district) => (
                <div key={district} className="flex items-center space-x-2">
                  <Checkbox
                    id={`district-${district}`}
                    checked={filters.districts.includes(district)}
                    onCheckedChange={() => toggleDistrict(district)}
                  />
                  <label
                    htmlFor={`district-${district}`}
                    className="text-sm cursor-pointer"
                  >
                    {district}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Typology */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tipologia</Label>
              <Select
                value={filters.typology || ''}
                onValueChange={(value) =>
                  updateFilter('typology', value || null)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas</SelectItem>
                  {['T0', 'T1', 'T2', 'T3', 'T4', 'T5', 'T6+', 'Loft', 'Duplex'].map(
                    (t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Energy Certificate */}
            <div className="space-y-2">
              <Label>Certificado Energético</Label>
              <Select
                value={filters.energyCertificate || ''}
                onValueChange={(value) =>
                  updateFilter('energyCertificate', value || null)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  {['A+', 'A', 'B', 'B-', 'C', 'D', 'E', 'F'].map((cert) => (
                    <SelectItem key={cert} value={cert}>
                      {cert}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Bedrooms & Bathrooms */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Quartos</Label>
              <Select
                value={filters.bedrooms?.toString() || ''}
                onValueChange={(value) =>
                  updateFilter('bedrooms', value ? Number(value) : null)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Qualquer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Qualquer</SelectItem>
                  <SelectItem value="1">1+</SelectItem>
                  <SelectItem value="2">2+</SelectItem>
                  <SelectItem value="3">3+</SelectItem>
                  <SelectItem value="4">4+</SelectItem>
                  <SelectItem value="5">5+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Casas de Banho</Label>
              <Select
                value={filters.bathrooms?.toString() || ''}
                onValueChange={(value) =>
                  updateFilter('bathrooms', value ? Number(value) : null)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Qualquer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Qualquer</SelectItem>
                  <SelectItem value="1">1+</SelectItem>
                  <SelectItem value="2">2+</SelectItem>
                  <SelectItem value="3">3+</SelectItem>
                  <SelectItem value="4">4+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Area Range */}
          <div className="space-y-3">
            <Label>
              Área: {filters.areaRange[0]}m² - {filters.areaRange[1]}m²
            </Label>
            <Slider
              min={0}
              max={1000}
              step={10}
              value={filters.areaRange}
              onValueChange={(value) => updateFilter('areaRange', value as [number, number])}
              className="w-full"
            />
          </div>

          {/* Amenities */}
          <div className="space-y-3">
            <Label>Comodidades</Label>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="amenity-pool"
                  checked={filters.amenities.pool}
                  onCheckedChange={() => toggleAmenity('pool')}
                />
                <label htmlFor="amenity-pool" className="text-sm cursor-pointer">
                  Piscina
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="amenity-garage"
                  checked={filters.amenities.garage}
                  onCheckedChange={() => toggleAmenity('garage')}
                />
                <label htmlFor="amenity-garage" className="text-sm cursor-pointer">
                  Garagem
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="amenity-elevator"
                  checked={filters.amenities.elevator}
                  onCheckedChange={() => toggleAmenity('elevator')}
                />
                <label htmlFor="amenity-elevator" className="text-sm cursor-pointer">
                  Elevador
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="amenity-ac"
                  checked={filters.amenities.airConditioning}
                  onCheckedChange={() => toggleAmenity('airConditioning')}
                />
                <label htmlFor="amenity-ac" className="text-sm cursor-pointer">
                  Ar Condicionado
                </label>
              </div>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
