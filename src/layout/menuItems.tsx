/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useTranslation } from 'react-i18next'
import { ROUTE_PATHS } from 'routes'
import { Dashboard, PeopleAlt, AccountBalance, Tune } from '@mui/icons-material'
import { ROLES } from 'auth/roles'
import { SidebarItemsType } from './Sidebar/types'

export function useMenuItems() {
  const { t } = useTranslation()

  const pagesSection = [
    {
      id: 'left_menu__dashboard',
      title: t('sidebar.dashboard'),
      href: ROUTE_PATHS.DASHBOARD,
      icon: Dashboard,
      allowedRoles: [ROLES.SUPER_ADMIN],
    },
    {
      id: 'left_menu__user',
      title: t('sidebar.userManagement.title'),
      href: ROUTE_PATHS.CUSTOMER,
      icon: PeopleAlt,
      allowedRoles: [ROLES.SUPER_ADMIN],
    },
    {
      id: 'left_menu__netflix_account',
      title: t('sidebar.netflixAccount.title'),
      href: ROUTE_PATHS.NETFLIX,
      icon: AccountBalance,
      allowedRoles: [ROLES.SUPER_ADMIN],
    },
    {
      id: 'left_menu__setting_config',
      title: t('sidebar.settingConfig'),
      href: ROUTE_PATHS.SETTING_CONFIGS,
      icon: Tune,
      allowedRoles: [ROLES.SUPER_ADMIN],
    },
  ] as unknown as SidebarItemsType[]

  const menuItems = [
    {
      title: t('sidebar.pages'),
      pages: pagesSection,
    },
  ]

  return menuItems
}

export default useMenuItems
