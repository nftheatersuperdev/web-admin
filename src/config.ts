import { Options as SentryOptions } from '@sentry/types'

interface Config {
  appName: string
  appVersion: string
  tableRowsDefaultPageSize: number
  tableRowsPerPageOptions: number[]
  isProductionEnvironment: boolean
  sentry: SentryOptions
  nftheater: string
  nftheaterAPI: string
  firebaseRest: string
  firebaseRestKey: string
  firebase: Record<string, string>
  timezone: string
}

const config: Config = {
  appName: import.meta.env.REACT_APP_NAME || 'evme-web-admin',
  appVersion: import.meta.env.npm_package_version || '0.0.0',
  tableRowsDefaultPageSize: 10,
  tableRowsPerPageOptions: [5, 10, 20, 50],
  isProductionEnvironment: import.meta.env.REACT_APP_ENVIRONMENT === 'production',
  sentry: {
    dsn: import.meta.env.REACT_APP_SENTRY_DSN || '',
    environment: import.meta.env.REACT_APP_SENTRY_ENVIRONMENT || '',
  },
  nftheater: import.meta.env.REACT_APP_NFTHEATER_API || '',
  nftheaterAPI: import.meta.env.REACT_APP_NFTHEATER_API || '',
  firebaseRest: import.meta.env.REACT_APP_FIREBASE_REST_API || '',
  firebaseRestKey: import.meta.env.REACT_APP_FIREBASE_REST_KEY || '',
  firebase: {
    apiKey: import.meta.env.REACT_APP_FIREBASE_API_KEY || '',
    authDomain: import.meta.env.REACT_APP_FIREBASE_AUTH_DOMAIN || '',
    projectId: import.meta.env.REACT_APP_FIREBASE_PROJECT_ID || '',
    storageBucket: import.meta.env.REACT_APP_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: import.meta.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: import.meta.env.REACT_APP_FIREBASE_APP_ID || '',
  },
  timezone: 'Asia/Bangkok',
}

export default config
