'use client'

import Sidebar from '@/components/Navigation/Sidebar'
import ModuleCard from '@/components/Navigation/ModuleCard'
import {
  LayoutDashboard,
  Home,
  MessageSquare,
  Users,
  Trophy,
  DollarSign,
  Scan,
  ExternalLink,
  TrendingUp,
  Activity,
  CheckCircle
} from 'lucide-react'

const modules = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard',
    gradient: 'bg-gradient-to-br from-blue-600 to-blue-400'
  },
  {
    title: 'Imóveis',
    icon: Home,
    href: '/imoveis',
    gradient: 'bg-gradient-to-br from-purple-600 to-purple-400'
  },
  {
    title: 'Chat IA',
    icon: MessageSquare,
    href: '/chat',
    gradient: 'bg-gradient-to-br from-green-600 to-green-400'
  },
  {
    title: 'Leads',
    icon: Users,
    href: '/leads',
    gradient: 'bg-gradient-to-br from-orange-600 to-orange-400'
  },
  {
    title: 'Gamificação',
    icon: Trophy,
    href: '/gamificacao',
    gradient: 'bg-gradient-to-br from-yellow-600 to-yellow-400'
  },
  {
    title: 'Pricing',
    icon: DollarSign,
    href: '/pricing',
    gradient: 'bg-gradient-to-br from-pink-600 to-pink-400'
  },
  {
    title: 'Scanner',
    icon: Scan,
    href: '/scanner-documentos',
    gradient: 'bg-gradient-to-br from-indigo-600 to-indigo-400'
  },
  {
    title: 'Casafari',
    icon: ExternalLink,
    href: '/integracao-casafari',
    gradient: 'bg-gradient-to-br from-teal-600 to-teal-400'
  }
]

const stats = [
  { label: 'Imóveis Ativos', value: '1,234', icon: Home, color: 'text-blue-600' },
  { label: 'Leads Este Mês', value: '89', icon: TrendingUp, color: 'text-green-600' },
  { label: 'Taxa de Conversão', value: '24%', icon: Activity, color: 'text-purple-600' },
  { label: 'Tarefas Completas', value: '156', icon: CheckCircle, color: 'text-orange-600' }
]

export default function HomePage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      {/* Main content area with left margin matching sidebar width (w-64 = 256px) */}
      <main className="flex-1 ml-64">
        {/* Top Bar with Stats */}
        <div className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Bem-vindo ao Imobiliário GO</h1>
            <p className="text-gray-600 mt-1">Escolha um módulo para começar</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => {
              const Icon = stat.icon
              return (
                <div
                  key={stat.label}
                  className="bg-gray-50 rounded-xl p-4 border border-gray-200"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 bg-white rounded-lg ${stat.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <p className="text-sm text-gray-600">{stat.label}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Module Cards Grid */}
        <div className="p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Módulos</h2>
            <p className="text-gray-600 mt-1">Acesse todas as funcionalidades da plataforma</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {modules.map((module) => (
              <ModuleCard
                key={module.href}
                title={module.title}
                icon={module.icon}
                href={module.href}
                gradient={module.gradient}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
