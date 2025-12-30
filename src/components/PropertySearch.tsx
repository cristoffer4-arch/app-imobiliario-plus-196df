'use client';

import { useState, useEffect, useCallback } from 'react';
import { useDebounce } from '@/lib/hooks/useDebounce';
import { supabase } from '@/lib/supabase';
import { PropertyPT, TipologiaPT, CertificadoEnergetico, PropertyPTFilterParams } from '@/types/property-pt';
import { DISTRITOS_PT } from '@/types/property-pt';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import { Search, Filter, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PropertySearchProps {
  onResults?: (properties: PropertyPT[], total: number) => void;
  onLoading?: (loading: boolean) => void;
  onError?: (error: Error) => void;
  className?: string;
  autoSearch?: boolean;
  showFilters?: boolean;
}

const TIPOLOGIAS: TipologiaPT[] = ['T0', 'T1', 'T2', 'T3', 'T4', 'T5', 'T6+', 'Loft', 'Duplex'];
const CERTIFICADOS: CertificadoEnergetico[] = ['A+', 'A', 'B', 'B-', 'C', 'D', 'E', 'F'];

export default function PropertySearch({
  onResults,
  onLoading,
  onError,
  className,
  autoSearch = true,
  showFilters = true,
}: PropertySearchProps) {
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<PropertyPTFilterParams>({
    page: 1,
    limit: 12,
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);

  // Debounced search term
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Search function
  const searchProperties = useCallback(
    async (searchFilters: PropertyPTFilterParams, term: string) => {
      setIsLoading(true);
      onLoading?.(true);

      try {
        let query = supabase
          .from('properties')
          .select('*', { count: 'exact' });

        // Apply search term
        if (term) {
          query = query.or(`title.ilike.%${term}%,description.ilike.%${term}%,address.ilike.%${term}%`);
        }

        // Apply filters
        if (searchFilters.tipologia) {
          const tipologias = Array.isArray(searchFilters.tipologia)
            ? searchFilters.tipologia
            : [searchFilters.tipologia];
          query = query.in('tipologia', tipologias);
        }

        if (searchFilters.distrito) {
          const distritos = Array.isArray(searchFilters.distrito)
            ? searchFilters.distrito
            : [searchFilters.distrito];
          query = query.in('distrito', distritos);
        }

        if (searchFilters.concelho) {
          const concelhos = Array.isArray(searchFilters.concelho)
            ? searchFilters.concelho
            : [searchFilters.concelho];
          query = query.in('concelho', concelhos);
        }

        if (searchFilters.freguesia) {
          query = query.ilike('freguesia', `%${searchFilters.freguesia}%`);
        }

        if (searchFilters.certificado_energetico) {
          const certificados = Array.isArray(searchFilters.certificado_energetico)
            ? searchFilters.certificado_energetico
            : [searchFilters.certificado_energetico];
          query = query.in('certificado_energetico', certificados);
        }

        // Price range
        if (searchFilters.minPrice !== undefined) {
          query = query.gte('price', searchFilters.minPrice);
        }
        if (searchFilters.maxPrice !== undefined) {
          query = query.lte('price', searchFilters.maxPrice);
        }

        // Condomínio
        if (searchFilters.maxCondominio !== undefined) {
          query = query.lte('condominio_mensal', searchFilters.maxCondominio);
        }

        // Area range
        if (searchFilters.minArea !== undefined) {
          query = query.gte('area', searchFilters.minArea);
        }
        if (searchFilters.maxArea !== undefined) {
          query = query.lte('area', searchFilters.maxArea);
        }

        // Bedrooms
        if (searchFilters.minBedrooms !== undefined) {
          query = query.gte('bedrooms', searchFilters.minBedrooms);
        }

        // Features
        if (searchFilters.hasElevador) {
          query = query.eq('elevador', true);
        }
        if (searchFilters.hasVaranda) {
          query = query.eq('varanda', true);
        }
        if (searchFilters.hasArrecadacao) {
          query = query.eq('arrecadacao', true);
        }
        if (searchFilters.minGaragem !== undefined) {
          query = query.gte('lugar_garagem', searchFilters.minGaragem);
        }

        // Pagination
        const page = searchFilters.page || 1;
        const limit = searchFilters.limit || 12;
        const from = (page - 1) * limit;
        const to = from + limit - 1;
        query = query.range(from, to);

        // Order by
        query = query.order('created_at', { ascending: false });

        const { data, error, count } = await query;

        if (error) throw error;

        const properties = (data || []) as PropertyPT[];
        const total = count || 0;

        setTotalResults(total);
        onResults?.(properties, total);
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Erro ao buscar imóveis');
        onError?.(err);
        console.error('Search error:', error);
      } finally {
        setIsLoading(false);
        onLoading?.(false);
      }
    },
    [onResults, onLoading, onError]
  );

  // Effect for auto-search
  useEffect(() => {
    if (autoSearch) {
      searchProperties(filters, debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, filters, autoSearch, searchProperties]);

  // Update filter
  const updateFilter = <K extends keyof PropertyPTFilterParams>(
    key: K,
    value: PropertyPTFilterParams[K]
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page when filters change
    }));
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({ page: 1, limit: filters.limit });
    setSearchTerm('');
  };

  // Manual search trigger
  const handleSearch = () => {
    searchProperties(filters, searchTerm);
  };

  // Pagination
  const goToPage = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const totalPages = Math.ceil(totalResults / (filters.limit || 12));

  return (
    <div className={cn('w-full space-y-4', className)}>
      {/* Search bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Pesquisar por título, descrição, localização..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        {showFilters && (
          <Button
            variant="outline"
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
        )}
        {!autoSearch && (
          <Button onClick={handleSearch} disabled={isLoading}>
            {isLoading ? 'A pesquisar...' : 'Pesquisar'}
          </Button>
        )}
      </div>

      {/* Advanced filters */}
      {showFilters && showAdvancedFilters && (
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Filtros Avançados</h3>
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-4 w-4 mr-2" />
              Limpar
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Tipologia */}
            <div className="space-y-2">
              <Label>Tipologia</Label>
              <Select
                value={filters.tipologia as string}
                onValueChange={(value) => updateFilter('tipologia', value as TipologiaPT)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas</SelectItem>
                  {TIPOLOGIAS.map((tip) => (
                    <SelectItem key={tip} value={tip}>
                      {tip}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Distrito */}
            <div className="space-y-2">
              <Label>Distrito</Label>
              <Select
                value={filters.distrito as string}
                onValueChange={(value) => updateFilter('distrito', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  {DISTRITOS_PT.map((distrito) => (
                    <SelectItem key={distrito} value={distrito}>
                      {distrito}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Certificado Energético */}
            <div className="space-y-2">
              <Label>Certificado Energético</Label>
              <Select
                value={filters.certificado_energetico as string}
                onValueChange={(value) =>
                  updateFilter('certificado_energetico', value as CertificadoEnergetico)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  {CERTIFICADOS.map((cert) => (
                    <SelectItem key={cert} value={cert}>
                      {cert}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Price range */}
            <div className="space-y-2">
              <Label>Preço Mínimo (€)</Label>
              <Input
                type="number"
                placeholder="0"
                value={filters.minPrice || ''}
                onChange={(e) => updateFilter('minPrice', Number(e.target.value) || undefined)}
              />
            </div>

            <div className="space-y-2">
              <Label>Preço Máximo (€)</Label>
              <Input
                type="number"
                placeholder="Sem limite"
                value={filters.maxPrice || ''}
                onChange={(e) => updateFilter('maxPrice', Number(e.target.value) || undefined)}
              />
            </div>

            {/* Max Condomínio */}
            <div className="space-y-2">
              <Label>Condomínio Máximo (€)</Label>
              <Input
                type="number"
                placeholder="Sem limite"
                value={filters.maxCondominio || ''}
                onChange={(e) => updateFilter('maxCondominio', Number(e.target.value) || undefined)}
              />
            </div>

            {/* Min bedrooms */}
            <div className="space-y-2">
              <Label>Quartos Mínimos</Label>
              <Input
                type="number"
                placeholder="0"
                min="0"
                value={filters.minBedrooms || ''}
                onChange={(e) => updateFilter('minBedrooms', Number(e.target.value) || undefined)}
              />
            </div>

            {/* Min garagem */}
            <div className="space-y-2">
              <Label>Lugares de Garagem</Label>
              <Input
                type="number"
                placeholder="0"
                min="0"
                value={filters.minGaragem || ''}
                onChange={(e) => updateFilter('minGaragem', Number(e.target.value) || undefined)}
              />
            </div>
          </div>

          {/* Features checkboxes */}
          <div className="flex flex-wrap gap-4 pt-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.hasElevador || false}
                onChange={(e) => updateFilter('hasElevador', e.target.checked || undefined)}
                className="rounded"
              />
              <span className="text-sm">Com Elevador</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.hasVaranda || false}
                onChange={(e) => updateFilter('hasVaranda', e.target.checked || undefined)}
                className="rounded"
              />
              <span className="text-sm">Com Varanda</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.hasArrecadacao || false}
                onChange={(e) => updateFilter('hasArrecadacao', e.target.checked || undefined)}
                className="rounded"
              />
              <span className="text-sm">Com Arrecadação</span>
            </label>
          </div>
        </Card>
      )}

      {/* Results summary and pagination */}
      {totalResults > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {totalResults} {totalResults === 1 ? 'imóvel encontrado' : 'imóveis encontrados'}
          </p>

          {totalPages > 1 && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(filters.page! - 1)}
                disabled={filters.page === 1 || isLoading}
              >
                Anterior
              </Button>
              <span className="flex items-center px-3 text-sm">
                Página {filters.page} de {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(filters.page! + 1)}
                disabled={filters.page === totalPages || isLoading}
              >
                Próxima
              </Button>
            </div>
          )}
        </div>
      )}

      {isLoading && (
        <div className="text-center py-8 text-muted-foreground">
          A pesquisar imóveis...
        </div>
      )}
    </div>
  );
}
