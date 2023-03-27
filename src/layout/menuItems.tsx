/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { useTranslation } from 'react-i18next'
import { ROLES } from 'auth/roles'
import { BarChart, Dashboard, DocumentScanner, Folder, PeopleAlt, Stars } from '@mui/icons-material'
import { SidebarItemsType } from './Sidebar/types'

export function useMenuItems() {
  const { t } = useTranslation()

  const pagesSection = [
    {
      href: '/dashboard',
      icon: Dashboard,
      title: t('sidebar.dashboard'),
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
      href: '/user',
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
          href: '/user',
          title: t('sidebar.userManagement.customerProfile'),
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
          href: '/admin-users',
          title: t('sidebar.userManagement.staffProfile'),
          allowedRoles: [
            ROLES.SUPER_ADMIN,
            ROLES.ADMIN,
            ROLES.CUSTOMER_SUPPORT,
            ROLES.OPERATION,
            ROLES.MARKETING,
            ROLES.PRODUCT_SUPPORT,
          ],
        },
      ],
    },
    {
      href: '/car',
      icon: Folder,
      title: t('sidebar.carManagement.title'),
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
          href: '/car',
          title: t('sidebar.carManagement.car'),
          allowedRoles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.OPERATION, ROLES.PRODUCT_SUPPORT],
        },
        {
          href: '/car-availability',
          title: t('sidebar.carManagement.carAvailability'),
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
          href: '/car-activity',
          title: t('sidebar.carManagement.carActivity'),
          allowedRoles: [ROLES.SUPER_ADMIN, ROLES.OPERATION],
        },
        {
          href: '/model-and-pricing',
          title: t('sidebar.carManagement.carModelAndPricing'),
          allowedRoles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.OPERATION, ROLES.PRODUCT_SUPPORT],
        },
      ],
    },
    {
      href: '/booking',
      icon: BarChart,
      title: t('sidebar.bookingManagement.title'),
      allowedRoles: [
        ROLES.SUPER_ADMIN,
        ROLES.ADMIN,
        ROLES.CUSTOMER_SUPPORT,
        ROLES.OPERATION,
        ROLES.PRODUCT_SUPPORT,
      ],
      children: [
        {
          href: '/subscription',
          title: t('sidebar.bookingManagement.booking'),
          allowedRoles: [
            ROLES.SUPER_ADMIN,
            ROLES.ADMIN,
            ROLES.CUSTOMER_SUPPORT,
            ROLES.OPERATION,
            ROLES.PRODUCT_SUPPORT,
          ],
        },
      ],
    },
    {
      href: '/voucher',
      icon: Stars,
      title: t('sidebar.voucherManagement.title'),
      allowedRoles: [
        ROLES.SUPER_ADMIN,
        ROLES.ADMIN,
        ROLES.OPERATION,
        ROLES.MARKETING,
        ROLES.PRODUCT_SUPPORT,
      ],
      children: [
        {
          href: '/user-groups',
          title: t('sidebar.voucherManagement.userGroup'),
          allowedRoles: [
            ROLES.SUPER_ADMIN,
            ROLES.ADMIN,
            ROLES.OPERATION,
            ROLES.MARKETING,
            ROLES.PRODUCT_SUPPORT,
          ],
        },
        {
          href: '/vouchers',
          title: t('sidebar.voucherManagement.voucher'),
          allowedRoles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MARKETING, ROLES.PRODUCT_SUPPORT],
        },
      ],
    },
    {
      href: '/documents',
      icon: DocumentScanner,
      title: t('sidebar.documentsManagement.title'),
      allowedRoles: [
        ROLES.SUPER_ADMIN,
        ROLES.ADMIN,
        ROLES.OPERATION,
        ROLES.CUSTOMER_SUPPORT,
        ROLES.MARKETING,
      ],
      children: [
        {
          href: '/documents',
          title: t('sidebar.documentsManagement.document'),
          allowedRoles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.OPERATION],
        },
        {
          href: '/consent-log',
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
          href: '/user-delete-log',
          title: t('sidebar.documentsManagement.deleteLog'),
          allowedRoles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.OPERATION, ROLES.CUSTOMER_SUPPORT],
        },
      ],
    },
    {
      href: '/notifications',
      icon: DocumentScanner,
      title: 'Notification',
      allowedRoles: [
        ROLES.SUPER_ADMIN,
        ROLES.ADMIN,
        ROLES.CUSTOMER_SUPPORT,
        ROLES.OPERATION,
        ROLES.MARKETING,
        ROLES.PRODUCT_SUPPORT,
        ROLES.IT_ADMIN,
      ],
      children: [
        {
          href: '/notifications',
          title: 'All Notification',
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
          href: '/notifications/templates',
          title: 'Notification Template',
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
          href: '/notifications/reports',
          title: 'Report',
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
