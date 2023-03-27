/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable prettier/prettier */
import '@mui/lab/themeAugmentation'
import { createTheme as createMuiTheme } from '@mui/material/styles'
import variants from './variants'
import typography from './typography'
import breakpoints from './breakpoints'
import components from './components'
import shadows from './shadows'

const createTheme = (name: string) => {
  let themeConfig = variants.find((variant) => variant.name === name)

  if (!themeConfig) {
    themeConfig = variants[0]
  }

  return createMuiTheme(
    {
      spacing: 4,
      breakpoints,
      // @ts-expect-error
      components,
      typography,
      shadows,
      palette: themeConfig.palette,
    },
    {
      name: themeConfig.name,
      header: themeConfig.header,
      footer: themeConfig.footer,
      sidebar: themeConfig.sidebar,
      size: {
        sidebar: '250px',
      },
    }
  )
}

export default createTheme