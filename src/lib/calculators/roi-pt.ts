/**
 * Calculadora ROI Português - Arrendamento vs Alojamento Local
 */

export interface ROIArrendamento {
  rendaMensal: number;
  rendaAnual: number;
  despesasAnuais: number;
  rendaLiquida: number;
  roi: number;
  paybackYears: number;
}

export interface ROIAL {
  ocupacao: number;
  tarifaDiaria: number;
  diasAno: number;
  receitaBruta: number;
  comissaoPlataforma: number;
  limpezas: number;
  utilities: number;
  despesasOperacionais: number;
  receitaLiquida: number;
  roi: number;
  paybackYears: number;
}

export function calculateROIArrendamento(
  valorImovel: number,
  rendaMensal: number,
  condominioMensal: number,
  imiAnual: number,
  manutencaoAnual: number = 500
): ROIArrendamento {
  const rendaAnual = rendaMensal * 12;
  const despesasAnuais = (condominioMensal * 12) + imiAnual + manutencaoAnual;
  const rendaLiquida = rendaAnual - despesasAnuais;
  const roi = (rendaLiquida / valorImovel) * 100;
  const paybackYears = valorImovel / rendaLiquida;

  return {
    rendaMensal,
    rendaAnual,
    despesasAnuais,
    rendaLiquida,
    roi,
    paybackYears
  };
}

export function calculateROIAL(
  valorImovel: number,
  tarifaDiaria: number,
  ocupacao: number,
  condominioMensal: number,
  imiAnual: number,
  limpezaPorEstadia: number = 50
): ROIAL {
  const diasAno = 365;
  const diasOcupados = (diasAno * ocupacao) / 100;
  const receitaBruta = tarifaDiaria * diasOcupados;
  
  const comissaoPlataforma = receitaBruta * 0.18;
  const limpezas = (diasOcupados / 3) * limpezaPorEstadia;
  const utilities = condominioMensal * 12 * 1.5;
  const despesasOperacionais = comissaoPlataforma + limpezas + utilities + imiAnual;
  
  const receitaLiquida = receitaBruta - despesasOperacionais;
  const roi = (receitaLiquida / valorImovel) * 100;
  const paybackYears = valorImovel / receitaLiquida;

  return {
    ocupacao,
    tarifaDiaria,
    diasAno,
    receitaBruta,
    comissaoPlataforma,
    limpezas,
    utilities,
    despesasOperacionais,
    receitaLiquida,
    roi,
    paybackYears
  };
}

export interface ComparacaoROI {
  arrendamento: ROIArrendamento;
  alojamentoLocal: ROIAL;
  diferencaROI: number;
  melhorOpcao: 'Arrendamento' | 'Alojamento Local';
  diferencaAnual: number;
}

export function compararROI(
  valorImovel: number,
  rendaMensal: number,
  tarifaDiariaAL: number,
  ocupacaoAL: number,
  condominioMensal: number,
  imiAnual: number
): ComparacaoROI {
  const arrendamento = calculateROIArrendamento(valorImovel, rendaMensal, condominioMensal, imiAnual);
  const alojamentoLocal = calculateROIAL(valorImovel, tarifaDiariaAL, ocupacaoAL, condominioMensal, imiAnual);
  
  const diferencaROI = alojamentoLocal.roi - arrendamento.roi;
  const melhorOpcao = diferencaROI > 0 ? 'Alojamento Local' : 'Arrendamento';
  const diferencaAnual = alojamentoLocal.receitaLiquida - arrendamento.rendaLiquida;

  return {
    arrendamento,
    alojamentoLocal,
    diferencaROI,
    melhorOpcao,
    diferencaAnual
  };
}
