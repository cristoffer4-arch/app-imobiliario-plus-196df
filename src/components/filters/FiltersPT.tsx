'use client';

import React, { useState } from 'react';
import { TipologiaPT, CertificadoEnergetico, DISTRITOS_PT } from '@/types/property-pt';

export interface PropertyFilters {
  tipologia?: TipologiaPT[];
  distrito?: string[];
  certificado_energetico?: CertificadoEnergetico[];
  minPrice?: number;
  maxPrice?: number;
  maxCondominio?: number;
  hasALLicense?: boolean;
  hasElevador?: boolean;
  minGaragem?: number;
}

interface FiltersPTProps {
  onFilterChange: (filters: PropertyFilters) => void;
}

export function FiltersPT({ onFilterChange }: FiltersPTProps) {
  const [filters, setFilters] = useState<PropertyFilters>({});

  const updateFilters = (newFilters: Partial<PropertyFilters>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    onFilterChange(updated);
  };

  return (
    <div className="space-y-6 p-4 bg-white rounded-lg shadow">
      {/* Tipologia Filter */}
      <div>
        <h3 className="font-semibold mb-2 text-gray-800">Tipologia</h3>
        <div className="grid grid-cols-3 gap-2">
          {(['T0', 'T1', 'T2', 'T3', 'T4', 'T5'] as TipologiaPT[]).map((tip) => (
            <button
              key={tip}
              onClick={() => {
                const current = filters.tipologia || [];
                const updated = current.includes(tip)
                  ? current.filter(t => t !== tip)
                  : [...current, tip];
                updateFilters({ tipologia: updated });
              }}
              className={`px-3 py-2 rounded border transition-colors ${
                filters.tipologia?.includes(tip)
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400'
              }`}
            >
              {tip}
            </button>
          ))}
        </div>
      </div>

      {/* Distrito Filter */}
      <div>
        <h3 className="font-semibold mb-2 text-gray-800">Distrito</h3>
        <select
          className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500"
          onChange={(e) => {
            const selected = e.target.value;
            if (selected) {
              updateFilters({ distrito: [selected] });
            }
          }}
          value={filters.distrito?.[0] || ''}
        >
          <option value="">Todos os distritos</option>
          {DISTRITOS_PT.map((distrito) => (
            <option key={distrito} value={distrito}>{distrito}</option>
          ))}
        </select>
      </div>

      {/* Certificado Energético */}
      <div>
        <h3 className="font-semibold mb-2 text-gray-800">Certificado Energético</h3>
        <div className="flex gap-2 flex-wrap">
          {(['A+', 'A', 'B', 'B-', 'C', 'D'] as CertificadoEnergetico[]).map((cert) => (
            <button
              key={cert}
              onClick={() => {
                const current = filters.certificado_energetico || [];
                const updated = current.includes(cert)
                  ? current.filter(c => c !== cert)
                  : [...current, cert];
                updateFilters({ certificado_energetico: updated });
              }}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                filters.certificado_energetico?.includes(cert)
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cert}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-semibold mb-2 text-gray-800">Preço</h3>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            placeholder="Mín €"
            className="border rounded p-2 focus:ring-2 focus:ring-blue-500"
            onChange={(e) => updateFilters({ minPrice: Number(e.target.value) || undefined })}
          />
          <input
            type="number"
            placeholder="Máx €"
            className="border rounded p-2 focus:ring-2 focus:ring-blue-500"
            onChange={(e) => updateFilters({ maxPrice: Number(e.target.value) || undefined })}
          />
        </div>
      </div>

      {/* Condomínio */}
      <div>
        <h3 className="font-semibold mb-2 text-gray-800">Condomínio Máximo</h3>
        <input
          type="number"
          placeholder="€/mês"
          className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500"
          onChange={(e) => updateFilters({ maxCondominio: Number(e.target.value) || undefined })}
        />
      </div>

      {/* Features */}
      <div>
        <h3 className="font-semibold mb-2 text-gray-800">Características</h3>
        <div className="space-y-2">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="mr-2 w-4 h-4 cursor-pointer"
              onChange={(e) => updateFilters({ hasALLicense: e.target.checked || undefined })}
            />
            <span className="text-gray-700">Com Licença AL</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="mr-2 w-4 h-4 cursor-pointer"
              onChange={(e) => updateFilters({ hasElevador: e.target.checked || undefined })}
            />
            <span className="text-gray-700">Com Elevador</span>
          </label>
          <div>
            <label className="text-gray-700 text-sm mb-1 block">Nº lugares garagem (mínimo)</label>
            <input
              type="number"
              min="0"
              placeholder="0"
              className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500"
              onChange={(e) => updateFilters({ minGaragem: Number(e.target.value) || undefined })}
            />
          </div>
        </div>
      </div>

      {/* Reset Button */}
      <button
        onClick={() => {
          setFilters({});
          onFilterChange({});
        }}
        className="w-full py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors font-medium"
      >
        Limpar Filtros
      </button>
    </div>
  );
}
