import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

interface RouteParams {
  params: {
    id: string;
  };
}

// GET /api/properties/[id] - Get property by ID
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { id } = params;

    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Imóvel não encontrado' },
          { status: 404 }
        );
      }
      throw error;
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// PUT /api/properties/[id] - Update property
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { id } = params;
    const body = await request.json();

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    // Check if property exists and user is the owner
    const { data: existingProperty, error: checkError } = await supabase
      .from('properties')
      .select('created_by')
      .eq('id', id)
      .single();

    if (checkError || !existingProperty) {
      return NextResponse.json(
        { error: 'Imóvel não encontrado' },
        { status: 404 }
      );
    }

    if (existingProperty.created_by !== user.id) {
      return NextResponse.json(
        { error: 'Sem permissão para editar este imóvel' },
        { status: 403 }
      );
    }

    // Update property
    const { data, error } = await supabase
      .from('properties')
      .update({
        ...body,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/properties/[id] - Delete property (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { id } = params;

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    // Check if property exists and user is the owner
    const { data: existingProperty, error: checkError } = await supabase
      .from('properties')
      .select('created_by')
      .eq('id', id)
      .single();

    if (checkError || !existingProperty) {
      return NextResponse.json(
        { error: 'Imóvel não encontrado' },
        { status: 404 }
      );
    }

    if (existingProperty.created_by !== user.id) {
      return NextResponse.json(
        { error: 'Sem permissão para excluir este imóvel' },
        { status: 403 }
      );
    }

    // Soft delete by setting status to 'deleted'
    const { error } = await supabase
      .from('properties')
      .update({ 
        status: 'deleted',
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ message: 'Imóvel excluído com sucesso' });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
