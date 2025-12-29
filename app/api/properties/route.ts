import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with service role for public access
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Helper for conditional logging (only in development)
const isDevelopment = process.env.NODE_ENV === 'development';
const log = (...args: any[]) => {
  if (isDevelopment) console.log(...args);
};
const logError = (...args: any[]) => {
  if (isDevelopment) console.error(...args);
};

// GET /api/properties - List properties with filters
export async function GET(request: NextRequest) {
  try {
    // Create a Supabase client for this request
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { searchParams } = new URL(request.url);

    // Extract query parameters
    const propertyType = searchParams.get('type') || searchParams.get('property_type');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const city = searchParams.get('city');
    const district = searchParams.get('district');
    const status = searchParams.get('status') || 'active';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    log('API /api/properties - Query params:', {
      propertyType,
      minPrice,
      maxPrice,
      city,
      district,
      status,
      page,
      limit
    });

    // Build query
    let query = supabase
      .from('properties')
      .select('*', { count: 'exact' })
      .eq('status', status)
      .order('created_at', { ascending: false });

    // Apply filters (using correct column names from schema)
    if (propertyType) query = query.eq('property_type', propertyType);
    if (minPrice) query = query.gte('price', parseFloat(minPrice));
    if (maxPrice) query = query.lte('price', parseFloat(maxPrice));
    if (city) query = query.ilike('city', `%${city}%`);
    if (district) query = query.ilike('district', `%${district}%`);

    // Pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      logError('Supabase query error:', error);
      throw error;
    }

    log('Query successful - Found', count, 'properties');

    return NextResponse.json({
      data,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    });
  } catch (error: any) {
    logError('API /api/properties error:', error);
    return NextResponse.json(
      { error: error.message, details: isDevelopment ? error : undefined },
      { status: 500 }
    );
  }
}

// POST /api/properties - Create new property
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const body = await request.json();

    // Validate required fields (using correct column names)
    const requiredFields = ['title', 'property_type', 'price', 'address', 'city'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Campo obrigatório: ${field}` },
          { status: 400 }
        );
      }
    }

    // Get current user (optional - allow anonymous property creation for testing)
    const { data: { user } } = await supabase.auth.getUser();

    // Insert property
    const propertyData: any = {
      title: body.title,
      property_type: body.property_type,
      price: body.price,
      address: body.address,
      city: body.city,
      district: body.district,
      postal_code: body.postal_code,
      country: body.country || 'Portugal',
      description: body.description,
      bedrooms: body.bedrooms,
      bathrooms: body.bathrooms,
      gross_area: body.gross_area,
      net_area: body.net_area,
      land_area: body.land_area,
      latitude: body.latitude,
      longitude: body.longitude,
      features: body.features || [],
      amenities: body.amenities || [],
      images: body.images || [],
      main_image: body.main_image,
      virtual_tour_url: body.virtual_tour_url,
      status: body.status || 'active',
      user_id: user?.id || null
    };

    const { data, error } = await supabase
      .from('properties')
      .insert(propertyData)
      .select()
      .single();

    if (error) {
      logError('Insert error:', error);
      throw error;
    }

    log('Property created successfully:', data?.id);
    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    logError('API /api/properties POST error:', error);
    return NextResponse.json(
      { error: error.message, details: isDevelopment ? error : undefined },
      { status: 500 }
    );
  }
}
