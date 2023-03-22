import { ROLES } from 'auth/roles'
import { BarChart, Dashboard, DocumentScanner, Folder, PeopleAlt, Stars } from '@mui/icons-material'
import { SidebarItemsType } from './types'

const pagesSection = [
  {
    href: '/dashboard',
    icon: Dashboard,
    title: 'Dashboard',
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
    title: 'User Management',
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
        title: 'Customer Profile',
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
        title: 'Staff Profile',
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
    title: 'Car Management',
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
        title: 'Car',
        allowedRoles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.OPERATION, ROLES.PRODUCT_SUPPORT],
      },
      {
        href: '/car-availability',
        title: 'Car Availability',
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
        title: 'Car Activity',
        allowedRoles: [ROLES.SUPER_ADMIN, ROLES.OPERATION],
      },
      {
        href: '/model-and-pricing',
        title: 'Model & Pricing',
        allowedRoles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.OPERATION, ROLES.PRODUCT_SUPPORT],
      },
    ],
  },
  {
    href: '/booking',
    icon: BarChart,
    title: 'Booking Management',
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
        title: 'Booking',
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
    title: 'Voucher Management',
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
        title: 'User Group',
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
        title: 'Voucher',
        allowedRoles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MARKETING, ROLES.PRODUCT_SUPPORT],
      },
    ],
  },
  {
    href: '/documents',
    icon: DocumentScanner,
    title: 'Document',
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
        title: 'Document',
        allowedRoles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.OPERATION],
      },
      {
        href: '/consent-log',
        title: 'Consent Log',
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
        title: 'Delete Log',
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

const navItems = [
  {
    title: 'Pages',
    pages: pagesSection,
  },
]

export default navItems
