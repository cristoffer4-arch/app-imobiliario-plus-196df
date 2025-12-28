import { NextRequest, NextResponse } from 'next/server';
import { casafariClient } from '@/lib/casafari-client';

/**
 * @route POST /api/casafari/properties
 * @description Busca propriedades na API CASAFARI
 * @body CasafariSearchRequest
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Verifica se existe token no header
    const token = request.headers.get('x-casafari-token');
    if (!token) {
      return NextResponse.json(
        { error: 'Token CASAFARI não fornecido. Use o header x-casafari-token' },
        { status: 401 }
      );
    }

    // Define o token no cliente
    casafariClient.setAccessToken(token);

    // Extrai parâmetros opcionais
    const { limit, offset, orderBy, order, ...searchRequest } = body;

    // Busca propriedades
    const properties = await casafariClient.searchProperties(
      searchRequest,
      { limit, offset, orderBy, order }
    );

    return NextResponse.json(properties);
  } catch (error: any) {
    console.error('Erro ao buscar propriedades CASAFARI:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar propriedades', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * @route GET /api/casafari/properties?propertyId=123
 * @description Busca propriedade por ID
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get('propertyId');

    if (!propertyId) {
      return NextResponse.json(
        { error: 'propertyId é obrigatório' },
        { status: 400 }
      );
    }

    // Verifica se existe token no header
    const token = request.headers.get('x-casafari-token');
    if (!token) {
      return NextResponse.json(
        { error: 'Token CASAFARI não fornecido. Use o header x-casafari-token' },
        { status: 401 }
      );
    }

    // Define o token no cliente
    casafariClient.setAccessToken(token);

    // Busca propriedade por ID
    const property = await casafariClient.getPropertyById(Number(propertyId));

    return NextResponse.json(property);
  } catch (error: any) {
    console.error('Erro ao buscar propriedade CASAFARI:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar propriedade', details: error.message },
      { status: 500 }
    );
  }
}
