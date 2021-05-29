import { createMuiTheme } from '@material-ui/core'
import { createGlobalStyle, DefaultTheme } from 'styled-components'

export const theme: DefaultTheme = {
  ...createMuiTheme(),
  size: {
    sidebar: '220px',
  },
}

const GlobalStyles = createGlobalStyle`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-size: 16px;
  }

  html {
    height: 100%;
  }

  body,
  #root {
    min-height: 100vh;
  }

  #root {
    width: 100%;
    margin: 0 auto;
  }
`

export default GlobalStyles
