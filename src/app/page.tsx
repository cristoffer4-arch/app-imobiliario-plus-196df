'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import type { Session } from '@supabase/supabase-js';

export default function HomePage() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [signingIn, setSigningIn] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    // Verificar sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
      
      // Se já estiver logado, redirecionar
      if (session) {
        router.push('/imoveis');
      }
    });

    // Escutar mudanças na autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        router.push('/imoveis');
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase, router]);

  const handleGoogleSignIn = async () => {
    try {
      setSigningIn(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        console.error('Erro ao fazer login:', error.message);
        alert('Erro ao fazer login. Por favor, tente novamente.');
        setSigningIn(false);
      }
    } catch (error) {
      console.error('Erro inesperado:', error);
      setSigningIn(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
          <p className="text-slate-400 font-light tracking-wide">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient orbs */}
        <div className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-amber-500/10 to-transparent blur-3xl animate-pulse" 
             style={{ animationDuration: '8s' }} />
        <div className="absolute -bottom-1/2 -left-1/4 w-[800px] h-[800px] rounded-full bg-gradient-to-tr from-amber-600/10 to-transparent blur-3xl animate-pulse" 
             style={{ animationDuration: '10s', animationDelay: '2s' }} />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(251,191,36,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(251,191,36,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 px-6 py-6 lg:px-12">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center shadow-lg shadow-amber-500/20 transition-transform group-hover:scale-105">
              <svg className="w-6 h-6 text-slate-950" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3L4 9V21H9V14H15V21H20V9L12 3Z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent tracking-tight">
                Lux.ai
              </h1>
              <p className="text-xs text-slate-500 tracking-wider">GESTÃO IMOBILIÁRIA</p>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 px-6 lg:px-12 pt-12 lg:pt-24 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Left Column - Text Content */}
            <div className="space-y-8 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 backdrop-blur-sm">
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-sm text-amber-400 font-medium tracking-wide">
                  Plataforma Inteligente
                </span>
              </div>

              <div className="space-y-6">
                <h2 className="text-5xl lg:text-7xl font-bold leading-tight">
                  <span className="text-white">Gestão</span>
                  <br />
                  <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent">
                    Imobiliária
                  </span>
                  <br />
                  <span className="text-slate-400 text-4xl lg:text-5xl">do Futuro</span>
                </h2>

                <p className="text-lg lg:text-xl text-slate-400 leading-relaxed max-w-xl font-light">
                  Transforme sua operação imobiliária com inteligência artificial. 
                  Gerencie propriedades, clientes e transações em uma plataforma 
                  moderna e intuitiva.
                </p>
              </div>

              {/* Features List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                {[
                  { icon: '🏠', text: 'Gestão de Imóveis' },
                  { icon: '👥', text: 'CRM Integrado' },
                  { icon: '📊', text: 'Analytics Avançado' },
                  { icon: '🤖', text: 'IA Assistente' },
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 backdrop-blur-sm hover:border-amber-500/30 transition-all duration-300 group cursor-default"
                    style={{ 
                      animation: `slideInLeft 0.6s ease-out ${index * 0.1}s backwards` 
                    }}
                  >
                    <span className="text-2xl group-hover:scale-110 transition-transform">
                      {feature.icon}
                    </span>
                    <span className="text-slate-300 font-medium">
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Sign In Card */}
            <div className="relative animate-fade-in-delay">
              {/* Glow effect behind card */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-transparent rounded-3xl blur-2xl" />
              
              <div className="relative bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 lg:p-12 shadow-2xl">
                <div className="space-y-8">
                  <div className="text-center space-y-3">
                    <h3 className="text-3xl font-bold text-white">
                      Bem-vindo de volta
                    </h3>
                    <p className="text-slate-400 font-light">
                      Entre para acessar sua plataforma
                    </p>
                  </div>

                  {/* Decorative line */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-700/50" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="bg-slate-900 px-4 text-slate-500 tracking-wider">
                        AUTENTICAÇÃO SEGURA
                      </span>
                    </div>
                  </div>

                  {/* Google Sign In Button */}
                  <button
                    onClick={handleGoogleSignIn}
                    disabled={signingIn}
                    className="w-full group relative overflow-hidden bg-white hover:bg-gray-50 text-slate-900 font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    <div className="flex items-center justify-center gap-3">
                      {signingIn ? (
                        <>
                          <div className="w-5 h-5 border-3 border-slate-300 border-t-slate-900 rounded-full animate-spin" />
                          <span>Conectando...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path
                              fill="#4285F4"
                              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                              fill="#34A853"
                              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                              fill="#FBBC05"
                              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                              fill="#EA4335"
                              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                          </svg>
                          <span>Continuar com Google</span>
                        </>
                      )}
                    </div>
                    
                    {/* Shine effect on hover */}
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  </button>

                  {/* Security badges */}
                  <div className="pt-6 border-t border-slate-700/50">
                    <div className="flex items-center justify-center gap-6 text-xs text-slate-500">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 1l6 3v5c0 4.42-3.58 8-8 8s-8-3.58-8-8V4l6-3zm0 2.18L5 5.45v3.89c0 3.31 2.69 6 6 6s6-2.69 6-6V5.45L10 3.18z"/>
                          <path d="M9 11.59l-2.3-2.3-1.4 1.42L9 14.41l5.7-5.7-1.4-1.42L9 11.59z"/>
                        </svg>
                        <span>Conexão segura</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/>
                        </svg>
                        <span>OAuth 2.0</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-6 lg:px-12 pb-8">
        <div className="max-w-7xl mx-auto border-t border-slate-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
            <p>© 2024 Lux.ai. Todos os direitos reservados.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-amber-400 transition-colors">Termos</a>
              <a href="#" className="hover:text-amber-400 transition-colors">Privacidade</a>
              <a href="#" className="hover:text-amber-400 transition-colors">Suporte</a>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animate-fade-in-delay {
          animation: fade-in 0.8s ease-out 0.2s backwards;
        }
      `}</style>
    </div>
  );
}
