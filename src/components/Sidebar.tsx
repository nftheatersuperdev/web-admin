import React from 'react'
import styled, { css } from 'styled-components'
import { Link } from 'react-router-dom'
import {
  SwipeableDrawer,
  ListItem,
  List,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@material-ui/core'
import { Home as HomeIcon } from '@material-ui/icons'

const ListContainer = styled.div`
  width: 200px;
`

interface SidebarProps {
  isOpen: boolean
  setIsSidebarOpen: (isOpen: boolean) => void
  handleOnOpen?: () => void
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
function Sidebar({ isOpen, setIsSidebarOpen, handleOnOpen = () => {} }: SidebarProps): JSX.Element {
  function handleSidebarEvent(event: React.MouseEvent | React.KeyboardEvent) {
    // Ensure we allow usage of tab and shift to navigate the sidebar without closing it
    // eslint-disable-next-line
    // @ts-expect-error
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return
    }
    setIsSidebarOpen(false)
  }

  function SidebarList(): JSX.Element {
    return (
      <ListContainer
        role="presentation"
        onClick={handleSidebarEvent}
        onKeyDown={handleSidebarEvent}
      >
        <List>
          <ListItem button component={Link} to="/">
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="HOME" />
          </ListItem>
        </List>
        <Divider />
      </ListContainer>
    )
  }

  return (
    <SwipeableDrawer anchor="left" open={isOpen} onOpen={handleOnOpen} onClose={handleSidebarEvent}>
      <SidebarList />
    </SwipeableDrawer>
  )
}

export default Sidebar
