'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Upload, X, Star, GripVertical, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import imageCompression from 'browser-image-compression';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { createClient } from '@/lib/supabase/client';

interface ImageData {
  id: string;
  url: string;
  file?: File;
  isUploading?: boolean;
  uploadProgress?: number;
  isPrimary?: boolean;
}

interface ImageUploadAdvancedProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
  maxSizeMB?: number;
  primaryImageIndex?: number;
  onPrimaryImageChange?: (index: number) => void;
}

function SortableImage({
  image,
  index,
  onDelete,
  onSetPrimary,
  isPrimary,
}: {
  image: ImageData;
  index: number;
  onDelete: () => void;
  onSetPrimary: () => void;
  isPrimary: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: image.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group aspect-square rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-50"
    >
      {image.isUploading ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100">
          <div className="w-3/4">
            <Progress value={image.uploadProgress || 0} className="h-2" />
            <p className="text-xs text-center mt-2 text-gray-600">
              {image.uploadProgress || 0}%
            </p>
          </div>
        </div>
      ) : (
        <>
          <Image
            src={image.url}
            alt={`Image ${index + 1}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {isPrimary && (
            <Badge className="absolute top-2 left-2 bg-yellow-500">
              <Star className="h-3 w-3 mr-1 fill-white" />
              Principal
            </Badge>
          )}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all">
            <div className="absolute top-2 right-2 flex gap-1">
              <button
                type="button"
                onClick={onSetPrimary}
                className="bg-white text-yellow-600 p-1.5 rounded-full hover:bg-yellow-50 transition-colors"
                title="Definir como principal"
              >
                <Star className={`h-4 w-4 ${isPrimary ? 'fill-yellow-600' : ''}`} />
              </button>
              <button
                type="button"
                onClick={onDelete}
                className="bg-white text-red-600 p-1.5 rounded-full hover:bg-red-50 transition-colors"
                title="Remover"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <button
              type="button"
              {...attributes}
              {...listeners}
              className="absolute bottom-2 right-2 bg-white text-gray-700 p-1.5 rounded-full hover:bg-gray-100 cursor-move"
              title="Arrastar para reordenar"
            >
              <GripVertical className="h-4 w-4" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default function ImageUploadAdvanced({
  images,
  onChange,
  maxImages = 10,
  maxSizeMB = 5,
  primaryImageIndex = 0,
  onPrimaryImageChange,
}: ImageUploadAdvancedProps) {
  const [imageData, setImageData] = useState<ImageData[]>(
    images.map((url, idx) => ({
      id: `${idx}-${url}`,
      url,
      isPrimary: idx === primaryImageIndex,
    }))
  );
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const compressAndUploadImage = async (file: File): Promise<string> => {
    try {
      // Compress image
      const compressionOptions = {
        maxSizeMB,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        fileType: 'image/jpeg',
      };

      const compressedFile = await imageCompression(file, compressionOptions);

      // Generate unique filename with crypto
      const fileExt = file.name.split('.').pop() || 'jpg';
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `properties/${fileName}`;

      // Upload to Supabase Storage
      const supabase = createClient();
      const { data, error } = await supabase.storage
        .from('property-images')
        .upload(filePath, compressedFile, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) throw error;

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from('property-images').getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setError(null);

    const filesArray = Array.from(files);
    const remainingSlots = maxImages - imageData.length;

    if (filesArray.length > remainingSlots) {
      setError(`Máximo de ${maxImages} imagens permitido. Você pode adicionar ${remainingSlots} mais.`);
      return;
    }

    // Validate file types
    const invalidFiles = filesArray.filter((file) => !file.type.startsWith('image/'));
    if (invalidFiles.length > 0) {
      setError('Apenas arquivos de imagem são permitidos.');
      return;
    }

    // Validate file sizes
    const oversizedFiles = filesArray.filter((file) => file.size > maxSizeMB * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setError(`Algumas imagens excedem o tamanho máximo de ${maxSizeMB}MB.`);
      return;
    }

    // Create preview images with loading state
    const newImages: ImageData[] = filesArray.map((file, idx) => ({
      id: `temp-${Date.now()}-${idx}`,
      url: URL.createObjectURL(file),
      file,
      isUploading: true,
      uploadProgress: 0,
    }));

    setImageData((prev) => [...prev, ...newImages]);

    // Upload images
    for (let i = 0; i < newImages.length; i++) {
      const imageItem = newImages[i];
      const file = imageItem.file!;

      try {
        // Simulate progress (compression phase)
        setImageData((prev) =>
          prev.map((img) =>
            img.id === imageItem.id ? { ...img, uploadProgress: 30 } : img
          )
        );

        const publicUrl = await compressAndUploadImage(file);

        // Update with actual URL
        setImageData((prev) =>
          prev.map((img) =>
            img.id === imageItem.id
              ? {
                  ...img,
                  url: publicUrl,
                  isUploading: false,
                  uploadProgress: 100,
                  file: undefined,
                }
              : img
          )
        );

        // Clean up blob URL
        URL.revokeObjectURL(imageItem.url);
      } catch (error) {
        console.error('Error uploading image:', error);
        // Remove failed upload
        setImageData((prev) => prev.filter((img) => img.id !== imageItem.id));
        setError(`Falha ao enviar ${file.name}`);
      }
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [imageData.length, maxImages]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const handleDelete = (index: number) => {
    const newImages = imageData.filter((_, i) => i !== index);
    setImageData(newImages);
    updateParent(newImages);
  };

  const handleSetPrimary = (index: number) => {
    const newImages = imageData.map((img, i) => ({
      ...img,
      isPrimary: i === index,
    }));
    setImageData(newImages);
    if (onPrimaryImageChange) {
      onPrimaryImageChange(index);
    }
    updateParent(newImages);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setImageData((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        const newItems = arrayMove(items, oldIndex, newIndex);
        updateParent(newItems);
        return newItems;
      });
    }
  };

  const updateParent = (images: ImageData[]) => {
    const urls = images.filter((img) => !img.isUploading).map((img) => img.url);
    onChange(urls);
  };

  // Sync with parent images prop
  useEffect(() => {
    if (images.length !== imageData.filter((img) => !img.isUploading).length) {
      setImageData(
        images.map((url, idx) => ({
          id: `${idx}-${url}`,
          url,
          isPrimary: idx === primaryImageIndex,
        }))
      );
    }
  }, [images, primaryImageIndex]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-semibold">
          Imagens da Propriedade ({imageData.length}/{maxImages})
        </Label>
        {imageData.length > 0 && (
          <p className="text-xs text-gray-500">
            Arraste as imagens para reordenar
          </p>
        )}
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm flex items-start gap-2">
          <X className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={imageData.map((img) => img.id)} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {imageData.map((image, index) => (
              <SortableImage
                key={image.id}
                image={image}
                index={index}
                onDelete={() => handleDelete(index)}
                onSetPrimary={() => handleSetPrimary(index)}
                isPrimary={image.isPrimary || false}
              />
            ))}

            {/* Upload box */}
            {imageData.length < maxImages && (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`
                  aspect-square border-2 border-dashed rounded-lg
                  flex flex-col items-center justify-center cursor-pointer
                  transition-colors
                  ${
                    isDragging
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                  }
                `}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileInput}
                  className="hidden"
                />
                <div className="text-center p-4">
                  {isDragging ? (
                    <ImageIcon className="h-10 w-10 text-blue-500 mx-auto mb-2" />
                  ) : (
                    <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                  )}
                  <p className="text-sm text-gray-600 font-medium mb-1">
                    {isDragging ? 'Solte aqui' : 'Adicionar Imagens'}
                  </p>
                  <p className="text-xs text-gray-400">
                    Arraste ou clique
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Máx. {maxSizeMB}MB por imagem
                  </p>
                </div>
              </div>
            )}
          </div>
        </SortableContext>
      </DndContext>

      <div className="text-xs text-gray-500 space-y-1">
        <p>• Formatos aceitos: JPG, PNG, WebP</p>
        <p>• As imagens serão comprimidas automaticamente para 1920x1080px</p>
        <p>• Clique na estrela para definir a imagem principal</p>
        <p>• Arraste as imagens para reordenar</p>
      </div>
    </div>
  );
}
