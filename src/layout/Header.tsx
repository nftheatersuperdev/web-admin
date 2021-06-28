import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import { AppBar as MuiAppBar, IconButton, Button, Hidden, Toolbar, Box } from '@material-ui/core'
import {
  Menu as MenuIcon,
  ExitToApp as ExitToAppIcon,
  Settings as SettingsIcon,
} from '@material-ui/icons'
import { useTranslation } from 'react-i18next'
import { ROUTE_PATHS } from 'routes'

const AppBar = styled(MuiAppBar)`
  z-index: ${({ theme }) => theme.zIndex.drawer + 1};
  background: #0f0c38;

  img {
    height: 30px;
  }
`

export interface HeaderProps {
  onSidebarToggle: () => void
}

function Header({ onSidebarToggle }: HeaderProps): JSX.Element {
  const history = useHistory()
  const { t, i18n } = useTranslation()

  const handleLanguageChange = async () => {
    const newLang = ['en-US', 'en'].includes(i18n.language) ? 'th' : 'en'
    await i18n.changeLanguage(newLang)
  }

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Hidden mdUp>
          <Button
            color="inherit"
            aria-label={t('header.aria.sidebarToggle')}
            onClick={onSidebarToggle}
          >
            <MenuIcon />
          </Button>
        </Hidden>

        <Box marginRight="auto" pl={1}>
          <img src={process.env.PUBLIC_URL + '/logo.png'} alt={t('header.aria.logo')} />
        </Box>

        <IconButton
          color="inherit"
          onClick={handleLanguageChange}
          aria-label={t('header.aria.changeLanguage')}
        >
          {i18n.language === 'th' ? '🇹🇭' : '🇺🇸'}
        </IconButton>

        <IconButton
          color="inherit"
          onClick={() => history.push(ROUTE_PATHS.SETTINGS)}
          aria-label={t('header.aria.settings')}
        >
          <SettingsIcon />
        </IconButton>

        <IconButton
          color="inherit"
          onClick={() => history.push(ROUTE_PATHS.LOGIN)}
          aria-label={t('header.aria.login')}
        >
          <ExitToAppIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  )
}

export default Header
