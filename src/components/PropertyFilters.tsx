'use client'

import { useState } from 'react'

export interface PropertyFilters {
  search?: string
  type?: string
  minPrice?: number
  maxPrice?: number
  location?: string
  bedrooms?: number
  bathrooms?: number
  minArea?: number
  maxArea?: number
  status?: string
}

interface PropertyFiltersProps {
  onFilterChange: (filters: PropertyFilters) => void
  initialFilters?: PropertyFilters
}

export default function PropertyFiltersComponent({ onFilterChange, initialFilters = {} }: PropertyFiltersProps) {
  const [filters, setFilters] = useState<PropertyFilters>(initialFilters)
  const [showAdvanced, setShowAdvanced] = useState(false)

  const handleChange = (key: keyof PropertyFilters, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleReset = () => {
    setFilters({})
    onFilterChange({})
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
      {/* Search Bar */}
      <div>
        <input
          type="text"
          placeholder="Buscar imóveis..."
          value={filters.search || ''}
          onChange={(e) => handleChange('search', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Quick Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
          <select
            value={filters.type || ''}
            onChange={(e) => handleChange('type', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos os tipos</option>
            <option value="apartment">Apartamento</option>
            <option value="house">Casa</option>
            <option value="condo">Condomínio</option>
            <option value="penthouse">Cobertura</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Localização</label>
          <input
            type="text"
            placeholder="Cidade, bairro..."
            value={filters.location || ''}
            onChange={(e) => handleChange('location', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            value={filters.status || ''}
            onChange={(e) => handleChange('status', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos</option>
            <option value="available">Disponível</option>
            <option value="sold">Vendido</option>
            <option value="rented">Alugado</option>
          </select>
        </div>
      </div>

      {/* Advanced Filters Toggle */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
      >
        {showAdvanced ? '▼' : '▶'} Filtros Avançados
      </button>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="space-y-4 pt-4 border-t border-gray-200">
          {/* Price Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preço Mínimo</label>
              <input
                type="number"
                placeholder="R$ 0"
                value={filters.minPrice || ''}
                onChange={(e) => handleChange('minPrice', e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preço Máximo</label>
              <input
                type="number"
                placeholder="R$ 999.999.999"
                value={filters.maxPrice || ''}
                onChange={(e) => handleChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Rooms */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quartos</label>
              <select
                value={filters.bedrooms || ''}
                onChange={(e) => handleChange('bedrooms', e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Qualquer</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
                <option value="5">5+</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Banheiros</label>
              <select
                value={filters.bathrooms || ''}
                onChange={(e) => handleChange('bathrooms', e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Qualquer</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
            </div>
          </div>

          {/* Area Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Área Mínima (m²)</label>
              <input
                type="number"
                placeholder="0"
                value={filters.minArea || ''}
                onChange={(e) => handleChange('minArea', e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Área Máxima (m²)</label>
              <input
                type="number"
                placeholder="9999"
                value={filters.maxArea || ''}
                onChange={(e) => handleChange('maxArea', e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Reset Button */}
      <div className="flex justify-end pt-4">
        <button
          onClick={handleReset}
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Limpar Filtros
        </button>
      </div>
    </div>
  )
}
