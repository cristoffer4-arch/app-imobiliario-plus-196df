'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function BackButton() {
  return (
    <Link 
      href="/home"
      className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
    >
      <ArrowLeft className="w-5 h-5" />
      <span className="font-medium">Voltar</span>
    </Link>
  )
}
