'use client'

import { useEffect, useRef, useState } from 'react'
import { PropertyLocation } from '@/lib/maps'

interface MapFilters {
  minPrice?: number
  maxPrice?: number
  propertyType?: string
  radiusKm?: number
}

interface PropertyMapAdvancedProps {
  center?: { lat: number; lng: number }
  zoom?: number
  onPropertyClick?: (propertyId: string) => void
  filters?: MapFilters
}

/**
 * Advanced map component with clustering, heatmap, polygon drawing, and routing
 * Uses Leaflet with plugins: MarkerCluster, Heatmap, Draw, Routing
 */
export default function PropertyMapAdvanced({
  center = { lat: 38.7223, lng: -9.1393 },
  zoom = 12,
  onPropertyClick,
  filters = {}
}: PropertyMapAdvancedProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<any>(null)
  const [L, setL] = useState<any>(null)
  const [properties, setProperties] = useState<PropertyLocation[]>([])
  const [viewMode, setViewMode] = useState<'markers' | 'clusters' | 'heatmap'>('clusters')
  const [isDrawing, setIsDrawing] = useState(false)
  const [showRouting, setShowRouting] = useState(false)
  const markersLayerRef = useRef<any>(null)
  const heatmapLayerRef = useRef<any>(null)
  const clusterGroupRef = useRef<any>(null)
  const drawnItemsRef = useRef<any>(null)

  // Load Leaflet and plugins
  useEffect(() => {
    if (typeof window === 'undefined') return

    Promise.all([
      import('leaflet'),
      import('leaflet.markercluster'),
      import('leaflet.heat'),
      import('leaflet-draw'),
      import('leaflet-routing-machine')
    ]).then(([leaflet, cluster, heat, draw, routing]) => {
      setL(leaflet.default)

      // Load CSS
      const cssLinks = [
        'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
        'https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css',
        'https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css',
        'https://unpkg.com/leaflet-draw@1.0.4/dist/leaflet.draw.css'
      ]

      cssLinks.forEach(href => {
        if (!document.querySelector(`link[href="${href}"]`)) {
          const link = document.createElement('link')
          link.rel = 'stylesheet'
          link.href = href
          document.head.appendChild(link)
        }
      })

      // Fix marker icons
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

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(mapInstance)

    setMap(mapInstance)

    return () => {
      mapInstance.remove()
    }
  }, [L, center.lat, center.lng, zoom])

  // Fetch properties from API
  useEffect(() => {
    if (!map) return

    const fetchProperties = async () => {
      try {
        const params = new URLSearchParams({
          lat: center.lat.toString(),
          lng: center.lng.toString(),
          radiusKm: (filters.radiusKm || 5).toString()
        })

        if (filters.minPrice) params.append('minPrice', filters.minPrice.toString())
        if (filters.maxPrice) params.append('maxPrice', filters.maxPrice.toString())
        if (filters.propertyType) params.append('type', filters.propertyType)

        const response = await fetch(`/api/properties/nearby?${params}`)
        const data = await response.json()

        if (data.success) {
          setProperties(data.properties)
        }
      } catch (error) {
        console.error('Error fetching properties:', error)
      }
    }

    fetchProperties()
  }, [map, center, filters])

  // Update map layers based on view mode
  useEffect(() => {
    if (!map || !L || !properties.length) return

    // Clear existing layers
    if (markersLayerRef.current) {
      map.removeLayer(markersLayerRef.current)
      markersLayerRef.current = null
    }
    if (heatmapLayerRef.current) {
      map.removeLayer(heatmapLayerRef.current)
      heatmapLayerRef.current = null
    }
    if (clusterGroupRef.current) {
      map.removeLayer(clusterGroupRef.current)
      clusterGroupRef.current = null
    }

    if (viewMode === 'markers') {
      // Regular markers
      const markers = properties.map(property => {
        const marker = L.marker([property.latitude, property.longitude])
          .bindPopup(`
            <div class="p-2">
              <h3 class="font-semibold text-sm">${property.title}</h3>
              <p class="text-xs text-gray-600 mt-1">€${property.price.toLocaleString()}</p>
              ${property.distance ? `<p class="text-xs text-gray-500 mt-1">${(property.distance / 1000).toFixed(1)} km</p>` : ''}
            </div>
          `)

        if (onPropertyClick) {
          marker.on('click', () => onPropertyClick(property.id))
        }

        return marker
      })

      markersLayerRef.current = L.layerGroup(markers).addTo(map)

    } else if (viewMode === 'clusters') {
      // Marker clustering
      clusterGroupRef.current = (L as any).markerClusterGroup({
        chunkedLoading: true,
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true,
        maxClusterRadius: 80
      })

      properties.forEach(property => {
        const marker = L.marker([property.latitude, property.longitude])
          .bindPopup(`
            <div class="p-2">
              <h3 class="font-semibold text-sm">${property.title}</h3>
              <p class="text-xs text-gray-600 mt-1">€${property.price.toLocaleString()}</p>
              ${property.distance ? `<p class="text-xs text-gray-500 mt-1">${(property.distance / 1000).toFixed(1)} km</p>` : ''}
            </div>
          `)

        if (onPropertyClick) {
          marker.on('click', () => onPropertyClick(property.id))
        }

        clusterGroupRef.current.addLayer(marker)
      })

      map.addLayer(clusterGroupRef.current)

    } else if (viewMode === 'heatmap') {
      // Heatmap
      const heatData = properties.map(p => [
        p.latitude,
        p.longitude,
        p.price / 1000000 // Intensity based on price
      ])

      heatmapLayerRef.current = (L as any).heatLayer(heatData, {
        radius: 25,
        blur: 15,
        maxZoom: 17,
        gradient: {
          0.0: 'blue',
          0.5: 'lime',
          1.0: 'red'
        }
      }).addTo(map)
    }

    // Fit bounds
    if (properties.length > 0 && viewMode !== 'heatmap') {
      const bounds = L.latLngBounds(properties.map(p => [p.latitude, p.longitude]))
      map.fitBounds(bounds, { padding: [50, 50] })
    }
  }, [map, L, properties, viewMode, onPropertyClick])

  // Polygon drawing
  useEffect(() => {
    if (!map || !L) return

    if (!drawnItemsRef.current) {
      drawnItemsRef.current = new L.FeatureGroup()
      map.addLayer(drawnItemsRef.current)
    }

    if (isDrawing) {
      const drawControl = new (L.Control as any).Draw({
        edit: {
          featureGroup: drawnItemsRef.current
        },
        draw: {
          polygon: true,
          rectangle: true,
          circle: true,
          marker: false,
          polyline: false,
          circlemarker: false
        }
      })
      map.addControl(drawControl)

      map.on((L.Draw as any).Event.CREATED, (e: any) => {
        const layer = e.layer
        drawnItemsRef.current.addLayer(layer)

        // Get properties within drawn area
        const bounds = layer.getBounds()
        const filtered = properties.filter(p => 
          bounds.contains([p.latitude, p.longitude])
        )
        console.log('Properties in area:', filtered.length)
      })

      return () => {
        map.removeControl(drawControl)
      }
    }
  }, [map, L, isDrawing, properties])

  return (
    <div className="relative w-full h-full min-h-[600px]">
      {/* Map container */}
      <div ref={mapRef} className="w-full h-full rounded-lg" />

      {/* Controls */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4 z-[1000] space-y-2">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold text-gray-700">View Mode:</p>
          <button
            onClick={() => setViewMode('markers')}
            className={`px-3 py-1 text-xs rounded ${
              viewMode === 'markers' ? 'bg-blue-600 text-white' : 'bg-gray-100'
            }`}
          >
            Markers
          </button>
          <button
            onClick={() => setViewMode('clusters')}
            className={`px-3 py-1 text-xs rounded ${
              viewMode === 'clusters' ? 'bg-blue-600 text-white' : 'bg-gray-100'
            }`}
          >
            Clusters
          </button>
          <button
            onClick={() => setViewMode('heatmap')}
            className={`px-3 py-1 text-xs rounded ${
              viewMode === 'heatmap' ? 'bg-blue-600 text-white' : 'bg-gray-100'
            }`}
          >
            Heatmap
          </button>
        </div>

        <div className="border-t pt-2 mt-2">
          <button
            onClick={() => setIsDrawing(!isDrawing)}
            className={`w-full px-3 py-1 text-xs rounded ${
              isDrawing ? 'bg-green-600 text-white' : 'bg-gray-100'
            }`}
          >
            {isDrawing ? 'Stop Drawing' : 'Draw Area'}
          </button>
        </div>

        <div className="border-t pt-2">
          <p className="text-xs text-gray-600">
            {properties.length} properties
          </p>
        </div>
      </div>

      {/* Loading state */}
      {!map && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-sm text-gray-600">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  )
}
