import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'

/**
 * GET /api/properties/nearby
 * Find properties within a specified radius
 * Query params: lat, lng, radiusKm (default: 5), limit (default: 50)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Parse and validate parameters
    const lat = parseFloat(searchParams.get('lat') || '')
    const lng = parseFloat(searchParams.get('lng') || '')
    const radiusKm = parseFloat(searchParams.get('radiusKm') || '5')
    const limit = parseInt(searchParams.get('limit') || '50')
    const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined
    const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined
    const propertyType = searchParams.get('type')

    // Validation
    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      return NextResponse.json(
        { error: 'lat and lng are required and must be valid numbers' },
        { status: 400 }
      )
    }

    if (Number.isNaN(radiusKm) || radiusKm <= 0 || radiusKm > 100) {
      return NextResponse.json(
        { error: 'radiusKm must be between 0 and 100' },
        { status: 400 }
      )
    }

    const radiusMeters = radiusKm * 1000
    const supabase = createClient()

    // Call the PostGIS function
    const { data, error } = await supabase
      .rpc('properties_within_radius', {
        p_latitude: lat,
        p_longitude: lng,
        p_radius_meters: radiusMeters
      })
      .limit(limit)

    if (error) {
      console.error('Supabase RPC error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch nearby properties' },
        { status: 500 }
      )
    }

    // Apply additional filters
    let filteredData = data || []

    if (minPrice !== undefined) {
      filteredData = filteredData.filter(p => p.price >= minPrice)
    }

    if (maxPrice !== undefined) {
      filteredData = filteredData.filter(p => p.price <= maxPrice)
    }

    if (propertyType) {
      filteredData = filteredData.filter(p => p.type === propertyType)
    }

    // Format response
    const response = {
      success: true,
      count: filteredData.length,
      radius: radiusKm,
      center: { lat, lng },
      properties: filteredData.map(p => ({
        id: p.id,
        title: p.title,
        price: p.price,
        latitude: p.latitude,
        longitude: p.longitude,
        distance: p.distance_meters,
        distanceKm: (p.distance_meters / 1000).toFixed(2)
      }))
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error in GET /api/properties/nearby:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
