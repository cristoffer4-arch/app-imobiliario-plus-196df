'use client'

import Link from 'next/link'
import { LucideIcon } from 'lucide-react'

interface ModuleCardProps {
  title: string
  icon: LucideIcon
  href: string
  gradient: string
}

export default function ModuleCard({ title, icon: Icon, href, gradient }: ModuleCardProps) {
  return (
    <Link
      href={href}
      className={`
        group relative overflow-hidden rounded-2xl p-6
        ${gradient}
        transition-all duration-300 ease-out
        motion-safe:hover:scale-105 hover:shadow-2xl
        motion-reduce:transition-none
        flex flex-col items-start justify-between
        min-h-[160px]
      `}
    >
      <div className="relative z-10 flex flex-col items-start gap-4 w-full">
        <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl transition-transform duration-300 motion-safe:group-hover:scale-110 motion-reduce:transform-none">
          <Icon className="w-8 h-8 text-white" strokeWidth={2} />
        </div>
        <h3 className="text-xl font-semibold text-white">
          {title}
        </h3>
      </div>
      
      {/* Animated background effect */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 motion-reduce:transition-none" />
      
      {/* Subtle shimmer effect - respects user's motion preferences */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 motion-reduce:transition-none">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full motion-safe:group-hover:translate-x-full motion-safe:transition-transform motion-safe:duration-1000" />
      </div>
    </Link>
  )
}
