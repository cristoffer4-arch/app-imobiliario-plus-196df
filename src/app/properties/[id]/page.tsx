'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import PropertyForm from '@/components/PropertyForm';
import { ArrowLeft, Edit, MapPin, Home, Bed, Bath, Maximize } from 'lucide-react';
import type { Property, ApiResponse } from '@/types/index';

export default function PropertyDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProperty();
    }
  }, [id]);

  const fetchProperty = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/properties/${id}`);

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/auth/login');
          return;
        }
        if (response.status === 404) {
          throw new Error('Propriedade não encontrada');
        }
        throw new Error('Falha ao carregar propriedade');
      }

      const result: ApiResponse<Property> = await response.json();
      setProperty(result.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price?: number) => {
    if (!price) return 'N/A';
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getTypeName = (type: string) => {
    const types: Record<string, string> = {
      apartment: 'Apartamento',
      house: 'Moradia',
      condo: 'Condomínio',
      land: 'Terreno',
      commercial: 'Comercial',
    };
    return types[type] || type;
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      active: 'default',
      pending: 'secondary',
      sold: 'destructive',
      rented: 'outline',
    };

    const labels: Record<string, string> = {
      active: 'Ativo',
      pending: 'Pendente',
      sold: 'Vendido',
      rented: 'Arrendado',
    };

    return (
      <Badge variant={variants[status] || 'default'}>
        {labels[status] || status}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-lg text-gray-500">A carregar...</div>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 text-red-600 p-6 rounded-md text-center">
            <p className="text-lg font-medium mb-2">Erro</p>
            <p>{error || 'Propriedade não encontrada'}</p>
            <Link href="/properties">
              <Button variant="outline" className="mt-4">
                Voltar para Propriedades
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (editing) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Cancelar Edição
          </Button>
        </div>

        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Editar Propriedade</h1>
          <PropertyForm
            property={property}
            onSuccess={() => {
              setEditing(false);
              fetchProperty();
            }}
            onCancel={() => setEditing(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <Link href="/properties">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Propriedades
          </Button>
        </Link>
        <Button onClick={() => setEditing(true)}>
          <Edit className="mr-2 h-4 w-4" />
          Editar
        </Button>
      </div>

      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl mb-2">{property.title}</CardTitle>
                {getStatusBadge(property.status)}
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-blue-600">
                  {formatPrice(property.price)}
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <Home className="h-5 w-5 text-gray-500" />
                <div>
                  <div className="text-sm text-gray-500">Tipo</div>
                  <div className="font-medium">{getTypeName(property.property_type)}</div>
                </div>
              </div>

              {property.bedrooms !== undefined && property.bedrooms !== null && (
                <div className="flex items-center gap-2">
                  <Bed className="h-5 w-5 text-gray-500" />
                  <div>
                    <div className="text-sm text-gray-500">Quartos</div>
                    <div className="font-medium">{property.bedrooms}</div>
                  </div>
                </div>
              )}

              {property.bathrooms !== undefined && property.bathrooms !== null && (
                <div className="flex items-center gap-2">
                  <Bath className="h-5 w-5 text-gray-500" />
                  <div>
                    <div className="text-sm text-gray-500">Casas de Banho</div>
                    <div className="font-medium">{property.bathrooms}</div>
                  </div>
                </div>
              )}

              {property.area && (
                <div className="flex items-center gap-2">
                  <Maximize className="h-5 w-5 text-gray-500" />
                  <div>
                    <div className="text-sm text-gray-500">Área</div>
                    <div className="font-medium">{property.area}m²</div>
                  </div>
                </div>
              )}
            </div>

            {(property.address || property.city || property.district) && (
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Localização
                </h3>
                <div className="text-gray-700">
                  {property.address && <div>{property.address}</div>}
                  <div>
                    {property.city}
                    {property.district && `, ${property.district}`}
                    {property.postal_code && ` - ${property.postal_code}`}
                  </div>
                </div>
              </div>
            )}

            {property.description && (
              <div>
                <h3 className="font-semibold mb-2">Descrição</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{property.description}</p>
              </div>
            )}

            <div className="pt-4 border-t">
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                <div>
                  <span className="font-medium">Criado em:</span>{' '}
                  {new Date(property.created_at).toLocaleDateString('pt-PT')}
                </div>
                <div>
                  <span className="font-medium">Atualizado em:</span>{' '}
                  {new Date(property.updated_at).toLocaleDateString('pt-PT')}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
