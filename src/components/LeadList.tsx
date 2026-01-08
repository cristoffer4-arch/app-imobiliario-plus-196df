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
import { Edit, Trash2, Eye, Search, Phone, Mail } from 'lucide-react';
import type { Lead } from '@/types/index';

interface LeadListProps {
  leads: Lead[];
  total?: number;
  page?: number;
  limit?: number;
  onPageChange?: (page: number) => void;
  onDelete?: (id: string) => void;
}

export default function LeadList({
  leads,
  total = 0,
  page = 1,
  limit = 20,
  onPageChange,
  onDelete,
}: LeadListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      new: 'default',
      contacted: 'secondary',
      meeting_scheduled: 'secondary',
      proposal_sent: 'outline',
      converted: 'default',
      lost: 'destructive',
    };

    const labels: Record<string, string> = {
      new: 'Novo',
      contacted: 'Contactado',
      meeting_scheduled: 'Reunião Agendada',
      proposal_sent: 'Proposta Enviada',
      converted: 'Convertido',
      lost: 'Perdido',
    };

    return (
      <Badge variant={variants[status] || 'default'}>
        {labels[status] || status}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      low: 'secondary',
      medium: 'default',
      high: 'outline',
      urgent: 'destructive',
    };

    const labels: Record<string, string> = {
      low: 'Baixa',
      medium: 'Média',
      high: 'Alta',
      urgent: 'Urgente',
    };

    return (
      <Badge variant={variants[priority] || 'default'}>
        {labels[priority] || priority}
      </Badge>
    );
  };

  const getSourceName = (source?: string) => {
    const sources: Record<string, string> = {
      idealista: 'Idealista',
      imovirtual: 'Imovirtual',
      olx: 'OLX',
      website: 'Website',
      referral: 'Referência',
      other: 'Outro',
    };
    return sources[source || 'other'] || source || 'N/A';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja eliminar este lead?')) {
      return;
    }

    if (onDelete) {
      onDelete(id);
    }
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      searchTerm === '' ||
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || lead.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || lead.priority === filterPriority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const totalPages = Math.ceil(total / limit);

  if (leads.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-gray-500">Nenhum lead encontrado</p>
          <Link href="/leads/new">
            <Button className="mt-4">Criar Primeiro Lead</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Leads ({total})</CardTitle>
        <div className="flex gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Pesquisar por nome, email ou telefone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Status</SelectItem>
              <SelectItem value="new">Novo</SelectItem>
              <SelectItem value="contacted">Contactado</SelectItem>
              <SelectItem value="meeting_scheduled">Reunião Agendada</SelectItem>
              <SelectItem value="proposal_sent">Proposta Enviada</SelectItem>
              <SelectItem value="converted">Convertido</SelectItem>
              <SelectItem value="lost">Perdido</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterPriority} onValueChange={setFilterPriority}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Prioridade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas Prioridades</SelectItem>
              <SelectItem value="low">Baixa</SelectItem>
              <SelectItem value="medium">Média</SelectItem>
              <SelectItem value="high">Alta</SelectItem>
              <SelectItem value="urgent">Urgente</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Contacto</TableHead>
              <TableHead>Origem</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Prioridade</TableHead>
              <TableHead>Pontuação</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLeads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell className="font-medium">{lead.name}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1 text-sm">
                    {lead.email && (
                      <div className="flex items-center gap-1 text-gray-600">
                        <Mail className="h-3 w-3" />
                        {lead.email}
                      </div>
                    )}
                    {lead.phone && (
                      <div className="flex items-center gap-1 text-gray-600">
                        <Phone className="h-3 w-3" />
                        {lead.phone}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>{getSourceName(lead.source)}</TableCell>
                <TableCell>{getStatusBadge(lead.status)}</TableCell>
                <TableCell>{getPriorityBadge(lead.priority)}</TableCell>
                <TableCell>
                  {lead.ai_score ? (
                    <Badge variant={lead.ai_score >= 70 ? 'default' : 'secondary'}>
                      {lead.ai_score}/100
                    </Badge>
                  ) : (
                    'N/A'
                  )}
                </TableCell>
                <TableCell className="text-sm text-gray-600">
                  {formatDate(lead.created_at)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex gap-2 justify-end">
                    <Link href={`/leads/${lead.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={`/leads/${lead.id}/edit`}>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(lead.id)}
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
