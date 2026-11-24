import { getApp, getApps, initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
}

const requiredConfigKeys = ['apiKey', 'authDomain', 'projectId', 'appId']

export function isFirebaseConfigured() {
  return requiredConfigKeys.every(key => Boolean(firebaseConfig[key]?.trim()))
}

export function getFirebaseAuth() {
  if (!isFirebaseConfigured()) {
    const error = new Error(
      'Configura las variables VITE_FIREBASE_* en .env.local para habilitar el inicio de sesión.'
    )
    error.code = 'auth/not-configured'
    throw error
  }

  const app = getApps().length ? getApp() : initializeApp(firebaseConfig)
  return getAuth(app)
}
