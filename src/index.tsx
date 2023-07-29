import React from 'react'
import ReactDOM from 'react-dom'
import { StylesProvider, CssBaseline } from '@material-ui/core'
import { AuthProvider } from 'auth/AuthContext'
import { Firebase } from 'auth/firebase'
import { QueryClient, QueryClientProvider } from 'react-query'
import theme from 'theme'
import { ThemeProvider } from 'styled-components'
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles'
import { THEMES } from 'theme-constants'
import App from './App'
import reportWebVitals from './reportWebVitals'
import config from './config'

// Ensure that internationalization is bundled into app
import './i18n'

const queryClient = new QueryClient()

if (config.isProductionEnvironment) {
  console.info('[Application] Running in production mode.')
} else {
  console.info('[Application] Running in development mode.')
}

// INFO: using es6 import here since require() is forbidden by eslint
if (process.env.MSW === 'true') {
  import('./tests/mockWorker').then(({ worker }) => {
    worker.start()
  })
}

ReactDOM.render(
  <React.StrictMode>
    <StylesProvider injectFirst>
      <CssBaseline />
      <MuiThemeProvider theme={theme(THEMES.DEFAULT)}>
        <ThemeProvider theme={theme(THEMES.DEFAULT)}>
          <AuthProvider fbase={new Firebase()}>
            <QueryClientProvider client={queryClient}>
              <App />
            </QueryClientProvider>
          </AuthProvider>
        </ThemeProvider>
      </MuiThemeProvider>
    </StylesProvider>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
