import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { app } from './config'
import { ENV } from '@shared/constants/env'

// safe: callers always guard with isFirebaseConfigured before accessing db
export const db = app ? getFirestore(app) : (null as unknown as ReturnType<typeof getFirestore>)

if (app && ENV.app.isDev && ENV.app.useEmulator) {
  try {
    connectFirestoreEmulator(db, 'localhost', 8080)
  } catch (error) {
    console.warn('Firestore emulator connection error (HMR):', error)
  }
}
