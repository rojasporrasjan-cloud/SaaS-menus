import { getFunctions } from 'firebase/functions'
import { app } from './config'

// safe: callers always guard with isFirebaseConfigured / null-check before calling
export const functions = app ? getFunctions(app, 'us-central1') : (null as unknown as ReturnType<typeof getFunctions>)
