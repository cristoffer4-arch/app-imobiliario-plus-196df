'use client'

import { useOAuthCallback } from '@/hooks/use-oauth-callback'

/**
 * Componente Client para processar callback OAuth
 * Este componente usa o hook useOAuthCallback para processar
 * tokens OAuth do Google após o redirecionamento
 */
export function OAuthHandler() {
  // Hook processa automaticamente os tokens do hash da URL
  useOAuthCallback()
  
  // Não renderiza nada visualmente
  return null
}
