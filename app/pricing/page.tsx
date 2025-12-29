'use client';

import { useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { PRICING_PLANS } from '@/lib/stripe';

export default function PricingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSelectPlan = async (planId: string) => {
    if (planId === 'FREE') {
      router.push('/dashboard');
      return;
    }

    setLoading(planId);
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planId }),
      });

      const data = await response.json();

      if (response.ok && data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Erro ao criar sessão de checkout');
        setLoading(null);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Erro ao processar solicitação');
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-4">
            Escolha o Plano Ideal
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Acesso completo às melhores propriedades com inteligência artificial
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {Object.values(PRICING_PLANS).map((plan) => (
            <Card
              key={plan.id}
              className={`relative p-8 ${
                plan.popular
                  ? 'border-2 border-blue-500 shadow-xl scale-105'
                  : 'border border-gray-200'
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500">
                  MAIS POPULAR
                </Badge>
              )}

              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h3>
                <div className="flex items-baseline mb-4">
                  <span className="text-5xl font-extrabold text-gray-900">
                    €{plan.price}
                  </span>
                  <span className="ml-2 text-gray-500">/mês</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={() => handleSelectPlan(plan.id)}
                disabled={loading !== null}
                className={`w-full ${
                  plan.popular
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-gray-900 hover:bg-gray-800'
                }`}
              >
                {loading === plan.id ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processando...
                  </>
                ) : plan.id === 'FREE' ? (
                  'Começar Grátis'
                ) : (
                  'Assinar Agora'
                )}
              </Button>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-24 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Perguntas Frequentes
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Posso cancelar a qualquer momento?
              </h3>
              <p className="text-gray-600">
                Sim! Você pode cancelar sua assinatura a qualquer momento sem
                taxas adicionais. Seu plano permanecerá ativo até o final do
                período pago.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Como funciona o período de teste?
              </h3>
              <p className="text-gray-600">
                Novos usuários recebem 7 dias de teste gratuito em qualquer
                plano pago. Você pode cancelar antes do término sem cobranças.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Posso fazer upgrade ou downgrade?
              </h3>
              <p className="text-gray-600">
                Sim! Você pode mudar de plano a qualquer momento. O valor será
                ajustado proporcionalmente.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
