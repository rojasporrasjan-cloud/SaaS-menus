export const ENV = {
  firebase: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string,
    appId: import.meta.env.VITE_FIREBASE_APP_ID as string,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID as string,
  },
  app: {
    name:       import.meta.env.VITE_APP_NAME as string,
    env:        import.meta.env.VITE_APP_ENV as 'development' | 'staging' | 'production',
    isDev:      import.meta.env.DEV,
    isProd:     import.meta.env.PROD,
    useEmulator: import.meta.env.VITE_USE_EMULATOR === 'true',
  },
  tenant: {
    devTenantId: import.meta.env.VITE_DEV_TENANT_ID as string,
  },
  cloudinary: {
    cloudName:    import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string,
    uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string,
  },
  gemini: {
    // Optional — set VITE_GEMINI_API_KEY to enable AI menu digitalization
    apiKey: (import.meta.env.VITE_GEMINI_API_KEY ?? '') as string,
  },
} as const
