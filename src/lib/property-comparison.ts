// Property Comparison System
// Allows users to select multiple properties on the map and compare them side-by-side

import { createClient } from '@/lib/supabase/client'

export interface PropertyComparisonData {
  id: string
  title: string
  price: number
  bedrooms: number
  bathrooms: number
  area: number
  location: {
    address: string
    latitude: number
    longitude: number
  }
  images: string[]
  features: string[]
  type: string
  yearBuilt?: number
  pricePerSqm: number
}

export interface ComparisonSet {
  id: string
  userId: string
  propertyIds: string[]
  createdAt: string
  name?: string
}

/**
 * Add property to comparison list (max 4 properties)
 */
export async function addToComparison(propertyId: string): Promise<boolean> {
  const comparison = getComparisonFromStorage()
  
  if (comparison.includes(propertyId)) {
    return false // Already in comparison
  }
  
  if (comparison.length >= 4) {
    throw new Error('Maximum 4 properties can be compared at once')
  }
  
  comparison.push(propertyId)
  saveComparisonToStorage(comparison)
  return true
}

/**
 * Remove property from comparison list
 */
export function removeFromComparison(propertyId: string): void {
  const comparison = getComparisonFromStorage()
  const filtered = comparison.filter(id => id !== propertyId)
  saveComparisonToStorage(filtered)
}

/**
 * Clear all properties from comparison
 */
export function clearComparison(): void {
  saveComparisonToStorage([])
}

/**
 * Get current comparison list
 */
export function getComparisonList(): string[] {
  return getComparisonFromStorage()
}

/**
 * Check if property is in comparison
 */
export function isInComparison(propertyId: string): boolean {
  return getComparisonFromStorage().includes(propertyId)
}

/**
 * Get full property data for comparison
 */
export async function getComparisonData(): Promise<PropertyComparisonData[]> {
  const supabase = createClient()
  const propertyIds = getComparisonFromStorage()
  
  if (propertyIds.length === 0) {
    return []
  }
  
  const { data, error } = await supabase
    .from('properties')
    .select(`
      id,
      title,
      price,
      bedrooms,
      bathrooms,
      area,
      address,
      latitude,
      longitude,
      images,
      features,
      type,
      year_built
    `)
    .in('id', propertyIds)
  
  if (error) {
    console.error('Error fetching comparison data:', error)
    return []
  }
  
  return data.map(property => ({
    id: property.id,
    title: property.title,
    price: property.price,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    area: property.area,
    location: {
      address: property.address,
      latitude: property.latitude,
      longitude: property.longitude
    },
    images: property.images || [],
    features: property.features || [],
    type: property.type,
    yearBuilt: property.year_built,
    pricePerSqm: property.price / property.area
  }))
}

/**
 * Save comparison set to database for logged-in users
 */
export async function saveComparisonSet(name: string): Promise<string | null> {
  const supabase = createClient()
  const propertyIds = getComparisonFromStorage()
  
  if (propertyIds.length === 0) {
    throw new Error('No properties to save')
  }
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('User must be logged in to save comparisons')
  }
  
  const { data, error } = await supabase
    .from('comparison_sets')
    .insert({
      user_id: user.id,
      property_ids: propertyIds,
      name: name
    })
    .select()
    .single()
  
  if (error) {
    console.error('Error saving comparison set:', error)
    return null
  }
  
  return data.id
}

/**
 * Load comparison set from database
 */
export async function loadComparisonSet(id: string): Promise<boolean> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('comparison_sets')
    .select('property_ids')
    .eq('id', id)
    .single()
  
  if (error || !data) {
    console.error('Error loading comparison set:', error)
    return false
  }
  
  saveComparisonToStorage(data.property_ids)
  return true
}

/**
 * Get user's saved comparison sets
 */
export async function getUserComparisonSets(): Promise<ComparisonSet[]> {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return []
  }
  
  const { data, error } = await supabase
    .from('comparison_sets')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching comparison sets:', error)
    return []
  }
  
  return data.map(set => ({
    id: set.id,
    userId: set.user_id,
    propertyIds: set.property_ids,
    createdAt: set.created_at,
    name: set.name
  }))
}

/**
 * Delete comparison set
 */
export async function deleteComparisonSet(id: string): Promise<boolean> {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('comparison_sets')
    .delete()
    .eq('id', id)
  
  if (error) {
    console.error('Error deleting comparison set:', error)
    return false
  }
  
  return true
}

/**
 * Calculate comparison metrics
 */
export function calculateComparisonMetrics(properties: PropertyComparisonData[]) {
  if (properties.length === 0) {
    return null
  }
  
  const prices = properties.map(p => p.price)
  const pricesPerSqm = properties.map(p => p.pricePerSqm)
  const areas = properties.map(p => p.area)
  
  return {
    priceRange: {
      min: Math.min(...prices),
      max: Math.max(...prices),
      avg: prices.reduce((a, b) => a + b, 0) / prices.length
    },
    pricePerSqmRange: {
      min: Math.min(...pricesPerSqm),
      max: Math.max(...pricesPerSqm),
      avg: pricesPerSqm.reduce((a, b) => a + b, 0) / pricesPerSqm.length
    },
    areaRange: {
      min: Math.min(...areas),
      max: Math.max(...areas),
      avg: areas.reduce((a, b) => a + b, 0) / areas.length
    },
    bestValue: properties.reduce((best, current) => 
      current.pricePerSqm < best.pricePerSqm ? current : best
    ),
    mostExpensive: properties.reduce((most, current) => 
      current.price > most.price ? current : most
    ),
    largest: properties.reduce((largest, current) => 
      current.area > largest.area ? current : largest
    )
  }
}

// Local storage helpers
const STORAGE_KEY = 'property-comparison'

function getComparisonFromStorage(): string[] {
  if (typeof window === 'undefined') {
    return []
  }
  
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) {
    return []
  }
  
  try {
    return JSON.parse(stored)
  } catch {
    return []
  }
}

function saveComparisonToStorage(propertyIds: string[]): void {
  if (typeof window === 'undefined') {
    return
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(propertyIds))
  
  // Dispatch custom event for UI updates
  window.dispatchEvent(new CustomEvent('comparisonUpdated', {
    detail: { propertyIds }
  }))
}
