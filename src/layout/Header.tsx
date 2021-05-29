import styled from 'styled-components'
import { AppBar as MuiAppBar, Button, Hidden, Toolbar, Typography, Box } from '@material-ui/core'
import { Menu as MenuIcon } from '@material-ui/icons'

const AppBar = styled(MuiAppBar)`
  z-index: ${({ theme }) => theme.zIndex.drawer + 1};
`

export interface HeaderProps {
  onSidebarToggle: () => void
}

function Header({ onSidebarToggle }: HeaderProps): JSX.Element {
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
      </Toolbar>
    </AppBar>
  )
}

export default Header
