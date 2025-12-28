import { NextRequest, NextResponse } from 'next/server'
import {
  addToFavorites,
  removeFromFavorites,
  getUserFavorites,
  getFavoriteProperties
} from '@/lib/favorites'

/**
 * GET /api/favorites
 * Get all favorites for the authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const withProperties = searchParams.get('withProperties') === 'true'

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    let result
    if (withProperties) {
      result = await getFavoriteProperties(userId)
    } else {
      result = await getUserFavorites(userId)
    }

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error in GET /api/favorites:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/favorites
 * Add a property to favorites
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, propertyId } = body

    if (!userId || !propertyId) {
      return NextResponse.json(
        { error: 'User ID and Property ID are required' },
        { status: 400 }
      )
    }

    const result = await addToFavorites(userId, propertyId)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: 'Property added to favorites', success: true },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error in POST /api/favorites:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/favorites
 * Remove a property from favorites
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const propertyId = searchParams.get('propertyId')

    if (!userId || !propertyId) {
      return NextResponse.json(
        { error: 'User ID and Property ID are required' },
        { status: 400 }
      )
    }

    const result = await removeFromFavorites(userId, propertyId)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: 'Property removed from favorites', success: true },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error in DELETE /api/favorites:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
