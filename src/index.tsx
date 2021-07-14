import React from 'react'
import ReactDOM from 'react-dom'
import * as Sentry from '@sentry/browser'
import { Integrations } from '@sentry/tracing'
import { QueryClient, QueryClientProvider } from 'react-query'
import { GraphQLClient } from 'graphql-request'
import { ThemeProvider } from 'styled-components'
import { StylesProvider, CssBaseline } from '@material-ui/core'
import { AuthProvider } from 'auth/AuthContext'
import { Firebase } from 'auth/firebase'
import { GraphQLClientProvider } from 'hooks/GraphQLClientContext'
import App from './App'
import reportWebVitals from './reportWebVitals'
import config from './config'
import GlobalStyles, { theme } from './GlobalStyles'

// Ensure that internationalization is bundled into app
import './i18n'

if (config.isProductionEnvironment) {
  // eslint-disable-next-line
  console.info('[Application] Running in production mode.')
  Sentry.init({
    dsn: config.sentry.dsn,
    release: `${config.appName}@${config.appVersion}`,
    integrations: [new Integrations.BrowserTracing()],
    environment: config.sentry.environment,
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  })
} else {
  // eslint-disable-next-line
  console.info('[Application] Running in development mode.')
}

const queryClient = new QueryClient()

// INFO: using es6 import here since require() is forbidden by eslint
if (process.env.MSW === 'true') {
  import('./tests/mockWorker').then(({ worker }) => {
    worker.start()
  })
}

ReactDOM.render(
  <React.StrictMode>
    <StylesProvider injectFirst>
      <GlobalStyles />
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider fb={new Firebase()}>
            <GraphQLClientProvider gqlClient={new GraphQLClient(config.evme)}>
              <App />
            </GraphQLClientProvider>
          </AuthProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </StylesProvider>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
