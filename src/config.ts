import { Options as SentryOptions } from '@sentry/types'

interface Config {
  appName: string
  appVersion: string
  tableRowsDefaultPageSize: number
  tableRowsPerPageOptions: number[]
  isProductionEnvironment: boolean
  sentry: SentryOptions
  evme: string
  googleMapsApiKey: string
  firebase: Record<string, string>
  maxInteger: number
}

const config: Config = {
  appName: process.env.REACT_APP_NAME || 'evme-admin',
  appVersion: process.env.npm_package_version || '0.0.0',
  tableRowsDefaultPageSize: 10,
  tableRowsPerPageOptions: [5, 10, 20, 50],
  isProductionEnvironment: process.env.REACT_APP_ENVIRONMENT === 'production',
  sentry: {
    dsn: process.env.REACT_APP_SENTRY_DSN || '',
    environment: process.env.REACT_APP_SENTRY_ENVIRONMENT || '',
  },
  evme: process.env.REACT_APP_EVME_API || '',
  googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '',
  firebase: {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY || '',
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || '',
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || '',
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: process.env.REACT_APP_FIREBASE_APP_ID || '',
    measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || '',
  },
  maxInteger: 2147483647,
}

export default config
