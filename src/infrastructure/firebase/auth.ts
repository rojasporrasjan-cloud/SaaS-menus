import { getAuth, connectAuthEmulator, type User } from 'firebase/auth'
import { app, isFirebaseConfigured } from './config'
import { ENV } from '@shared/constants/env'

// In production, Firebase must be configured. Fail fast with a clear message
// rather than propagating confusing null-reference errors later.
if (!isFirebaseConfigured && ENV.app.isProd) {
  throw new Error(
    '[Firebase] Firebase is not configured. ' +
    'Check that all VITE_FIREBASE_* environment variables are set in your deployment.',
  )
}

// safe: callers always guard with isFirebaseConfigured before accessing auth
export const auth = app ? getAuth(app) : (null as unknown as ReturnType<typeof getAuth>)

if (app && ENV.app.isDev && ENV.app.useEmulator) {
  try {
    connectAuthEmulator(auth, 'http://localhost:9099')
  } catch (error) {
    console.warn('Auth emulator connection error (HMR):', error)
  }
}

type AuthListener = (user: User | null) => void

// ── Mock auth for dev without Firebase ─────────────────────────────────────────
const listeners: AuthListener[] = []
let _currentUser: User | null = null

export const mockAuth = {
  setCurrentUser(user: User | null) {
    _currentUser = user
    listeners.forEach((fn) => fn(user))
  },
  onAuthStateChanged(fn: AuthListener) {
    fn(_currentUser)
    listeners.push(fn)
    return () => {
      const idx = listeners.indexOf(fn)
      if (idx > -1) listeners.splice(idx, 1)
    }
  },
}
