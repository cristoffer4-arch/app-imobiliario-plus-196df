// API Route: /api/leads
// GET: List leads with filters and pagination
// POST: Create new lead (authenticated users only)

import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { XP_REWARDS } from '@/lib/gamification-constants';
import type { LeadCreateInput, LeadFilterParams } from '@/types/index';

// Zod schema for POST validation
const CreateLeadSchema = z.object({
  property_id: z.string().uuid().optional(),
  name: z.string().min(1, 'Name is required').max(255),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  message: z.string().optional(),
  source: z.enum(['idealista', 'imovirtual', 'olx', 'website', 'referral', 'other']).optional(),
  status: z.enum(['new', 'contacted', 'meeting_scheduled', 'proposal_sent', 'converted', 'lost']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
});

// GET /api/leads - List leads with filters and pagination
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    
    // Pagination
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // Build query
    let query = supabase
      .from('leads')
      .select('*', { count: 'exact' })
      .eq('user_id', session.user.id);

    // Apply filters
    const status = searchParams.get('status');
    if (status) {
      query = query.eq('status', status);
    }

    const priority = searchParams.get('priority');
    if (priority) {
      query = query.eq('priority', priority);
    }

    const source = searchParams.get('source');
    if (source) {
      query = query.eq('source', source);
    }

    const propertyId = searchParams.get('property_id');
    if (propertyId) {
      query = query.eq('property_id', propertyId);
    }

    const minScore = searchParams.get('min_score');
    if (minScore) {
      query = query.gte('ai_score', parseInt(minScore, 10));
    }

    const maxScore = searchParams.get('max_score');
    if (maxScore) {
      query = query.lte('ai_score', parseInt(maxScore, 10));
    }

    // Search
    const search = searchParams.get('search');
    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`);
    }

    // Apply pagination and ordering
    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      console.error('Error fetching leads:', error);
      return NextResponse.json(
        { error: 'Failed to fetch leads', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data,
      pagination: {
        page,
        limit,
        total: count || 0,
        total_pages: Math.ceil((count || 0) / limit),
      },
      message: 'Leads retrieved successfully',
    });

  } catch (error) {
    console.error('Unexpected error in GET /api/leads:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/leads - Create new lead
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check authentication
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse and validate request body
    let body: unknown;
    try {
      body = await request.json();
    } catch (parseError) {
      return NextResponse.json(
        { error: 'Invalid request body: must be valid JSON' },
        { status: 400 }
      );
    }

    const validationResult = CreateLeadSchema.safeParse(body);
    if (!validationResult.success) {
      const formattedErrors = validationResult.error.issues
        .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
        .join('; ');
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: formattedErrors,
        },
        { status: 400 }
      );
    }

    const validatedData = validationResult.data;

    // Prepare lead data
    const leadData = {
      user_id: session.user.id,
      property_id: validatedData.property_id || null,
      name: validatedData.name,
      email: validatedData.email || null,
      phone: validatedData.phone || null,
      message: validatedData.message || null,
      source: validatedData.source || 'other',
      status: validatedData.status || 'new',
      priority: validatedData.priority || 'medium',
    };

    // Insert lead
    const { data, error } = await supabase
      .from('leads')
      .insert([leadData])
      .select()
      .single();

    if (error) {
      console.error('Error creating lead:', error);
      return NextResponse.json(
        { error: 'Failed to create lead', details: error.message },
        { status: 500 }
      );
    }

    // Award XP for creating a lead (5 XP)
    try {
      const { error: xpError } = await supabase.rpc('award_xp', {
        p_user_id: session.user.id,
        p_xp_amount: XP_REWARDS.LEAD_CREATED,
        p_activity_type: 'lead_created',
        p_description: `Lead criado: ${validatedData.name}`
      });

      if (xpError) {
        console.error('Error awarding XP:', xpError);
        // Don't fail the request if XP award fails
      }
    } catch (xpError) {
      console.error('Error awarding XP:', xpError);
      // Don't fail the request if XP award fails
    }

    return NextResponse.json(
      {
        data,
        message: 'Lead created successfully',
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Unexpected error in POST /api/leads:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
