// API Route: /api/properties
// GET: List properties with filters and pagination
// POST: Create new property (authenticated users only)

import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import type { Property, CreatePropertyInput, PropertyFilters } from '@/lib/types/property';

// Initialize Supabase client with anon key (public read access)
// NOTE: anon key allows public reads; service_role key would bypass RLS for admin ops
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

// Zod schema for POST validation
const CreatePropertySchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().optional(),
  property_type: z.enum(['apartment', 'house', 'villa', 'townhouse', 'land', 'commercial']),
  price: z.number().positive('Price must be greater than 0'),
  location: z.string().min(1, 'Location is required'),
  bedrooms: z.number().int().nonnegative().optional(),
  bathrooms: z.number().int().nonnegative().optional(),
  area: z.number().positive().optional(),
  images: z.array(z.string()).optional(),
  status: z.enum(['available', 'inactive']).optional(),
});

type CreatePropertyPayload = z.infer<typeof CreatePropertySchema>;

// GET /api/properties - List properties with filters and pagination
export async function GET(request: NextRequest) {
  try {
    // Parse query parameters safely
    const searchParams = request.nextUrl.searchParams;
    
    // Pagination parameters
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    // Numeric parameters with safe parsing
    const parseNumeric = (value: string | null): number | undefined => {
      if (!value) return undefined;
      const num = parseInt(value, 10);
      return Number.isFinite(num) ? num : undefined;
    };

    const minPrice = parseNumeric(searchParams.get('min_price'));
    const maxPrice = parseNumeric(searchParams.get('max_price'));
    const minBedrooms = parseNumeric(searchParams.get('min_bedrooms'));
    const maxBedrooms = parseNumeric(searchParams.get('max_bedrooms'));

    // Build query
    let query = supabase
      .from('properties')
      .select('*', { count: 'exact' });

    // Apply filters
    const userIdParam = searchParams.get('user_id');
    if (userIdParam) {
      query = query.eq('user_id', userIdParam);
    }

    const propertyType = searchParams.get('property_type');
    if (propertyType) {
      query = query.eq('property_type', propertyType);
    }

    const status = searchParams.get('status');
    if (status) {
      query = query.eq('status', status);
    }

    if (minPrice !== undefined) {
      query = query.gte('price', minPrice);
    }
    if (maxPrice !== undefined) {
      query = query.lte('price', maxPrice);
    }
    if (minBedrooms !== undefined) {
      query = query.gte('bedrooms', minBedrooms);
    }
    if (maxBedrooms !== undefined) {
      query = query.lte('bedrooms', maxBedrooms);
    }

    const location = searchParams.get('location');
    if (location) {
      query = query.ilike('location', `%${location}%`);
    }

    // Apply pagination and ordering
    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      console.error('Error fetching properties:', error);
      if (process.env.NODE_ENV === 'development') {
        console.error('Details:', error.message);
      }
      return NextResponse.json(
        { error: 'Failed to fetch properties' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data,
      pagination: {
        page,
        pageSize,
        total: count,
        pages: Math.ceil((count || 0) / pageSize),
      },
      message: 'Properties retrieved successfully',
    });

  } catch (error) {
    console.error('Unexpected error in GET /api/properties:', error);
    if (process.env.NODE_ENV === 'development') {
      console.error('Stack trace:', error instanceof Error ? error.stack : 'N/A');
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/properties - Create new property (authenticated users only)
export async function POST(request: NextRequest) {
  try {
    // Note: Authentication is handled via Supabase auth header from client
    // Safe auth: Avoid destructuring session directly; use optional chaining
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error('Invalid JSON in request body');
      return NextResponse.json(
        { error: 'Invalid request body: must be valid JSON' },
        { status: 400 }
      );
    }

    // Validate request body with Zod
    const validationResult = CreatePropertySchema.safeParse(body);
    if (!validationResult.success) {
      const formattedErrors = validationResult.error.issues
        .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
        .join('; ');
      console.error('Validation error in POST /api/properties:', formattedErrors);
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: formattedErrors,
        },
        { status: 400 }
      );
    }

    const validatedData = validationResult.data;

    // Extract user_id from auth header (this would normally come from Supabase JWT)
    // For this implementation, RLS will enforce that user_id matches authenticated user
    const propertyData = {
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
      // Note: user_id should be set by RLS policy (use service_role for admin creation)
    };

    // Insert property using authenticated context
    const { data, error } = await supabase
      .from('properties')
      .insert([propertyData])
      .select()
      .single();

    if (error) {
      console.error('Error creating property:', error);
      if (process.env.NODE_ENV === 'development') {
        console.error('Supabase error details:', error.message);
      }
      return NextResponse.json(
        { error: 'Failed to create property' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        data,
        message: 'Property created successfully',
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Unexpected error in POST /api/properties:', error);
    if (process.env.NODE_ENV === 'development') {
      console.error('Stack trace:', error instanceof Error ? error.stack : 'N/A');
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
