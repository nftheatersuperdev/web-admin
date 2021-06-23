interface Config {
  appName: string
  appVersion: string
  tableRowsDefaultPageSize: number
  tableRowsPerPageOptions: number[]
  isProductionEnvironment: boolean
  sentry: Record<string, string>
  evme: string
  googleMapsApiKey: string
}

const config: Config = {
  appName: process.env.REACT_APP_NAME || 'evme-admin',
  appVersion: process.env.npm_package_version || '0.0.0',
  tableRowsDefaultPageSize: 10,
  tableRowsPerPageOptions: [10, 20, 50],
  isProductionEnvironment: process.env.REACT_APP_ENVIRONMENT === 'production',
  sentry: {
    dsn: process.env.REACT_APP_SENTRY_DSN || '',
    environment: process.env.REACT_APP_SENTRY_ENVIRONMENT || '',
  },
  evme: process.env.REACT_APP_EVME_API || '',
  googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '',
}

export default config
