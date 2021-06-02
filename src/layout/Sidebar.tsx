import React from 'react'
import styled from 'styled-components'
import { Link, useLocation, matchPath } from 'react-router-dom'
import {
  SwipeableDrawer,
  Drawer,
  ListItem,
  List,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Hidden,
  Toolbar,
} from '@material-ui/core'
import {
  Equalizer as DashboardIcon,
  ShoppingCart as SubscriptionIcon,
  DirectionsCar as CarIcon,
  Group as UserIcon,
  Shop as PackageIcon,
  BatteryChargingFull as ChargingIcon,
  BusinessCenter as InsuranceIcon,
  MonetizationOn as AdditionalExpenseIcon,
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
  { subHeader: 'Vehicle Management' },
  { title: 'Cars', path: ROUTE_PATHS.CAR, icon: <CarIcon /> },
  { title: 'Pricing', path: ROUTE_PATHS.PRICING, icon: <PackageIcon /> },
  { subHeader: 'Subscription Management' },
  { title: 'Subscriptions', path: ROUTE_PATHS.SUBSCRIPTION, icon: <SubscriptionIcon /> },
  {
    title: 'Additional Expense',
    path: ROUTE_PATHS.ADDITIONAL_EXPENSE,
    icon: <AdditionalExpenseIcon />,
  },
  { title: 'Insurance', path: ROUTE_PATHS.INSURANCE, icon: <InsuranceIcon /> },
  { subHeader: 'Others' },
  { title: 'Charging Stations', path: ROUTE_PATHS.CHARGING_STATIONS, icon: <ChargingIcon /> },
]

// eslint-disable-next-line @typescript-eslint/no-empty-function
function Sidebar({ isOpen, onSidebarToggle }: SidebarProps): JSX.Element {
  const location = useLocation()

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
          {SIDEBAR_ITEMS.map(({ title, subHeader, path, icon }) => {
            return subHeader ? (
              <ListSubheader key={subHeader} component="div">
                {subHeader}
              </ListSubheader>
            ) : (
              <ListItem
                key={title}
                button
                // @ts-expect-error we want to use the component prop here
                component={Link}
                to={path}
                selected={
                  !!matchPath(location.pathname, {
                    path,
                    exact: true,
                    strict: false,
                  })
                }
              >
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText primary={title} />
              </ListItem>
            )
          })}
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
