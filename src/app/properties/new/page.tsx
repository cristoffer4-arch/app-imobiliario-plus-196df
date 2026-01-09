'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import PropertyForm from '@/components/PropertyForm';
import { ArrowLeft } from 'lucide-react';

// Disable prerendering for this page to avoid server-side hook errors
export const dynamic = 'force-dynamic';

export default function NewPropertyPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push('/properties');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/properties">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Propriedades
          </Button>
        </Link>
      </div>

      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Nova Propriedade</h1>
        <PropertyForm onSuccess={handleSuccess} />
      </div>
    </div>
  );
}
