'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Home,
  MessageSquare,
  Users,
  Trophy,
  DollarSign,
  Scan,
  ExternalLink,
  Bell,
  User
} from 'lucide-react'

const menuItems = [
  { name: 'Home', icon: Home, href: '/home', badge: null },
  { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard', badge: null },
  { name: 'Imóveis', icon: Home, href: '/imoveis', badge: null },
  { name: 'Chat IA', icon: MessageSquare, href: '/chat', badge: 'New' },
  { name: 'Leads', icon: Users, href: '/leads', badge: null },
  { name: 'Gamificação', icon: Trophy, href: '/gamificacao', badge: null },
  { name: 'Pricing', icon: DollarSign, href: '/pricing', badge: null },
  { name: 'Scanner', icon: Scan, href: '/scanner-documentos', badge: null },
  { name: 'Casafari', icon: ExternalLink, href: '/integracao-casafari', badge: null },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col z-40">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <Link href="/home" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-400 rounded-xl flex items-center justify-center">
            <Home className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Imobiliário GO</h1>
            <p className="text-xs text-gray-500">Gestão Inteligente</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-3 py-3 rounded-xl
                    transition-all duration-200
                    ${isActive 
                      ? 'bg-blue-50 text-blue-600 font-medium' 
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" strokeWidth={2} />
                  <span className="flex-1">{item.name}</span>
                  {item.badge && (
                    <span className="px-2 py-0.5 text-xs font-medium bg-blue-600 text-white rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
              <Bell className="w-2.5 h-2.5 text-white" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">Usuário</p>
            <p className="text-xs text-gray-500 truncate">Ver perfil</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
