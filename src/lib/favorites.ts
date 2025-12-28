// Favorites system for luxury properties
import { createClient } from '@/lib/supabase'

export interface Favorite {
  id: string
  userId: string
  propertyId: string
  createdAt: string
}

/**
 * Add a property to favorites
 */
export async function addToFavorites(
  userId: string,
  propertyId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('favorites')
      .insert({
        user_id: userId,
        property_id: propertyId,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error('Error adding to favorites:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to add favorite'
    }
  }
}

/**
 * Remove a property from favorites
 */
export async function removeFromFavorites(
  userId: string,
  propertyId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient()

    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('property_id', propertyId)

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error('Error removing from favorites:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to remove favorite'
    }
  }
}

/**
 * Check if a property is in favorites
 */
export async function isFavorite(
  userId: string,
  propertyId: string
): Promise<boolean> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('property_id', propertyId)
      .single()

    if (error && error.code !== 'PGRST116') throw error

    return !!data
  } catch (error) {
    console.error('Error checking favorite:', error)
    return false
  }
}

/**
 * Get all favorites for a user
 */
export async function getUserFavorites(
  userId: string
): Promise<{ success: boolean; favorites?: Favorite[]; error?: string }> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error

    const favorites: Favorite[] = data.map(item => ({
      id: item.id,
      userId: item.user_id,
      propertyId: item.property_id,
      createdAt: item.created_at
    }))

    return { success: true, favorites }
  } catch (error) {
    console.error('Error getting favorites:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get favorites'
    }
  }
}

/**
 * Get favorite properties with full property details
 */
export async function getFavoriteProperties(userId: string) {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('favorites')
      .select(`
        id,
        created_at,
        properties (
          *
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error('Error getting favorite properties:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get favorites'
    }
  }
}

/**
 * Toggle favorite status
 */
export async function toggleFavorite(
  userId: string,
  propertyId: string
): Promise<{ success: boolean; isFavorite: boolean; error?: string }> {
  const currentlyFavorite = await isFavorite(userId, propertyId)

  if (currentlyFavorite) {
    const result = await removeFromFavorites(userId, propertyId)
    return { ...result, isFavorite: false }
  } else {
    const result = await addToFavorites(userId, propertyId)
    return { ...result, isFavorite: true }
  }
}
