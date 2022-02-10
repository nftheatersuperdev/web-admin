import { createTheme } from '@material-ui/core/styles'
import { createGlobalStyle, DefaultTheme } from 'styled-components'

export const theme: DefaultTheme = {
  ...createTheme(),
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
    display: flex;
    flex-flow: column;
  }

  a {
    text-decoration: none;
  }
`

export default GlobalStyles
