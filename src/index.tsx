import React from 'react'
import ReactDOM from 'react-dom'
import * as Sentry from '@sentry/browser'
import { Integrations } from '@sentry/tracing'
import { QueryClient, QueryClientProvider } from 'react-query'
import App from './App'
import reportWebVitals from './reportWebVitals'
import config from './config'
import GlobalStyles from './GlobalStyles'

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

ReactDOM.render(
  <React.StrictMode>
    <GlobalStyles />
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
