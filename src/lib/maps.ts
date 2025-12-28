// Maps utilities for geospatial queries with Supabase + PostGIS
import { createClient } from '@/lib/supabase'

export interface PropertyLocation {
  id: string
  title: string
  price: number
  latitude: number
  longitude: number
  distance?: number
}

export interface MapBounds {
  northEast: { lat: number; lng: number }
  southWest: { lat: number; lng: number }
}

/**
 * Find properties within a radius from a point
 */
export async function getPropertiesWithinRadius(
  latitude: number,
  longitude: number,
  radiusMeters: number = 5000
): Promise<{ success: boolean; properties?: PropertyLocation[]; error?: string }> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase.rpc('properties_within_radius', {
      p_latitude: latitude,
      p_longitude: longitude,
      p_radius_meters: radiusMeters
    })

    if (error) throw error

    const properties: PropertyLocation[] = data.map((item: any) => ({
      id: item.id,
      title: item.title,
      price: item.price,
      latitude: item.latitude,
      longitude: item.longitude,
      distance: item.distance_meters
    }))

    return { success: true, properties }
  } catch (error) {
    console.error('Error finding properties within radius:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to find properties'
    }
  }
}

/**
 * Find properties within map bounds
 */
export async function getPropertiesInBounds(
  bounds: MapBounds
): Promise<{ success: boolean; properties?: PropertyLocation[]; error?: string }> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('properties')
      .select('id, title, price, latitude, longitude')
      .gte('latitude', bounds.southWest.lat)
      .lte('latitude', bounds.northEast.lat)
      .gte('longitude', bounds.southWest.lng)
      .lte('longitude', bounds.northEast.lng)
      .not('latitude', 'is', null)
      .not('longitude', 'is', null)

    if (error) throw error

    const properties: PropertyLocation[] = data

    return { success: true, properties }
  } catch (error) {
    console.error('Error finding properties in bounds:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to find properties'
    }
  }
}

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3 // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180
  const φ2 = (lat2 * Math.PI) / 180
  const Δφ = ((lat2 - lat1) * Math.PI) / 180
  const Δλ = ((lon2 - lon1) * Math.PI) / 180

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c // Distance in meters
}

/**
 * Format distance for display
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} m`
  }
  return `${(meters / 1000).toFixed(1)} km`
}

/**
 * Get center point of multiple coordinates
 */
export function getCenterPoint(
  coordinates: Array<{ lat: number; lng: number }>
): { lat: number; lng: number } {
  if (coordinates.length === 0) {
    return { lat: 0, lng: 0 }
  }

  const sum = coordinates.reduce(
    (acc, coord) => ({
      lat: acc.lat + coord.lat,
      lng: acc.lng + coord.lng
    }),
    { lat: 0, lng: 0 }
  )

  return {
    lat: sum.lat / coordinates.length,
    lng: sum.lng / coordinates.length
  }
}

/**
 * Default locations for Portugal
 */
export const DEFAULT_LOCATIONS = {
  lisbon: { lat: 38.7223, lng: -9.1393, name: 'Lisboa' },
  porto: { lat: 41.1579, lng: -8.6291, name: 'Porto' },
  algarve: { lat: 37.0179, lng: -7.9304, name: 'Algarve' },
  cascais: { lat: 38.6979, lng: -9.4214, name: 'Cascais' },
  sintra: { lat: 38.8029, lng: -9.3817, name: 'Sintra' }
}
