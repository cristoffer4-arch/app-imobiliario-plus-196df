'use client';

import { useState, useCallback, DragEvent, ChangeEvent } from 'react';
import { storageClient, UploadResult } from '@/lib/storage-client';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  propertyId: string;
  onUploadComplete?: (results: UploadResult[]) => void;
  onUploadError?: (error: Error) => void;
  maxFiles?: number;
  existingImages?: string[];
  className?: string;
}

interface FileWithPreview {
  file: File;
  preview: string;
  progress: number;
  uploaded: boolean;
  error?: string;
}

export default function ImageUpload({
  propertyId,
  onUploadComplete,
  onUploadError,
  maxFiles = 10,
  existingImages = [],
  className,
}: ImageUploadProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Generate preview URL for file
  const createPreview = (file: File): string => {
    return URL.createObjectURL(file);
  };

  // Validate and add files
  const addFiles = useCallback(
    (newFiles: FileList | File[]) => {
      const fileArray = Array.from(newFiles);
      const totalFiles = files.length + existingImages.length + fileArray.length;

      if (totalFiles > maxFiles) {
        const error = new Error(`Máximo de ${maxFiles} imagens permitido`);
        onUploadError?.(error);
        return;
      }

      const validFiles: FileWithPreview[] = [];

      fileArray.forEach((file) => {
        const validation = storageClient.validateFile(file);
        if (validation.valid) {
          validFiles.push({
            file,
            preview: createPreview(file),
            progress: 0,
            uploaded: false,
          });
        } else {
          onUploadError?.(new Error(validation.error));
        }
      });

      setFiles((prev) => [...prev, ...validFiles]);
    },
    [files.length, existingImages.length, maxFiles, onUploadError]
  );

  // Handle drag events
  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      addFiles(droppedFiles);
    }
  };

  // Handle file input change
  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(e.target.files);
    }
  };

  // Remove file from list
  const removeFile = (index: number) => {
    setFiles((prev) => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  // Upload all files
  const uploadFiles = async () => {
    if (files.length === 0) return;

    setIsUploading(true);
    const uploadResults: UploadResult[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        if (files[i].uploaded) continue;

        try {
          // Update progress to show uploading
          setFiles((prev) => {
            const newFiles = [...prev];
            newFiles[i].progress = 50;
            return newFiles;
          });

          const result = await storageClient.uploadImage(
            files[i].file,
            propertyId,
            true // compress
          );

          uploadResults.push(result);

          // Mark as uploaded
          setFiles((prev) => {
            const newFiles = [...prev];
            newFiles[i].progress = 100;
            newFiles[i].uploaded = true;
            return newFiles;
          });
        } catch (error) {
          const err = error instanceof Error ? error : new Error('Upload failed');
          setFiles((prev) => {
            const newFiles = [...prev];
            newFiles[i].error = err.message;
            return newFiles;
          });
          onUploadError?.(err);
        }
      }

      if (uploadResults.length > 0) {
        onUploadComplete?.(uploadResults);
      }
    } finally {
      setIsUploading(false);
    }
  };

  // Clean up previews on unmount
  useState(() => {
    return () => {
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    };
  });

  return (
    <div className={cn('w-full space-y-4', className)}>
      {/* Drop zone */}
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={cn(
          'border-2 border-dashed rounded-lg p-8 text-center transition-colors',
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 hover:border-muted-foreground/50'
        )}
      >
        <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-sm text-muted-foreground mb-2">
          Arraste e solte imagens aqui ou clique para selecionar
        </p>
        <p className="text-xs text-muted-foreground mb-4">
          Máximo {maxFiles} imagens • JPG, PNG, WebP • Até 5MB cada
        </p>
        <input
          type="file"
          multiple
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileInput}
          className="hidden"
          id="file-upload"
          disabled={isUploading}
        />
        <label htmlFor="file-upload">
          <Button type="button" variant="secondary" disabled={isUploading} asChild>
            <span>Selecionar Imagens</span>
          </Button>
        </label>
      </div>

      {/* Preview grid */}
      {files.length > 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {files.map((fileItem, index) => (
              <div
                key={`${fileItem.file.name}-${index}`}
                className="relative group aspect-square rounded-lg overflow-hidden border"
              >
                <img
                  src={fileItem.preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover"
                />

                {/* Remove button */}
                {!fileItem.uploaded && !isUploading && (
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}

                {/* Progress overlay */}
                {fileItem.progress > 0 && fileItem.progress < 100 && (
                  <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                    <Progress value={fileItem.progress} className="w-3/4" />
                  </div>
                )}

                {/* Success indicator */}
                {fileItem.uploaded && (
                  <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <ImageIcon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                )}

                {/* Error indicator */}
                {fileItem.error && (
                  <div className="absolute inset-0 bg-destructive/80 flex items-center justify-center p-2">
                    <p className="text-xs text-destructive-foreground text-center">
                      {fileItem.error}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Upload button */}
          {files.some((f) => !f.uploaded) && (
            <Button
              onClick={uploadFiles}
              disabled={isUploading}
              className="w-full"
            >
              {isUploading ? 'A carregar...' : `Carregar ${files.filter((f) => !f.uploaded).length} imagem(ns)`}
            </Button>
          )}
        </div>
      )}

      {/* Existing images count */}
      {existingImages.length > 0 && (
        <p className="text-sm text-muted-foreground">
          {existingImages.length} imagem(ns) já carregada(s)
        </p>
      )}
    </div>
  );
}
