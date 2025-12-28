// Saved areas functionality - save and manage drawn map areas
import { createClient } from '@/lib/supabase'

export interface SavedArea {
  id: string
  userId: string
  name: string
  description?: string
  geometry: {
    type: 'polygon' | 'circle' | 'rectangle'
    coordinates: Array<[number, number]>
    center?: { lat: number; lng: number }
    radius?: number
  }
  filters?: {
    minPrice?: number
    maxPrice?: number
    propertyType?: string
  }
  propertyCount?: number
  createdAt: string
  updatedAt: string
}

/**
 * Save a drawn area
 */
export async function saveArea(
  userId: string,
  area: Omit<SavedArea, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
): Promise<{ success: boolean; areaId?: string; error?: string }> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('saved_areas')
      .insert({
        user_id: userId,
        name: area.name,
        description: area.description,
        geometry: area.geometry,
        filters: area.filters,
        property_count: area.propertyCount,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error

    return { success: true, areaId: data.id }
  } catch (error) {
    console.error('Error saving area:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to save area'
    }
  }
}

/**
 * Get all saved areas for a user
 */
export async function getSavedAreas(
  userId: string
): Promise<{ success: boolean; areas?: SavedArea[]; error?: string }> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('saved_areas')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })

    if (error) throw error

    const areas: SavedArea[] = data.map(item => ({
      id: item.id,
      userId: item.user_id,
      name: item.name,
      description: item.description,
      geometry: item.geometry,
      filters: item.filters,
      propertyCount: item.property_count,
      createdAt: item.created_at,
      updatedAt: item.updated_at
    }))

    return { success: true, areas }
  } catch (error) {
    console.error('Error getting saved areas:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get areas'
    }
  }
}

/**
 * Delete a saved area
 */
export async function deleteSavedArea(
  areaId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient()

    const { error } = await supabase
      .from('saved_areas')
      .delete()
      .eq('id', areaId)

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error('Error deleting area:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete area'
    }
  }
}

/**
 * Update saved area
 */
export async function updateSavedArea(
  areaId: string,
  updates: Partial<Pick<SavedArea, 'name' | 'description' | 'filters' | 'propertyCount'>>
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient()

    const { error } = await supabase
      .from('saved_areas')
      .update({
        ...updates,
        property_count: updates.propertyCount,
        updated_at: new Date().toISOString()
      })
      .eq('id', areaId)

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error('Error updating area:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update area'
    }
  }
}

/**
 * Check if point is inside saved area
 */
export function isPointInArea(
  point: { lat: number; lng: number },
  area: SavedArea
): boolean {
  if (area.geometry.type === 'circle' && area.geometry.center && area.geometry.radius) {
    const distance = calculateDistance(
      point.lat,
      point.lng,
      area.geometry.center.lat,
      area.geometry.center.lng
    )
    return distance <= area.geometry.radius
  }

  // Polygon ray casting algorithm
  const polygon = area.geometry.coordinates
  let inside = false

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0], yi = polygon[i][1]
    const xj = polygon[j][0], yj = polygon[j][1]

    const intersect = ((yi > point.lat) !== (yj > point.lat))
      && (point.lng < (xj - xi) * (point.lat - yi) / (yj - yi) + xi)

    if (intersect) inside = !inside
  }

  return inside
}

function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3
  const φ1 = (lat1 * Math.PI) / 180
  const φ2 = (lat2 * Math.PI) / 180
  const Δφ = ((lat2 - lat1) * Math.PI) / 180
  const Δλ = ((lon2 - lon1) * Math.PI) / 180

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c
}
