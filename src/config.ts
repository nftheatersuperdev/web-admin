interface Config {
  appName: string
  appVersion: string
  tableRowsDefaultPageSize: number
  tableRowsPerPageOptions: number[]
  isProductionEnvironment: boolean
  nftheater: string
  nftheaterAPI: string
  firebaseRest: string
  firebaseRestKey: string
  googleMapsApiKey: string
  firebase: Record<string, string>
  timezone: string
}

const config: Config = {
  appName: process.env.REACT_APP_NAME || 'evme-web-admin',
  appVersion: process.env.npm_package_version || '0.0.0',
  tableRowsDefaultPageSize: 10,
  tableRowsPerPageOptions: [5, 10, 20, 50],
  isProductionEnvironment: process.env.REACT_APP_ENVIRONMENT === 'production',
  nftheater: process.env.REACT_APP_NFTHEATER_API || '',
  nftheaterAPI: process.env.REACT_APP_NFTHEATER_API || '',
  googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '',
  firebaseRest: process.env.REACT_APP_FIREBASE_REST_API || '',
  firebaseRestKey: process.env.REACT_APP_FIREBASE_REST_KEY || '',
  firebase: {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY || '',
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || '',
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || '',
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: process.env.REACT_APP_FIREBASE_APP_ID || '',
  },
  timezone: 'Asia/Bangkok',
}

export default config
