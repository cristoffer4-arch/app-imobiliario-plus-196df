'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Home, Upload, Image as ImageIcon, Wand2, FileText, 
  Eye, Download, Sparkles, Check, X, ArrowLeft, Copy,
  Lightbulb, TrendingUp, Star, Zap, ChevronRight
} from 'lucide-react';
import ThemeSwitcher from '@/components/custom/theme-switcher';

interface ImagemDestaque {
  id: string;
  url: string;
  nome: string;
  ajustada: boolean;
  original?: string;
}

interface DetalhesImovel {
  tipo: string;
  area: string;
  quartos: string;
  banheiros: string;
  localizacao: string;
  preco: string;
  caracteristicas: string[];
}

export default function AnuncioIdealistaPage() {
  const [etapa, setEtapa] = useState<'upload' | 'texto' | 'preview'>('upload');
  const [imagens, setImagens] = useState<ImagemDestaque[]>([]);
  const [processando, setProcessando] = useState(false);
  const [detalhes, setDetalhes] = useState<DetalhesImovel>({
    tipo: 'apartamento',
    area: '',
    quartos: '',
    banheiros: '',
    localizacao: '',
    preco: '',
    caracteristicas: []
  });
  const [descricaoGerada, setDescricaoGerada] = useState('');
  const [tituloGerado, setTituloGerado] = useState('');
  const [frasesDestaque, setFrasesDestaque] = useState<string[]>([]);
  const [copiado, setCopiado] = useState(false);

  const caracteristicasDisponiveis = [
    'Varanda', 'Garagem', 'Elevador', 'Piscina', 'Jardim',
    'Ar Condicionado', 'Aquecimento Central', 'Cozinha Equipada',
    'Arrecadação', 'Condomínio Fechado', 'Vista Mar', 'Renovado',
    'Mobilado', 'Luminoso', 'Terraço'
  ];

  const frasesDestaqueOpcoes = [
    'Oportunidade exclusiva',
    'Pronto para morar',
    'Ambiente amplo e luminoso',
    'Localização privilegiada',
    'Excelente investimento',
    'Acabamentos de qualidade',
    'Vista deslumbrante',
    'Zona nobre',
    'Recém renovado',
    'Ideal para famílias'
  ];

  const handleUploadImagem = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const novasImagens: ImagemDestaque[] = Array.from(files).map((file, idx) => ({
      id: `img-${Date.now()}-${idx}`,
      url: URL.createObjectURL(file),
      nome: file.name,
      ajustada: false,
      original: URL.createObjectURL(file)
    }));

    setImagens([...imagens, ...novasImagens]);
  };

  const ajustarImagemIA = async (imagemId: string) => {
    setProcessando(true);
    
    // Simulação de ajuste com IA (padrão Idealista)
    setTimeout(() => {
      setImagens(imagens.map(img => 
        img.id === imagemId 
          ? { ...img, ajustada: true }
          : img
      ));
      setProcessando(false);
    }, 2000);
  };

  const ajustarTodasImagens = async () => {
    setProcessando(true);
    
    setTimeout(() => {
      setImagens(imagens.map(img => ({ ...img, ajustada: true })));
      setProcessando(false);
    }, 3000);
  };

  const removerImagem = (imagemId: string) => {
    setImagens(imagens.filter(img => img.id !== imagemId));
  };

  const gerarTextoInteligente = () => {
    setProcessando(true);

    // Simulação de geração de texto com IA
    setTimeout(() => {
      const titulo = `${detalhes.tipo.charAt(0).toUpperCase() + detalhes.tipo.slice(1)} T${detalhes.quartos} ${detalhes.area}m² - ${detalhes.localizacao}`;
      
      const descricao = `Descubra este magnífico ${detalhes.tipo} com ${detalhes.area}m² de área útil, localizado em ${detalhes.localizacao}. 

Com ${detalhes.quartos} quartos espaçosos e ${detalhes.banheiros} casas de banho modernas, este imóvel oferece todo o conforto que procura para a sua família.

Características principais:
${detalhes.caracteristicas.map(c => `• ${c}`).join('\n')}

Este imóvel destaca-se pela sua localização privilegiada, próximo de todos os serviços essenciais, transportes públicos, escolas e zonas comerciais. Ideal para quem procura qualidade de vida num ambiente tranquilo e bem servido.

Não perca esta oportunidade única! Agende já a sua visita e venha conhecer aquele que pode ser o seu próximo lar.

Preço: ${detalhes.preco}€

Contacte-nos para mais informações ou agendamento de visita.`;

      setTituloGerado(titulo);
      setDescricaoGerada(descricao);
      setFrasesDestaque(frasesDestaqueOpcoes.slice(0, 3));
      setProcessando(false);
      setEtapa('texto');
    }, 2000);
  };

  const toggleCaracteristica = (caracteristica: string) => {
    if (detalhes.caracteristicas.includes(caracteristica)) {
      setDetalhes({
        ...detalhes,
        caracteristicas: detalhes.caracteristicas.filter(c => c !== caracteristica)
      });
    } else {
      setDetalhes({
        ...detalhes,
        caracteristicas: [...detalhes.caracteristicas, caracteristica]
      });
    }
  };

  const toggleFraseDestaque = (frase: string) => {
    if (frasesDestaque.includes(frase)) {
      setFrasesDestaque(frasesDestaque.filter(f => f !== frase));
    } else {
      setFrasesDestaque([...frasesDestaque, frase]);
    }
  };

  const exportarParaIdealista = () => {
    const conteudo = `TÍTULO:\n${tituloGerado}\n\n${frasesDestaque.map(f => `🔸 ${f}`).join('\n')}\n\nDESCRIÇÃO:\n${descricaoGerada}`;
    
    const blob = new Blob([conteudo], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `anuncio-idealista-${Date.now()}.txt`;
    a.click();
  };

  const copiarParaClipboard = () => {
    const conteudo = `${tituloGerado}\n\n${frasesDestaque.map(f => `🔸 ${f}`).join('\n')}\n\n${descricaoGerada}`;
    navigator.clipboard.writeText(conteudo);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </button>
              </Link>
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-orange-500 to-red-600 p-2 rounded-xl">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Anúncio Idealista
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Crie anúncios otimizados com IA
                  </p>
                </div>
              </div>
            </div>
            <ThemeSwitcher />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4">
            <div className={`flex items-center gap-2 ${etapa === 'upload' ? 'text-orange-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                etapa === 'upload' ? 'bg-orange-500 text-white' : 'bg-gray-200 dark:bg-gray-700'
              }`}>
                <ImageIcon className="w-5 h-5" />
              </div>
              <span className="font-semibold hidden sm:block">Imagens</span>
            </div>
            
            <ChevronRight className="w-5 h-5 text-gray-400" />
            
            <div className={`flex items-center gap-2 ${etapa === 'texto' ? 'text-orange-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                etapa === 'texto' ? 'bg-orange-500 text-white' : 'bg-gray-200 dark:bg-gray-700'
              }`}>
                <FileText className="w-5 h-5" />
              </div>
              <span className="font-semibold hidden sm:block">Texto</span>
            </div>
            
            <ChevronRight className="w-5 h-5 text-gray-400" />
            
            <div className={`flex items-center gap-2 ${etapa === 'preview' ? 'text-orange-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                etapa === 'preview' ? 'bg-orange-500 text-white' : 'bg-gray-200 dark:bg-gray-700'
              }`}>
                <Eye className="w-5 h-5" />
              </div>
              <span className="font-semibold hidden sm:block">Preview</span>
            </div>
          </div>
        </div>

        {/* Etapa 1: Upload e Ajuste de Imagens */}
        {etapa === 'upload' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <ImageIcon className="w-6 h-6 text-orange-500" />
                Imagens em Destaque
              </h2>

              {/* Upload Area */}
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:border-orange-500 transition-colors">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleUploadImagem}
                  className="hidden"
                  id="upload-imagens"
                />
                <label htmlFor="upload-imagens" className="cursor-pointer">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400 font-semibold mb-2">
                    Clique para fazer upload ou arraste as imagens
                  </p>
                  <p className="text-sm text-gray-500">
                    PNG, JPG até 10MB cada
                  </p>
                </label>
              </div>

              {/* Imagens Carregadas */}
              {imagens.length > 0 && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Imagens Carregadas ({imagens.length})
                    </h3>
                    <button
                      onClick={ajustarTodasImagens}
                      disabled={processando || imagens.every(img => img.ajustada)}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Wand2 className="w-4 h-4" />
                      Ajustar Todas com IA
                    </button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {imagens.map(imagem => (
                      <div key={imagem.id} className="relative group">
                        <img
                          src={imagem.url}
                          alt={imagem.nome}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        
                        {imagem.ajustada && (
                          <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full">
                            <Check className="w-4 h-4" />
                          </div>
                        )}

                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                          {!imagem.ajustada && (
                            <button
                              onClick={() => ajustarImagemIA(imagem.id)}
                              disabled={processando}
                              className="p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                              title="Ajustar com IA"
                            >
                              <Wand2 className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => removerImagem(imagem.id)}
                            className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                            title="Remover"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 truncate">
                          {imagem.nome}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Detalhes do Imóvel */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <FileText className="w-6 h-6 text-orange-500" />
                Detalhes do Imóvel
              </h2>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tipo de Imóvel
                  </label>
                  <select
                    value={detalhes.tipo}
                    onChange={(e) => setDetalhes({ ...detalhes, tipo: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="apartamento">Apartamento</option>
                    <option value="moradia">Moradia</option>
                    <option value="escritorio">Escritório</option>
                    <option value="loja">Loja</option>
                    <option value="terreno">Terreno</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Área (m²)
                  </label>
                  <input
                    type="number"
                    value={detalhes.area}
                    onChange={(e) => setDetalhes({ ...detalhes, area: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Ex: 120"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Quartos
                  </label>
                  <input
                    type="number"
                    value={detalhes.quartos}
                    onChange={(e) => setDetalhes({ ...detalhes, quartos: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Ex: 3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Casas de Banho
                  </label>
                  <input
                    type="number"
                    value={detalhes.banheiros}
                    onChange={(e) => setDetalhes({ ...detalhes, banheiros: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Ex: 2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Localização
                  </label>
                  <input
                    type="text"
                    value={detalhes.localizacao}
                    onChange={(e) => setDetalhes({ ...detalhes, localizacao: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Ex: Lisboa, Avenidas Novas"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Preço (€)
                  </label>
                  <input
                    type="text"
                    value={detalhes.preco}
                    onChange={(e) => setDetalhes({ ...detalhes, preco: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Ex: 350000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Características
                </label>
                <div className="flex flex-wrap gap-2">
                  {caracteristicasDisponiveis.map(caracteristica => (
                    <button
                      key={caracteristica}
                      onClick={() => toggleCaracteristica(caracteristica)}
                      className={`px-4 py-2 rounded-lg border-2 transition-all ${
                        detalhes.caracteristicas.includes(caracteristica)
                          ? 'bg-orange-500 text-white border-orange-500'
                          : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-orange-500'
                      }`}
                    >
                      {caracteristica}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={gerarTextoInteligente}
                disabled={processando || !detalhes.area || !detalhes.quartos || !detalhes.localizacao || !detalhes.preco}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              >
                <Sparkles className="w-5 h-5" />
                Gerar Texto Inteligente
              </button>
            </div>
          </div>
        )}

        {/* Etapa 2: Texto Inteligente */}
        {etapa === 'texto' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Lightbulb className="w-6 h-6 text-orange-500" />
                Frases de Destaque
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Selecione frases que elevem o imóvel nos rankings de busca
              </p>

              <div className="flex flex-wrap gap-2">
                {frasesDestaqueOpcoes.map(frase => (
                  <button
                    key={frase}
                    onClick={() => toggleFraseDestaque(frase)}
                    className={`px-4 py-2 rounded-lg border-2 transition-all ${
                      frasesDestaque.includes(frase)
                        ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white border-orange-500'
                        : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-orange-500'
                    }`}
                  >
                    {frase}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <FileText className="w-6 h-6 text-orange-500" />
                Título do Anúncio
              </h2>
              <textarea
                value={tituloGerado}
                onChange={(e) => setTituloGerado(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                rows={2}
              />
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-orange-500" />
                Descrição Otimizada
              </h2>
              <textarea
                value={descricaoGerada}
                onChange={(e) => setDescricaoGerada(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                rows={15}
              />
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setEtapa('upload')}
                className="flex items-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all font-semibold"
              >
                <ArrowLeft className="w-5 h-5" />
                Voltar
              </button>
              <button
                onClick={() => setEtapa('preview')}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all font-semibold"
              >
                Pré-visualizar
                <Eye className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Etapa 3: Preview e Exportação */}
        {etapa === 'preview' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Eye className="w-6 h-6 text-orange-500" />
                Pré-visualização do Anúncio
              </h2>

              {/* Preview Card */}
              <div className="border-2 border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                {/* Imagens */}
                {imagens.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-4 bg-gray-50 dark:bg-gray-900">
                    {imagens.slice(0, 4).map(imagem => (
                      <img
                        key={imagem.id}
                        src={imagem.url}
                        alt={imagem.nome}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                )}

                <div className="p-6">
                  {/* Frases Destaque */}
                  {frasesDestaque.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {frasesDestaque.map(frase => (
                        <span
                          key={frase}
                          className="px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-semibold rounded-full"
                        >
                          {frase}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Título */}
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {tituloGerado}
                  </h3>

                  {/* Descrição */}
                  <div className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                    {descricaoGerada}
                  </div>
                </div>
              </div>
            </div>

            {/* Ações de Exportação */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Download className="w-6 h-6" />
                Exportar Anúncio
              </h2>
              <p className="mb-6 text-white/90">
                Seu anúncio está pronto para publicação no Idealista e otimizado para SEO
              </p>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={exportarParaIdealista}
                  className="flex items-center gap-2 px-6 py-3 bg-white text-orange-600 rounded-lg hover:bg-gray-100 transition-all font-semibold"
                >
                  <Download className="w-5 h-5" />
                  Baixar para Idealista
                </button>

                <button
                  onClick={copiarParaClipboard}
                  className="flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-lg transition-all font-semibold"
                >
                  {copiado ? (
                    <>
                      <Check className="w-5 h-5" />
                      Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5" />
                      Copiar Texto
                    </>
                  )}
                </button>

                <button
                  onClick={() => setEtapa('texto')}
                  className="flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-lg transition-all font-semibold"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Editar
                </button>
              </div>
            </div>

            {/* Dicas SEO */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-green-500" />
                Otimização SEO
              </h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Título otimizado</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Inclui localização, tipo e características principais
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Palavras-chave estratégicas</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Descrição contém termos relevantes para busca
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Imagens otimizadas</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Ajustadas para padrão Idealista com IA
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">Frases de destaque</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Elevam o anúncio nos rankings de busca
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
