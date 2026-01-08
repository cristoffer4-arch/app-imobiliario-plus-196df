'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Trash2, Eye, Search } from 'lucide-react';
import type { Property } from '@/types/index';

interface PropertyListProps {
  properties: Property[];
  total?: number;
  page?: number;
  limit?: number;
  onPageChange?: (page: number) => void;
  onDelete?: (id: string) => void;
}

export default function PropertyList({
  properties,
  total = 0,
  page = 1,
  limit = 20,
  onPageChange,
  onDelete,
}: PropertyListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

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

  const formatPrice = (price?: number) => {
    if (!price) return 'N/A';
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja eliminar esta propriedade?')) {
      return;
    }

    if (onDelete) {
      onDelete(id);
    }
  };

  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
      searchTerm === '' ||
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.city?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === 'all' || property.property_type === filterType;
    const matchesStatus = filterStatus === 'all' || property.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const totalPages = Math.ceil(total / limit);

  if (properties.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-gray-500">Nenhuma propriedade encontrada</p>
          <Link href="/properties/new">
            <Button className="mt-4">Criar Primeira Propriedade</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Propriedades ({total})</CardTitle>
        <div className="flex gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Pesquisar por título ou cidade..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Tipos</SelectItem>
              <SelectItem value="apartment">Apartamento</SelectItem>
              <SelectItem value="house">Moradia</SelectItem>
              <SelectItem value="condo">Condomínio</SelectItem>
              <SelectItem value="land">Terreno</SelectItem>
              <SelectItem value="commercial">Comercial</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Status</SelectItem>
              <SelectItem value="active">Ativo</SelectItem>
              <SelectItem value="pending">Pendente</SelectItem>
              <SelectItem value="sold">Vendido</SelectItem>
              <SelectItem value="rented">Arrendado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Localização</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Detalhes</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProperties.map((property) => (
              <TableRow key={property.id}>
                <TableCell className="font-medium">{property.title}</TableCell>
                <TableCell>{getTypeName(property.property_type)}</TableCell>
                <TableCell>{property.city || 'N/A'}</TableCell>
                <TableCell>{formatPrice(property.price)}</TableCell>
                <TableCell className="text-sm text-gray-600">
                  {property.bedrooms && `${property.bedrooms} quartos`}
                  {property.bedrooms && property.area && ' • '}
                  {property.area && `${property.area}m²`}
                </TableCell>
                <TableCell>{getStatusBadge(property.status)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <Link href={`/properties/${property.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={`/properties/${property.id}/edit`}>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(property.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {totalPages > 1 && onPageChange && (
          <div className="flex justify-center gap-2 mt-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page - 1)}
              disabled={page === 1}
            >
              Anterior
            </Button>
            <span className="flex items-center px-4 text-sm">
              Página {page} de {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page + 1)}
              disabled={page === totalPages}
            >
              Próxima
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
