// API Route: /api/properties/[id]
// GET: Get single property by ID
// PUT: Update property by ID
// DELETE: Delete property by ID

import { createServerSupabaseClient } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import type { UpdatePropertyInput } from '@/lib/types/property';

type RouteContext = {
  params: Promise<{ id: string }>;
};

// GET /api/properties/[id] - Get single property
export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Check authentication
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Fetch property
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Property not found' },
          { status: 404 }
        );
      }
      console.error('Error fetching property:', error);
      return NextResponse.json(
        { error: 'Failed to fetch property', details: error.message },
        { status: 500 }
      );
    }

    // Verify ownership (users can only access their own properties)
    if (data.user_id !== session.user.id) {
      return NextResponse.json(
        { error: 'Forbidden: You can only access your own properties' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      data,
      message: 'Property retrieved successfully'
    });

  } catch (error: any) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/properties/[id] - Update property
export async function PUT(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Check authentication
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Parse request body
    const body: UpdatePropertyInput = await request.json();

    // Validate that at least one field is being updated
    if (Object.keys(body).length === 0) {
      return NextResponse.json(
        { error: 'No fields provided for update' },
        { status: 400 }
      );
    }

    // Validate price if provided
    if (body.price !== undefined && body.price <= 0) {
      return NextResponse.json(
        { error: 'Price must be greater than 0' },
        { status: 400 }
      );
    }

    // Check if property exists and user owns it
    const { data: existingProperty, error: fetchError } = await supabase
      .from('properties')
      .select('user_id')
      .eq('id', id)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Property not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: 'Failed to fetch property', details: fetchError.message },
        { status: 500 }
      );
    }

    // Verify ownership
    if (existingProperty.user_id !== session.user.id) {
      return NextResponse.json(
        { error: 'Forbidden: You can only update your own properties' },
        { status: 403 }
      );
    }

    // Update property
    const { data, error } = await supabase
      .from('properties')
      .update(body)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating property:', error);
      return NextResponse.json(
        { error: 'Failed to update property', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      data,
      message: 'Property updated successfully'
    });

  } catch (error: any) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/properties/[id] - Delete property
export async function DELETE(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const supabase = await createServerSupabaseClient();
    
    // Check authentication
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Check if property exists and user owns it
    const { data: existingProperty, error: fetchError } = await supabase
      .from('properties')
      .select('user_id')
      .eq('id', id)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Property not found' },
          { status: 404 }
      );
      }
      return NextResponse.json(
        { error: 'Failed to fetch property', details: fetchError.message },
        { status: 500 }
      );
    }

    // Verify ownership
    if (existingProperty.user_id !== session.user.id) {
      return NextResponse.json(
        { error: 'Forbidden: You can only delete your own properties' },
        { status: 403 }
      );
    }

    // Delete property
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting property:', error);
      return NextResponse.json(
        { error: 'Failed to delete property', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Property deleted successfully'
    });

  } catch (error: any) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
