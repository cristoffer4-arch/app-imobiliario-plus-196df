// Advanced search filters for luxury properties
import { Property } from '@/lib/types/property'

export interface SearchFilters {
  location?: string
  minPrice?: number
  maxPrice?: number
  bedrooms?: number
  bathrooms?: number
  minArea?: number
  maxArea?: number
  propertyType?: 'apartment' | 'house' | 'penthouse' | 'villa'
  amenities?: string[]
  status?: 'available' | 'sold' | 'rented'
}

export interface SortOptions {
  field: 'price' | 'area' | 'createdAt' | 'bedrooms'
  direction: 'asc' | 'desc'
}

/**
 * Filter properties based on search criteria
 */
export function filterProperties(
  properties: Property[],
  filters: SearchFilters
): Property[] {
  return properties.filter(property => {
    // Location filter
    if (filters.location) {
      const locationMatch = property.location.toLowerCase().includes(
        filters.location.toLowerCase()
      )
      if (!locationMatch) return false
    }

    // Price range filter
    if (filters.minPrice && property.price < filters.minPrice) return false
    if (filters.maxPrice && property.price > filters.maxPrice) return false

    // Bedrooms filter
    if (filters.bedrooms && property.bedrooms < filters.bedrooms) return false

    // Bathrooms filter
    if (filters.bathrooms && property.bathrooms < filters.bathrooms) return false

    // Area range filter
    if (filters.minArea && property.area < filters.minArea) return false
    if (filters.maxArea && property.area > filters.maxArea) return false

    // Property type filter
    if (filters.propertyType && property.type !== filters.propertyType) return false

    // Amenities filter
    if (filters.amenities && filters.amenities.length > 0) {
      const hasAllAmenities = filters.amenities.every(amenity =>
        property.amenities?.includes(amenity)
      )
      if (!hasAllAmenities) return false
    }

    // Status filter
    if (filters.status && property.status !== filters.status) return false

    return true
  })
}

/**
 * Sort properties based on criteria
 */
export function sortProperties(
  properties: Property[],
  sortOptions: SortOptions
): Property[] {
  return [...properties].sort((a, b) => {
    const multiplier = sortOptions.direction === 'asc' ? 1 : -1

    switch (sortOptions.field) {
      case 'price':
        return (a.price - b.price) * multiplier
      case 'area':
        return (a.area - b.area) * multiplier
      case 'bedrooms':
        return (a.bedrooms - b.bedrooms) * multiplier
      case 'createdAt':
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        ) * multiplier
      default:
        return 0
    }
  })
}

/**
 * Search and filter properties
 */
export function searchProperties(
  properties: Property[],
  filters: SearchFilters,
  sortOptions?: SortOptions
): Property[] {
  let results = filterProperties(properties, filters)

  if (sortOptions) {
    results = sortProperties(results, sortOptions)
  }

  return results
}

/**
 * Get available filter options from properties
 */
export function getFilterOptions(properties: Property[]) {
  const locations = [...new Set(properties.map(p => p.location))]
  const types = [...new Set(properties.map(p => p.type))]
  const allAmenities = properties.flatMap(p => p.amenities || [])
  const amenities = [...new Set(allAmenities)]

  const prices = properties.map(p => p.price)
  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)

  const areas = properties.map(p => p.area)
  const minArea = Math.min(...areas)
  const maxArea = Math.max(...areas)

  return {
    locations,
    types,
    amenities,
    priceRange: { min: minPrice, max: maxPrice },
    areaRange: { min: minArea, max: maxArea }
  }
}
