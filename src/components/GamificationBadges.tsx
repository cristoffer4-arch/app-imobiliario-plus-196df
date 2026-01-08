'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, Lock, Star, Crown, Zap } from 'lucide-react';
import type { UserBadge, Badge as BadgeType } from '@/types/index';

interface GamificationBadgesProps {
  badges: UserBadge[];
  totalBadges?: number;
}

export default function GamificationBadges({ badges, totalBadges = 20 }: GamificationBadgesProps) {
  const getRarityColor = (rarity: string) => {
    const colors: Record<string, string> = {
      common: 'bg-gray-100 text-gray-800 border-gray-300',
      rare: 'bg-blue-100 text-blue-800 border-blue-300',
      epic: 'bg-purple-100 text-purple-800 border-purple-300',
      legendary: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    };
    return colors[rarity] || colors.common;
  };

  const getRarityIcon = (rarity: string) => {
    const icons: Record<string, JSX.Element> = {
      common: <Star className="h-4 w-4" />,
      rare: <Award className="h-4 w-4" />,
      epic: <Crown className="h-4 w-4" />,
      legendary: <Zap className="h-4 w-4" />,
    };
    return icons[rarity] || icons.common;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Badges Desbloqueadas</span>
          <span className="text-sm font-normal text-gray-500">
            {badges.length} / {totalBadges}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {badges.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Lock className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>Ainda não desbloqueou nenhuma badge</p>
            <p className="text-sm mt-1">
              Complete ações para desbloquear badges e ganhar XP!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {badges.map((userBadge) => {
              const badge = userBadge.badge;
              if (!badge) return null;

              return (
                <div
                  key={userBadge.id}
                  className={`relative p-4 rounded-lg border-2 ${getRarityColor(
                    badge.rarity
                  )} transition-transform hover:scale-105`}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-2">{badge.icon || '🏆'}</div>
                    <h4 className="font-semibold text-sm mb-1">{badge.name}</h4>
                    <p className="text-xs text-gray-600 mb-2">{badge.description}</p>

                    <div className="flex items-center justify-center gap-1 mb-2">
                      {getRarityIcon(badge.rarity)}
                      <Badge variant="outline" className="text-xs">
                        {badge.rarity}
                      </Badge>
                    </div>

                    {badge.xp_reward > 0 && (
                      <div className="text-xs text-gray-600 mb-1">
                        <Zap className="h-3 w-3 inline mr-1 text-yellow-500" />
                        +{badge.xp_reward} XP
                      </div>
                    )}

                    <div className="text-xs text-gray-500">
                      {formatDate(userBadge.unlocked_at)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {badges.length > 0 && badges.length < totalBadges && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Lock className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Ainda há {totalBadges - badges.length} badges para desbloquear!
                </p>
                <p className="text-xs text-gray-500">
                  Continue criando propriedades, gerenciando leads e atingindo metas.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
