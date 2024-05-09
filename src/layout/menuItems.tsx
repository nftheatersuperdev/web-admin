import { useTranslation } from 'react-i18next'
import { ROUTE_PATHS } from 'routes'
import {
  Dashboard,
  PeopleAlt,
  AccountBalance,
  Tune,
  YouTube,
  AdminPanelSettings,
  EmojiEvents,
  LocalAtm,
} from '@mui/icons-material'
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
      allowedRoles: [
        ROLES.SUPER_ADMIN,
        ROLES.NETFLIX_ADMIN,
        ROLES.NETFLIX_AUTHOR,
        ROLES.YOUTUBE_ADMIN,
        ROLES.YOUTUBE_AUTHOR,
      ],
    },
    {
      id: 'left_menu__admin',
      title: t('sidebar.adminManagement.title'),
      href: ROUTE_PATHS.ADMIN,
      icon: AdminPanelSettings,
      allowedRoles: [ROLES.SUPER_ADMIN],
    },
    {
      id: 'left_menu__user',
      title: t('sidebar.userManagement.title'),
      href: ROUTE_PATHS.CUSTOMER,
      icon: PeopleAlt,
      allowedRoles: [
        ROLES.SUPER_ADMIN,
        ROLES.NETFLIX_ADMIN,
        ROLES.NETFLIX_AUTHOR,
        ROLES.YOUTUBE_ADMIN,
        ROLES.YOUTUBE_AUTHOR,
      ],
    },
    {
      id: 'left_menu__netflix_account',
      title: t('sidebar.netflixAccount.title'),
      href: ROUTE_PATHS.NETFLIX,
      icon: AccountBalance,
      allowedRoles: [ROLES.SUPER_ADMIN, ROLES.NETFLIX_ADMIN, ROLES.NETFLIX_AUTHOR],
      allowedPrivileges: ['ALL', 'NETFLIX'],
    },
    {
      id: 'left_menu__youtube_account',
      title: t('sidebar.youtubeAccount.title'),
      href: ROUTE_PATHS.YOUTUBE,
      icon: YouTube,
      allowedRoles: [ROLES.SUPER_ADMIN, ROLES.YOUTUBE_ADMIN, ROLES.YOUTUBE_AUTHOR],
      allowedPrivileges: ['ALL', 'YOUTUBE'],
    },
    {
      id: 'left_menu__setting_package',
      title: 'แพ็คเก็ต',
      href: ROUTE_PATHS.PACKAGES,
      icon: LocalAtm,
      allowedRoles: [ROLES.SUPER_ADMIN],
    },
    {
      id: 'left_menu__reward',
      title: t('sidebar.reward'),
      href: ROUTE_PATHS.REWARD,
      icon: EmojiEvents,
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
