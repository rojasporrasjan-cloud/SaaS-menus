import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@shared/constants/routes'
import { AuthService, parseAuthError } from '../services/AuthService'
import type { LoginFormValues } from '../types/auth.types'

/**
 * Manages async state for both email and Google sign-in flows.
 * Navigation to dashboard happens after successful authentication.
 */
export function useSignIn() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const redirectToDashboard = () =>
    navigate(ROUTES.admin.dashboard, { replace: true })

  const signInWithEmail = async (values: LoginFormValues) => {
    setIsLoading(true)
    setError(null)
    try {
      await AuthService.signInWithEmail(values.email, values.password)
      redirectToDashboard()
    } catch (err) {
      setError(parseAuthError(err))
    } finally {
      setIsLoading(false)
    }
  }

  const signInWithGoogle = async () => {
    setIsLoading(true)
    setError(null)
    try {
      await AuthService.signInWithGoogle()
      redirectToDashboard()
    } catch (err) {
      setError(parseAuthError(err))
    } finally {
      setIsLoading(false)
    }
  }

  return { signInWithEmail, signInWithGoogle, isLoading, error, clearError: () => setError(null) }
}
