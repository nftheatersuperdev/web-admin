interface Config {
  appName: string
  appVersion: string
  isProductionEnvironment: boolean
  sentry: Record<string, string>
}

const config: Config = {
  appName: process.env.REACT_APP_NAME || 'evme-admin',
  appVersion: process.env.npm_package_version || '0.0.0',
  isProductionEnvironment: process.env.REACT_APP_ENVIRONMENT === 'production',
  sentry: {
    dsn: process.env.REACT_APP_SENTRY_DSN ?? '',
    environment: process.env.REACT_APP_SENTRY_ENVIRONMENT ?? '',
  },
}

export default config
