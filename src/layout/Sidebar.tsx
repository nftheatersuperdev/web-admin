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
  People as UserIcon,
  Shop as PackageIcon,
  BatteryChargingFull as ChargingIcon,
  Person as ProfileIcon,
  Settings as SettingsIcon,
  SupervisedUserCircle as AdminUsersIcon,
  LoyaltyOutlined as LoyaltyOutlinedIcon,
  GroupAdd as GroupAddIcon,
  LibraryBooks as LibraryBooksIcon,
  Laptop as LaptopIcon,
  PersonAddDisabled as UserDeleteLogIcon,
} from '@material-ui/icons'
import { ROUTE_PATHS } from 'routes'
import { useTranslation } from 'react-i18next'
import { useAuth } from 'auth/AuthContext'
import { ROLES, hasAllowedRole } from 'auth/roles'

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
      {
        id: 'left_menu__dashboard',
        title: t('sidebar.dashboard'),
        path: ROUTE_PATHS.DASHBOARD,
        icon: <DashboardIcon />,
        allowedRoles: [
          ROLES.SUPER_ADMIN,
          ROLES.ADMIN,
          ROLES.CUSTOMER_SUPPORT,
          ROLES.OPERATION,
          ROLES.MARKETING,
        ],
      },
      {
        id: 'left_menu__users',
        title: t('sidebar.users'),
        path: ROUTE_PATHS.USER,
        icon: <UserIcon />,
        allowedRoles: [
          ROLES.SUPER_ADMIN,
          ROLES.ADMIN,
          ROLES.CUSTOMER_SUPPORT,
          ROLES.OPERATION,
          ROLES.MARKETING,
        ],
      },
      {
        id: 'left_menu__user_group',
        title: t('sidebar.userGroups'),
        path: ROUTE_PATHS.USER_GROUPS,
        icon: <GroupAddIcon />,
        allowedRoles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MARKETING],
      },

      {
        subHeader: t('sidebar.vehicleManagement'),
        allowedRoles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.OPERATION, ROLES.MARKETING],
      },
      {
        id: 'left_menu__cars',
        title: t('sidebar.cars'),
        path: ROUTE_PATHS.CAR,
        icon: <CarIcon />,
        allowedRoles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.OPERATION],
      },
      {
        id: 'left_menu__car_availability',
        title: t('sidebar.carAvailability'),
        path: ROUTE_PATHS.CAR_AVAILABILITY,
        icon: <CarIcon />,
        allowedRoles: [
          ROLES.SUPER_ADMIN,
          ROLES.ADMIN,
          ROLES.CUSTOMER_SUPPORT,
          ROLES.OPERATION,
          ROLES.MARKETING,
        ],
      },
      {
        id: 'left_menu__car_activity',
        title: t('sidebar.carActivity'),
        path: ROUTE_PATHS.CAR_ACTIVITY,
        icon: <CarIcon />,
        allowedRoles: [ROLES.SUPER_ADMIN, ROLES.OPERATION],
      },
      {
        id: 'left_menu__model',
        title: t('sidebar.modelAndPricing'),
        path: ROUTE_PATHS.MODEL_AND_PRICING,
        icon: <PackageIcon />,
        allowedRoles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.OPERATION, ROLES.MARKETING],
      },
      {
        subHeader: t('sidebar.subscriptionManagement'),
        allowedRoles: [
          ROLES.SUPER_ADMIN,
          ROLES.ADMIN,
          ROLES.CUSTOMER_SUPPORT,
          ROLES.OPERATION,
          ROLES.MARKETING,
        ],
      },
      {
        id: 'left_menu__subscription',
        title: t('sidebar.subscriptions'),
        path: ROUTE_PATHS.SUBSCRIPTION,
        icon: <SubscriptionIcon />,
        allowedRoles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.CUSTOMER_SUPPORT, ROLES.OPERATION],
      },
      /*{
        title: t('sidebar.additionalExpense'),
        path: ROUTE_PATHS.ADDITIONAL_EXPENSE,
        icon: <AdditionalExpenseIcon />,
        allowedRoles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.OPERATION],
      },*/
      {
        subHeader: t('sidebar.voucherManagement'),
        allowedRoles: [
          ROLES.SUPER_ADMIN,
          ROLES.ADMIN,
          ROLES.OPERATION,
          ROLES.CUSTOMER_SUPPORT,
          ROLES.MARKETING,
        ],
      },
      {
        id: 'left_menu__vouchers',
        title: t('sidebar.vouchers'),
        path: ROUTE_PATHS.VOUCHER,
        icon: <LoyaltyOutlinedIcon />,
        allowedRoles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MARKETING],
      },

      {
        subHeader: t('sidebar.others'),
        allowedRoles: [
          ROLES.SUPER_ADMIN,
          ROLES.ADMIN,
          ROLES.OPERATION,
          ROLES.CUSTOMER_SUPPORT,
          ROLES.MARKETING,
        ],
      },
      {
        id: 'left_menu__documents',
        title: t('sidebar.documents'),
        path: ROUTE_PATHS.DOCUMENTS,
        icon: <LibraryBooksIcon />,
        allowedRoles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.OPERATION],
      },
      {
        id: 'left_menu__consent_log',
        title: t('sidebar.consentLog'),
        path: ROUTE_PATHS.CONSENT_LOG,
        icon: <LaptopIcon />,
        allowedRoles: [
          ROLES.SUPER_ADMIN,
          ROLES.ADMIN,
          ROLES.OPERATION,
          ROLES.CUSTOMER_SUPPORT,
          ROLES.MARKETING,
        ],
      },
      {
        id: 'left_menu__cookie_log',
        title: t('sidebar.cookieConsentLog'),
        path: ROUTE_PATHS.COOKIE_CONSENT_LOG,
        icon: <LaptopIcon />,
        allowedRoles: [ROLES.ADMIN, ROLES.CUSTOMER_SUPPORT],
      },
      {
        id: 'left_menu__delete_log',
        title: t('sidebar.userDeleteLog'),
        path: ROUTE_PATHS.USER_DELETE_LOG,
        icon: <UserDeleteLogIcon />,
        allowedRoles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.OPERATION, ROLES.CUSTOMER_SUPPORT],
      },
      {
        id: 'left_menu__charging_locations',
        title: t('sidebar.chargingLocations'),
        path: ROUTE_PATHS.CHARGING_LOCATIONS,
        icon: <ChargingIcon />,
        allowedRoles: [
          ROLES.SUPER_ADMIN,
          ROLES.ADMIN,
          ROLES.CUSTOMER_SUPPORT,
          ROLES.OPERATION,
          ROLES.MARKETING,
        ],
      },
      {
        id: 'left_menu__admin_users',
        title: t('sidebar.adminUsers'),
        path: ROUTE_PATHS.ADMIN_USERS,
        icon: <AdminUsersIcon />,
        allowedRoles: [ROLES.SUPER_ADMIN],
      },
      { subHeader: t('sidebar.account') },
      {
        id: 'left_menu__profile',
        title: t('sidebar.profile'),
        path: ROUTE_PATHS.ACCOUNT,
        icon: <ProfileIcon />,
        allowedRoles: [
          ROLES.SUPER_ADMIN,
          ROLES.ADMIN,
          ROLES.CUSTOMER_SUPPORT,
          ROLES.OPERATION,
          ROLES.MARKETING,
        ],
      },
      {
        id: 'left_menu__settings',
        title: t('sidebar.settings'),
        path: ROUTE_PATHS.ACCOUNT_SETTINGS,
        icon: <SettingsIcon />,
        allowedRoles: [
          ROLES.SUPER_ADMIN,
          ROLES.ADMIN,
          ROLES.CUSTOMER_SUPPORT,
          ROLES.OPERATION,
          ROLES.MARKETING,
        ],
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
    const { getRole } = useAuth()
    const currentRole = getRole()

    return (
      <List role="presentation" onClick={handleSidebarEvent} onKeyDown={handleSidebarEvent}>
        <List>
          {SIDEBAR_ITEMS.map(({ id, title, subHeader, path, icon, allowedRoles }) => {
            if (!hasAllowedRole(currentRole, allowedRoles)) {
              return null
            }

            return subHeader ? (
              <ListSubheader key={subHeader} component="div">
                {subHeader}
              </ListSubheader>
            ) : (
              <ListItem
                id={id}
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
