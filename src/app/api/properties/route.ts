// API Route: /api/properties
// GET: List properties with filters (public access)
// POST: Create new property (authenticated users)

import { createClient } from '@supabase/supabase-js';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Environment check
const isDevelopment = process.env.NODE_ENV === 'development';

// Logging helpers
function log(...args: unknown[]) {
  if (isDevelopment) {
    console.log(...args);
  }
}

function logError(...args: unknown[]) {
  console.error(...args);
}

// Zod validation schema for POST requests
const createPropertySchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().optional(),
  property_type: z.enum(['apartment', 'house', 'villa', 'commercial', 'land'], {
    errorMap: () => ({ message: 'Invalid property type' }),
  }),
  price: z.number().positive('Price must be greater than 0'),
  location: z.string().min(1, 'Location is required'),
  bedrooms: z.number().int().nonnegative().optional(),
  bathrooms: z.number().int().nonnegative().optional(),
  area: z.number().positive().optional(),
  images: z.array(z.string()).optional(),
  status: z.enum(['available', 'sold', 'rented', 'pending']).optional(),
});

// GET /api/properties - List properties (public access with anon key)
export async function GET(request: NextRequest) {
  try {
    // Use public anon key for GET requests to allow public access via RLS policies
    // IMPORTANT: Never expose service_role key in client-accessible code - it bypasses RLS
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    
    if (!supabaseUrl || !supabaseAnonKey) {
      logError('Missing Supabase environment variables');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Parse query parameters for filters and pagination
    const searchParams = request.nextUrl.searchParams;
    
    // Parse pagination params with safe numeric parsing
    const pageParam = searchParams.get('page');
    const limitParam = searchParams.get('limit');
    
    const page = pageParam ? parseInt(pageParam, 10) : 1;
    const limit = limitParam ? parseInt(limitParam, 10) : 10;
    
    // Validate numeric parameters
    if (!Number.isFinite(page) || page < 1) {
      return NextResponse.json(
        { error: 'Invalid page parameter - must be a positive integer' },
        { status: 400 }
      );
    }
    
    if (!Number.isFinite(limit) || limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: 'Invalid limit parameter - must be between 1 and 100' },
        { status: 400 }
      );
    }

    // Parse price filters with safe numeric parsing
    const minPriceParam = searchParams.get('minPrice') || searchParams.get('min_price');
    const maxPriceParam = searchParams.get('maxPrice') || searchParams.get('max_price');
    
    let minPrice: number | undefined;
    let maxPrice: number | undefined;
    
    if (minPriceParam) {
      minPrice = parseInt(minPriceParam, 10);
      if (!Number.isFinite(minPrice) || minPrice < 0) {
        return NextResponse.json(
          { error: 'Invalid minPrice parameter - must be a non-negative number' },
          { status: 400 }
        );
      }
    }
    
    if (maxPriceParam) {
      maxPrice = parseInt(maxPriceParam, 10);
      if (!Number.isFinite(maxPrice) || maxPrice < 0) {
        return NextResponse.json(
          { error: 'Invalid maxPrice parameter - must be a non-negative number' },
          { status: 400 }
        );
      }
    }

    // Accept both 'type' and 'property_type' for backward compatibility
    const propertyType = searchParams.get('property_type') || searchParams.get('type');
    const status = searchParams.get('status');
    const location = searchParams.get('location');
    const userId = searchParams.get('user_id');
    
    log('API /api/properties GET - Query params:', { 
      page, 
      limit, 
      propertyType, 
      status, 
      minPrice, 
      maxPrice, 
      location,
      userId
    });

    // Build query
    let query = supabase
      .from('properties')
      .select('*', { count: 'exact' });

    // Apply filters
    if (userId) {
      query = query.eq('user_id', userId);
    }
    if (propertyType) {
      query = query.eq('property_type', propertyType);
    }
    if (status) {
      query = query.eq('status', status);
    }
    if (minPrice !== undefined) {
      query = query.gte('price', minPrice);
    }
    if (maxPrice !== undefined) {
      query = query.lte('price', maxPrice);
    }
    if (location) {
      query = query.ilike('location', `%${location}%`);
    }

    // Apply pagination BEFORE executing the query
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    // Execute query with ordering
    const { data, error, count } = await query
      .order('created_at', { ascending: false });

    if (error) {
      logError('Error fetching properties:', error);
      return NextResponse.json(
        { error: 'Failed to fetch properties', ...(isDevelopment && { details: error.message }) },
        { status: 500 }
      );
    }

    log('Query successful - Found', count, 'total properties, returning page', page);

    return NextResponse.json({
      data,
      count,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: count ? Math.ceil(count / limit) : 0,
      },
      message: 'Properties retrieved successfully'
    });

  } catch (error: unknown) {
    logError('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error', ...(isDevelopment && { details: error instanceof Error ? error.message : 'Unknown error' }) },
      { status: 500 }
    );
  }
}

// POST /api/properties - Create new property (authenticated users recommended)
export async function POST(request: NextRequest) {
  try {
    // Use auth-helpers client for authenticated requests
    const supabase = createRouteHandlerClient({ cookies });
    
    // Safely extract user without destructuring (avoids runtime errors)
    let user = null;
    try {
      const authResponse = await supabase.auth.getUser();
      if (authResponse.data?.user) {
        user = authResponse.data.user;
      }
    } catch (authError) {
      logError('Auth check failed:', authError);
      // Continue without user - RLS will enforce policy
    }

    log('API /api/properties POST - User:', user?.id || 'anonymous');

    // Parse request body
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    // Validate input with Zod schema
    const validationResult = createPropertySchema.safeParse(body);
    
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      
      log('Validation failed:', errors);
      
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: errors,
        },
        { status: 400 }
      );
    }

    const validatedData = validationResult.data;

    // Prepare property data with user_id (can be null if unauthenticated)
    // RLS policies will determine if insert is allowed
    const propertyData = {
      user_id: user?.id || null,
      title: validatedData.title,
      description: validatedData.description || null,
      property_type: validatedData.property_type,
      price: validatedData.price,
      location: validatedData.location,
      bedrooms: validatedData.bedrooms || null,
      bathrooms: validatedData.bathrooms || null,
      area: validatedData.area || null,
      images: validatedData.images || null,
      status: validatedData.status || 'available',
    };

    log('Inserting property:', { ...propertyData, user_id: propertyData.user_id || 'null' });

    // Insert property (RLS policies will enforce access control)
    const { data, error } = await supabase
      .from('properties')
      .insert([propertyData])
      .select()
      .single();

    if (error) {
      logError('Error creating property:', error);
      return NextResponse.json(
        { 
          error: 'Failed to create property',
          ...(isDevelopment && { details: error.message })
        },
        { status: 500 }
      );
    }

    log('Property created successfully:', data?.id);

    return NextResponse.json({
      data,
      message: 'Property created successfully'
    }, { status: 201 });

  } catch (error: unknown) {
    logError('Unexpected error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        ...(isDevelopment && { details: error instanceof Error ? error.message : 'Unknown error' })
      },
      { status: 500 }
    );
  }
}
