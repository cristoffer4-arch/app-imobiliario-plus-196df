// API Route: /api/leads/[id]
// GET: Get single lead by ID
// PUT: Update lead by ID
// DELETE: Delete lead by ID

import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import type { LeadUpdateInput } from '@/types/index';

type RouteContext = {
  params: Promise<{ id: string }>;
};

// Zod schema for PUT validation
const UpdateLeadSchema = z.object({
  property_id: z.string().uuid().optional(),
  name: z.string().min(1).max(255).optional(),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().optional(),
  message: z.string().optional(),
  source: z.enum(['idealista', 'imovirtual', 'olx', 'website', 'referral', 'other']).optional(),
  status: z.enum(['new', 'contacted', 'meeting_scheduled', 'proposal_sent', 'converted', 'lost']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  ai_score: z.number().int().min(0).max(100).optional(),
  ai_analysis: z.record(z.any()).optional(),
  last_contacted_at: z.string().datetime().optional(),
});

// GET /api/leads/[id] - Get single lead
export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
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

    const { id } = await params;

    // Fetch lead
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Lead not found' },
          { status: 404 }
        );
      }
      console.error('Error fetching lead:', error);
      return NextResponse.json(
        { error: 'Failed to fetch lead', details: error.message },
        { status: 500 }
      );
    }

    // Verify ownership
    if (data.user_id !== session.user.id) {
      return NextResponse.json(
        { error: 'Forbidden: You can only access your own leads' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      data,
      message: 'Lead retrieved successfully'
    });

  } catch (error) {
    console.error('Unexpected error in GET /api/leads/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/leads/[id] - Update lead
export async function PUT(
  request: NextRequest,
  { params }: RouteContext
) {
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

    const { id } = await params;

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

    const validationResult = UpdateLeadSchema.safeParse(body);
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

    // Check if lead exists and user owns it
    const { data: existingLead, error: fetchError } = await supabase
      .from('leads')
      .select('user_id')
      .eq('id', id)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Lead not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: 'Failed to fetch lead', details: fetchError.message },
        { status: 500 }
      );
    }

    if (existingLead.user_id !== session.user.id) {
      return NextResponse.json(
        { error: 'Forbidden: You can only update your own leads' },
        { status: 403 }
      );
    }

    const validatedData = validationResult.data;

    // Update lead
    const { data, error } = await supabase
      .from('leads')
      .update({
        ...validatedData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating lead:', error);
      return NextResponse.json(
        { error: 'Failed to update lead', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data,
      message: 'Lead updated successfully',
    });

  } catch (error) {
    console.error('Unexpected error in PUT /api/leads/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/leads/[id] - Delete lead
export async function DELETE(
  request: NextRequest,
  { params }: RouteContext
) {
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

    const { id } = await params;

    // Check if lead exists and user owns it
    const { data: existingLead, error: fetchError } = await supabase
      .from('leads')
      .select('user_id')
      .eq('id', id)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Lead not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: 'Failed to fetch lead', details: fetchError.message },
        { status: 500 }
      );
    }

    if (existingLead.user_id !== session.user.id) {
      return NextResponse.json(
        { error: 'Forbidden: You can only delete your own leads' },
        { status: 403 }
      );
    }

    // Delete lead
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting lead:', error);
      return NextResponse.json(
        { error: 'Failed to delete lead', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Lead deleted successfully',
    });

  } catch (error) {
    console.error('Unexpected error in DELETE /api/leads/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
