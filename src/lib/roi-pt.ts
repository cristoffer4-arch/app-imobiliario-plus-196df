// src/lib/roi-pt.ts
import { calcularIMI, calcularIMT } from './tax-pt';

export interface DadosInvestimento {
  valorCompra: number;
  custoAquisicao: number; // IMT + custos notariais + comissões
  custoRenovacao?: number;
  valorAluguel: number; // mensal
  taxaIRS: number; // em decimal (ex: 0.28 para 28%)
  taxaVacancia?: number; // em decimal
  custoManutencaoAnual?: number;
  valorizacaoAnual?: number; // em decimal
}

export interface ResultadoROI {
  rendaBrutaAnual: number;
  rendaLiquidaAnual: number;
  imi: number;
  irs: number;
  custoManutencao: number;
  custoVacancia: number;
  roiBruto: number; // em percentagem
  roiLiquido: number; // em percentagem
  paybackPeriodo: number; // em anos
  fluxoCaixaMensal: number;
  tir?: number; // Taxa Interna de Retorno
}

export function calcularROI(dados: DadosInvestimento): ResultadoROI {
  const investimentoTotal = dados.valorCompra + dados.custoAquisicao + (dados.custoRenovacao || 0);
  
  // Renda Bruta Anual
  const rendaBrutaAnual = dados.valorAluguel * 12;
  
  // Custos Anuais
  const imi = calcularIMI(dados.valorCompra, 'urbano');
  const custoVacancia = dados.taxaVacancia 
    ? rendaBrutaAnual * dados.taxaVacancia 
    : 0;
  const custoManutencao = dados.custoManutencaoAnual || (dados.valorCompra * 0.01); // 1% do valor
  
  // Renda Tributável (70% da renda bruta - regime simplificado)
  const rendaTributavel = rendaBrutaAnual * 0.7;
  const irs = rendaTributavel * dados.taxaIRS;
  
  // Renda Líquida
  const custosAnuais = imi + irs + custoManutencao + custoVacancia;
  const rendaLiquidaAnual = rendaBrutaAnual - custosAnuais;
  
  // ROI
  const roiBruto = (rendaBrutaAnual / investimentoTotal) * 100;
  const roiLiquido = (rendaLiquidaAnual / investimentoTotal) * 100;
  
  // Payback Period
  const paybackPeriodo = rendaLiquidaAnual > 0 
    ? investimentoTotal / rendaLiquidaAnual 
    : Infinity;
  
  // Fluxo de Caixa Mensal
  const fluxoCaixaMensal = rendaLiquidaAnual / 12;
  
  return {
    rendaBrutaAnual,
    rendaLiquidaAnual,
    imi,
    irs,
    custoManutencao,
    custoVacancia,
    roiBruto,
    roiLiquido,
    paybackPeriodo,
    fluxoCaixaMensal,
  };
}

export function calcularTIR(
  investimentoInicial: number,
  fluxosCaixa: number[],
  guess: number = 0.1
): number {
  const maxIteracoes = 100;
  const precisao = 0.0001;
  
  let taxa = guess;
  
  for (let i = 0; i < maxIteracoes; i++) {
    let vpFluxos = -investimentoInicial;
    let vpDerivada = 0;
    
    for (let periodo = 0; periodo < fluxosCaixa.length; periodo++) {
      const fator = Math.pow(1 + taxa, periodo + 1);
      vpFluxos += fluxosCaixa[periodo] / fator;
      vpDerivada -= (periodo + 1) * fluxosCaixa[periodo] / Math.pow(1 + taxa, periodo + 2);
    }
    
    const novaTaxa = taxa - vpFluxos / vpDerivada;
    
    if (Math.abs(novaTaxa - taxa) < precisao) {
      return novaTaxa * 100; // retorna em percentagem
    }
    
    taxa = novaTaxa;
  }
  
  return taxa * 100;
}

export function projecaoInvestimento(
  dados: DadosInvestimento,
  anos: number = 10
): Array<{
  ano: number;
  valorImovel: number;
  rendaAcumulada: number;
  retornoTotal: number;
  roiAcumulado: number;
}> {
  const investimentoTotal = dados.valorCompra + dados.custoAquisicao + (dados.custoRenovacao || 0);
  const taxaValorizacao = dados.valorizacaoAnual || 0.03; // 3% ao ano por padrão
  const roiAnual = calcularROI(dados);
  
  const projecao = [];
  let valorImovel = dados.valorCompra;
  let rendaAcumulada = 0;
  
  for (let ano = 1; ano <= anos; ano++) {
    valorImovel *= (1 + taxaValorizacao);
    rendaAcumulada += roiAnual.rendaLiquidaAnual;
    const retornoTotal = (valorImovel - dados.valorCompra) + rendaAcumulada;
    const roiAcumulado = (retornoTotal / investimentoTotal) * 100;
    
    projecao.push({
      ano,
      valorImovel,
      rendaAcumulada,
      retornoTotal,
      roiAcumulado,
    });
  }
  
  return projecao;
}

export function compararInvestimentos(
  investimentos: Array<DadosInvestimento & { nome: string }>
): Array<{
  nome: string;
  roiLiquido: number;
  paybackPeriodo: number;
  fluxoCaixaMensal: number;
  score: number; // pontuação composta
}> {
  return investimentos
    .map((inv) => {
      const roi = calcularROI(inv);
      // Score: 40% ROI + 30% Fluxo Caixa + 30% Payback
      const scoreROI = (roi.roiLiquido / 10) * 0.4; // normalizado para 10% = máximo
      const scoreFluxo = (roi.fluxoCaixaMensal / 1000) * 0.3; // normalizado para €1000 = máximo
      const scorePayback = roi.paybackPeriodo < Infinity 
        ? ((20 - roi.paybackPeriodo) / 20) * 0.3 
        : 0;
      const score = Math.max(0, scoreROI + scoreFluxo + scorePayback);
      
      return {
        nome: inv.nome,
        roiLiquido: roi.roiLiquido,
        paybackPeriodo: roi.paybackPeriodo,
        fluxoCaixaMensal: roi.fluxoCaixaMensal,
        score,
      };
    })
    .sort((a, b) => b.score - a.score);
}
