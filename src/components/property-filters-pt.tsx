// src/components/property-filters-pt.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';

export interface FiltrosPropriedadePT {
  tipologia?: string[];
  precoMin?: number;
  precoMax?: number;
  areaMin?: number;
  areaMax?: number;
  localizacao?: string;
  certificadoEnergetico?: string[];
  caracteristicas?: string[];
}

interface PropertyFiltersPTProps {
  onFiltrosChange: (filtros: FiltrosPropriedadePT) => void;
}

export function PropertyFiltersPT({ onFiltrosChange }: PropertyFiltersPTProps) {
  const [filtros, setFiltros] = useState<FiltrosPropriedadePT>({});

  const tipologias = ['T0', 'T1', 'T2', 'T3', 'T4', 'T5', 'T6+'];
  const certificados = ['A+', 'A', 'B', 'B-', 'C', 'D', 'E', 'F'];
  const caracteristicas = [
    'elevador',
    'garagem',
    'varanda',
    'piscina',
    'jardim',
    'ar-condicionado',
  ];

  const atualizarFiltros = (novosFiltros: Partial<FiltrosPropriedadePT>) => {
    const filtrosAtualizados = { ...filtros, ...novosFiltros };
    setFiltros(filtrosAtualizados);
    onFiltrosChange(filtrosAtualizados);
  };

  const toggleTipologia = (tip: string) => {
    const current = filtros.tipologia || [];
    const updated = current.includes(tip)
      ? current.filter((t) => t !== tip)
      : [...current, tip];
    atualizarFiltros({ tipologia: updated });
  };

  const toggleCertificado = (cert: string) => {
    const current = filtros.certificadoEnergetico || [];
    const updated = current.includes(cert)
      ? current.filter((c) => c !== cert)
      : [...current, cert];
    atualizarFiltros({ certificadoEnergetico: updated });
  };

  const toggleCaracteristica = (car: string) => {
    const current = filtros.caracteristicas || [];
    const updated = current.includes(car)
      ? current.filter((c) => c !== car)
      : [...current, car];
    atualizarFiltros({ caracteristicas: updated });
  };

  const limparFiltros = () => {
    setFiltros({});
    onFiltrosChange({});
  };

  return (
    <div className="space-y-6 p-4 border rounded-lg">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Filtros</h3>
        <Button variant="ghost" size="sm" onClick={limparFiltros}>
          Limpar
        </Button>
      </div>

      {/* Tipologia */}
      <div className="space-y-2">
        <Label>Tipologia</Label>
        <div className="flex flex-wrap gap-2">
          {tipologias.map((tip) => (
            <Button
              key={tip}
              variant={filtros.tipologia?.includes(tip) ? 'default' : 'outline'}
              size="sm"
              onClick={() => toggleTipologia(tip)}
            >
              {tip}
            </Button>
          ))}
        </div>
      </div>

      {/* Preço */}
      <div className="space-y-2">
        <Label>Preço (€)</Label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            placeholder="Mínimo"
            value={filtros.precoMin || ''}
            onChange={(e) => atualizarFiltros({ precoMin: Number(e.target.value) })}
          />
          <Input
            type="number"
            placeholder="Máximo"
            value={filtros.precoMax || ''}
            onChange={(e) => atualizarFiltros({ precoMax: Number(e.target.value) })}
          />
        </div>
      </div>

      {/* Área */}
      <div className="space-y-2">
        <Label>Área (m²)</Label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            placeholder="Mínimo"
            value={filtros.areaMin || ''}
            onChange={(e) => atualizarFiltros({ areaMin: Number(e.target.value) })}
          />
          <Input
            type="number"
            placeholder="Máximo"
            value={filtros.areaMax || ''}
            onChange={(e) => atualizarFiltros({ areaMax: Number(e.target.value) })}
          />
        </div>
      </div>

      {/* Localização */}
      <div className="space-y-2">
        <Label>Localização</Label>
        <Input
          placeholder="Cidade ou região"
          value={filtros.localizacao || ''}
          onChange={(e) => atualizarFiltros({ localizacao: e.target.value })}
        />
      </div>

      {/* Certificado Energético */}
      <div className="space-y-2">
        <Label>Certificado Energético</Label>
        <div className="flex flex-wrap gap-2">
          {certificados.map((cert) => (
            <Button
              key={cert}
              variant={filtros.certificadoEnergetico?.includes(cert) ? 'default' : 'outline'}
              size="sm"
              onClick={() => toggleCertificado(cert)}
            >
              {cert}
            </Button>
          ))}
        </div>
      </div>

      {/* Características */}
      <div className="space-y-2">
        <Label>Características</Label>
        <div className="space-y-2">
          {caracteristicas.map((car) => (
            <div key={car} className="flex items-center space-x-2">
              <Checkbox
                id={car}
                checked={filtros.caracteristicas?.includes(car)}
                onCheckedChange={() => toggleCaracteristica(car)}
              />
              <label
                htmlFor={car}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize"
              >
                {car}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
