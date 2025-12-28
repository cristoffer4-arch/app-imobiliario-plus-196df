'use client';

import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  cta: string;
  popular?: boolean;
}

const plans: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 29,
    period: '/mês',
    description: 'Para compradores e investidores iniciantes',
    features: [
      'Até 10 propriedades salvas',
      'Pesquisa básica com filtros',
      'Mapas interativos básicos',
      '5 consultas IA/dia',
      'Alertas de email semanais',
      'Comparação até 3 propriedades',
      'Suporte por email'
    ],
    cta: 'Começar Agora'
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 79,
    period: '/mês',
    description: 'Para profissionais e investidores ativos',
    features: [
      'Propriedades ilimitadas',
      'Todos os filtros avançados',
      'Mapas com heatmap e clustering',
      '50 consultas IA/dia',
      'Alertas em tempo real',
      'Comparação ilimitada',
      'Análise de ROI e valorização',
      'Dashboard de investimentos',
      'Exportação de dados (PDF/Excel)',
      'Suporte prioritário'
    ],
    cta: 'Upgrade para Pro',
    popular: true
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 149,
    period: '/mês',
    description: 'Para agências e investidores profissionais',
    features: [
      'Tudo do Professional +',
      'Consultas IA ilimitadas',
      'API access completo',
      'Relatórios personalizados',
      'Análise preditiva de mercado',
      'Integração CRM',
      'White-label (sob consulta)',
      'Múltiplos usuários (até 5)',
      'Suporte dedicado 24/7',
      'Consultoria mensal'
    ],
    cta: 'Falar com Vendas'
  }
];

export default function PricingPlans() {
  const router = useRouter();

  const handlePlanSelect = async (planId: string) => {
    // Redirect to signup/checkout with plan selection
    router.push(`/auth/signup?plan=${planId}`);
  };

  return (
    <div className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-4">
            Escolha o Plano Ideal
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Acesso completo às melhores propriedades de luxo com inteligência artificial
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative flex flex-col p-8 ${
                plan.popular
                  ? 'border-2 border-blue-500 shadow-xl scale-105'
                  : 'border border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-6 transform -translate-y-1/2">
                  <span className="inline-flex px-4 py-1 rounded-full text-sm font-semibold bg-blue-500 text-white">
                    Mais Popular
                  </span>
                </div>
              )}

              {/* Plan Header */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                <div className="flex items-baseline">
                  <span className="text-5xl font-bold text-gray-900">€{plan.price}</span>
                  <span className="ml-2 text-gray-600">{plan.period}</span>
                </div>
              </div>

              {/* Features List */}
              <ul className="space-y-4 mb-8 flex-grow">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <Button
                onClick={() => handlePlanSelect(plan.id)}
                className={`w-full ${
                  plan.popular
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-gray-900 hover:bg-gray-800'
                }`}
                size="lg"
              >
                {plan.cta}
              </Button>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-24 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Perguntas Frequentes</h2>
          <div className="max-w-3xl mx-auto space-y-6 text-left">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Posso mudar de plano a qualquer momento?</h3>
              <p className="text-gray-600">Sim, você pode fazer upgrade ou downgrade do seu plano a qualquer momento.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Existe desconto para pagamento anual?</h3>
              <p className="text-gray-600">Sim, oferecemos 20% de desconto para assinaturas anuais.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Posso cancelar minha assinatura?</h3>
              <p className="text-gray-600">Sim, você pode cancelar a qualquer momento sem penalidades.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
