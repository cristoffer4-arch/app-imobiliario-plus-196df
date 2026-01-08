'use client';

import React, { useState } from 'react';
import { calculateCustosAquisicaoPT } from '@/lib/calculators/tax-pt';
import { compararROI } from '@/lib/calculators/roi-pt';

export function InvestorDashboardPT() {
  const [valorImovel, setValorImovel] = useState<number>(300000);
  const [rendaMensal, setRendaMensal] = useState<number>(1200);
  const [tarifaDiariaAL, setTarifaDiariaAL] = useState<number>(80);
  const [ocupacaoAL, setOcupacaoAL] = useState<number>(70);
  const [condominioMensal, setCondominioMensal] = useState<number>(100);
  const [imiAnual, setImiAnual] = useState<number>(540);
  
  const [habitacaoPropria, setHabitacaoPropria] = useState(false);

  const custosAquisicao = calculateCustosAquisicaoPT(valorImovel, habitacaoPropria);
  const comparacao = compararROI(valorImovel, rendaMensal, tarifaDiariaAL, ocupacaoAL, condominioMensal, imiAnual);

  const formatEuro = (value: number) => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR'
    }).format(value);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard Investidor PT</h1>

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-white p-6 rounded-lg shadow">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Valor do Imóvel
          </label>
          <input
            type="number"
            value={valorImovel}
            onChange={(e) => setValorImovel(Number(e.target.value))}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Renda Mensal Arrendamento
          </label>
          <input
            type="number"
            value={rendaMensal}
            onChange={(e) => setRendaMensal(Number(e.target.value))}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tarifa Diária AL
          </label>
          <input
            type="number"
            value={tarifaDiariaAL}
            onChange={(e) => setTarifaDiariaAL(Number(e.target.value))}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ocupação AL (%)
          </label>
          <input
            type="number"
            value={ocupacaoAL}
            onChange={(e) => setOcupacaoAL(Number(e.target.value))}
            className="w-full border rounded p-2"
            max="100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Condomínio Mensal
          </label>
          <input
            type="number"
            value={condominioMensal}
            onChange={(e) => setCondominioMensal(Number(e.target.value))}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            IMI Anual
          </label>
          <input
            type="number"
            value={imiAnual}
            onChange={(e) => setImiAnual(Number(e.target.value))}
            className="w-full border rounded p-2"
          />
        </div>
        <div className="col-span-full">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={habitacaoPropria}
              onChange={(e) => setHabitacaoPropria(e.target.checked)}
              className="mr-2 w-4 h-4"
            />
            <span className="text-sm text-gray-700">Habitação Própria Permanente (IMT reduzido)</span>
          </label>
        </div>
      </div>

      {/* Custos de Aquisição */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Custos de Aquisição</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-blue-50 rounded">
            <p className="text-sm text-gray-600">IMT</p>
            <p className="text-xl font-bold text-blue-600">{formatEuro(custosAquisicao.imt)}</p>
          </div>
          <div className="p-4 bg-green-50 rounded">
            <p className="text-sm text-gray-600">Imposto Selo</p>
            <p className="text-xl font-bold text-green-600">{formatEuro(custosAquisicao.impostoSelo)}</p>
          </div>
          <div className="p-4 bg-purple-50 rounded">
            <p className="text-sm text-gray-600">Escrit.+ Registo</p>
            <p className="text-xl font-bold text-purple-600">{formatEuro(custosAquisicao.escritura + custosAquisicao.registoPredial)}</p>
          </div>
          <div className="p-4 bg-red-50 rounded">
            <p className="text-sm text-gray-600">Total Custos</p>
            <p className="text-xl font-bold text-red-600">{formatEuro(custosAquisicao.totalCustos)}</p>
          </div>
          <div className="col-span-2 md:col-span-4 p-4 bg-gray-50 rounded border-2 border-gray-300">
            <p className="text-sm text-gray-600">Investimento Total (Imóvel + Custos)</p>
            <p className="text-3xl font-bold text-gray-900">{formatEuro(custosAquisicao.totalComImovel)}</p>
          </div>
          <div className="col-span-2 md:col-span-4 p-4 bg-yellow-50 rounded">
            <p className="text-sm text-gray-600">IMI Anual Estimado</p>
            <p className="text-lg font-bold text-yellow-700">{formatEuro(custosAquisicao.imiAnualEstimado)}</p>
          </div>
        </div>
      </div>

      {/* Comparação ROI */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Comparação de Rentabilidade</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Arrendamento */}
          <div className="p-6 bg-blue-50 rounded-lg border-2 border-blue-200">
            <h3 className="text-xl font-bold mb-4 text-blue-900">Arrendamento Tradicional</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-700">Renda Anual:</span>
                <span className="font-bold">{formatEuro(comparacao.arrendamento.rendaAnual)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Despesas Anuais:</span>
                <span className="font-bold text-red-600">-{formatEuro(comparacao.arrendamento.despesasAnuais)}</span>
              </div>
              <div className="flex justify-between pt-3 border-t-2 border-blue-300">
                <span className="text-gray-900 font-semibold">Renda Líquida:</span>
                <span className="font-bold text-blue-700">{formatEuro(comparacao.arrendamento.rendaLiquida)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-900 font-semibold">ROI:</span>
                <span className="font-bold text-2xl text-blue-700">{comparacao.arrendamento.roi.toFixed(2)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Payback:</span>
                <span className="font-semibold">{comparacao.arrendamento.paybackYears.toFixed(1)} anos</span>
              </div>
            </div>
          </div>

          {/* Alojamento Local */}
          <div className="p-6 bg-green-50 rounded-lg border-2 border-green-200">
            <h3 className="text-xl font-bold mb-4 text-green-900">Alojamento Local</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-700">Receita Bruta:</span>
                <span className="font-bold">{formatEuro(comparacao.alojamentoLocal.receitaBruta)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Despesas Operacionais:</span>
                <span className="font-bold text-red-600">-{formatEuro(comparacao.alojamentoLocal.despesasOperacionais)}</span>
              </div>
              <div className="flex justify-between pt-3 border-t-2 border-green-300">
                <span className="text-gray-900 font-semibold">Receita Líquida:</span>
                <span className="font-bold text-green-700">{formatEuro(comparacao.alojamentoLocal.receitaLiquida)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-900 font-semibold">ROI:</span>
                <span className="font-bold text-2xl text-green-700">{comparacao.alojamentoLocal.roi.toFixed(2)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Payback:</span>
                <span className="font-semibold">{comparacao.alojamentoLocal.paybackYears.toFixed(1)} anos</span>
              </div>
            </div>
          </div>
        </div>

        {/* Conclusão */}
        <div className={`p-6 rounded-lg border-2 ${
          comparacao.melhorOpcao === 'Alojamento Local' 
            ? 'bg-green-100 border-green-400' 
            : 'bg-blue-100 border-blue-400'
        }`}>
          <h3 className="text-xl font-bold mb-2">Recomendação</h3>
          <p className="text-lg">
            <span className="font-bold">{comparacao.melhorOpcao}</span> oferece melhor rentabilidade:
          </p>
          <p className="text-2xl font-bold mt-2">
            +{formatEuro(Math.abs(comparacao.diferencaAnual))}/ano ({Math.abs(comparacao.diferencaROI).toFixed(2)}% ROI)
          </p>
        </div>
      </div>
    </div>
  );
}
