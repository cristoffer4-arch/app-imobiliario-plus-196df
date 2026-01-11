import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Forçar runtime Node.js
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    // Validar Content-Type
    const contentType = request.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      return NextResponse.json(
        { error: 'Content-Type deve ser application/json' },
        { status: 400 }
      );
    }

    // Parse JSON com tratamento de erro
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error('Erro ao fazer parse do JSON:', parseError);
      return NextResponse.json(
        { error: 'Body da requisição inválido' },
        { status: 400 }
      );
    }

    const { prompt } = body;

    // Validar e normalizar prompt
    const normalized = prompt?.trim();
    if (!normalized || typeof normalized !== 'string') {
      return NextResponse.json(
        { error: 'Prompt é obrigatório' },
        { status: 400 }
      );
    }

    // Verificar tamanho máximo
    if (normalized.length > 10000) {
      return NextResponse.json(
        { error: 'Prompt muito longo (máximo 10000 caracteres)' },
        { status: 400 }
      );
    }

    // Verificar API Key
    const apiKey = process.env.GOOGLE_GEMINI_KEY;
    
    if (!apiKey) {
      console.error('GOOGLE_GEMINI_KEY não configurada');
      return NextResponse.json(
        { error: 'Configuração inválida do servidor' },
        { status: 500 }
      );
    }

    // Inicializar Gemini
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Chamar API com tratamento de erro específico
    try {
      const result = await model.generateContent(normalized);
      const response = result.response.text();

      return NextResponse.json({ response });
    } catch (geminiError: any) {
      console.error('Erro da API Gemini:', geminiError);
      
      // Tratar erros específicos da Gemini
      const errorMessage = geminiError?.message || 'Erro ao chamar o modelo de IA';
      
      if (errorMessage.includes('quota')) {
        return NextResponse.json(
          { error: 'Limite de uso da API excedido' },
          { status: 429 }
        );
      }
      
      if (errorMessage.includes('API key')) {
        return NextResponse.json(
          { error: 'Chave de API inválida' },
          { status: 401 }
        );
      }

      return NextResponse.json(
        { error: 'Erro ao processar sua mensagem com a IA' },
        { status: 502 }
      );
    }
  } catch (error: any) {
    console.error('Erro geral na API:', error);
    return NextResponse.json(
      { error: 'Erro ao processar requisição' },
      { status: 500 }
    );
  }
}
