import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { PropertyFilters } from '@/components/filters/FiltersPT';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  
  // Parse filters from query params
  const filters: PropertyFilters = {
    tipologia: searchParams.get('tipologia')?.split(',') as PropertyFilters['tipologia'],
    distrito: searchParams.get('distrito')?.split(','),
    certificado_energetico: searchParams.get('certificado')?.split(',') as PropertyFilters['certificado_energetico'],
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    maxCondominio: searchParams.get('maxCondominio') ? Number(searchParams.get('maxCondominio')) : undefined,
    hasALLicense: searchParams.get('hasAL') === 'true',
    hasElevador: searchParams.get('hasElevador') === 'true',
    minGaragem: searchParams.get('minGaragem') ? Number(searchParams.get('minGaragem')) : undefined,
  };

  const supabase = await createClient();
  let query = supabase.from('properties').select('*');

  // Apply filters
  if (filters.tipologia && filters.tipologia.length > 0) {
    query = query.in('tipologia', filters.tipologia);
  }
  
  if (filters.distrito && filters.distrito.length > 0) {
    query = query.in('distrito', filters.distrito);
  }
  
  if (filters.certificado_energetico && filters.certificado_energetico.length > 0) {
    query = query.in('certificado_energetico', filters.certificado_energetico);
  }
  
  if (filters.minPrice) {
    query = query.gte('price', filters.minPrice);
  }
  
  if (filters.maxPrice) {
    query = query.lte('price', filters.maxPrice);
  }
  
  if (filters.maxCondominio) {
    query = query.lte('condominio_mensal', filters.maxCondominio);
  }
  
  if (filters.hasALLicense) {
    query = query.not('al_license', 'is', null);
  }
  
  if (filters.hasElevador) {
    query = query.eq('elevador', true);
  }
  
  if (filters.minGaragem) {
    query = query.gte('lugar_garagem', filters.minGaragem);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ properties: data });
}
