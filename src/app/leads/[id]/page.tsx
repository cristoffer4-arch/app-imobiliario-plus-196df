'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import LeadForm from '@/components/LeadForm';
import { ArrowLeft, Edit, Mail, Phone, MessageSquare } from 'lucide-react';
import type { Lead, ApiResponse } from '@/types/index';

export default function LeadDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (id) {
      fetchLead();
    }
  }, [id]);

  const fetchLead = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/leads/${id}`);

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/auth/login');
          return;
        }
        if (response.status === 404) {
          throw new Error('Lead não encontrado');
        }
        throw new Error('Falha ao carregar lead');
      }

      const result: ApiResponse<Lead> = await response.json();
      setLead(result.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-lg text-gray-500">A carregar...</div>
        </div>
      </div>
    );
  }

  if (error || !lead) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 text-red-600 p-6 rounded-md text-center">
            <p className="text-lg font-medium mb-2">Erro</p>
            <p>{error || 'Lead não encontrado'}</p>
            <Link href="/leads">
              <Button variant="outline" className="mt-4">
                Voltar para Leads
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
          <h1 className="text-3xl font-bold mb-6">Editar Lead</h1>
          <LeadForm
            lead={lead}
            onSuccess={() => {
              setEditing(false);
              fetchLead();
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
        <Link href="/leads">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Leads
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
                <CardTitle className="text-2xl mb-2">{lead.name}</CardTitle>
                <div className="flex gap-2">
                  {getStatusBadge(lead.status)}
                  {getPriorityBadge(lead.priority)}
                  {lead.ai_score && (
                    <Badge variant={lead.ai_score >= 70 ? 'default' : 'secondary'}>
                      Score: {lead.ai_score}/100
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {lead.email && (
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-gray-500 mt-1" />
                  <div>
                    <div className="text-sm text-gray-500">Email</div>
                    <a href={`mailto:${lead.email}`} className="font-medium text-blue-600 hover:underline">
                      {lead.email}
                    </a>
                  </div>
                </div>
              )}

              {lead.phone && (
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-gray-500 mt-1" />
                  <div>
                    <div className="text-sm text-gray-500">Telefone</div>
                    <a href={`tel:${lead.phone}`} className="font-medium text-blue-600 hover:underline">
                      {lead.phone}
                    </a>
                  </div>
                </div>
              )}
            </div>

            {lead.message && (
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Mensagem
                </h3>
                <p className="text-gray-700 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
                  {lead.message}
                </p>
              </div>
            )}

            <div className="pt-4 border-t">
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                <div>
                  <span className="font-medium">Origem:</span> {lead.source || 'N/A'}
                </div>
                <div>
                  <span className="font-medium">Criado em:</span>{' '}
                  {new Date(lead.created_at).toLocaleDateString('pt-PT')}
                </div>
                {lead.last_contacted_at && (
                  <div>
                    <span className="font-medium">Último contacto:</span>{' '}
                    {new Date(lead.last_contacted_at).toLocaleDateString('pt-PT')}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
