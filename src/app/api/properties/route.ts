// API Route: /api/properties
// GET: List properties with filters
// POST: Create new property

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import type { Property, CreatePropertyInput, PropertyFilters } from '@/lib/types/property';

// GET /api/properties - List properties
export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Check authentication
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse query parameters for filters
    const searchParams = request.nextUrl.searchParams;
    const filters: PropertyFilters = {
      property_type: searchParams.get('property_type') as any,
      status: searchParams.get('status') as any,
      min_price: searchParams.get('min_price') ? Number(searchParams.get('min_price')) : undefined,
      max_price: searchParams.get('max_price') ? Number(searchParams.get('max_price')) : undefined,
      min_bedrooms: searchParams.get('min_bedrooms') ? Number(searchParams.get('min_bedrooms')) : undefined,
      max_bedrooms: searchParams.get('max_bedrooms') ? Number(searchParams.get('max_bedrooms')) : undefined,
      location: searchParams.get('location') || undefined,
      user_id: searchParams.get('user_id') || session.user.id,
    };

    // Build query
    let query = supabase
      .from('properties')
      .select('*', { count: 'exact' });

    // Apply filters
    if (filters.user_id) {
      query = query.eq('user_id', filters.user_id);
    }
    if (filters.property_type) {
      query = query.eq('property_type', filters.property_type);
    }
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    if (filters.min_price) {
      query = query.gte('price', filters.min_price);
    }
    if (filters.max_price) {
      query = query.lte('price', filters.max_price);
    }
    if (filters.min_bedrooms) {
      query = query.gte('bedrooms', filters.min_bedrooms);
    }
    if (filters.max_bedrooms) {
      query = query.lte('bedrooms', filters.max_bedrooms);
    }
    if (filters.location) {
      query = query.ilike('location', `%${filters.location}%`);
    }

    // Execute query with ordering
    const { data, error, count } = await query
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching properties:', error);
      return NextResponse.json(
        { error: 'Failed to fetch properties', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data,
      count,
      message: 'Properties retrieved successfully'
    });

  } catch (error: any) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// POST /api/properties - Create new property
export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Check authentication
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const body: CreatePropertyInput = await request.json();

    // Validate required fields
    if (!body.title || !body.property_type || !body.price || !body.location) {
      return NextResponse.json(
        { error: 'Missing required fields: title, property_type, price, location' },
        { status: 400 }
      );
    }

    // Validate price
    if (body.price <= 0) {
      return NextResponse.json(
        { error: 'Price must be greater than 0' },
        { status: 400 }
      );
    }

    // Prepare property data
    const propertyData = {
      user_id: session.user.id,
      title: body.title,
      description: body.description || null,
      property_type: body.property_type,
      price: body.price,
      location: body.location,
      bedrooms: body.bedrooms || null,
      bathrooms: body.bathrooms || null,
      area: body.area || null,
      images: body.images || null,
      status: body.status || 'available',
    };

    // Insert property
    const { data, error } = await supabase
      .from('properties')
      .insert([propertyData])
      .select()
      .single();

    if (error) {
      console.error('Error creating property:', error);
      return NextResponse.json(
        { error: 'Failed to create property', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data,
      message: 'Property created successfully'
    }, { status: 201 });

  } catch (error: any) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
