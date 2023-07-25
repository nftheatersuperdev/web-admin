/* eslint-disable import/no-relative-parent-imports */
/* eslint-disable no-restricted-imports */
import styled from 'styled-components'
import { withTheme } from '@emotion/react'
import { Grid, AppBar as MuiAppBar, IconButton as MuiIconButton, Toolbar } from '@mui/material'
import { NavLink } from 'react-router-dom'
import { Menu as MenuIcon } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { version } from '../../../package.json'
import NavbarUserDropdown from './NavbarUserDropdown'
import NavbarLanguagesDropdown from './NavbarLanguagesDropdown'

const AppBar = styled(MuiAppBar)`
  background: #fff !important;
  color: #999 !important;
`

const IconButton = styled(MuiIconButton)`
  svg {
    width: 22px;
    height: 22px;
  }
`
const VersionText = styled.div`
  margin-right: 10px;
`

const LogoImage = styled.img`
  margin-top: 6px;
`

interface NavbarProps {
  onSidebarToggle: (state?: boolean) => void
}

function Navbar({ onSidebarToggle }: NavbarProps) {
  const { t } = useTranslation()

  return (
    <AppBar position="sticky" elevation={0}>
      <Toolbar>
        <Grid container alignItems="center">
          <Grid item sx={{ display: { xs: 'block', md: 'none' } }}>
            <IconButton
              color="inherit"
              aria-label="Open drawer"
              size="large"
              onClick={() => onSidebarToggle(true)}
            >
              <MenuIcon />
            </IconButton>
          </Grid>
          <Grid item xs>
            <NavLink to="/">
              <LogoImage
                src={process.env.PUBLIC_URL + '/logo-full-dark.png'}
                alt="logo"
                height={32}
              />
            </NavLink>
          </Grid>
          <Grid item>
            <VersionText>{t('header.version', { version })}</VersionText>
          </Grid>
          <Grid item>
            <NavbarLanguagesDropdown />
            <NavbarUserDropdown />
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  )
}

export default withTheme(Navbar)
