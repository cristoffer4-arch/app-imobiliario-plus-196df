'use client';

import { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { 
  Camera, Upload, Download, Mail, Cloud, FileText, 
  Check, X, Maximize2, RotateCw, ZoomIn, ZoomOut,
  Home, HardDrive, Share2, Save, Trash2,
  ChevronLeft, Loader2, AlertCircle
} from 'lucide-react';

interface ScannedDocument {
  id: string;
  name: string;
  imageUrl: string;
  timestamp: Date;
  pages: number;
  size: string;
}

export default function ScannerDocumentos() {
  const [mode, setMode] = useState<'camera' | 'upload' | null>(null);
  const [scannedDocs, setScannedDocs] = useState<ScannedDocument[]>([]);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<ScannedDocument | null>(null);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Simular detecção de bordas e otimização de imagem
  const processImage = async (imageData: string) => {
    setIsProcessing(true);
    
    // Simular processamento de IA (detecção de bordas, otimização)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newDoc: ScannedDocument = {
      id: Date.now().toString(),
      name: `Documento_${new Date().toLocaleDateString('pt-PT').replace(/\//g, '-')}`,
      imageUrl: imageData,
      timestamp: new Date(),
      pages: 1,
      size: '2.3 MB'
    };
    
    setScannedDocs(prev => [...prev, newDoc]);
    setCurrentImage(null);
    setIsProcessing(false);
    setMode(null);
  };

  // Iniciar câmera
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setMode('camera');
    } catch (error) {
      alert('Erro ao acessar câmera. Verifique as permissões.');
    }
  };

  // Capturar foto da câmera
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg');
        setCurrentImage(imageData);
        
        // Parar câmera
        const stream = video.srcObject as MediaStream;
        stream?.getTracks().forEach(track => track.stop());
      }
    }
  };

  // Upload de arquivo
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageData = event.target?.result as string;
        setCurrentImage(imageData);
        setMode('upload');
      };
      reader.readAsDataURL(file);
    }
  };

  // Aplicar ajustes de imagem
  const applyImageAdjustments = () => {
    if (currentImage) {
      // Aqui aplicaríamos os ajustes reais com canvas
      processImage(currentImage);
    }
  };

  // Gerar PDF (simulado)
  const generatePDF = async (doc: ScannedDocument) => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simular download de PDF
    const link = document.createElement('a');
    link.href = doc.imageUrl;
    link.download = `${doc.name}.pdf`;
    link.click();
    
    setIsProcessing(false);
    alert('PDF gerado e baixado com sucesso!');
  };

  // Exportar para email
  const exportToEmail = (doc: ScannedDocument) => {
    const subject = encodeURIComponent(`Documento: ${doc.name}`);
    const body = encodeURIComponent(`Segue em anexo o documento digitalizado: ${doc.name}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  // Exportar para cloud (simulado)
  const exportToCloud = async (service: 'drive' | 'dropbox' | 'onedrive', doc: ScannedDocument) => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    
    const serviceName = service === 'drive' ? 'Google Drive' : 
                        service === 'dropbox' ? 'Dropbox' : 'OneDrive';
    alert(`Documento exportado para ${serviceName} com sucesso!`);
    setShowExportMenu(false);
  };

  // Salvar no dispositivo
  const saveToDevice = (doc: ScannedDocument) => {
    const link = document.createElement('a');
    link.href = doc.imageUrl;
    link.download = `${doc.name}.jpg`;
    link.click();
    alert('Documento salvo no dispositivo!');
  };

  // Deletar documento
  const deleteDocument = (docId: string) => {
    if (confirm('Deseja realmente excluir este documento?')) {
      setScannedDocs(prev => prev.filter(doc => doc.id !== docId));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/">
                <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <ChevronLeft className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                </button>
              </Link>
              <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-2 rounded-xl">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Scanner de Documentos
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Digitalize e exporte documentos com IA
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Modo de captura não iniciado */}
        {!mode && !currentImage && (
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Botão Câmera */}
            <button
              onClick={startCamera}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all group"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Camera className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Usar Câmera
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Capture documentos em tempo real com detecção automática de bordas
                </p>
              </div>
            </button>

            {/* Botão Upload */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border-2 border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-500 transition-all group"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Upload className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Upload de Arquivo
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Selecione uma imagem da galeria para digitalizar
                </p>
              </div>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        )}

        {/* Modo Câmera Ativa */}
        {mode === 'camera' && !currentImage && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl mb-8">
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full rounded-xl"
              />
              <canvas ref={canvasRef} className="hidden" />
              
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
                <button
                  onClick={capturePhoto}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-full font-semibold shadow-lg transition-all flex items-center gap-2"
                >
                  <Camera className="w-6 h-6" />
                  Capturar
                </button>
                <button
                  onClick={() => {
                    setMode(null);
                    const stream = videoRef.current?.srcObject as MediaStream;
                    stream?.getTracks().forEach(track => track.stop());
                  }}
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-4 rounded-full font-semibold shadow-lg transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Pré-visualização e Ajustes */}
        {currentImage && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl mb-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Maximize2 className="w-6 h-6 text-blue-500" />
              Ajustar Documento
            </h2>

            <div className="relative mb-6">
              <img
                src={currentImage}
                alt="Documento capturado"
                className="w-full rounded-xl"
                style={{
                  filter: `brightness(${brightness}%) contrast(${contrast}%)`,
                  transform: `rotate(${rotation}deg) scale(${zoom})`
                }}
              />
            </div>

            {/* Controles de Ajuste */}
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Brilho: {brightness}%
                </label>
                <input
                  type="range"
                  min="50"
                  max="150"
                  value={brightness}
                  onChange={(e) => setBrightness(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Contraste: {contrast}%
                </label>
                <input
                  type="range"
                  min="50"
                  max="150"
                  value={contrast}
                  onChange={(e) => setContrast(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setRotation(prev => prev + 90)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <RotateCw className="w-5 h-5" />
                Girar
              </button>

              <button
                onClick={() => setZoom(prev => Math.min(prev + 0.1, 2))}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <ZoomIn className="w-5 h-5" />
                Zoom +
              </button>

              <button
                onClick={() => setZoom(prev => Math.max(prev - 0.1, 0.5))}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <ZoomOut className="w-5 h-5" />
                Zoom -
              </button>

              <button
                onClick={() => setCurrentImage(null)}
                className="flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors ml-auto"
              >
                <X className="w-5 h-5" />
                Cancelar
              </button>

              <button
                onClick={applyImageAdjustments}
                disabled={isProcessing}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-lg hover:from-blue-600 hover:to-cyan-700 transition-all font-semibold disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    Confirmar
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Lista de Documentos Digitalizados */}
        {scannedDocs.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <FileText className="w-6 h-6 text-purple-500" />
              Documentos Digitalizados ({scannedDocs.length})
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {scannedDocs.map(doc => (
                <div
                  key={doc.id}
                  className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-all"
                >
                  <img
                    src={doc.imageUrl}
                    alt={doc.name}
                    className="w-full h-48 object-cover rounded-lg mb-3"
                  />
                  
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2 truncate">
                    {doc.name}
                  </h3>
                  
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <span>{doc.pages} página(s)</span>
                    <span>{doc.size}</span>
                  </div>

                  {/* Botões de Ação */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => generatePDF(doc)}
                      className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                    >
                      <Download className="w-4 h-4" />
                      PDF
                    </button>

                    <button
                      onClick={() => saveToDevice(doc)}
                      className="flex items-center justify-center gap-2 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                    >
                      <Save className="w-4 h-4" />
                      Salvar
                    </button>

                    <button
                      onClick={() => exportToEmail(doc)}
                      className="flex items-center justify-center gap-2 px-3 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
                    >
                      <Mail className="w-4 h-4" />
                      Email
                    </button>

                    <button
                      onClick={() => {
                        setSelectedDoc(doc);
                        setShowExportMenu(true);
                      }}
                      className="flex items-center justify-center gap-2 px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm font-medium"
                    >
                      <Cloud className="w-4 h-4" />
                      Cloud
                    </button>
                  </div>

                  <button
                    onClick={() => deleteDocument(doc.id)}
                    className="w-full mt-2 flex items-center justify-center gap-2 px-3 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors text-sm font-medium"
                  >
                    <Trash2 className="w-4 h-4" />
                    Excluir
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal de Exportação para Cloud */}
        {showExportMenu && selectedDoc && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-2xl">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Cloud className="w-6 h-6 text-purple-500" />
                Exportar para Cloud
              </h3>

              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Escolha o serviço de armazenamento:
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => exportToCloud('drive', selectedDoc)}
                  disabled={isProcessing}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors disabled:opacity-50"
                >
                  <HardDrive className="w-5 h-5" />
                  <span className="font-semibold">Google Drive</span>
                </button>

                <button
                  onClick={() => exportToCloud('dropbox', selectedDoc)}
                  disabled={isProcessing}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors disabled:opacity-50"
                >
                  <Cloud className="w-5 h-5" />
                  <span className="font-semibold">Dropbox</span>
                </button>

                <button
                  onClick={() => exportToCloud('onedrive', selectedDoc)}
                  disabled={isProcessing}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors disabled:opacity-50"
                >
                  <Cloud className="w-5 h-5" />
                  <span className="font-semibold">OneDrive</span>
                </button>
              </div>

              <button
                onClick={() => {
                  setShowExportMenu(false);
                  setSelectedDoc(null);
                }}
                className="w-full mt-4 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Informações de Funcionalidades */}
        {scannedDocs.length === 0 && !mode && !currentImage && (
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8 border border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-4">
              <div className="bg-blue-500 p-3 rounded-xl">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  Funcionalidades do Scanner
                </h3>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-500" />
                    Detecção automática de bordas com IA
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-500" />
                    Otimização de brilho e contraste
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-500" />
                    Geração de PDF de alta qualidade
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-500" />
                    Exportação para Google Drive, Dropbox e OneDrive
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-500" />
                    Compartilhamento por email
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-green-500" />
                    Salvamento direto no dispositivo
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
