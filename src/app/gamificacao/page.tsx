'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trophy, Star, Award, TrendingUp } from 'lucide-react'

export default function GamificacaoPage() {
  const [userPoints, setUserPoints] = useState(0)
  const [userLevel, setUserLevel] = useState(1)
  const [achievements, setAchievements] = useState<any[]>([])

  useEffect(() => {
    // Simular carregamento de dados do usuário
    setUserPoints(1250)
    setUserLevel(5)
    setAchievements([
      { id: 1, name: 'Primeira Venda', icon: Trophy, completed: true },
      { id: 2, name: '10 Propriedades Cadastradas', icon: Star, completed: true },
      { id: 3, name: 'Mestre do Atendimento', icon: Award, completed: false },
      { id: 4, name: 'Top Performer', icon: TrendingUp, completed: false },
    ])
  }, [])

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Gamificação</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Seus Pontos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary">{userPoints}</div>
            <p className="text-sm text-muted-foreground mt-2">Continue trabalhando para ganhar mais pontos!</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Seu Nível</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary">Nível {userLevel}</div>
            <p className="text-sm text-muted-foreground mt-2">Próximo nível em 250 pontos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conquistas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary">
              {achievements.filter(a => a.completed).length}/{achievements.length}
            </div>
            <p className="text-sm text-muted-foreground mt-2">Conquistas desbloqueadas</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Suas Conquistas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {achievements.map((achievement) => {
              const Icon = achievement.icon
              return (
                <div
                  key={achievement.id}
                  className={`flex items-center gap-4 p-4 rounded-lg border ${
                    achievement.completed
                      ? 'bg-primary/10 border-primary'
                      : 'bg-muted border-muted-foreground/20 opacity-50'
                  }`}
                >
                  <Icon className="h-8 w-8" />
                  <div className="flex-1">
                    <h3 className="font-semibold">{achievement.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {achievement.completed ? 'Completo!' : 'Em progresso...'}
                    </p>
                  </div>
                  {achievement.completed && (
                    <Award className="h-6 w-6 text-primary" />
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
