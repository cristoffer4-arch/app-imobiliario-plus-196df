'use client';

import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, Zap } from 'lucide-react';
import { XP_PER_LEVEL } from '@/lib/gamification-constants';

interface XPProgressBarProps {
  xp: number;
  level: number;
  nextLevelXP: number;
  progressToNextLevel: number;
}

export default function XPProgressBar({
  xp,
  level,
  nextLevelXP,
  progressToNextLevel,
}: XPProgressBarProps) {
  const currentLevelXP = (level - 1) * XP_PER_LEVEL;
  const xpInCurrentLevel = xp - currentLevelXP;

  return (
    <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-3 rounded-full">
              <Trophy className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-2xl font-bold">Nível {level}</h3>
              <p className="text-sm text-white/80">
                {xp.toLocaleString('pt-PT')} XP Total
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 text-yellow-300">
              <Zap className="h-5 w-5" />
              <span className="text-lg font-semibold">
                {xpInCurrentLevel}/{XP_PER_LEVEL}
              </span>
            </div>
            <p className="text-xs text-white/70">XP para próximo nível</p>
          </div>
        </div>

        <div className="space-y-2">
          <Progress value={progressToNextLevel} className="h-3 bg-white/20" />
          <div className="flex justify-between text-xs text-white/70">
            <span>Nível {level}</span>
            <span>{Math.round(progressToNextLevel)}%</span>
            <span>Nível {level + 1}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
