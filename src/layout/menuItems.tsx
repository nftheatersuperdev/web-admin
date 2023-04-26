/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useTranslation } from 'react-i18next'
import { ROLES } from 'auth/roles'
import { PRIVILEGES } from 'auth/privileges'
import { ROUTE_PATHS } from 'routes'
import { BarChart, Dashboard, DocumentScanner, Folder, PeopleAlt, Stars } from '@mui/icons-material'
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
        ROLES.ADMIN,
        ROLES.CUSTOMER_SUPPORT,
        ROLES.OPERATION,
        ROLES.MARKETING,
        ROLES.PRODUCT_SUPPORT,
        ROLES.IT_ADMIN,
      ],
    },
    {
      id: 'left_menu__user_management',
      href: ROUTE_PATHS.USER,
      icon: PeopleAlt,
      title: t('sidebar.userManagement.title'),
      allowedRoles: [
        ROLES.SUPER_ADMIN,
        ROLES.ADMIN,
        ROLES.CUSTOMER_SUPPORT,
        ROLES.OPERATION,
        ROLES.MARKETING,
        ROLES.PRODUCT_SUPPORT,
      ],
      children: [
        {
          id: 'left_menu__users',
          title: t('sidebar.users'),
          href: ROUTE_PATHS.USER,
          allowedRoles: [
            ROLES.SUPER_ADMIN,
            ROLES.ADMIN,
            ROLES.CUSTOMER_SUPPORT,
            ROLES.OPERATION,
            ROLES.MARKETING,
            ROLES.PRODUCT_SUPPORT,
          ],
        },
        {
          id: 'left_menu__user_group',
          title: t('sidebar.userManagement.userGroup'),
          href: ROUTE_PATHS.USER_GROUPS,
          allowedRoles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MARKETING, ROLES.PRODUCT_SUPPORT],
        },
        {
          id: 'left_menu__customer_profile',
          title: t('sidebar.userManagement.customerProfile'),
          href: ROUTE_PATHS.CUSTOMER_PROFILE,
          allowedRoles: [
            ROLES.SUPER_ADMIN,
            ROLES.ADMIN,
            ROLES.CUSTOMER_SUPPORT,
            ROLES.OPERATION,
            ROLES.MARKETING,
            ROLES.PRODUCT_SUPPORT,
          ],
          allowedPrivileges: [PRIVILEGES.PERM_CUSTOMER_VIEW],
        },
        {
          id: 'left_menu__staff_profile',
          title: t('sidebar.userManagement.staffProfile'),
          href: ROUTE_PATHS.STAFF_PROFILES,
          allowedRoles: [ROLES.SUPER_ADMIN, ROLES.IT_ADMIN],
          allowedPrivileges: [PRIVILEGES.PERM_ADMIN_USER_VIEW, PRIVILEGES.PERM_ADMIN_USER_CREATE],
        },
        {
          id: 'left_menu__admin_users',
          title: t('sidebar.userManagement.adminUsers'),
          href: ROUTE_PATHS.ADMIN_USERS,
          allowedRoles: [ROLES.SUPER_ADMIN, ROLES.IT_ADMIN],
        },
      ],
    },
    {
      id: 'left_menu__car_management',
      title: t('sidebar.carManagement.title'),
      href: ROUTE_PATHS.CAR,
      icon: Folder,
      allowedRoles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.OPERATION, ROLES.PRODUCT_SUPPORT],
      children: [
        {
          id: 'left_menu__cars',
          title: t('sidebar.carManagement.car'),
          href: ROUTE_PATHS.CAR,
          allowedRoles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.OPERATION, ROLES.PRODUCT_SUPPORT],
        },
        {
          id: 'left_menu__car_availability',
          title: t('sidebar.carManagement.carAvailability'),
          href: ROUTE_PATHS.CAR_AVAILABILITY,
          allowedRoles: [
            ROLES.SUPER_ADMIN,
            ROLES.ADMIN,
            ROLES.CUSTOMER_SUPPORT,
            ROLES.OPERATION,
            ROLES.MARKETING,
            ROLES.PRODUCT_SUPPORT,
          ],
        },
        {
          id: 'left_menu__car_activity',
          title: t('sidebar.carManagement.carActivity'),
          href: ROUTE_PATHS.CAR_ACTIVITY,
          allowedRoles: [ROLES.SUPER_ADMIN, ROLES.OPERATION],
        },
        {
          id: 'left_menu__model',
          title: t('sidebar.carManagement.carModelAndPricing'),
          href: ROUTE_PATHS.MODEL_AND_PRICING,
          allowedRoles: [
            ROLES.SUPER_ADMIN,
            ROLES.ADMIN,
            ROLES.OPERATION,
            ROLES.MARKETING,
            ROLES.PRODUCT_SUPPORT,
          ],
        },
      ],
    },
    {
      id: 'left_menu__booking_management',
      title: t('sidebar.bookingManagement.title'),
      href: ROUTE_PATHS.SUBSCRIPTION,
      icon: BarChart,
      allowedRoles: [
        ROLES.SUPER_ADMIN,
        ROLES.ADMIN,
        ROLES.CUSTOMER_SUPPORT,
        ROLES.OPERATION,
        ROLES.PRODUCT_SUPPORT,
      ],
      children: [
        {
          id: 'left_menu__booking',
          title: t('sidebar.bookingManagement.booking'),
          href: ROUTE_PATHS.SUBSCRIPTION,
          allowedRoles: [
            ROLES.SUPER_ADMIN,
            ROLES.ADMIN,
            ROLES.CUSTOMER_SUPPORT,
            ROLES.OPERATION,
            ROLES.PRODUCT_SUPPORT,
          ],
        },
        {
          id: 'left_menu__subscription_management_package_management',
          title: t('sidebar.packageManagement'),
          href: ROUTE_PATHS.SUBSCRIPTION_PACKAGE_MANAGEMENT,
          allowedRoles: [ROLES.SUPER_ADMIN],
        },
      ],
    },
    {
      id: 'left_menu__voucher_management',
      title: t('sidebar.voucherManagement.title'),
      href: ROUTE_PATHS.VOUCHER,
      icon: Stars,
      allowedRoles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MARKETING, ROLES.PRODUCT_SUPPORT],
      children: [
        {
          id: 'left_menu__vouchers',
          title: t('sidebar.voucherManagement.voucher'),
          href: ROUTE_PATHS.VOUCHER,
          allowedRoles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MARKETING, ROLES.PRODUCT_SUPPORT],
        },
      ],
    },
    {
      id: 'left_menu__document_management',
      title: t('sidebar.documentsManagement.title'),
      href: ROUTE_PATHS.DOCUMENTS,
      icon: DocumentScanner,
      allowedRoles: [
        ROLES.SUPER_ADMIN,
        ROLES.ADMIN,
        ROLES.OPERATION,
        ROLES.CUSTOMER_SUPPORT,
        ROLES.MARKETING,
      ],
      children: [
        {
          id: 'left_menu__document',
          href: ROUTE_PATHS.DOCUMENTS,
          title: t('sidebar.documentsManagement.document'),
          allowedRoles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.OPERATION],
        },
        {
          id: 'left_menu__consent_log',
          href: ROUTE_PATHS.CONSENT_LOG,
          title: t('sidebar.documentsManagement.consentLog'),
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
          href: ROUTE_PATHS.COOKIE_CONSENT_LOG,
          allowedRoles: [ROLES.ADMIN, ROLES.CUSTOMER_SUPPORT],
        },
        {
          id: 'left_menu__delete_log',
          title: t('sidebar.userDeleteLog'),
          href: ROUTE_PATHS.USER_DELETE_LOG,
          allowedRoles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.OPERATION, ROLES.CUSTOMER_SUPPORT],
        },
      ],
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
