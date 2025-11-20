'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Check, X, Sparkles, Crown, Gift, ArrowLeft, CreditCard, 
  Shield, Zap, Users, TrendingUp, Award
} from 'lucide-react';

type PlanoTipo = 'gratuito' | 'premium';

interface Plano {
  id: PlanoTipo;
  nome: string;
  preco: string;
  precoNumerico: number;
  descricao: string;
  icon: typeof Crown;
  cor: string;
  recursos: {
    nome: string;
    incluido: boolean;
  }[];
  destaque?: boolean;
}

export default function AssinaturaPage() {
  const [planoSelecionado, setPlanoSelecionado] = useState<PlanoTipo | null>(null);
  const [voucher, setVoucher] = useState('');
  const [voucherAplicado, setVoucherAplicado] = useState(false);
  const [voucherValido, setVoucherValido] = useState<boolean | null>(null);
  const [processando, setProcessando] = useState(false);

  const planos: Plano[] = [
    {
      id: 'gratuito',
      nome: 'Plano Gratuito',
      preco: 'Grátis',
      precoNumerico: 0,
      descricao: 'Ideal para começar',
      icon: Sparkles,
      cor: 'from-blue-500 to-cyan-500',
      recursos: [
        { nome: 'Até 5 leads por mês', incluido: true },
        { nome: 'Até 3 imóveis cadastrados', incluido: true },
        { nome: 'Dashboard básico', incluido: true },
        { nome: 'Suporte por email', incluido: true },
        { nome: 'Gamificação completa', incluido: false },
        { nome: 'Integração Casafari CRM', incluido: false },
        { nome: 'Anúncios Idealista com IA', incluido: false },
        { nome: 'Análise de desempenho', incluido: false },
        { nome: 'Coaching personalizado', incluido: false },
        { nome: 'Suporte prioritário', incluido: false },
      ]
    },
    {
      id: 'premium',
      nome: 'Plano Premium',
      preco: '€3,99/mês',
      precoNumerico: 3.99,
      descricao: 'Acesso total ilimitado',
      icon: Crown,
      cor: 'from-purple-500 to-pink-600',
      destaque: true,
      recursos: [
        { nome: 'Leads ilimitados', incluido: true },
        { nome: 'Imóveis ilimitados', incluido: true },
        { nome: 'Dashboard avançado', incluido: true },
        { nome: 'Gamificação completa', incluido: true },
        { nome: 'Integração Casafari CRM', incluido: true },
        { nome: 'Anúncios Idealista com IA', incluido: true },
        { nome: 'Análise de desempenho', incluido: true },
        { nome: 'Coaching personalizado', incluido: true },
        { nome: 'Suporte prioritário 24/7', incluido: true },
        { nome: 'Relatórios personalizados', incluido: true },
      ]
    }
  ];

  const validarVoucher = () => {
    setProcessando(true);
    
    // Simula validação
    setTimeout(() => {
      if (voucher.trim().toLowerCase() === 'alexzilottividor') {
        setVoucherValido(true);
        setVoucherAplicado(true);
      } else {
        setVoucherValido(false);
      }
      setProcessando(false);
    }, 1000);
  };

  const finalizarAssinatura = () => {
    setProcessando(true);
    
    setTimeout(() => {
      if (voucherAplicado && voucherValido) {
        alert('🎉 Parabéns! Você ganhou acesso TOTAL GRÁTIS por 1 ano com o voucher especial!');
      } else if (planoSelecionado === 'gratuito') {
        alert('✅ Plano Gratuito ativado com sucesso!');
      } else if (planoSelecionado === 'premium') {
        alert('✅ Assinatura Premium confirmada! Bem-vindo ao acesso total.');
      }
      setProcessando(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <button className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Voltar ao Dashboard</span>
              </button>
            </Link>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Pagamento 100% Seguro</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Escolha o Plano Ideal para Você
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Comece grátis ou desbloqueie todo o potencial com o Plano Premium por apenas €3,99/mês
          </p>
        </div>

        {/* Planos */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {planos.map((plano) => (
            <div
              key={plano.id}
              className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-2 transition-all duration-300 ${
                planoSelecionado === plano.id
                  ? 'border-purple-500 scale-105'
                  : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700'
              } ${plano.destaque ? 'ring-4 ring-purple-500/20' : ''}`}
            >
              {plano.destaque && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-purple-500 to-pink-600 text-white text-sm font-bold px-4 py-1 rounded-full shadow-lg">
                    ⭐ Mais Popular
                  </span>
                </div>
              )}

              <div className="p-8">
                {/* Header do Plano */}
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-br ${plano.cor} rounded-2xl flex items-center justify-center`}>
                    <plano.icon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {plano.nome}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {plano.descricao}
                    </p>
                  </div>
                </div>

                {/* Preço */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold text-gray-900 dark:text-white">
                      {plano.preco}
                    </span>
                    {plano.precoNumerico > 0 && (
                      <span className="text-gray-600 dark:text-gray-400">/mês</span>
                    )}
                  </div>
                </div>

                {/* Recursos */}
                <div className="space-y-3 mb-8">
                  {plano.recursos.map((recurso, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      {recurso.incluido ? (
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      ) : (
                        <X className="w-5 h-5 text-gray-300 dark:text-gray-600 flex-shrink-0 mt-0.5" />
                      )}
                      <span className={`text-sm ${
                        recurso.incluido 
                          ? 'text-gray-900 dark:text-white font-medium' 
                          : 'text-gray-400 dark:text-gray-500'
                      }`}>
                        {recurso.nome}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Botão de Seleção */}
                <button
                  onClick={() => setPlanoSelecionado(plano.id)}
                  className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 ${
                    planoSelecionado === plano.id
                      ? `bg-gradient-to-r ${plano.cor} text-white shadow-lg scale-105`
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {planoSelecionado === plano.id ? '✓ Plano Selecionado' : 'Selecionar Plano'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Voucher Section */}
        {planoSelecionado && (
          <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <Gift className="w-6 h-6 text-purple-500" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Tem um Voucher Especial?
              </h3>
            </div>

            <div className="space-y-4">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={voucher}
                  onChange={(e) => {
                    setVoucher(e.target.value);
                    setVoucherValido(null);
                  }}
                  placeholder="Digite seu código de voucher"
                  disabled={voucherAplicado}
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  onClick={validarVoucher}
                  disabled={!voucher.trim() || voucherAplicado || processando}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processando ? 'Validando...' : 'Aplicar'}
                </button>
              </div>

              {voucherValido === true && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-green-900 dark:text-green-100">
                        🎉 Voucher Válido!
                      </p>
                      <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                        Você ganhou <strong>acesso TOTAL GRÁTIS por 1 ano</strong> ao Plano Premium!
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {voucherValido === false && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <X className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-red-900 dark:text-red-100">
                        Voucher Inválido
                      </p>
                      <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                        O código digitado não é válido. Verifique e tente novamente.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Resumo e Finalização */}
        {planoSelecionado && (
          <div className="max-w-2xl mx-auto bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl shadow-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-6">Resumo da Assinatura</h3>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-white/80">Plano Selecionado:</span>
                <span className="font-bold text-lg">
                  {planos.find(p => p.id === planoSelecionado)?.nome}
                </span>
              </div>
              
              {voucherAplicado && voucherValido ? (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Valor Original:</span>
                    <span className="line-through">€3,99/mês</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Voucher Aplicado:</span>
                    <span className="font-bold text-yellow-300">AlexZilottiVidor</span>
                  </div>
                  <div className="border-t border-white/20 pt-3 mt-3">
                    <div className="flex justify-between items-center text-xl">
                      <span className="font-bold">Total:</span>
                      <span className="font-bold text-yellow-300">GRÁTIS por 1 ano! 🎉</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="border-t border-white/20 pt-3 mt-3">
                  <div className="flex justify-between items-center text-xl">
                    <span className="font-bold">Total:</span>
                    <span className="font-bold">
                      {planos.find(p => p.id === planoSelecionado)?.preco}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={finalizarAssinatura}
              disabled={processando}
              className="w-full bg-white text-purple-600 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processando ? (
                'Processando...'
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  {voucherAplicado && voucherValido ? 'Ativar Acesso Grátis' : 'Confirmar Assinatura'}
                </>
              )}
            </button>

            <p className="text-center text-white/70 text-sm mt-4">
              Pagamento seguro e criptografado • Cancele quando quiser
            </p>
          </div>
        )}

        {/* Benefícios */}
        <div className="mt-16 grid md:grid-cols-4 gap-6">
          {[
            { icon: Zap, titulo: 'Ativação Instantânea', desc: 'Acesso imediato após confirmação' },
            { icon: Shield, titulo: '100% Seguro', desc: 'Pagamentos criptografados' },
            { icon: Users, titulo: 'Suporte Dedicado', desc: 'Equipe pronta para ajudar' },
            { icon: Award, titulo: 'Garantia Total', desc: 'Satisfação garantida' },
          ].map((item, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <item.icon className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                {item.titulo}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
