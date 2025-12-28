import PricingPlans from '@/components/pricing/PricingPlans';

export const metadata = {
  title: 'Planos e Preços | Imobiliário GO',
  description: 'Escolha o plano ideal para investir em imóveis de luxo com inteligência artificial',
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <PricingPlans />
    </div>
  );
}
