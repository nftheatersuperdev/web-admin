import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import {
  SwipeableDrawer,
  ListItem,
  List,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@material-ui/core'
import { Home as HomeIcon, DirectionsCar as SubscriptionIcon } from '@material-ui/icons'
// eslint-disable-next-line
import { ROUTE_PATHS } from '../routes'

const ListContainer = styled.div`
  width: 200px;
`

interface SidebarProps {
  isOpen: boolean
  setIsSidebarOpen: (isOpen: boolean) => void
  handleOnOpen?: () => void
}

const SIDEBAR_ITEMS = [
  { title: 'HOME', path: ROUTE_PATHS.ROOT, icon: <HomeIcon /> },
  { title: 'SUBSCRIPTION', path: ROUTE_PATHS.SUBSCRIPTION, icon: <SubscriptionIcon /> },
]

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
          {SIDEBAR_ITEMS.map(({ title, path, icon }) => (
            <ListItem key={title} button component={Link} to={path}>
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary={title} />
            </ListItem>
          ))}
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
