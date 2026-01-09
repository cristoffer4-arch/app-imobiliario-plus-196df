# 📸 Guia de Implementação - Upload de Imagens

## Status: ✅ Supabase Storage Configurado

### 🎯 Configuração Supabase (COMPLETO)

#### Bucket Criado
- **Nome**: `property-images`
- **Visibilidade**: Público
- **Políticas RLS**: Configuradas para usuários autenticados

#### Políticas de Segurança (Row Level Security)
As seguintes políticas foram criadas para o bucket:

1. **SELECT**: Permite leitura pública
2. **INSERT**: Permite upload apenas para usuários autenticados
3. **UPDATE**: Permite atualização apenas para usuários autenticados
4. **DELETE**: Permite exclusão apenas para usuários autenticados

**Condição SQL**: `auth.role() = 'authenticated'`

---

## 🚀 Próximos Passos - Implementação Frontend

### 1. Criar Componente de Upload de Imagens

Crie o arquivo `src/components/ImageUpload.tsx`:

```typescript
'use client';

import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface ImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

export default function ImageUpload({ images, onChange, maxImages = 5 }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  const uploadImage = async (file: File) => {
    try {
      setUploading(true);
      setError(null);

      // Validar tamanho (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Imagem deve ter no máximo 5MB');
      }

      // Validar tipo
      if (!file.type.startsWith('image/')) {
        throw new Error('Arquivo deve ser uma imagem');
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload para Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from('property-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('property-images')
        .getPublicUrl(filePath);

      // Adicionar à lista de imagens
      onChange([...images, publicUrl]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      if (images.length >= maxImages) {
        setError(`Máximo de ${maxImages} imagens permitido`);
        break;
      }
      await uploadImage(files[i]);
    }
  };

  return (
    <div className="space-y-4">
      <Label>Imagens da Propriedade</Label>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
          {error}
        </div>
      )}

      {/* Grid de imagens */}
      <div className="grid grid-cols-3 gap-4">
        {images.map((url, index) => (
          <div key={index} className="relative aspect-square rounded-lg overflow-hidden border">
            <Image
              src={url}
              alt={`Imagem ${index + 1}`}
              fill
              className="object-cover"
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}

        {/* Botão de upload */}
        {images.length < maxImages && (
          <label className="aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50">
            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              disabled={uploading}
              className="hidden"
            />
            {uploading ? (
              <div className="text-center">
                <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-2" />
                <p className="text-sm text-gray-500">Enviando...</p>
              </div>
            ) : (
              <div className="text-center">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Adicionar Imagem</p>
                <p className="text-xs text-gray-400 mt-1">{images.length}/{maxImages}</p>
              </div>
            )}
          </label>
        )}
      </div>

      <p className="text-xs text-gray-500">
        Formatos aceitos: JPG, PNG, WebP. Tamanho máximo: 5MB por imagem.
      </p>
    </div>
  );
}
```

### 2. Atualizar PropertyForm.tsx

Modifique `src/components/PropertyForm.tsx` para incluir o upload:

```typescript
// Adicionar import
import ImageUpload from '@/components/ImageUpload';

// Adicionar no formData state
const [formData, setFormData] = useState<Partial<PropertyCreateInput>>({
  // ... campos existentes
  images: property?.images || [],
});

// Adicionar no JSX, antes dos botões
<ImageUpload
  images={formData.images || []}
  onChange={(images) => handleChange('images', images)}
  maxImages={5}
/>
```

### 3. Atualizar a API Route

O campo `images` já existe na tabela como `jsonb`, então a API já suporta!

Verifique em `src/app/api/properties/route.ts` se o campo `images` está sendo processado.

---

## 📋 Checklist de Implementação

- [x] Criar bucket `property-images` no Supabase
- [x] Configurar políticas RLS no bucket
- [x] Tornar bucket público
- [ ] Criar componente `ImageUpload.tsx`
- [ ] Integrar componente no `PropertyForm.tsx`
- [ ] Testar upload de imagens
- [ ] Testar visualização de imagens
- [ ] Testar remoção de imagens

---

## 🧪 Como Testar

1. **Acesse**: https://deploy-preview-23--luxeagent.netlify.app/properties/new
2. **Login**: Faça login com usuário de teste
3. **Upload**: Tente fazer upload de uma imagem
4. **Verificar**:
   - Imagem aparece na grid de preview
   - URL da imagem está no formato: `https://[project].supabase.co/storage/v1/object/public/property-images/[filename]`
   - Imagem é salva corretamente ao criar a propriedade

---

## 🔧 Troubleshooting

### Erro: "Policy prevents upload"
**Solução**: Verificar se o usuário está autenticado e as políticas RLS estão ativas.

### Erro: "File too large"
**Solução**: Reduzir tamanho da imagem para menos de 5MB.

### Imagem não aparece
**Solução**: Verificar se o bucket está público e a URL está correta.

---

## 📚 Documentação Supabase Storage

- [Supabase Storage Docs](https://supabase.com/docs/guides/storage)
- [Upload Files](https://supabase.com/docs/guides/storage/uploads/standard-uploads)
- [RLS Policies](https://supabase.com/docs/guides/storage/security/access-control)

---

## ✨ Melhorias Futuras

- [ ] Adicionar compressão de imagens no cliente
- [ ] Implementar drag & drop
- [ ] Adicionar crop de imagens
- [ ] Implementar reordenação de imagens
- [ ] Adicionar progress bar de upload
- [ ] Implementar lazy loading das imagens
