import { useState, useCallback } from 'react'
import { StorageService } from '@infrastructure/services/StorageService'
import type { UploadProgress } from '@infrastructure/services/StorageService'

interface UseTenantAssetUploadReturn {
  selectedFile: File | null
  previewUrl: string | null
  uploadProgress: number
  isUploading: boolean
  selectFile: (file: File) => void
  clearFile: (existingUrl: string | null) => void
  uploadAndGetUrl: (tenantId: string) => Promise<string | null>
}

const storageService = new StorageService()

export function useTenantAssetUpload(initialUrl?: string | null): UseTenantAssetUploadReturn {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialUrl ?? null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  const selectFile = useCallback((file: File) => {
    setSelectedFile(file)
    setPreviewUrl(URL.createObjectURL(file))
    setUploadProgress(0)
  }, [])

  const clearFile = useCallback((existingUrl: string | null) => {
    setSelectedFile(null)
    setPreviewUrl(existingUrl)
    setUploadProgress(0)
  }, [])

  const uploadAndGetUrl = useCallback(
    async (tenantId: string): Promise<string | null> => {
      if (!selectedFile) return previewUrl ?? null

      setIsUploading(true)
      setUploadProgress(0)
      try {
        const { getUrl } = storageService.upload(
          tenantId,
          'images',
          selectedFile,
          (p: UploadProgress) => setUploadProgress(p.percentage),
        )
        const url = await getUrl()
        setUploadProgress(100)
        setSelectedFile(null) // consumed
        return url
      } finally {
        setIsUploading(false)
      }
    },
    [selectedFile, previewUrl],
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
