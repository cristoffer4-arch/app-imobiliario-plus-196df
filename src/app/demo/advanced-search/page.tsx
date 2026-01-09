'use client';

import { useState, useEffect } from 'react';
import PropertyFiltersAdvanced, { AdvancedFilters } from '@/components/PropertyFiltersAdvanced';
import PropertyMapInteractive from '@/components/PropertyMapInteractive';
import PropertyCard from '@/components/PropertyCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapBounds, PropertyLocation } from '@/lib/maps';

// Sample data for demonstration
const SAMPLE_PROPERTIES: PropertyLocation[] = [
  {
    id: '1',
    title: 'Apartamento T3 em Lisboa',
    price: 350000,
    latitude: 38.7223,
    longitude: -9.1393,
  },
  {
    id: '2',
    title: 'Moradia T4 em Cascais',
    price: 650000,
    latitude: 38.6979,
    longitude: -9.4214,
  },
  {
    id: '3',
    title: 'Apartamento T2 no Porto',
    price: 250000,
    latitude: 41.1579,
    longitude: -8.6291,
  },
  {
    id: '4',
    title: 'Condomínio T3 em Sintra',
    price: 450000,
    latitude: 38.8029,
    longitude: -9.3817,
  },
  {
    id: '5',
    title: 'Casa de Campo T5 no Algarve',
    price: 850000,
    latitude: 37.0179,
    longitude: -7.9304,
  },
];

export default function AdvancedSearchDemo() {
  const [filters, setFilters] = useState<AdvancedFilters | null>(null);
  const [filteredProperties, setFilteredProperties] = useState<PropertyLocation[]>(SAMPLE_PROPERTIES);
  const [mapBounds, setMapBounds] = useState<MapBounds | null>(null);
  const [viewMode, setViewMode] = useState<'map' | 'list' | 'both'>('both');

  // Apply filters
  useEffect(() => {
    if (!filters) return;

    let filtered = [...SAMPLE_PROPERTIES];

    // Filter by price range
    filtered = filtered.filter(
      (p) => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    );

    // Filter by map bounds if available
    if (mapBounds) {
      filtered = filtered.filter(
        (p) =>
          p.latitude >= mapBounds.southWest.lat &&
          p.latitude <= mapBounds.northEast.lat &&
          p.longitude >= mapBounds.southWest.lng &&
          p.longitude <= mapBounds.northEast.lng
      );
    }

    setFilteredProperties(filtered);
  }, [filters, mapBounds]);

  const handleFilterChange = (newFilters: AdvancedFilters) => {
    setFilters(newFilters);
  };

  const handlePropertyClick = (propertyId: string) => {
    console.log('Property clicked:', propertyId);
    // Navigate to property details page
    window.location.href = `/properties/${propertyId}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Pesquisa Avançada</h1>
            <p className="text-gray-600 mt-1">
              Demonstração de filtros avançados e mapa interativo
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'map' ? 'default' : 'outline'}
              onClick={() => setViewMode('map')}
            >
              Mapa
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              onClick={() => setViewMode('list')}
            >
              Lista
            </Button>
            <Button
              variant={viewMode === 'both' ? 'default' : 'outline'}
              onClick={() => setViewMode('both')}
            >
              Ambos
            </Button>
          </div>
        </div>

        {/* Filters */}
        <PropertyFiltersAdvanced onFilterChange={handleFilterChange} />

        {/* Results */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Map View */}
          {(viewMode === 'map' || viewMode === 'both') && (
            <Card className={viewMode === 'map' ? 'lg:col-span-2' : ''}>
              <CardHeader>
                <CardTitle>
                  Mapa Interativo ({filteredProperties.length} imóveis)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PropertyMapInteractive
                  properties={filteredProperties}
                  onPropertyClick={handlePropertyClick}
                  onBoundsChange={setMapBounds}
                  enableClustering={true}
                  showControls={true}
                  className="h-[600px]"
                />
              </CardContent>
            </Card>
          )}

          {/* List View */}
          {(viewMode === 'list' || viewMode === 'both') && (
            <Card className={viewMode === 'list' ? 'lg:col-span-2' : ''}>
              <CardHeader>
                <CardTitle>Resultados ({filteredProperties.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {filteredProperties.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">
                      Nenhum imóvel encontrado com os filtros selecionados
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[600px] overflow-y-auto">
                    {filteredProperties.map((property) => (
                      <div
                        key={property.id}
                        className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => handlePropertyClick(property.id)}
                      >
                        <h3 className="font-semibold text-lg">{property.title}</h3>
                        <p className="text-2xl font-bold text-blue-600 mt-2">
                          €{property.price.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {property.latitude.toFixed(4)}, {property.longitude.toFixed(4)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Como usar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-gray-600">
            <p>
              <strong>Filtros Avançados:</strong> Use os controles deslizantes e seletores para
              refinar sua pesquisa. Os filtros são salvos automaticamente no navegador.
            </p>
            <p>
              <strong>Mapa Interativo:</strong> Clique nos marcadores para ver detalhes. Use os
              controles de zoom e alterne entre visualizações de rua, satélite e terreno.
            </p>
            <p>
              <strong>Agrupamento:</strong> Quando vários imóveis estão próximos, eles são
              agrupados em círculos numerados. Clique para ampliar.
            </p>
            <p>
              <strong>Filtro por Área:</strong> Mova o mapa e os resultados serão filtrados
              automaticamente para mostrar apenas os imóveis visíveis.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
