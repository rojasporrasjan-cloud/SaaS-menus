import { useState, useCallback } from 'react'
import { StorageService } from '@infrastructure/services/StorageService'
import type { UploadProgress } from '@infrastructure/services/StorageService'

interface UseDishImageUploadReturn {
  selectedFile: File | null
  previewUrl: string | null
  uploadProgress: number
  isUploading: boolean
  selectFile: (file: File) => void
  clearFile: () => void
  uploadAndGetUrl: (tenantId: string) => Promise<string | null>
}

const storageService = new StorageService()

export function useDishImageUpload(initialUrl?: string | null): UseDishImageUploadReturn {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialUrl ?? null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  const selectFile = useCallback((file: File) => {
    setSelectedFile(file)
    setPreviewUrl(URL.createObjectURL(file))
    setUploadProgress(0)
  }, [])

  const clearFile = useCallback(() => {
    setSelectedFile(null)
    setPreviewUrl(initialUrl ?? null)
    setUploadProgress(0)
  }, [initialUrl])

  const uploadAndGetUrl = useCallback(
    async (tenantId: string): Promise<string | null> => {
      if (!selectedFile) return initialUrl ?? null

      setIsUploading(true)
      setUploadProgress(0)

      try {
        const { getUrl } = storageService.upload(
          tenantId,
          'images',
          selectedFile,
          (progress: UploadProgress) => setUploadProgress(progress.percentage),
        )
        const url = await getUrl()
        setUploadProgress(100)
        return url
      } finally {
        setIsUploading(false)
      }
    },
    [selectedFile, initialUrl],
  )

  return {
    selectedFile,
    previewUrl,
    uploadProgress,
    isUploading,
    selectFile,
    clearFile,
    uploadAndGetUrl,
  }
}
