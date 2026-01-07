'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { createClient } from '@/lib/supabase';
import { buildAbsoluteUrl } from '@/lib/site-url';

const PLAN_NAMES: Record<string, string> = 
  free: 'Free',{
  starter: 'Starter',
  professional: 'Professional',
  premium: 'Premium'
};

function SignupForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const supabase = createClient();
  const [selectedPlan, setSelectedPlan] = useState<string>('free');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  useEffect(() => {
    const plan = searchParams.get('plan');
    if (plan && PLAN_NAMES[plan]) {
      setSelectedPlan(plan);
    }
  }, [searchParams]);

  const handleGoogleSignup = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: buildAbsoluteUrl(`/auth/callback?plan=${selectedPlan}`),
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error signing up with Google:', error);
      alert('Erro ao fazer login com Google. Tente novamente.');
    }
  };

  const handleEmailSignup = async () => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { plan: selectedPlan }
        }
      });

      if (error) throw error;
      
      alert('Conta criada! Verifique seu email para confirmar.');
      router.push('/auth/login');
    } catch (error) {
      console.error('Error signing up:', error);
      alert('Erro ao criar conta. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center py-12 px-4">
      <Card className="max-w-md w-full p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Criar Conta
          </h1>
          <p className="text-gray-600">
            Plano selecionado: <span className="font-semibold">{PLAN_NAMES[selectedPlan]}</span>
          </p>
        </div>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <Button
            onClick={handleEmailSignup}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            size="lg"
          >
            Criar Conta
          </Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">ou</span>
            </div>
          </div>
          <Button
            onClick={handleGoogleSignup}
            className="w-full bg-white hover:bg-gray-50 text-gray-900 border border-gray-300"
            size="lg"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
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
            Continuar com Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">ou</span>
            </div>
          </div>

          <Button
            onClick={() => router.push('/pricing')}
            variant="outline"
            className="w-full"
            size="lg"
          >
            Voltar aos Planos
          </Button>
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          Ao criar uma conta, você concorda com nossos{' '}
          <a href="/termos" className="text-blue-600 hover:underline">
            Termos de Serviço
          </a>{' '}
          e{' '}
          <a href="/privacidade" className="text-blue-600 hover:underline">
            Política de Privacidade
          </a>
          .
        </p>
      </Card>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignupForm />
    </Suspense>
  );
}
