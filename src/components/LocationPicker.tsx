'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { MapPin, Search, Loader2 } from 'lucide-react';
import { initializeLeaflet } from '@/lib/leaflet-utils';

interface LocationPickerProps {
  address?: string;
  latitude?: number;
  longitude?: number;
  onLocationChange: (location: {
    latitude: number;
    longitude: number;
    address?: string;
  }) => void;
  className?: string;
}

export default function LocationPicker({
  address = '',
  latitude,
  longitude,
  onLocationChange,
  className = '',
}: LocationPickerProps) {
  const [map, setMap] = useState<any>(null);
  const [L, setL] = useState<any>(null);
  const [marker, setMarker] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState(address);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  // Default center (Lisbon)
  const defaultCenter = { lat: 38.7223, lng: -9.1393 };
  const currentCenter = latitude && longitude ? { lat: latitude, lng: longitude } : defaultCenter;

  // Load Leaflet
  useEffect(() => {
    if (typeof window === 'undefined') return;

    initializeLeaflet().then((leaflet) => {
      setL(leaflet);
    }).catch((error) => {
      console.error('Error loading Leaflet:', error);
    });
  }, []);

  // Initialize map
  useEffect(() => {
    if (!L || !mapRef.current || map) return;

    const mapInstance = L.map(mapRef.current).setView(
      [currentCenter.lat, currentCenter.lng],
      latitude && longitude ? 15 : 12
    );

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(mapInstance);

    // Add click handler
    mapInstance.on('click', (e: any) => {
      const { lat, lng } = e.latlng;
      updateMarker(lat, lng);
      reverseGeocode(lat, lng);
    });

    setMap(mapInstance);

    return () => {
      mapInstance.remove();
    };
  }, [L, currentCenter.lat, currentCenter.lng]);

  // Add or update marker
  const updateMarker = useCallback(
    (lat: number, lng: number) => {
      if (!map || !L) return;

      if (marker) {
        marker.setLatLng([lat, lng]);
      } else {
        const newMarker = L.marker([lat, lng], {
          draggable: true,
        })
          .addTo(map)
          .bindPopup('Arraste para ajustar a localização');

        newMarker.on('dragend', (e: any) => {
          const { lat, lng } = e.target.getLatLng();
          onLocationChange({ latitude: lat, longitude: lng });
          reverseGeocode(lat, lng);
        });

        setMarker(newMarker);
      }

      map.setView([lat, lng], 15);
      onLocationChange({ latitude: lat, longitude: lng });
    },
    [map, L, marker, onLocationChange]
  );

  // Initial marker placement
  useEffect(() => {
    if (latitude && longitude && map && L) {
      updateMarker(latitude, longitude);
    }
  }, [latitude, longitude, map, L]);

  // Geocode address to coordinates
  const geocodeAddress = async (query: string) => {
    if (!query.trim()) return;

    setIsSearching(true);
    setSearchError(null);

    try {
      // Using Nominatim (OpenStreetMap) geocoding service
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&countrycodes=pt&limit=1`
      );

      if (!response.ok) throw new Error('Falha na pesquisa');

      const data = await response.json();

      if (data.length === 0) {
        setSearchError('Endereço não encontrado');
        return;
      }

      const result = data[0];
      const lat = parseFloat(result.lat);
      const lng = parseFloat(result.lon);

      updateMarker(lat, lng);
      onLocationChange({
        latitude: lat,
        longitude: lng,
        address: result.display_name,
      });
    } catch (error) {
      console.error('Geocoding error:', error);
      setSearchError('Erro ao pesquisar endereço');
    } finally {
      setIsSearching(false);
    }
  };

  // Reverse geocode coordinates to address
  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );

      if (!response.ok) throw new Error('Falha na pesquisa reversa');

      const data = await response.json();

      if (data.display_name) {
        setSearchQuery(data.display_name);
        onLocationChange({
          latitude: lat,
          longitude: lng,
          address: data.display_name,
        });
      }
    } catch (error) {
      console.error('Reverse geocoding error:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear existing timeout
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    
    // Debounce the search
    const timeout = setTimeout(() => {
      geocodeAddress(searchQuery);
    }, 300);
    
    setDebounceTimeout(timeout);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }
    };
  }, [debounceTimeout]);

  return (
    <div className={`space-y-4 ${className}`}>
      <div>
        <Label htmlFor="location-search">Localização</Label>
        <form onSubmit={handleSearch} className="flex gap-2 mt-2">
          <Input
            id="location-search"
            type="text"
            placeholder="Pesquisar endereço..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={isSearching}>
            {isSearching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </form>
        {searchError && (
          <p className="text-sm text-red-600 mt-1">{searchError}</p>
        )}
      </div>

      <Card className="p-4">
        <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
          <MapPin className="h-4 w-4" />
          <span>Clique no mapa ou arraste o marcador para selecionar a localização</span>
        </div>
        <div ref={mapRef} className="w-full h-[300px] rounded-lg overflow-hidden" />
        {latitude && longitude && (
          <div className="mt-3 text-xs text-gray-500">
            Coordenadas: {latitude.toFixed(6)}, {longitude.toFixed(6)}
          </div>
        )}
      </Card>
    </div>
  );
}
