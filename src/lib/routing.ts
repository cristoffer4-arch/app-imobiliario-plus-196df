// Routing utilities for calculating routes between properties
import { PropertyLocation } from './maps'

export interface RouteStep {
  instruction: string
  distance: number
  duration: number
}

export interface Route {
  distance: number
  duration: number
  steps: RouteStep[]
  geometry: Array<[number, number]>
}

/**
 * Calculate route between two points using OSRM (Open Source Routing Machine)
 */
export async function calculateRoute(
  from: { lat: number; lng: number },
  to: { lat: number; lng: number },
  mode: 'driving' | 'walking' | 'cycling' = 'driving'
): Promise<{ success: boolean; route?: Route; error?: string }> {
  try {
    const response = await fetch(
      `https://router.project-osrm.org/route/v1/${mode}/${from.lng},${from.lat};${to.lng},${to.lat}?overview=full&steps=true`
    )

    if (!response.ok) {
      throw new Error('Failed to calculate route')
    }

    const data = await response.json()

    if (!data.routes || data.routes.length === 0) {
      throw new Error('No route found')
    }

    const osrmRoute = data.routes[0]

    const route: Route = {
      distance: osrmRoute.distance,
      duration: osrmRoute.duration,
      steps: osrmRoute.legs[0].steps.map((step: any) => ({
        instruction: step.maneuver.instruction || '',
        distance: step.distance,
        duration: step.duration
      })),
      geometry: decodePolyline(osrmRoute.geometry)
    }

    return { success: true, route }
  } catch (error) {
    console.error('Error calculating route:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to calculate route'
    }
  }
}

/**
 * Calculate routes from one point to multiple properties
 */
export async function calculateRoutesToProperties(
  from: { lat: number; lng: number },
  properties: PropertyLocation[],
  mode: 'driving' | 'walking' | 'cycling' = 'driving'
): Promise<Array<{ propertyId: string; route: Route | null }>> {
  const results = await Promise.all(
    properties.map(async (property) => {
      const result = await calculateRoute(
        from,
        { lat: property.latitude, lng: property.longitude },
        mode
      )

      return {
        propertyId: property.id,
        route: result.success ? result.route! : null
      }
    })
  )

  return results
}

/**
 * Format duration for display
 */
export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${Math.round(seconds)}s`
  }

  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) {
    return `${minutes}min`
  }

  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  return `${hours}h ${remainingMinutes}min`
}

/**
 * Format route distance
 */
export function formatRouteDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)} m`
  }
  return `${(meters / 1000).toFixed(1)} km`
}

/**
 * Decode polyline geometry (OSRM uses encoded polylines)
 */
function decodePolyline(encoded: string): Array<[number, number]> {
  const coordinates: Array<[number, number]> = []
  let index = 0
  let lat = 0
  let lng = 0

  while (index < encoded.length) {
    let b
    let shift = 0
    let result = 0

    do {
      b = encoded.charCodeAt(index++) - 63
      result |= (b & 0x1f) << shift
      shift += 5
    } while (b >= 0x20)

    const dlat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1
    lat += dlat

    shift = 0
    result = 0

    do {
      b = encoded.charCodeAt(index++) - 63
      result |= (b & 0x1f) << shift
      shift += 5
    } while (b >= 0x20)

    const dlng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1
    lng += dlng

    coordinates.push([lat / 1e5, lng / 1e5])
  }

  return coordinates
}

/**
 * Get user's current location
 */
export function getUserLocation(): Promise<{ lat: number; lng: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        })
      },
      (error) => {
        reject(error)
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    )
  })
}

/**
 * Open navigation in external app (Google Maps, Apple Maps)
 */
export function openExternalNavigation(
  to: { lat: number; lng: number },
  propertyTitle?: string
) {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
  const label = propertyTitle ? encodeURIComponent(propertyTitle) : 'Property'

  const url = isIOS
    ? `maps://maps.apple.com/?daddr=${to.lat},${to.lng}&dirflg=d`
    : `https://www.google.com/maps/dir/?api=1&destination=${to.lat},${to.lng}&destination_label=${label}`

  window.open(url, '_blank')
}
