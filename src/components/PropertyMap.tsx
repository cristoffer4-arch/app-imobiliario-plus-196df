'use client'

import { useEffect, useRef, useState } from 'react'
import { PropertyLocation } from '@/lib/maps'

interface PropertyMapProps {
  properties: PropertyLocation[]
  center?: { lat: number; lng: number }
  zoom?: number
  onPropertyClick?: (propertyId: string) => void
}

/**
 * Simple interactive map component using Leaflet
 * Displays properties as markers on the map
 */
export default function PropertyMap({
  properties,
  center = { lat: 38.7223, lng: -9.1393 }, // Default to Lisbon
  zoom = 12,
  onPropertyClick
}: PropertyMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<any>(null)
  const [L, setL] = useState<any>(null)

  // Load Leaflet dynamically (client-side only)
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Import Leaflet
    import('leaflet').then((leaflet) => {
      setL(leaflet.default)

      // Import Leaflet CSS
      if (!document.querySelector('link[href*="leaflet.css"]')) {
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
        document.head.appendChild(link)
      }

      // Fix Leaflet marker icons
      delete (leaflet.default.Icon.Default.prototype as any)._getIconUrl
      leaflet.default.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
      })
    })
  }, [])

  // Initialize map
  useEffect(() => {
    if (!L || !mapRef.current || map) return

    const mapInstance = L.map(mapRef.current).setView([center.lat, center.lng], zoom)

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(mapInstance)

    setMap(mapInstance)

    return () => {
      mapInstance.remove()
    }
  }, [L, center.lat, center.lng, zoom])

  // Add property markers
  useEffect(() => {
    if (!map || !L || !properties.length) return

    // Clear existing markers
    map.eachLayer((layer: any) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer)
      }
    })

    // Add markers for each property
    const markers: any[] = []
    properties.forEach((property) => {
      if (!property.latitude || !property.longitude) return

      const marker = L.marker([property.latitude, property.longitude])
        .addTo(map)
        .bindPopup(
          `
          <div class="p-2">
            <h3 class="font-semibold text-sm">${property.title}</h3>
            <p class="text-xs text-gray-600 mt-1">€${property.price.toLocaleString()}</p>
            ${property.distance ? `<p class="text-xs text-gray-500 mt-1">${(property.distance / 1000).toFixed(1)} km</p>` : ''}
          </div>
        `
        )

      // Add click handler
      if (onPropertyClick) {
        marker.on('click', () => {
          onPropertyClick(property.id)
        })
      }

      markers.push(marker)
    })

    // Fit map bounds to show all markers
    if (markers.length > 0) {
      const group = L.featureGroup(markers)
      map.fitBounds(group.getBounds(), { padding: [50, 50] })
    }
  }, [map, L, properties, onPropertyClick])

  return (
    <div className="relative w-full h-full min-h-[400px] rounded-lg overflow-hidden">
      <div ref={mapRef} className="w-full h-full" />
      
      {/* Loading state */}
      {!map && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-sm text-gray-600">Loading map...</p>
          </div>
        </div>
      )}

      {/* Property count badge */}
      {properties.length > 0 && (
        <div className="absolute top-4 right-4 bg-white px-4 py-2 rounded-lg shadow-lg z-[1000]">
          <p className="text-sm font-semibold">
            {properties.length} {properties.length === 1 ? 'Property' : 'Properties'}
          </p>
        </div>
      )}
    </div>
  )
}
