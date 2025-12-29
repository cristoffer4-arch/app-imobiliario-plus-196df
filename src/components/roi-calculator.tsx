// src/components/roi-calculator.tsx
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { calcularROI, type DadosInvestimento, type ResultadoROI } from '@/lib/roi-pt';

export function ROICalculator() {
  const [dados, setDados] = useState<DadosInvestimento>({
    valorCompra: 0,
    custoAquisicao: 0,
    custoRenovacao: 0,
    valorAluguel: 0,
    taxaIRS: 0.28,
    taxaVacancia: 0.05,
    custoManutencaoAnual: 0,
    valorizacaoAnual: 0.03,
  });

  const [resultado, setResultado] = useState<ResultadoROI | null>(null);

  const atualizarCampo = (campo: keyof DadosInvestimento, valor: number) => {
    setDados((prev) => ({ ...prev, [campo]: valor }));
  };

  const calcular = () => {
    const res = calcularROI(dados);
    setResultado(res);
  };

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-PT', {
      style: 'currency',
      currency: 'EUR',
    }).format(valor);
  };

  const formatarPercentagem = (valor: number) => {
    return `${valor.toFixed(2)}%`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Calculadora de ROI Imobiliário</CardTitle>
          <CardDescription>
            Calcule o retorno sobre investimento do seu imóvel em Portugal
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="valorCompra">Valor de Compra (€)</Label>
              <Input
                id="valorCompra"
                type="number"
                value={dados.valorCompra || ''}
                onChange={(e) => atualizarCampo('valorCompra', Number(e.target.value))}
                placeholder="Ex: 300000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="custoAquisicao">Custos de Aquisição (€)</Label>
              <Input
                id="custoAquisicao"
                type="number"
                value={dados.custoAquisicao || ''}
                onChange={(e) => atualizarCampo('custoAquisicao', Number(e.target.value))}
                placeholder="IMT + Registo + Comissões"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="custoRenovacao">Custos de Renovação (€)</Label>
              <Input
                id="custoRenovacao"
                type="number"
                value={dados.custoRenovacao || ''}
                onChange={(e) => atualizarCampo('custoRenovacao', Number(e.target.value))}
                placeholder="Ex: 50000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="valorAluguel">Valor do Aluguel Mensal (€)</Label>
              <Input
                id="valorAluguel"
                type="number"
                value={dados.valorAluguel || ''}
                onChange={(e) => atualizarCampo('valorAluguel', Number(e.target.value))}
                placeholder="Ex: 1500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="taxaIRS">Taxa IRS (%)</Label>
              <Input
                id="taxaIRS"
                type="number"
                step="0.01"
                value={(dados.taxaIRS || 0) * 100}
                onChange={(e) => atualizarCampo('taxaIRS', Number(e.target.value) / 100)}
                placeholder="Ex: 28"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="taxaVacancia">Taxa de Vacância (%)</Label>
              <Input
                id="taxaVacancia"
                type="number"
                step="0.01"
                value={(dados.taxaVacancia || 0) * 100}
                onChange={(e) => atualizarCampo('taxaVacancia', Number(e.target.value) / 100)}
                placeholder="Ex: 5"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="custoManutencaoAnual">Custo Manutenção Anual (€)</Label>
              <Input
                id="custoManutencaoAnual"
                type="number"
                value={dados.custoManutencaoAnual || ''}
                onChange={(e) => atualizarCampo('custoManutencaoAnual', Number(e.target.value))}
                placeholder="Ex: 3000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="valorizacaoAnual">Valorização Anual (%)</Label>
              <Input
                id="valorizacaoAnual"
                type="number"
                step="0.01"
                value={(dados.valorizacaoAnual || 0) * 100}
                onChange={(e) => atualizarCampo('valorizacaoAnual', Number(e.target.value) / 100)}
                placeholder="Ex: 3"
              />
            </div>
          </div>

          <Button onClick={calcular} className="w-full">
            Calcular ROI
          </Button>
        </CardContent>
      </Card>

      {resultado && (
        <Card>
          <CardHeader>
            <CardTitle>Resultados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-muted-foreground">Renda Bruta Anual</Label>
                <p className="text-2xl font-bold">{formatarMoeda(resultado.rendaBrutaAnual)}</p>
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground">Renda Líquida Anual</Label>
                <p className="text-2xl font-bold text-green-600">
                  {formatarMoeda(resultado.rendaLiquidaAnual)}
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground">ROI Bruto</Label>
                <p className="text-2xl font-bold">{formatarPercentagem(resultado.roiBruto)}</p>
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground">ROI Líquido</Label>
                <p className="text-2xl font-bold text-green-600">
                  {formatarPercentagem(resultado.roiLiquido)}
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground">Período de Payback</Label>
                <p className="text-2xl font-bold">
                  {resultado.paybackPeriodo < Infinity
                    ? `${resultado.paybackPeriodo.toFixed(1)} anos`
                    : 'N/A'}
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground">Fluxo de Caixa Mensal</Label>
                <p className="text-2xl font-bold">
                  {formatarMoeda(resultado.fluxoCaixaMensal)}
                </p>
              </div>

              <div className="col-span-2 pt-4 border-t">
                <h4 className="font-semibold mb-2">Custos Anuais</h4>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <Label className="text-muted-foreground">IMI</Label>
                    <p>{formatarMoeda(resultado.imi)}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">IRS</Label>
                    <p>{formatarMoeda(resultado.irs)}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Manutenção</Label>
                    <p>{formatarMoeda(resultado.custoManutencao)}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
