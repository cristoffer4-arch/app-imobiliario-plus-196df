import { createBrowserClient, createServerClient } from '@supabase/ssr';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseDatabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_DATABASE_URL || supabaseUrl;

export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey);

export function createClient() {
  return createBrowserClient(
    supabaseDatabaseUrl,
    supabaseAnonKey
  );
}

export async function createServerSupabaseClient() {
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  
  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}

// Tipos do banco de dados
export interface Imovel {
  id: string;
  titulo: string;
  descricao?: string;
  tipo: string;
  preco: number;
  area_m2?: number;
  quartos?: number;
  banheiros?: number;
  endereco: string;
  cidade: string;
  estado?: string;
  cep?: string;
  latitude?: number;
  longitude?: number;
  status: 'disponivel' | 'vendido' | 'reservado';
  data_venda?: string;
  fonte?: string;
  url_origem?: string;
  imagens?: string[];
  caracteristicas?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: string;
  nome: string;
  email?: string;
  telefone?: string;
  interesse_tipo?: string;
  interesse_cidade?: string;
  orcamento_min?: number;
  orcamento_max?: number;
  status: 'novo' | 'contatado' | 'qualificado' | 'convertido';
  origem?: string;
  notas?: string;
  created_at: string;
  updated_at: string;
}

export interface Venda {
  id: string;
  imovel_id: string;
  lead_id?: string;
  valor_venda: number;
  comissao_percentual?: number;
  comissao_valor?: number;
  data_venda: string;
  status: 'concluida' | 'cancelada';
  observacoes?: string;
  created_at: string;
}

export interface HistoricoScraping {
  id: string;
  fonte: string;
  url: string;
  imoveis_encontrados: number;
  imoveis_novos: number;
  imoveis_atualizados: number;
  status: 'sucesso' | 'erro' | 'parcial';
  mensagem?: string;
  created_at: string;
}

export interface Notificacao {
  id: string;
  titulo: string;
  mensagem: string;
  tipo: 'info' | 'sucesso' | 'alerta' | 'erro';
  prioridade: 'baixa' | 'media' | 'alta';
  lida: boolean;
  data: string;
  created_at: string;
}
