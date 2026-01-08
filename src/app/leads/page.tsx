'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import LeadList from '@/components/LeadList';
import { Plus } from 'lucide-react';
import type { Lead, ApiListResponse } from '@/types/index';

export default function LeadsPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeads = async (currentPage: number) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/leads?page=${currentPage}&limit=20`);
      
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/auth/login');
          return;
        }
        throw new Error('Failed to fetch leads');
      }

      const data: ApiListResponse<Lead> = await response.json();
      setLeads(data.data);
      setTotal(data.pagination.total);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads(page);
  }, [page]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/leads/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete lead');
      }

      fetchLeads(page);
    } catch (err: any) {
      alert(`Erro ao eliminar lead: ${err.message}`);
    }
  };

  if (loading && leads.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-lg text-gray-500">A carregar leads...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Leads</h1>
          <p className="text-gray-600 mt-1">
            Gerencie todos os seus leads em um só lugar
          </p>
        </div>
        <Link href="/leads/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novo Lead
          </Button>
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
          <p>{error}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchLeads(page)}
            className="mt-2"
          >
            Tentar novamente
          </Button>
        </div>
      )}

      <LeadList
        leads={leads}
        total={total}
        page={page}
        limit={20}
        onPageChange={handlePageChange}
        onDelete={handleDelete}
      />
    </div>
  );
}
