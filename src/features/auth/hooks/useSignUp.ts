import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { ROUTES } from '@shared/constants/routes'
import { TenantProvisioningService } from '@infrastructure/services/TenantProvisioningService'
import type { TenantBrandingSeed } from '@infrastructure/services/TenantProvisioningService'
import { UserAccountService } from '@infrastructure/services/UserAccountService'
import { AuthService, parseAuthError } from '../services/AuthService'
import type { RegisterFormValues } from '../types/auth.types'

const FALLBACK_RESTAURANT_NAME = 'Mi Restaurante'

/**
 * Flujo de registro self-serve:
 *   1. Crea la cuenta (email/password o Google)
 *   2. Provisiona el tenant del lado del cliente (tenant + member owner + mapping
 *      + menú por defecto), aplicando la plantilla elegida en el embudo.
 *   3. Refresca el contexto de tenant y entra al dashboard (donde aparece onboarding)
 */
export function useSignUp() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function finishProvisioning(
    restaurantName: string,
    branding: TenantBrandingSeed,
  ): Promise<void> {
    await TenantProvisioningService.provision({ restaurantName, branding })
    // El TenantProvider resuelve el tenant desde `users/{uid}` (recién creado).
    await queryClient.invalidateQueries({ queryKey: ['tenant-context'] })
    navigate(ROUTES.admin.dashboard, { replace: true })
  }

  async function registerWithEmail(
    values: RegisterFormValues,
    branding: TenantBrandingSeed,
  ): Promise<void> {
    setIsLoading(true)
    setError(null)
    try {
      await AuthService.signUpWithEmail(values.email, values.password, values.ownerName)
      await finishProvisioning(values.restaurantName, branding)
    } catch (err) {
      setError(parseAuthError(err))
    } finally {
      setIsLoading(false)
    }
  }

  async function continueWithGoogle(branding: TenantBrandingSeed): Promise<void> {
    setIsLoading(true)
    setError(null)
    try {
      const credential = await AuthService.signInWithGoogle()
      const existing = await UserAccountService.getForUser(credential.user.uid)
      if (existing) {
        // Cuenta ya provisionada → directo al dashboard.
        await queryClient.invalidateQueries({ queryKey: ['tenant-context'] })
        navigate(ROUTES.admin.dashboard, { replace: true })
        return
      }
      const restaurantName = credential.user.displayName?.trim() || FALLBACK_RESTAURANT_NAME
      await finishProvisioning(restaurantName, branding)
    } catch (err) {
      setError(parseAuthError(err))
    } finally {
      setIsLoading(false)
    }
  }

  return {
    registerWithEmail,
    continueWithGoogle,
    isLoading,
    error,
    clearError: () => setError(null),
  }
}
