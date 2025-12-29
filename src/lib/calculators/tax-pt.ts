/**
 * Calculadoras Fiscais Portuguesas
 * IMI, IMT, Imposto do Selo, e Custos de Aquisição
 * 
 * @module tax-pt
 * @description Implementa os cálculos fiscais específicos do mercado português
 */

/**
 * Calcula o IMI (Imposto Municipal sobre Imóveis)
 * Taxa varia entre 0.3% e 0.45% conforme município
 * 
 * @param valorPatrimonial - Valor patrimonial tributário do imóvel
 * @param taxaMunicipal - Taxa IMI do município (padrão: 0.3%)
 * @returns Valor anual do IMI
 */
export function calculateIMI(valorPatrimonial: number, taxaMunicipal: number = 0.003): number {
  return valorPatrimonial * taxaMunicipal;
}

/**
 * Calcula o IMT (Imposto Municipal sobre Transmissões)
 * Escalões progressivos para habitação própria permanente
 * Taxa única de 6% para habitação secundária
 * 
 * @param valorAquisicao - Valor de aquisição do imóvel
 * @param habitacaoPropria - Se é habitação própria permanente (taxas reduzidas)
 * @returns Valor do IMT a pagar
 */
export function calculateIMT(valorAquisicao: number, habitacaoPropria: boolean = true): number {
  if (habitacaoPropria) {
    // Escalões progressivos para habitação própria
    if (valorAquisicao <= 97064) return 0; // Isento
    if (valorAquisicao <= 134567) return (valorAquisicao - 97064) * 0.02;
    if (valorAquisicao <= 186119) return 750.06 + (valorAquisicao - 134567) * 0.05;
    if (valorAquisicao <= 288523) return 3326.66 + (valorAquisicao - 186119) * 0.07;
    if (valorAquisicao <= 574323) return 10492.54 + (valorAquisicao - 288523) * 0.08;
    if (valorAquisicao <= 1103872) return 33356.54 + (valorAquisicao - 574323) * 0.06;
    return 65129.48 + (valorAquisicao - 1103872) * 0.075;
  } else {
    // Habitação secundária ou comercial (taxa fixa 6%)
    if (valorAquisicao <= 97064) return valorAquisicao * 0.01;
    return 970.64 + (valorAquisicao - 97064) * 0.06;
  }
}

/**
 * Calcula o Imposto do Selo
 * Taxa fixa de 0.8% sobre o valor de aquisição
 * 
 * @param valorAquisicao - Valor de aquisição do imóvel
 * @returns Valor do Imposto do Selo
 */
export function calculateImpostoSelo(valorAquisicao: number): number {
  return valorAquisicao * 0.008;
}

/**
 * Interface para os custos totais de aquisição
 */
export interface CustosAquisicao {
  valorImovel: number;
  imt: number;
  impostoSelo: number;
  registoPredial: number;
  escritura: number;
  imiAnualEstimado: number;
  totalCustos: number;
  totalComImovel: number;
}

/**
 * Calcula todos os custos de aquisição de um imóvel em Portugal
 * Inclui IMT, Imposto do Selo, Escritura, Registo e estimativa de IMI
 * 
 * @param valorImovel - Valor de compra do imóvel
 * @param habitacaoPropria - Se é habitação própria permanente
 * @param taxaIMI - Taxa IMI do município (padrão: 0.3%)
 * @returns Objeto com breakdown completo dos custos
 */
export function calculateCustosAquisicaoPT(
  valorImovel: number,
  habitacaoPropria: boolean = true,
  taxaIMI: number = 0.003
): CustosAquisicao {
  const imt = calculateIMT(valorImovel, habitacaoPropria);
  const impostoSelo = calculateImpostoSelo(valorImovel);
  const registoPredial = 275; // Valor médio
  const escritura = 650; // Valor médio
  
  // Valor patrimonial é geralmente ~60% do valor de mercado
  const imiAnualEstimado = calculateIMI(valorImovel * 0.6, taxaIMI);

  const totalCustos = imt + impostoSelo + registoPredial + escritura;

  return {
    valorImovel,
    imt,
    impostoSelo,
    registoPredial,
    escritura,
    imiAnualEstimado,
    totalCustos,
    totalComImovel: valorImovel + totalCustos
  };
}
