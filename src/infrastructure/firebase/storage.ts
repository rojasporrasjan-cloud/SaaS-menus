import { getStorage, connectStorageEmulator } from 'firebase/storage'
import { app } from './config'
import { ENV } from '@shared/constants/env'

// safe: callers always guard with isFirebaseConfigured before accessing storage
export const storage = app ? getStorage(app) : (null as unknown as ReturnType<typeof getStorage>)

if (app && ENV.app.isDev && ENV.app.useEmulator) {
  try {
    connectStorageEmulator(storage, 'localhost', 9199)
  } catch (error) {
    console.warn('Storage emulator connection error (HMR):', error)
  }
}
