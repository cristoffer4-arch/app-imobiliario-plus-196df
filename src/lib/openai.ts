import OpenAI from 'openai';

// Inicializa o cliente OpenAI com a chave de API
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Gera uma resposta de chat usando o modelo GPT-4o
 * @param prompt - O prompt/pergunta do usuário
 * @param systemMessage - Mensagem de sistema opcional para definir o comportamento
 * @returns A resposta gerada pela IA
 */
export async function generateChatResponse(
  prompt: string,
  systemMessage: string = 'Você é um assistente útil e prestativo.'
) {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    return completion.choices[0]?.message?.content || 'Sem resposta';
  } catch (error) {
    console.error('Erro ao gerar resposta:', error);
    throw new Error('Falha ao gerar resposta da OpenAI');
  }
}

/**
 * Gera uma resposta estruturada em JSON
 * @param prompt - O prompt do usuário
 * @param schema - Descrição do schema JSON esperado
 * @returns Resposta em formato JSON
 */
export async function generateJSONResponse<T>(
  prompt: string,
  schema: string
): Promise<T> {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `Você deve responder APENAS com JSON válido seguindo este schema: ${schema}`,
        },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.5,
    });

    const content = completion.choices[0]?.message?.content || '{}';
    return JSON.parse(content) as T;
  } catch (error) {
    console.error('Erro ao gerar JSON:', error);
    throw new Error('Falha ao gerar resposta JSON da OpenAI');
  }
}

/**
 * Analisa texto e extrai informações específicas
 * @param text - Texto para análise
 * @param instruction - Instrução de análise
 * @returns Resultado da análise
 */
export async function analyzeText(text: string, instruction: string) {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'Você é um especialista em análise de texto.',
        },
        {
          role: 'user',
          content: `${instruction}\n\nTexto para análise:\n${text}`,
        },
      ],
      temperature: 0.3,
    });

    return completion.choices[0]?.message?.content || 'Análise não disponível';
  } catch (error) {
    console.error('Erro ao analisar texto:', error);
    throw new Error('Falha ao analisar texto com OpenAI');
  }
}
