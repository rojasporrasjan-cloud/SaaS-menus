import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth'
import { auth, mockAuth } from '@infrastructure/firebase/auth'

interface AuthContextValue {
  firebaseUser: FirebaseUser | null
  isLoading: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!auth) {
      const savedUser = localStorage.getItem('mock_user')
      if (savedUser) {
        try {
          mockAuth.setCurrentUser(JSON.parse(savedUser))
        } catch {
          mockAuth.setCurrentUser(null)
        }
      }
      const unsubscribe = mockAuth.onAuthStateChanged((user) => {
        setFirebaseUser(user)
        setIsLoading(false)
      })
      return unsubscribe
    }
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user)
      setIsLoading(false)
    })

    return unsubscribe
  }, [])

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        isLoading,
        isAuthenticated: firebaseUser !== null,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuthContext must be used inside <AuthProvider>')
  return ctx
}
