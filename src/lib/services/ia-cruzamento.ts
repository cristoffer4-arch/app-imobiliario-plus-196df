// Serviço de IA para Cruzamento Inteligente de Imóveis
import type { Imovel, ResultadoCruzamento } from '@/lib/types/imoveis';

/**
 * VARIÁVEL 1: Sistema de Deduplicação Inteligente
 * Agrupa imóveis duplicados e exibe informações consolidadas
 */
export interface ImovelConsolidado extends Imovel {
  duplicatas?: {
    site: string;
    preco?: number;
    url?: string;
    fonte: string;
  }[];
  total_sites?: number;
}

/**
 * Calcula similaridade entre dois textos (versão simplificada sem API)
 */
function calcularSimilaridadeTexto(texto1: string, texto2: string): number {
  const t1 = texto1.toLowerCase().trim();
  const t2 = texto2.toLowerCase().trim();
  
  // Similaridade exata
  if (t1 === t2) return 100;
  
  // Similaridade por palavras comuns
  const palavras1 = new Set(t1.split(/\s+/));
  const palavras2 = new Set(t2.split(/\s+/));
  
  const intersecao = new Set([...palavras1].filter(p => palavras2.has(p)));
  const uniao = new Set([...palavras1, ...palavras2]);
  
  return (intersecao.size / uniao.size) * 100;
}

/**
 * Calcula similaridade de preço (tolerância de 10%)
 */
function calcularSimilaridadePreco(preco1?: number, preco2?: number): number {
  if (!preco1 || !preco2) return 0;
  
  const diferenca = Math.abs(preco1 - preco2);
  const media = (preco1 + preco2) / 2;
  const percentualDiferenca = (diferenca / media) * 100;
  
  if (percentualDiferenca <= 10) return 100;
  if (percentualDiferenca <= 20) return 80;
  if (percentualDiferenca <= 30) return 60;
  return 40;
}

/**
 * Calcula similaridade de características (quartos, banheiros, área)
 */
function calcularSimilaridadeCaracteristicas(imovel1: Imovel, imovel2: Imovel): number {
  let pontos = 0;
  let total = 0;

  // Quartos
  if (imovel1.quartos && imovel2.quartos) {
    total += 33;
    if (imovel1.quartos === imovel2.quartos) pontos += 33;
    else if (Math.abs(imovel1.quartos - imovel2.quartos) === 1) pontos += 20;
  }

  // Banheiros
  if (imovel1.banheiros && imovel2.banheiros) {
    total += 33;
    if (imovel1.banheiros === imovel2.banheiros) pontos += 33;
    else if (Math.abs(imovel1.banheiros - imovel2.banheiros) === 1) pontos += 20;
  }

  // Área (tolerância de 15%)
  if (imovel1.area_m2 && imovel2.area_m2) {
    total += 34;
    const diferenca = Math.abs(imovel1.area_m2 - imovel2.area_m2);
    const percentual = (diferenca / imovel1.area_m2) * 100;
    if (percentual <= 15) pontos += 34;
    else if (percentual <= 25) pontos += 20;
  }

  return total > 0 ? (pontos / total) * 100 : 0;
}

/**
 * VARIÁVEL 1: Consolidar imóveis duplicados
 * Remove duplicatas e agrupa informações de múltiplos sites
 */
export function consolidarImoveis(imoveis: Imovel[]): ImovelConsolidado[] {
  const imoveisConsolidados: ImovelConsolidado[] = [];
  const processados = new Set<string>();

  for (const imovel of imoveis) {
    if (processados.has(imovel.id)) continue;

    const imovelConsolidado: ImovelConsolidado = {
      ...imovel,
      duplicatas: [],
      total_sites: 1
    };

    // Buscar duplicatas
    for (const outroImovel of imoveis) {
      if (outroImovel.id === imovel.id || processados.has(outroImovel.id)) continue;

      // Verificar se são o mesmo imóvel (critérios simplificados)
      const mesmoTipo = imovel.tipo === outroImovel.tipo;
      const precoSimilar = imovel.preco && outroImovel.preco 
        ? Math.abs(imovel.preco - outroImovel.preco) / imovel.preco < 0.15 
        : false;
      const caracteristicasSimilares = 
        imovel.quartos === outroImovel.quartos &&
        imovel.banheiros === outroImovel.banheiros;

      if (mesmoTipo && (precoSimilar || caracteristicasSimilares)) {
        imovelConsolidado.duplicatas!.push({
          site: outroImovel.fonte,
          preco: outroImovel.preco,
          url: outroImovel.url_portal_externo || outroImovel.url_anuncio,
          fonte: outroImovel.fonte
        });
        imovelConsolidado.total_sites! += 1;
        processados.add(outroImovel.id);
      }
    }

    processados.add(imovel.id);
    imoveisConsolidados.push(imovelConsolidado);
  }

  return imoveisConsolidados;
}

/**
 * Realiza cruzamento inteligente entre imóvel interno e lista de externos
 */
export function cruzarImoveis(
  imovelInterno: Imovel,
  imoveisExternos: Imovel[]
): ResultadoCruzamento {
  const correspondencias = [];

  for (const imovelExterno of imoveisExternos) {
    // Pular se for o mesmo tipo diferente
    if (imovelInterno.tipo !== imovelExterno.tipo) continue;

    // Calcular similaridades
    const simTitulo = calcularSimilaridadeTexto(
      imovelInterno.titulo,
      imovelExterno.titulo
    );

    const simEndereco = imovelInterno.endereco && imovelExterno.endereco
      ? calcularSimilaridadeTexto(imovelInterno.endereco, imovelExterno.endereco)
      : 0;

    const simPreco = calcularSimilaridadePreco(
      imovelInterno.preco,
      imovelExterno.preco
    );

    const simCaracteristicas = calcularSimilaridadeCaracteristicas(
      imovelInterno,
      imovelExterno
    );

    // Calcular grau de confiança ponderado
    const grauConfianca = (
      simTitulo * 0.3 +
      simEndereco * 0.3 +
      simPreco * 0.2 +
      simCaracteristicas * 0.2
    );

    // Adicionar apenas se confiança >= 60%
    if (grauConfianca >= 60) {
      const motivos = [];
      if (simTitulo >= 70) motivos.push(`Título similar (${simTitulo.toFixed(0)}%)`);
      if (simEndereco >= 70) motivos.push(`Endereço similar (${simEndereco.toFixed(0)}%)`);
      if (simPreco >= 70) motivos.push(`Preço similar (${simPreco.toFixed(0)}%)`);
      if (simCaracteristicas >= 70) motivos.push(`Características similares (${simCaracteristicas.toFixed(0)}%)`);

      correspondencias.push({
        imovel_externo: imovelExterno,
        grau_confianca: Math.round(grauConfianca),
        motivos
      });
    }
  }

  // Ordenar por grau de confiança (maior primeiro)
  correspondencias.sort((a, b) => b.grau_confianca - a.grau_confianca);

  return {
    imovel_interno: imovelInterno,
    correspondencias
  };
}

/**
 * Análise em lote de múltiplos imóveis
 */
export function cruzarImoveisEmLote(
  imoveisInternos: Imovel[],
  imoveisExternos: Imovel[],
  onProgress?: (progresso: number) => void
): ResultadoCruzamento[] {
  const resultados: ResultadoCruzamento[] = [];
  
  for (let i = 0; i < imoveisInternos.length; i++) {
    const resultado = cruzarImoveis(imoveisInternos[i], imoveisExternos);
    resultados.push(resultado);
    
    if (onProgress) {
      onProgress(((i + 1) / imoveisInternos.length) * 100);
    }
  }

  return resultados;
}
