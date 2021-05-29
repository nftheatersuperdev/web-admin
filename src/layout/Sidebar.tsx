import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import {
  SwipeableDrawer,
  Drawer,
  ListItem,
  List,
  ListItemIcon,
  ListItemText,
  Hidden,
  Toolbar,
} from '@material-ui/core'
import {
  Equalizer as DashboardIcon,
  ShoppingCart as SubscriptionIcon,
  DirectionsCar as CarIcon,
  Group as UserIcon,
  Shop as PackageIcon,
} from '@material-ui/icons'
import { ROUTE_PATHS } from 'routes'

const MobileSidebar = styled(SwipeableDrawer)`
  width: ${({ theme }) => theme.size.sidebar};
`

const DesktopSidebar = styled(Drawer)`
  width: ${({ theme }) => theme.size.sidebar};
  > .MuiPaper-root {
    width: ${({ theme }) => theme.size.sidebar};
  }
`

interface SidebarProps {
  isOpen: boolean
  onSidebarToggle: (isOpen?: boolean) => void
}

const SIDEBAR_ITEMS = [
  { title: 'Dashboard', path: ROUTE_PATHS.ROOT, icon: <DashboardIcon /> },
  { title: 'Users', path: ROUTE_PATHS.USER, icon: <UserIcon /> },
  { title: 'Cars', path: ROUTE_PATHS.CAR, icon: <CarIcon /> },
  { title: 'Packages', path: ROUTE_PATHS.PACKAGE, icon: <PackageIcon /> },
  { title: 'Subscriptions', path: ROUTE_PATHS.SUBSCRIPTION, icon: <SubscriptionIcon /> },
]

// eslint-disable-next-line @typescript-eslint/no-empty-function
function Sidebar({ isOpen, onSidebarToggle }: SidebarProps): JSX.Element {
  function handleSidebarEvent(event: React.MouseEvent | React.KeyboardEvent) {
    // Ensure we allow usage of tab and shift to navigate the sidebar without closing it
    // eslint-disable-next-line
    // @ts-expect-error
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return
    }
    onSidebarToggle(false)
  }

  function SidebarList(): JSX.Element {
    return (
      <List role="presentation" onClick={handleSidebarEvent} onKeyDown={handleSidebarEvent}>
        <List>
          {SIDEBAR_ITEMS.map(({ title, path, icon }) => (
            <ListItem key={title} button component={Link} to={path}>
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary={title} />
            </ListItem>
          ))}
        </List>
      </List>
    )
  }

  return (
    <React.Fragment>
      <Hidden mdUp>
        <MobileSidebar
          anchor="left"
          open={isOpen}
          onOpen={() => onSidebarToggle(true)}
          onClose={handleSidebarEvent}
        >
          <SidebarList />
        </MobileSidebar>
      </Hidden>
      <Hidden smDown>
        <DesktopSidebar variant="permanent">
          <Toolbar />
          <SidebarList />
        </DesktopSidebar>
      </Hidden>
    </React.Fragment>
  )
}

export default Sidebar
