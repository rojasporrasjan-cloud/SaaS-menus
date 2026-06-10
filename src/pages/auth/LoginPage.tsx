import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { UtensilsCrossed } from 'lucide-react'
import { useAuthContext } from '@app/providers/AuthProvider'
import { LoginForm, GoogleSignInButton, useSignIn } from '@features/auth'
import { ROUTES } from '@shared/constants/routes'
import { Spinner } from '@shared/ui/components/Spinner'
import { Button } from '@shared/ui/components/Button'
import { AuthService, parseAuthError } from '@features/auth'

export default function LoginPage() {
  const { isAuthenticated, isLoading: isAuthLoading } = useAuthContext()
  const { signInWithEmail, signInWithGoogle, isLoading, error, clearError } = useSignIn()
  const [showReset, setShowReset] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetState, setResetState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [resetError, setResetError] = useState<string | null>(null)

  // Already authenticated → redirect to dashboard
  if (!isAuthLoading && isAuthenticated) {
    return <Navigate to={ROUTES.admin.dashboard} replace />
  }

  if (isAuthLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setResetState('loading')
    setResetError(null)
    try {
      await AuthService.sendPasswordReset(resetEmail)
      setResetState('success')
    } catch (err) {
      setResetState('error')
      setResetError(parseAuthError(err))
    }
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-surface-50 p-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500 shadow-lg">
            <UtensilsCrossed size={28} className="text-white" />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-bold text-surface-900">Panel de administración</h1>
            <p className="mt-0.5 text-sm text-surface-500">Ingresa a tu restaurante</p>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-surface-0 p-6 shadow-sm border border-surface-100">
          {!showReset ? (
            <>
              {/* Google sign in */}
              <GoogleSignInButton
                onClick={signInWithGoogle}
                isLoading={isLoading}
              />

              {/* Divider */}
              <div className="my-5 flex items-center gap-3">
                <div className="h-px flex-1 bg-surface-200" />
                <span className="text-xs text-surface-400 font-medium">o con email</span>
                <div className="h-px flex-1 bg-surface-200" />
              </div>

              {/* Email form */}
              <LoginForm
                onSubmit={signInWithEmail}
                isLoading={isLoading}
                error={error}
              />

              {/* Forgot password */}
              <button
                type="button"
                onClick={() => { setShowReset(true); clearError() }}
                className="mt-4 w-full text-center text-xs text-brand-600 hover:text-brand-700 hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </>
          ) : (
            /* Password reset form */
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="text-base font-semibold text-surface-900">
                  Recuperar contraseña
                </h2>
                <p className="mt-1 text-sm text-surface-500">
                  Te enviaremos un enlace para restablecer tu contraseña.
                </p>
              </div>

              {resetState === 'success' ? (
                <div className="rounded-xl bg-green-50 p-4 text-sm text-green-700">
                  ✓ Revisa tu email. Te enviamos el enlace de recuperación.
                </div>
              ) : (
                <form onSubmit={handlePasswordReset} className="flex flex-col gap-3">
                  {resetError && (
                    <p className="text-xs text-red-600">{resetError}</p>
                  )}
                  <input
                    type="email"
                    placeholder="tu@email.com"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                    className="w-full rounded-xl border border-surface-200 bg-surface-0 px-4 py-3 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-400"
                  />
                  <Button
                    type="submit"
                    className="w-full"
                    isLoading={resetState === 'loading'}
                  >
                    Enviar enlace
                  </Button>
                </form>
              )}

              <button
                type="button"
                onClick={() => { setShowReset(false); setResetState('idle') }}
                className="text-xs text-surface-500 hover:text-surface-700 hover:underline"
              >
                ← Volver al inicio de sesión
              </button>
            </div>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-surface-400">
          © {new Date().getFullYear()} Soda La Rustica · Todos los derechos reservados
        </p>
      </div>
    </div>
  )
}
