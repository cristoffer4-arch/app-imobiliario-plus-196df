import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

/**
 * NOTE:
 * - This file uses the public ANON key for read-only/public endpoints.
 * - DO NOT use the Supabase service_role key in code that could be committed or exposed to clients.
 * - For auth-aware server routes (session from cookies), prefer `createRouteHandlerClient({ cookies })`
 *   from @supabase/auth-helpers-nextjs or a server-only client that reads the request's cookies.
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const isDevelopment = process.env.NODE_ENV === 'development';

const log = (...args: unknown[]) => {
  if (isDevelopment) console.log('[api/properties]', ...args);
};
// Always log errors to stderr (so hosted platforms collect them).
const logError = (...args: unknown[]) => {
  console.error('[api/properties][ERROR]', ...args);
};

// Zod schema for POST body validation
const CreatePropertySchema = z.object({
  title: z.string().min(1),
  property_type: z.string().min(1),
  price: z.preprocess((val) => {
    if (typeof val === 'string') return Number(val);
    if (typeof val === 'number') return val;
    return NaN;
  }, z.number().finite().positive()),
  address: z.string().min(1),
  city: z.string().min(1),
  district: z.string().optional().nullable(),
  postal_code: z.string().optional().nullable(),
  country: z.string().optional().default('Portugal'),
  description: z.string().optional().nullable(),
  bedrooms: z.number().optional().nullable(),
  bathrooms: z.number().optional().nullable(),
  gross_area: z.number().optional().nullable(),
  net_area: z.number().optional().nullable(),
  land_area: z.number().optional().nullable(),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  features: z.preprocess((v) => (Array.isArray(v) ? v : []), z.array(z.any()).optional()),
  amenities: z.preprocess((v) => (Array.isArray(v) ? v : []), z.array(z.any()).optional()),
  images: z.preprocess((v) => (Array.isArray(v) ? v : []), z.array(z.any()).optional()),
  main_image: z.string().optional().nullable(),
  virtual_tour_url: z.string().optional().nullable(),
  status: z.enum(['active', 'inactive']).optional().default('active'),
});

export async function GET(request: NextRequest) {
  try {
    // Use anon client for public reads. For auth-based reads, use an auth-aware client.
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { searchParams } = new URL(request.url);

    // Accept both legacy 'type' and new 'property_type' param for backward-compatibility
    const propertyType = searchParams.get('type') ?? searchParams.get('property_type') ?? undefined;
    const minPriceRaw = searchParams.get('minPrice');
    const maxPriceRaw = searchParams.get('maxPrice');
    const city = searchParams.get('city') ?? undefined;
    const district = searchParams.get('district') ?? undefined;
    const status = searchParams.get('status') ?? 'active';
    const pageRaw = searchParams.get('page') ?? '1';
    const limitRaw = searchParams.get('limit') ?? '10';

    const page = parseInt(pageRaw, 10);
    const limit = parseInt(limitRaw, 10);

    if (!Number.isFinite(page) || page < 1) {
      return NextResponse.json({ error: 'Invalid page parameter' }, { status: 400 });
    }
    if (!Number.isFinite(limit) || limit < 1 || limit > 100) {
      return NextResponse.json({ error: 'Invalid limit parameter (1-100 allowed)' }, { status: 400 });
    }

    const minPrice = minPriceRaw !== null ? parseFloat(minPriceRaw) : undefined;
    const maxPrice = maxPriceRaw !== null ? parseFloat(maxPriceRaw) : undefined;
    if (minPriceRaw !== null && !Number.isFinite(minPrice)) {
      return NextResponse.json({ error: 'Invalid minPrice parameter' }, { status: 400 });
    }
    if (maxPriceRaw !== null && !Number.isFinite(maxPrice)) {
      return NextResponse.json({ error: 'Invalid maxPrice parameter' }, { status: 400 });
    }

    log('Query params:', { propertyType, minPrice, maxPrice, city, district, status, page, limit });

    // Build query
    let query = supabase
      .from('properties')
      .select('*', { count: 'exact' })
      .eq('status', status)
      .order('created_at', { ascending: false });

    if (propertyType) query = query.eq('property_type', propertyType);
    if (minPrice !== undefined) query = query.gte('price', minPrice);
    if (maxPrice !== undefined) query = query.lte('price', maxPrice);
    if (city) query = query.ilike('city', `%${city}%`);
    if (district) query = query.ilike('district', `%${district}%`);

    // Pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      logError('Supabase query error:', error);
      return NextResponse.json(
        { error: 'Database query failed', details: isDevelopment ? error : undefined },
        { status: 500 }
      );
    }

    log('Query successful - Found', count, 'properties');

    return NextResponse.json({
      data,
      pagination: {
        page,
        limit,
        total: count ?? 0,
        totalPages: Math.ceil(((count ?? 0) as number) / limit),
      },
    });
  } catch (error: any) {
    logError('API /api/properties GET unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: isDevelopment ? error : undefined },
      { status: 500 }
    );
  }
}

// POST /api/properties - create new property
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const body = await request.json();

    // Validate with Zod
    const parsed = CreatePropertySchema.safeParse(body);
    if (!parsed.success) {
      // Return structured Zod errors for client debugging (400)
      return NextResponse.json({ error: 'Invalid payload', issues: parsed.error.format() }, { status: 400 });
    }

    const validated = parsed.data;

    // Try to get the current user if available.
    // Note: Using anon client will not return a session. For auth-aware server routes that read cookies,
    // use createRouteHandlerClient({ cookies }) to read session from request cookies.
    let userId: string | null = null;
    try {
      const userRes = await supabase.auth.getUser();
      userId = userRes?.data?.user?.id ?? null;
    } catch (e) {
      // If auth.getUser fails or returns nothing, treat as anonymous
      userId = null;
    }

    const propertyData: Record<string, any> = {
      title: validated.title,
      property_type: validated.property_type,
      price: validated.price,
      address: validated.address,
      city: validated.city,
      district: validated.district ?? null,
      postal_code: validated.postal_code ?? null,
      country: validated.country ?? 'Portugal',
      description: validated.description ?? null,
      bedrooms: validated.bedrooms ?? null,
      bathrooms: validated.bathrooms ?? null,
      gross_area: validated.gross_area ?? null,
      net_area: validated.net_area ?? null,
      land_area: validated.land_area ?? null,
      latitude: validated.latitude ?? null,
      longitude: validated.longitude ?? null,
      features: validated.features ?? [],
      amenities: validated.amenities ?? [],
      images: validated.images ?? [],
      main_image: validated.main_image ?? null,
      virtual_tour_url: validated.virtual_tour_url ?? null,
      status: validated.status ?? 'active',
      user_id: userId,
    };

    const { data, error } = await supabase.from('properties').insert(propertyData).select().single();

    if (error) {
      logError('Insert error:', error);
      return NextResponse.json({ error: 'Insert failed', details: isDevelopment ? error : undefined }, { status: 500 });
    }

    log('Property created successfully:', data?.id);

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    logError('API /api/properties POST unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: isDevelopment ? error : undefined },
      { status: 500 }
    );
  }
}
