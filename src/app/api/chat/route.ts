import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string | Date;
};

type PropertyContext = {
  title?: string;
  price?: number;
  location?: string;
  type?: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
};

// Forçar runtime Node.js
export const runtime = 'nodejs';

const buildPrompt = (
  message: string,
  context?: PropertyContext,
  history?: ChatMessage[]
) => {
  let prompt = 'Você é um assistente especializado em imóveis de luxo. ';
  prompt += 'Responda de forma profissional, prestativa e detalhada em português.\n\n';

  if (context && typeof context === 'object') {
    prompt += 'Contexto do Imóvel:\n';
    if (context.title) prompt += `- Título: ${context.title}\n`;
    if (context.price) prompt += `- Preço: R$ ${context.price.toLocaleString('pt-BR')}\n`;
    if (context.location) prompt += `- Localização: ${context.location}\n`;
    if (context.type) prompt += `- Tipo: ${context.type}\n`;
    if (context.bedrooms) prompt += `- Quartos: ${context.bedrooms}\n`;
    if (context.bathrooms) prompt += `- Banheiros: ${context.bathrooms}\n`;
    if (context.area) prompt += `- Área: ${context.area}m²\n`;
    prompt += '\n';
  }

  if (Array.isArray(history) && history.length > 0) {
    prompt += 'Histórico da Conversa:\n';
    history.slice(-5).forEach((msg) => {
      if (!msg?.content || !msg?.role) return;
      const role = msg.role === 'user' ? 'Usuário' : 'Assistente';
      prompt += `${role}: ${msg.content}\n`;
    });
    prompt += '\n';
  }

  prompt += `Usuário: ${message}\nAssistente:`;
  return prompt;
};

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

    const { prompt, message, context, history } = body as {
      prompt?: string;
      message?: string;
      context?: PropertyContext;
      history?: ChatMessage[];
    };

    const userInput = typeof prompt === 'string' && prompt.trim()
      ? prompt.trim()
      : typeof message === 'string' && message.trim()
        ? message.trim()
        : '';

    if (!userInput) {
      return NextResponse.json(
        { error: 'Prompt é obrigatório' },
        { status: 400 }
      );
    }

    // Verificar tamanho máximo
    if (userInput.length > 10000) {
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
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const promptWithContext = buildPrompt(userInput, context, history);

    // Chamar API com tratamento de erro específico
    try {
      const result = await model.generateContent(promptWithContext);
      const response = result.response.text();

      return NextResponse.json({
        message: response,
        timestamp: new Date().toISOString(),
      });
    } catch (geminiError: unknown) {
      console.error('Erro da API Gemini:', geminiError);
      
      // Tratar erros específicos da Gemini
      const errorMessage = geminiError instanceof Error
        ? geminiError.message
        : 'Erro ao chamar o modelo de IA';
      
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
  } catch (error: unknown) {
    console.error('Erro geral na API:', error);
    return NextResponse.json(
      { error: 'Erro ao processar requisição' },
      { status: 500 }
    );
  }
}
