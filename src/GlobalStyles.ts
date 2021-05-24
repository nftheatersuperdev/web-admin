import { createGlobalStyle, css } from 'styled-components'
import reset from 'styled-reset'

const GlobalStyles = createGlobalStyle`${({ theme }) => css`
  ${reset}

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
`}`

export default GlobalStyles
