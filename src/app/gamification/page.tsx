'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import XPProgressBar from '@/components/XPProgressBar';
import GamificationBadges from '@/components/GamificationBadges';
import { Trophy, Target, TrendingUp } from 'lucide-react';
import type { GamificationStats, ApiResponse } from '@/types/index';

export default function GamificationPage() {
  const router = useRouter();
  const [stats, setStats] = useState<GamificationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/gamification');

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/auth/login');
          return;
        }
        throw new Error('Failed to fetch gamification stats');
      }

      const data: ApiResponse<GamificationStats> = await response.json();
      setStats(data.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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

  if (error || !stats) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 text-red-600 p-6 rounded-md text-center">
          <p className="text-lg font-medium mb-2">Erro</p>
          <p>{error || 'Falha ao carregar estatísticas'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Trophy className="h-8 w-8 text-yellow-500" />
          Gamificação
        </h1>
        <p className="text-gray-600 mt-1">
          Acompanhe seu progresso, nível e badges desbloqueadas
        </p>
      </div>

      <div className="space-y-6">
        <XPProgressBar
          xp={stats.xp}
          level={stats.level}
          nextLevelXP={stats.next_level_xp}
          progressToNextLevel={stats.progress_to_next_level}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Target className="h-5 w-5 text-blue-500" />
                Propriedades
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.total_properties}</div>
              <p className="text-sm text-gray-600 mt-1">Total criadas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5 text-green-500" />
                Leads
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.total_leads}</div>
              <p className="text-sm text-gray-600 mt-1">Total gerenciados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Badges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.badges.length}</div>
              <p className="text-sm text-gray-600 mt-1">Desbloqueadas</p>
            </CardContent>
          </Card>
        </div>

        <GamificationBadges badges={stats.badges} />

        {stats.recent_activities.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Atividades Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.recent_activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{activity.description}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(activity.created_at).toLocaleString('pt-PT')}
                      </p>
                    </div>
                    {activity.xp > 0 && (
                      <div className="text-yellow-600 font-semibold">
                        +{activity.xp} XP
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
