import { GoogleGenerativeAI } from '@google/generative-ai'

if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
  throw new Error('NEXT_PUBLIC_GEMINI_API_KEY is not defined')
}

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY)

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface PropertyContext {
  title?: string
  price?: number
  location?: string
  type?: string
  bedrooms?: number
  bathrooms?: number
  area?: number
}

class GeminiClient {
  private model = genAI.getGenerativeModel({ model: 'gemini-pro' })

  async sendMessage(
    message: string,
    context?: PropertyContext,
    conversationHistory?: ChatMessage[]
  ): Promise<string> {
    try {
      // Build context-aware prompt
      let prompt = this.buildPrompt(message, context, conversationHistory)

      const result = await this.model.generateContent(prompt)
      const response = await result.response
      const text = response.text()

      return text
    } catch (error) {
      console.error('Error calling Gemini API:', error)
      throw new Error('Failed to get AI response')
    }
  }

  private buildPrompt(
    message: string,
    context?: PropertyContext,
    history?: ChatMessage[]
  ): string {
    let prompt = `Você é um assistente especializado em imóveis de luxo. `
    prompt += `Responda de forma profissional, prestativa e detalhada em português.\n\n`

    // Add property context if available
    if (context) {
      prompt += `Contexto do Imóvel:\n`
      if (context.title) prompt += `- Título: ${context.title}\n`
      if (context.price) prompt += `- Preço: R$ ${context.price.toLocaleString('pt-BR')}\n`
      if (context.location) prompt += `- Localização: ${context.location}\n`
      if (context.type) prompt += `- Tipo: ${context.type}\n`
      if (context.bedrooms) prompt += `- Quartos: ${context.bedrooms}\n`
      if (context.bathrooms) prompt += `- Banheiros: ${context.bathrooms}\n`
      if (context.area) prompt += `- Área: ${context.area}m²\n`
      prompt += `\n`
    }

    // Add conversation history
    if (history && history.length > 0) {
      prompt += `Histórico da Conversa:\n`
      history.slice(-5).forEach((msg) => {
        const role = msg.role === 'user' ? 'Usuário' : 'Assistente'
        prompt += `${role}: ${msg.content}\n`
      })
      prompt += `\n`
    }

    prompt += `Usuário: ${message}\n`
    prompt += `Assistente:`

    return prompt
  }

  async analyzeProperty(propertyData: PropertyContext): Promise<string> {
    const prompt = `
      Analise o seguinte imóvel de luxo e forneça insights sobre:
      1. Avaliação de preço (se está adequado ao mercado)
      2. Pontos fortes e diferenciais
      3. Público-alvo ideal
      4. Sugestões de melhoria ou destaque
      
      Dados do Imóvel:
      - Título: ${propertyData.title}
      - Preço: R$ ${propertyData.price?.toLocaleString('pt-BR')}
      - Localização: ${propertyData.location}
      - Tipo: ${propertyData.type}
      - Quartos: ${propertyData.bedrooms}
      - Banheiros: ${propertyData.bathrooms}
      - Área: ${propertyData.area}m²
      
      Forneça uma análise detalhada e profissional.
    `

    try {
      const result = await this.model.generateContent(prompt)
      const response = await result.response
      return response.text()
    } catch (error) {
      console.error('Error analyzing property:', error)
      throw new Error('Failed to analyze property')
    }
  }

  async generatePropertyDescription(propertyData: PropertyContext): Promise<string> {
    const prompt = `
      Crie uma descrição atrativa e profissional para o seguinte imóvel de luxo:
      
      - Tipo: ${propertyData.type}
      - Localização: ${propertyData.location}
      - Quartos: ${propertyData.bedrooms}
      - Banheiros: ${propertyData.bathrooms}
      - Área: ${propertyData.area}m²
      - Preço: R$ ${propertyData.price?.toLocaleString('pt-BR')}
      
      A descrição deve:
      - Ser persuasiva e elegante
      - Destacar os principais atributos
      - Ter entre 150-200 palavras
      - Usar linguagem sofisticada mas acessível
    `

    try {
      const result = await this.model.generateContent(prompt)
      const response = await result.response
      return response.text()
    } catch (error) {
      console.error('Error generating description:', error)
      throw new Error('Failed to generate description')
    }
  }
}

export const geminiClient = new GeminiClient()
