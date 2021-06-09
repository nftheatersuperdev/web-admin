import React, { useMemo } from 'react'
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
import { useTranslation } from 'react-i18next'

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

// eslint-disable-next-line @typescript-eslint/no-empty-function
function Sidebar({ isOpen, onSidebarToggle }: SidebarProps): JSX.Element {
  const location = useLocation()
  const { t } = useTranslation()

  const SIDEBAR_ITEMS = useMemo(
    () => [
      { title: t('sidebar.dashboard'), path: ROUTE_PATHS.ROOT, icon: <DashboardIcon /> },
      { title: t('sidebar.users'), path: ROUTE_PATHS.USER, icon: <UserIcon /> },
      { subHeader: t('sidebar.vehicleManagement') },
      { title: t('sidebar.cars'), path: ROUTE_PATHS.CAR, icon: <CarIcon /> },
      { title: t('sidebar.pricing'), path: ROUTE_PATHS.PRICING, icon: <PackageIcon /> },
      { subHeader: t('sidebar.subscriptionManagement') },
      {
        title: t('sidebar.subscriptions'),
        path: ROUTE_PATHS.SUBSCRIPTION,
        icon: <SubscriptionIcon />,
      },
      {
        title: t('sidebar.additionalExpense'),
        path: ROUTE_PATHS.ADDITIONAL_EXPENSE,
        icon: <AdditionalExpenseIcon />,
      },
      { title: t('sidebar.insurance'), path: ROUTE_PATHS.INSURANCE, icon: <InsuranceIcon /> },
      { subHeader: t('sidebar.others') },
      {
        title: t('sidebar.chargingStations'),
        path: ROUTE_PATHS.CHARGING_STATIONS,
        icon: <ChargingIcon />,
      },
    ],
    [t]
  )

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
