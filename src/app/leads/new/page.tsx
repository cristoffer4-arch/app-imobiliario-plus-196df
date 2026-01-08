'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import LeadForm from '@/components/LeadForm';
import { ArrowLeft } from 'lucide-react';

export default function NewLeadPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push('/leads');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/leads">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Leads
          </Button>
        </Link>
      </div>

      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Novo Lead</h1>
        <LeadForm onSuccess={handleSuccess} />
      </div>
    </div>
  );
}
