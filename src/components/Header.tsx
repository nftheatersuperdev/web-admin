import React, { useState } from 'react'
import styled from 'styled-components'
import { AppBar as MuiAppBar, Button, Toolbar, Typography, Box } from '@material-ui/core'
import { Menu as MenuIcon } from '@material-ui/icons'
import Sidebar from './Sidebar'

const AppBar = styled(MuiAppBar)`
  position: relative;

  #toolbar {
    padding: 0;
  }
`

function Header(): JSX.Element {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const title = 'EVme'

  return (
    <React.Fragment>
      <AppBar>
        <Toolbar id="toolbar">
          <Button color="inherit" aria-label="Home Button" onClick={toggleSidebar}>
            <MenuIcon />
          </Button>

          <Box marginRight="auto" pl={1}>
            <Typography variant="h5">{title}</Typography>
          </Box>
        </Toolbar>
      </AppBar>
      <Sidebar isOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
    </React.Fragment>
  )
}

export default Header
