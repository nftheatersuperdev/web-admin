import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import {
  AppBar as MuiAppBar,
  IconButton,
  Button,
  Hidden,
  Toolbar,
  Typography,
  Box,
} from '@material-ui/core'
import { Menu as MenuIcon, ExitToApp as ExitToAppIcon } from '@material-ui/icons'
import { ROUTE_PATHS } from 'routes'

const AppBar = styled(MuiAppBar)`
  z-index: ${({ theme }) => theme.zIndex.drawer + 1};
`

export interface HeaderProps {
  onSidebarToggle: () => void
}

function Header({ onSidebarToggle }: HeaderProps): JSX.Element {
  const history = useHistory()
  const title = 'EVme'

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Hidden mdUp>
          <Button color="inherit" aria-label="Sidebar Toggle" onClick={onSidebarToggle}>
            <MenuIcon />
          </Button>
        </Hidden>

        <Box marginRight="auto" pl={1}>
          <Typography variant="h5">{title}</Typography>
        </Box>

        <IconButton color="inherit" onClick={() => history.push(ROUTE_PATHS.LOGIN)}>
          <ExitToAppIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  )
}

export default Header
