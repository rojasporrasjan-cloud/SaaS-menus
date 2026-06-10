import { useState } from 'react'
import { useAuthContext } from '@app/providers/AuthProvider'
import { AuthService } from '../services/AuthService'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@shared/constants/routes'

/**
 * Primary auth hook for admin components.
 * Wraps AuthContext and adds navigation-aware sign out.
 */
export function useAuth() {
  const { firebaseUser, isLoading } = useAuthContext()
  const navigate = useNavigate()
  const [resendLoading, setResendLoading] = useState(false)
  const [resendSent, setResendSent] = useState(false)

  const signOut = async () => {
    await AuthService.signOut()
    navigate(ROUTES.auth.login, { replace: true })
  }

  const resendVerificationEmail = async () => {
    setResendLoading(true)
    try {
      await AuthService.resendVerificationEmail()
      setResendSent(true)
    } catch {
      // ignore
    } finally {
      setResendLoading(false)
    }
  }

  return {
    user: firebaseUser,
    isLoading,
    signOut,
    resendVerificationEmail,
    resendLoading,
    resendSent,
  }
}
