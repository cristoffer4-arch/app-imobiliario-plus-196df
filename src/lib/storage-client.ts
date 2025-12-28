import { supabase } from './supabase'

const BUCKET_NAME = 'property-images'
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

export interface UploadResult {
  url: string
  path: string
  publicUrl: string
}

class StorageClient {
  private bucketName = BUCKET_NAME

  // Initialize bucket (call this once on app setup)
  async initializeBucket() {
    const { data: buckets } = await supabase.storage.listBuckets()
    const bucketExists = buckets?.some(b => b.name === this.bucketName)

    if (!bucketExists) {
      await supabase.storage.createBucket(this.bucketName, {
        public: true,
        fileSizeLimit: MAX_FILE_SIZE,
        allowedMimeTypes: ALLOWED_TYPES,
      })
    }
  }

  // Compress image before upload
  async compressImage(file: File, maxWidth = 1920, quality = 0.8): Promise<File> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      
      reader.onload = (e) => {
        const img = new Image()
        img.src = e.target?.result as string
        
        img.onload = () => {
          const canvas = document.createElement('canvas')
          let width = img.width
          let height = img.height
          
          // Calculate new dimensions
          if (width > maxWidth) {
            height = (height * maxWidth) / width
            width = maxWidth
          }
          
          canvas.width = width
          canvas.height = height
          
          const ctx = canvas.getContext('2d')
          ctx?.drawImage(img, 0, 0, width, height)
          
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name, {
                  type: file.type,
                  lastModified: Date.now(),
                })
                resolve(compressedFile)
              } else {
                reject(new Error('Compression failed'))
              }
            },
            file.type,
            quality
          )
        }
        
        img.onerror = () => reject(new Error('Image load failed'))
      }
      
      reader.onerror = () => reject(new Error('File read failed'))
    })
  }

  // Validate file
  validateFile(file: File): { valid: boolean; error?: string } {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return {
        valid: false,
        error: `Tipo de arquivo inválido. Permitidos: ${ALLOWED_TYPES.join(', ')}`
      }
    }

    if (file.size > MAX_FILE_SIZE) {
      return {
        valid: false,
        error: `Arquivo muito grande. Máximo: ${MAX_FILE_SIZE / 1024 / 1024}MB`
      }
    }

    return { valid: true }
  }

  // Upload single image
  async uploadImage(
    file: File,
    propertyId: string,
    compress = true
  ): Promise<UploadResult> {
    // Validate
    const validation = this.validateFile(file)
    if (!validation.valid) {
      throw new Error(validation.error)
    }

    // Compress if needed
    let fileToUpload = file
    if (compress) {
      try {
        fileToUpload = await this.compressImage(file)
      } catch (error) {
        console.warn('Compression failed, using original file:', error)
      }
    }

    // Generate unique filename
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(7)
    const ext = file.name.split('.').pop()
    const filename = `${propertyId}/${timestamp}-${randomStr}.${ext}`

    // Upload to Supabase
    const { data, error } = await supabase.storage
      .from(this.bucketName)
      .upload(filename, fileToUpload, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      throw new Error(`Upload failed: ${error.message}`)
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from(this.bucketName)
      .getPublicUrl(data.path)

    return {
      url: publicUrlData.publicUrl,
      path: data.path,
      publicUrl: publicUrlData.publicUrl,
    }
  }

  // Upload multiple images
  async uploadImages(
    files: File[],
    propertyId: string,
    compress = true
  ): Promise<UploadResult[]> {
    const uploads = files.map(file => this.uploadImage(file, propertyId, compress))
    return Promise.all(uploads)
  }

  // Delete image
  async deleteImage(path: string): Promise<void> {
    const { error } = await supabase.storage
      .from(this.bucketName)
      .remove([path])

    if (error) {
      throw new Error(`Delete failed: ${error.message}`)
    }
  }

  // Delete multiple images
  async deleteImages(paths: string[]): Promise<void> {
    const { error } = await supabase.storage
      .from(this.bucketName)
      .remove(paths)

    if (error) {
      throw new Error(`Bulk delete failed: ${error.message}`)
    }
  }

  // Delete all images for a property
  async deletePropertyImages(propertyId: string): Promise<void> {
    const { data: files } = await supabase.storage
      .from(this.bucketName)
      .list(propertyId)

    if (files && files.length > 0) {
      const paths = files.map(file => `${propertyId}/${file.name}`)
      await this.deleteImages(paths)
    }
  }

  // Get public URL for a path
  getPublicUrl(path: string): string {
    const { data } = supabase.storage
      .from(this.bucketName)
      .getPublicUrl(path)
    return data.publicUrl
  }
}

export const storageClient = new StorageClient()
