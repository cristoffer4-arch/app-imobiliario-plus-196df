'use client'

import { useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Upload, FileText, Scan, CheckCircle2 } from 'lucide-react'
import { useDropzone } from 'react-dropzone'

export default function ScannerDocumentosPage() {
  const [files, setFiles] = useState<File[]>([])
  const [scanning, setScanning] = useState(false)
  const [results, setResults] = useState<any[]>([])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
      'application/pdf': ['.pdf'],
    },
  })

  const handleScan = async () => {
    setScanning(true)
    // Simular processamento de documentos
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setResults([
      {
        id: 1,
        fileName: files[0]?.name || 'document.pdf',
        type: 'Contrato de Compra e Venda',
        status: 'verified',
        extractedData: {
          valor: 'R$ 450.000,00',
          data: '15/03/2024',
          partes: 'João Silva e Maria Santos',
        },
      },
    ])
    setScanning(false)
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Scanner de Documentos</h1>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Upload de Documentos</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? 'border-primary bg-primary/5'
                  : 'border-muted-foreground/25 hover:border-primary/50'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              {isDragActive ? (
                <p className="text-lg">Solte os arquivos aqui...</p>
              ) : (
                <div>
                  <p className="text-lg mb-2">Arraste e solte documentos aqui</p>
                  <p className="text-sm text-muted-foreground">
                    ou clique para selecionar arquivos
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Suporta PDF, PNG, JPG, JPEG
                  </p>
                </div>
              )}
            </div>

            {files.length > 0 && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Arquivos selecionados:</h3>
                <ul className="space-y-2">
                  {files.map((file, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <FileText className="h-4 w-4" />
                      {file.name}
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={handleScan}
                  disabled={scanning}
                  className="w-full mt-4"
                >
                  {scanning ? (
                    <>
                      <Scan className="mr-2 h-4 w-4 animate-spin" />
                      Processando...
                    </>
                  ) : (
                    <>
                      <Scan className="mr-2 h-4 w-4" />
                      Escanear Documentos
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resultados da Análise</CardTitle>
          </CardHeader>
          <CardContent>
            {results.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>Nenhum documento analisado ainda</p>
              </div>
            ) : (
              <div className="space-y-4">
                {results.map((result) => (
                  <div key={result.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold">{result.fileName}</h3>
                        <p className="text-sm text-muted-foreground">
                          {result.type}
                        </p>
                      </div>
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Valor:</span>
                        <span className="font-medium">{result.extractedData.valor}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Data:</span>
                        <span className="font-medium">{result.extractedData.data}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Partes:</span>
                        <span className="font-medium">{result.extractedData.partes}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
