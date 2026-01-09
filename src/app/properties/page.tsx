'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import PropertyList from '@/components/PropertyList';
import PropertyFiltersComponent, { PropertyFilters } from '@/components/PropertyFilters';
import { Plus } from 'lucide-react';
import type { Property, ApiListResponse } from '@/types/index';

export default function PropertiesPage() {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<PropertyFilters>({});

  const fetchProperties = async (currentPage: number) => {
    try {
      setLoading(true);
      setError(null);

      
      
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/auth/login');
          return;
        }
        throw new Error('Failed to fetch properties');
      }

      const data: ApiListResponse<Property> = await response.json();
      setProperties(data.data);
      setTotal(data.pagination.total);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties(page);
  }, [page], filters);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

    const handleFilterChange = (newFilters: PropertyFilters) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filters change
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/properties/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete property');
      }

      // Refresh the list
      fetchProperties(page);
    } catch (err: any) {
      alert(`Erro ao eliminar propriedade: ${err.message}`);
    }
  };

  if (loading && properties.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-lg text-gray-500">A carregar propriedades...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Propriedades</h1>
          <p className="text-gray-600 mt-1">
            Gerencie todas as suas propriedades em um só lugar
          </p>
        </div>
        <Link href="/properties/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nova Propriedade
          </Button>
        </Link>
      </div>

            <PropertyFiltersComponent
        onFilterChange={handleFilterChange}
        initialFilters={filters}
      />

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
          <p>{error}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchProperties(page)}
            className="mt-2"
          >
            Tentar novamente
          </Button>
        </div>
      )}

      <PropertyList
        properties={properties}
        total={total}
        page={page}
        limit={20}
        onPageChange={handlePageChange}
        onDelete={handleDelete}
      />
    </div>
  );
}
