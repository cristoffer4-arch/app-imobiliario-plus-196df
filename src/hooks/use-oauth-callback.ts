import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

/**
 * Hook para processar callback OAuth do Google
 * Extrai tokens do hash da URL e configura a sessão do Supabase
 * Fix para Issue #1: App travado no loading screen após correção OAuth
 */
export function useOAuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const processOAuthCallback = async () => {
      try {
        // Extrair parâmetros do hash da URL
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');

        // Se não houver tokens, não é um callback OAuth
        if (!accessToken || !refreshToken) {
          return;
        }

        console.log('🔐 Processando tokens OAuth do callback...');

        // Configurar sessão no Supabase com os tokens
        const { data, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (error) {
          console.error('❌ Erro ao configurar sessão OAuth:', error);
          throw error;
        }

        console.log('✅ Sessão OAuth configurada com sucesso');
        console.log('👤 Usuário autenticado:', data.user?.email);

        // Limpar hash da URL
        window.location.hash = '';
        
        // Redirecionar para o dashboard
        navigate('/dashboard', { replace: true });
        
      } catch (err) {
        console.error('❌ Erro no processamento do callback OAuth:', err);
        // Em caso de erro, redirecionar para login
        navigate('/login', { replace: true });
      }
    };

    processOAuthCallback();
  }, [navigate]);
}
