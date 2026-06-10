import { useState } from 'react'
import { useUpdateBranding, BrandingForm } from '@features/settings'
import { StorageService } from '@infrastructure/services/StorageService'
import type { BrandingFormValues } from '@features/settings'
import type { Tenant } from '@core/domain/entities/Tenant'

interface BrandingStepProps {
  tenant: Tenant
  tenantId: string
  onNext: () => void
  onBack: () => void
}

const storageService = new StorageService()

export function BrandingStep({ tenant, tenantId, onNext, onBack }: BrandingStepProps) {
  const {
    updateBranding,
    isLoading: isUpdatingBranding,
    error: brandingError,
    success: brandingSuccess,
  } = useUpdateBranding(tenantId)

  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const handleSubmit = async (
    values: BrandingFormValues,
    logoFile: File | null,
    coverFile: File | null,
  ): Promise<void> => {
    setIsUploading(true)
    setUploadError(null)
    try {
      const logoUrl = logoFile
        ? await storageService.upload(tenantId, 'images', logoFile).getUrl()
        : tenant.branding.logoUrl

      const coverImageUrl = coverFile
        ? await storageService.upload(tenantId, 'images', coverFile).getUrl()
        : tenant.branding.coverImageUrl

      await updateBranding(values, logoUrl, coverImageUrl)
      onNext()
    } catch {
      setUploadError('Error al subir la imagen. Intenta de nuevo.')
    } finally {
      setIsUploading(false)
    }
  }

  const isLoading = isUploading || isUpdatingBranding
  const combinedError = uploadError ?? brandingError

  return (
    <div className="flex flex-col gap-5">
      <div className="text-center">
        <h2 className="text-xl font-bold text-surface-900">Personaliza tu marca</h2>
        <p className="mt-1 text-sm text-surface-500">
          Color, logo y portada. Puedes cambiarlos cuando quieras.
        </p>
      </div>

      <BrandingForm
        tenant={tenant}
        isLoading={isLoading}
        error={combinedError}
        success={brandingSuccess}
        onSubmit={(values, logoFile, coverFile) => {
          void handleSubmit(values, logoFile, coverFile)
        }}
      />

      <button
        type="button"
        onClick={onBack}
        className="self-start text-xs text-surface-500 hover:text-surface-700 hover:underline"
      >
        ← Atrás
      </button>
    </div>
  )
}
