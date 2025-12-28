'use client';

import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PricingCardProps {
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  cta: string;
  popular?: boolean;
  onSelect: () => void;
}

export default function PricingCard({
  name,
  price,
  period,
  description,
  features,
  cta,
  popular = false,
  onSelect
}: PricingCardProps) {
  return (
    <Card
      className={`relative flex flex-col p-8 transition-all ${
        popular
          ? 'border-2 border-blue-500 shadow-2xl scale-105'
          : 'border border-gray-200 hover:shadow-lg'
      }`}
    >
      {popular && (
        <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500">
          Mais Popular
        </Badge>
      )}

      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{name}</h3>
        <p className="text-gray-600 mb-4 min-h-12">{description}</p>
        <div className="flex items-baseline">
          <span className="text-5xl font-bold text-gray-900">€{price}</span>
          <span className="ml-2 text-gray-600">{period}</span>
        </div>
      </div>

      <ul className="space-y-4 mb-8 flex-grow">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
            <span className="text-gray-700 text-sm">{feature}</span>
          </li>
        ))}
      </ul>

      <Button
        onClick={onSelect}
        className={`w-full ${
          popular
            ? 'bg-blue-600 hover:bg-blue-700'
            : 'bg-gray-900 hover:bg-gray-800'
        }`}
        size="lg"
      >
        {cta}
      </Button>
    </Card>
  );
}
