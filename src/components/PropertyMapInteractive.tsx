'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MapPin, Layers, ZoomIn, ZoomOut, Search, X } from 'lucide-react';
import type { PropertyLocation, MapBounds } from '@/lib/maps';

interface PropertyMapInteractiveProps {
  properties: PropertyLocation[];
  center?: { lat: number; lng: number };
  zoom?: number;
  onPropertyClick?: (propertyId: string) => void;
  onBoundsChange?: (bounds: MapBounds) => void;
  enableDrawing?: boolean;
  enableClustering?: boolean;
  showControls?: boolean;
  className?: string;
}

export default function PropertyMapInteractive({
  properties,
  center = { lat: 38.7223, lng: -9.1393 }, // Lisbon default
  zoom = 12,
  onPropertyClick,
  onBoundsChange,
  enableDrawing = false,
  enableClustering = true,
  showControls = true,
  className = '',
}: PropertyMapInteractiveProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [L, setL] = useState<any>(null);
  const [markerCluster, setMarkerCluster] = useState<any>(null);
  const [currentLayer, setCurrentLayer] = useState<string>('streets');
  const [isLoading, setIsLoading] = useState(true);
  const [drawnLayer, setDrawnLayer] = useState<any>(null);
  const markersRef = useRef<any[]>([]);
  const clusterGroupRef = useRef<any>(null);

  // Load Leaflet and MarkerCluster
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const loadLeaflet = async () => {
      try {
        // Load Leaflet
        const leaflet = await import('leaflet');
        const L = leaflet.default;

        // Load MarkerCluster if enabled
        let MarkerClusterGroup = null;
        if (enableClustering) {
          const clusterModule = await import('leaflet.markercluster');
          MarkerClusterGroup = (clusterModule as any).default;
        }

        // Load Leaflet CSS
        if (!document.querySelector('link[href*="leaflet.css"]')) {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          document.head.appendChild(link);
        }

        // Load MarkerCluster CSS
        if (enableClustering && !document.querySelector('link[href*="MarkerCluster.css"]')) {
          const clusterLink = document.createElement('link');
          clusterLink.rel = 'stylesheet';
          clusterLink.href =
            'https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css';
          document.head.appendChild(clusterLink);

          const clusterDefaultLink = document.createElement('link');
          clusterDefaultLink.rel = 'stylesheet';
          clusterDefaultLink.href =
            'https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css';
          document.head.appendChild(clusterDefaultLink);
        }

        // Fix marker icons
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        });

        setL(L);
        setMarkerCluster(MarkerClusterGroup);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading Leaflet:', error);
        setIsLoading(false);
      }
    };

    loadLeaflet();
  }, [enableClustering]);

  // Initialize map
  useEffect(() => {
    if (!L || !mapRef.current || map) return;

    const mapInstance = L.map(mapRef.current, {
      zoomControl: false, // We'll add custom controls
    }).setView([center.lat, center.lng], zoom);

    // Add tile layers
    const tileLayers: Record<string, any> = {
      streets: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }),
      satellite: L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
          attribution: '© Esri',
          maxZoom: 19,
        }
      ),
      terrain: L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenTopoMap contributors',
        maxZoom: 17,
      }),
    };

    tileLayers[currentLayer].addTo(mapInstance);

    // Store tile layers for switching
    (mapInstance as any).tileLayers = tileLayers;

    // Add bounds change listener
    if (onBoundsChange) {
      mapInstance.on('moveend', () => {
        const bounds = mapInstance.getBounds();
        onBoundsChange({
          northEast: {
            lat: bounds.getNorthEast().lat,
            lng: bounds.getNorthEast().lng,
          },
          southWest: {
            lat: bounds.getSouthWest().lat,
            lng: bounds.getSouthWest().lng,
          },
        });
      });
    }

    setMap(mapInstance);

    return () => {
      mapInstance.remove();
    };
  }, [L, center.lat, center.lng, zoom, currentLayer]);

  // Update markers when properties change
  useEffect(() => {
    if (!map || !L || !properties.length) return;

    // Clear existing markers
    if (clusterGroupRef.current) {
      map.removeLayer(clusterGroupRef.current);
      clusterGroupRef.current = null;
    }
    markersRef.current.forEach((marker) => map.removeLayer(marker));
    markersRef.current = [];

    // Custom icon for property markers
    const propertyIcon = L.divIcon({
      className: 'custom-property-marker',
      html: `
        <div class="relative">
          <div class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
            <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });

    const markers: any[] = [];

    properties.forEach((property) => {
      if (!property.latitude || !property.longitude) return;

      const marker = L.marker([property.latitude, property.longitude], {
        icon: propertyIcon,
      });

      // Create popup content
      const popupContent = `
        <div class="property-popup" style="min-width: 200px;">
          <h3 class="font-semibold text-sm mb-1">${property.title}</h3>
          <p class="text-lg font-bold text-blue-600 mb-2">€${property.price.toLocaleString()}</p>
          ${
            property.distance
              ? `<p class="text-xs text-gray-500">${(property.distance / 1000).toFixed(1)} km</p>`
              : ''
          }
          <button 
            class="mt-2 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 w-full"
            onclick="window.dispatchEvent(new CustomEvent('property-click', { detail: '${property.id}' }))"
          >
            Ver Detalhes
          </button>
        </div>
      `;

      marker.bindPopup(popupContent, {
        maxWidth: 250,
        className: 'custom-popup',
      });

      markers.push(marker);
    });

    // Add markers with clustering if enabled
    if (enableClustering && markerCluster) {
      const clusterGroup = markerCluster.markerClusterGroup({
        maxClusterRadius: 50,
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true,
        iconCreateFunction: (cluster: any) => {
          const count = cluster.getChildCount();
          let size = 'small';
          if (count > 10) size = 'medium';
          if (count > 50) size = 'large';

          return L.divIcon({
            html: `<div class="cluster-icon cluster-${size}"><span>${count}</span></div>`,
            className: 'custom-cluster-icon',
            iconSize: L.point(40, 40),
          });
        },
      });

      markers.forEach((marker) => clusterGroup.addLayer(marker));
      map.addLayer(clusterGroup);
      clusterGroupRef.current = clusterGroup;

      // Fit bounds to show all markers
      if (markers.length > 0) {
        map.fitBounds(clusterGroup.getBounds(), { padding: [50, 50] });
      }
    } else {
      // Add markers without clustering
      markers.forEach((marker) => {
        marker.addTo(map);
        markersRef.current.push(marker);
      });

      // Fit bounds to show all markers
      if (markers.length > 0) {
        const group = L.featureGroup(markers);
        map.fitBounds(group.getBounds(), { padding: [50, 50] });
      }
    }
  }, [map, L, properties, enableClustering, markerCluster]);

  // Handle property click events
  useEffect(() => {
    if (!onPropertyClick) return;

    const handlePropertyClick = (e: any) => {
      onPropertyClick(e.detail);
    };

    window.addEventListener('property-click', handlePropertyClick);
    return () => window.removeEventListener('property-click', handlePropertyClick);
  }, [onPropertyClick]);

  const handleLayerChange = useCallback(
    (newLayer: string) => {
      if (!map || !L) return;

      const tileLayers = (map as any).tileLayers;
      if (!tileLayers) return;

      // Remove current layer
      map.eachLayer((layer: any) => {
        if (layer instanceof L.TileLayer) {
          map.removeLayer(layer);
        }
      });

      // Add new layer
      tileLayers[newLayer].addTo(map);
      setCurrentLayer(newLayer);
    },
    [map, L]
  );

  const handleZoomIn = useCallback(() => {
    if (map) map.zoomIn();
  }, [map]);

  const handleZoomOut = useCallback(() => {
    if (map) map.zoomOut();
  }, [map]);

  const handleResetView = useCallback(() => {
    if (map) {
      map.setView([center.lat, center.lng], zoom);
    }
  }, [map, center, zoom]);

  if (isLoading) {
    return (
      <div className={`relative w-full h-full min-h-[400px] bg-gray-100 rounded-lg ${className}`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-sm text-gray-600">Carregando mapa...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full min-h-[400px] rounded-lg overflow-hidden ${className}`}>
      <div ref={mapRef} className="w-full h-full" />

      {/* Custom Controls */}
      {showControls && (
        <>
          {/* Layer Switcher */}
          <div className="absolute top-4 right-4 z-[1000]">
            <Card className="p-2 shadow-lg">
              <Select value={currentLayer} onValueChange={handleLayerChange}>
                <SelectTrigger className="w-[140px] h-9">
                  <Layers className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="streets">Ruas</SelectItem>
                  <SelectItem value="satellite">Satélite</SelectItem>
                  <SelectItem value="terrain">Terreno</SelectItem>
                </SelectContent>
              </Select>
            </Card>
          </div>

          {/* Zoom Controls */}
          <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleZoomIn}
              className="bg-white shadow-lg"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleZoomOut}
              className="bg-white shadow-lg"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleResetView}
              className="bg-white shadow-lg"
              title="Redefinir visualização"
            >
              <MapPin className="h-4 w-4" />
            </Button>
          </div>

          {/* Property Count Badge */}
          {properties.length > 0 && (
            <div className="absolute bottom-4 left-4 z-[1000]">
              <Badge variant="secondary" className="bg-white shadow-lg px-3 py-2 text-sm">
                <MapPin className="h-4 w-4 mr-2" />
                {properties.length} {properties.length === 1 ? 'Imóvel' : 'Imóveis'}
              </Badge>
            </div>
          )}
        </>
      )}

      {/* Add custom styles */}
      <style jsx global>{`
        .custom-property-marker {
          background: transparent;
          border: none;
        }
        
        .custom-cluster-icon {
          background: transparent;
          border: none;
        }
        
        .cluster-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          color: white;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }
        
        .cluster-small {
          background: #2563eb;
          font-size: 12px;
        }
        
        .cluster-medium {
          background: #dc2626;
          font-size: 14px;
        }
        
        .cluster-large {
          background: #7c3aed;
          font-size: 16px;
        }
        
        .custom-popup .leaflet-popup-content-wrapper {
          border-radius: 8px;
          padding: 0;
        }
        
        .custom-popup .leaflet-popup-content {
          margin: 12px;
        }
      `}</style>
    </div>
  );
}
