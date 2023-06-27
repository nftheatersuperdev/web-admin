import { lazy } from 'react'
import { ROLES } from 'auth/roles'
import { LayoutRouteProps } from './layout/LayoutRoute'

export const ROUTE_PATHS = Object.freeze({
  CATCH_ALL: '**',
  ROOT: '/',
  DASHBOARD: '/dashboard',
  LOGIN: '/login',
  LOGOUT: '/logout',
  ACCOUNT: '/account',
  ACCOUNT_SETTINGS: '/account/settings',
  USER: '/user',
  USER_GROUPS: '/user-groups',
  USER_GROUP_DETAIL: '/user-groups/:id',
  BOOKING_CAR_REPLACEMENT: '/booking/:bookingId/:bookingDetailId/car-replacement',
  BOOKING_CAR_DETAIL: '/booking/:bookingId/:bookingDetailId/car/:carId',
  BOOKING_DETAIL: '/booking/:bookingId/:bookingDetailId',
  BOOKING: '/booking',
  PRICING: '/pricing',
  MODEL_AND_PRICING: '/model-and-pricing',
  MODEL_AND_PRICING_EDIT: '/model-and-pricing/:id/edit',
  CAR_DETAIL: '/car/:id',
  CAR: '/car',
  CAR_AVAILABILITY_DETAIL: '/car-availability/:id',
  CAR_AVAILABILITY: '/car-availability',

  CAR_ACTIVITY_DETAIL: '/car-activity/:id',
  CAR_ACTIVITY: '/car-activity',
  VOUCHER: '/vouchers',
  VOUCHER_CREATE: '/vouchers/create',
  VOUCHER_EDIT: '/vouchers/:voucherCode/edit',
  VOUCHER_EVENTS: '/vouchers/:voucherId/events',
  CHARGING_LOCATIONS: '/charging-locations',
  DOCUMENTS: '/documents',
  DOCUMENT_VERSIONS: '/documents/:documentCode/versions',
  DOCUMENT_VERSION_VIEW: '/documents/:documentCode/versions/:version',
  DOCUMENT_VERSION_EDIT: '/documents/:documentCode/versions/:version/edit',
  CONSENT_LOG: '/consent-log',
  CONSENTS_LOG: '/consents-log',
  USER_DELETE_LOG: '/user-delete-log',
  COOKIE_CONSENT_LOG: '/cookie-consent-log',
  ADDITIONAL_EXPENSE: '/additional-expense',
  ADMIN_USERS: '/admin-users',
  STAFF_PROFILES: '/staff-profiles',
  STAFF_PROFILE_DETAIL: '/staff-profile/:id/edit',
  STAFF_PROFILE_ADD: '/staff-profile/create',
  SUBSCRIPTION_MANAGEMENT: '/subscription-management',
  SUBSCRIPTION_PACKAGE_MANAGEMENT: '/subscription-management/package-management',
  SUBSCRIPTION_PACKAGE_ADD: '/subscription-management/package-management/create',
  CUSTOMER_PROFILE: '/customer-profiles',
  CUSTOMER_PROFILE_DETAIL: '/customer-profile/:id/edit',
  CUSTOMER_PROFILE_ADD: '/customer-profile/create',
  LEAD_MANAGEMENT: '/lead-management',
  LEAD_MANAGEMENT_DETAIL: '/lead-management-detail/:id',
  FORBIDDEN: '/403',
  NOT_FOUND: '/404',
})

export const routes: Readonly<LayoutRouteProps[]> = Object.freeze([
  {
    path: ROUTE_PATHS.LOGIN,
    isPublic: true,
    component: lazy(() => import('./pages/Login' /* webpackChunkName: "app" */)),
  },
  {
    path: ROUTE_PATHS.LOGOUT,
    isPublic: true,
    component: lazy(() => import('./pages/Logout' /* webpackChunkName: "app" */)),
  },
  {
    path: ROUTE_PATHS.DASHBOARD,
    component: lazy(() => import('./pages/Dashboard' /* webpackChunkName: "app" */)),
    allowedRoles: [
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
      ROLES.CUSTOMER_SUPPORT,
      ROLES.OPERATION,
      ROLES.MARKETING,
      ROLES.PRODUCT_SUPPORT,
      ROLES.IT_ADMIN,
      ROLES.CENTRE_OPERATION,
      ROLES.BRANCH_MANAGER,
      ROLES.BRANCH_OFFICER,
    ],
  },
  {
    path: ROUTE_PATHS.ACCOUNT_SETTINGS,
    component: lazy(() => import('./pages/Account/Settings' /* webpackChunkName: "app" */)),
    allowedRoles: [
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
      ROLES.CUSTOMER_SUPPORT,
      ROLES.OPERATION,
      ROLES.MARKETING,
      ROLES.PRODUCT_SUPPORT,
      ROLES.IT_ADMIN,
      ROLES.CENTRE_OPERATION,
      ROLES.BRANCH_MANAGER,
      ROLES.BRANCH_OFFICER,
    ],
  },
  {
    path: ROUTE_PATHS.ACCOUNT,
    component: lazy(() => import('./pages/Account' /* webpackChunkName: "app" */)),
    allowedRoles: [
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
      ROLES.CUSTOMER_SUPPORT,
      ROLES.OPERATION,
      ROLES.MARKETING,
      ROLES.PRODUCT_SUPPORT,
      ROLES.IT_ADMIN,
      ROLES.CENTRE_OPERATION,
      ROLES.BRANCH_MANAGER,
      ROLES.BRANCH_OFFICER,
    ],
  },
  {
    path: ROUTE_PATHS.USER_GROUP_DETAIL,
    component: lazy(() => import('./pages/UserGroupDetail' /* webpackChunkName: "app" */)),
    allowedRoles: [
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
      ROLES.OPERATION,
      ROLES.MARKETING,
      ROLES.PRODUCT_SUPPORT,
    ],
  },
  {
    path: ROUTE_PATHS.USER_GROUPS,
    component: lazy(() => import('./pages/UserGroups' /* webpackChunkName: "app" */)),
    allowedRoles: [
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
      ROLES.OPERATION,
      ROLES.MARKETING,
      ROLES.PRODUCT_SUPPORT,
    ],
  },
  {
    path: ROUTE_PATHS.BOOKING_CAR_REPLACEMENT,
    component: lazy(() => import('./pages/BookingCarReplacement' /* webpackChunkName: "app" */)),
    allowedRoles: [
      ROLES.SUPER_ADMIN,
      ROLES.OPERATION,
      ROLES.CENTRE_OPERATION,
      ROLES.BRANCH_MANAGER,
    ],
  },
  {
    path: ROUTE_PATHS.BOOKING_CAR_DETAIL,
    component: lazy(() => import('./pages/BookingCarDetail' /* webpackChunkName: "app" */)),
    allowedRoles: [
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
      ROLES.CUSTOMER_SUPPORT,
      ROLES.OPERATION,
      ROLES.PRODUCT_SUPPORT,
      ROLES.CENTRE_OPERATION,
      ROLES.BRANCH_MANAGER,
      ROLES.BRANCH_OFFICER,
    ],
  },
  {
    path: ROUTE_PATHS.BOOKING_DETAIL,
    component: lazy(() => import('./pages/BookingDetail' /* webpackChunkName: "app" */)),
    allowedRoles: [
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
      ROLES.CUSTOMER_SUPPORT,
      ROLES.OPERATION,
      ROLES.PRODUCT_SUPPORT,
      ROLES.CENTRE_OPERATION,
      ROLES.BRANCH_MANAGER,
      ROLES.BRANCH_OFFICER,
    ],
  },
  {
    path: ROUTE_PATHS.BOOKING,
    component: lazy(() => import('./pages/Booking' /* webpackChunkName: "app" */)),
    allowedRoles: [
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
      ROLES.CUSTOMER_SUPPORT,
      ROLES.OPERATION,
      ROLES.PRODUCT_SUPPORT,
      ROLES.CENTRE_OPERATION,
      ROLES.BRANCH_MANAGER,
      ROLES.BRANCH_OFFICER,
    ],
  },
  {
    path: ROUTE_PATHS.SUBSCRIPTION_PACKAGE_ADD,
    component: lazy(() => import('./pages/SubscriptionCreateEdit' /* webpackChunkName: "app" */)),
    allowedRoles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MARKETING, ROLES.PRODUCT_SUPPORT],
  },
  {
    path: ROUTE_PATHS.PRICING,
    component: lazy(() => import('./pages/Pricing' /* webpackChunkName: "app" */)),
    allowedRoles: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
  },
  {
    path: ROUTE_PATHS.MODEL_AND_PRICING_EDIT,
    component: lazy(() => import('./pages/ModelAndPricingEdit' /* webpackChunkName: "app" */)),
    allowedRoles: [
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
      ROLES.OPERATION,
      ROLES.MARKETING,
      ROLES.CUSTOMER_SUPPORT,
      ROLES.PRODUCT_SUPPORT,
      ROLES.CENTRE_OPERATION,
    ],
  },
  {
    path: ROUTE_PATHS.MODEL_AND_PRICING,
    component: lazy(() => import('./pages/ModelAndPricing' /* webpackChunkName: "app" */)),
    allowedRoles: [
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
      ROLES.OPERATION,
      ROLES.MARKETING,
      ROLES.CUSTOMER_SUPPORT,
      ROLES.PRODUCT_SUPPORT,
      ROLES.CENTRE_OPERATION,
    ],
  },
  {
    path: ROUTE_PATHS.CAR_DETAIL,
    component: lazy(() => import('./pages/CarDetail' /* webpackChunkName: "app" */)),
    allowedRoles: [
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
      ROLES.OPERATION,
      ROLES.PRODUCT_SUPPORT,
      ROLES.CENTRE_OPERATION,
      ROLES.BRANCH_MANAGER,
      ROLES.BRANCH_OFFICER,
    ],
  },
  {
    path: ROUTE_PATHS.CAR,
    component: lazy(() => import('./pages/Car' /* webpackChunkName: "app" */)),
    allowedRoles: [
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
      ROLES.OPERATION,
      ROLES.PRODUCT_SUPPORT,
      ROLES.CENTRE_OPERATION,
      ROLES.BRANCH_MANAGER,
      ROLES.BRANCH_OFFICER,
    ],
  },
  {
    path: ROUTE_PATHS.CAR_AVAILABILITY_DETAIL,
    component: lazy(() => import('./pages/CarAvailabilityDetail' /* webpackChunkName: "app" */)),
    allowedRoles: [
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
      ROLES.CUSTOMER_SUPPORT,
      ROLES.OPERATION,
      ROLES.MARKETING,
      ROLES.PRODUCT_SUPPORT,
      ROLES.CENTRE_OPERATION,
      ROLES.BRANCH_MANAGER,
      ROLES.BRANCH_OFFICER,
    ],
  },
  {
    path: ROUTE_PATHS.CAR_AVAILABILITY,
    component: lazy(() => import('./pages/CarAvailability' /* webpackChunkName: "app" */)),
    allowedRoles: [
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
      ROLES.CUSTOMER_SUPPORT,
      ROLES.OPERATION,
      ROLES.MARKETING,
      ROLES.PRODUCT_SUPPORT,
      ROLES.CENTRE_OPERATION,
      ROLES.BRANCH_MANAGER,
      ROLES.BRANCH_OFFICER,
    ],
  },

  {
    path: ROUTE_PATHS.CAR_ACTIVITY_DETAIL,
    component: lazy(() => import('./pages/CarActivityDetail' /* webpackChunkName: "app" */)),
    allowedRoles: [
      ROLES.SUPER_ADMIN,
      ROLES.OPERATION,
      ROLES.CENTRE_OPERATION,
      ROLES.BRANCH_MANAGER,
      ROLES.BRANCH_OFFICER,
    ],
  },
  {
    path: ROUTE_PATHS.CAR_ACTIVITY,
    component: lazy(() => import('./pages/CarActivity' /* webpackChunkName: "app" */)),
    allowedRoles: [
      ROLES.SUPER_ADMIN,
      ROLES.OPERATION,
      ROLES.CENTRE_OPERATION,
      ROLES.BRANCH_MANAGER,
      ROLES.BRANCH_OFFICER,
    ],
  },
  {
    path: ROUTE_PATHS.VOUCHER_CREATE,
    component: lazy(() => import('./pages/VoucherCreateEdit' /* webpackChunkName: "app" */)),
    allowedRoles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MARKETING, ROLES.PRODUCT_SUPPORT],
  },
  {
    path: ROUTE_PATHS.VOUCHER_EDIT,
    component: lazy(() => import('./pages/VoucherCreateEdit' /* webpackChunkName: "app" */)),
    allowedRoles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MARKETING, ROLES.PRODUCT_SUPPORT],
  },
  {
    path: ROUTE_PATHS.VOUCHER_EVENTS,
    component: lazy(() => import('./pages/VoucherEvents' /* webpackChunkName: "app" */)),
    allowedRoles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MARKETING, ROLES.PRODUCT_SUPPORT],
  },
  {
    path: ROUTE_PATHS.VOUCHER,
    component: lazy(() => import('./pages/Voucher' /* webpackChunkName: "app" */)),
    allowedRoles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.MARKETING, ROLES.PRODUCT_SUPPORT],
  },
  {
    path: ROUTE_PATHS.CHARGING_LOCATIONS,
    component: lazy(() => import('./pages/ChargingLocations' /* webpackChunkName: "app" */)),
    allowedRoles: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
  },
  {
    path: ROUTE_PATHS.DOCUMENT_VERSION_EDIT,
    component: lazy(() => import('./pages/DocumentVersionEdit' /* webpackChunkName: "app" */)),
    allowedRoles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.OPERATION, ROLES.CENTRE_OPERATION],
  },
  {
    path: ROUTE_PATHS.DOCUMENT_VERSION_VIEW,
    component: lazy(() => import('./pages/DocumentVersionView' /* webpackChunkName: "app" */)),
    allowedRoles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.OPERATION, ROLES.CENTRE_OPERATION],
  },
  {
    path: ROUTE_PATHS.DOCUMENT_VERSIONS,
    component: lazy(() => import('./pages/DocumentVersions' /* webpackChunkName: "app" */)),
    allowedRoles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.OPERATION, ROLES.CENTRE_OPERATION],
  },
  {
    path: ROUTE_PATHS.DOCUMENTS,
    component: lazy(() => import('./pages/Documents' /* webpackChunkName: "app" */)),
    allowedRoles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.OPERATION, ROLES.CENTRE_OPERATION],
  },
  {
    path: ROUTE_PATHS.CONSENTS_LOG,
    component: lazy(() => import('./pages/ConsentsLog' /* webpackChunkName: "app" */)),
    allowedRoles: [
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
      ROLES.OPERATION,
      ROLES.CUSTOMER_SUPPORT,
      ROLES.MARKETING,
      ROLES.CENTRE_OPERATION,
    ],
  },
  {
    path: ROUTE_PATHS.COOKIE_CONSENT_LOG,
    component: lazy(() => import('./pages/CookieConsentLog' /* webpackChunkName: "app" */)),
    allowedRoles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.CUSTOMER_SUPPORT],
  },
  {
    path: ROUTE_PATHS.USER_DELETE_LOG,
    component: lazy(() => import('./pages/UserDeleteLog' /* webpackChunkName: "app" */)),
    allowedRoles: [
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
      ROLES.OPERATION,
      ROLES.CUSTOMER_SUPPORT,
      ROLES.CENTRE_OPERATION,
    ],
  },
  {
    path: ROUTE_PATHS.ADDITIONAL_EXPENSE,
    component: lazy(() => import('./pages/AdditionalExpenses' /* webpackChunkName: "app" */)),
    allowedRoles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.OPERATION],
  },
  {
    path: ROUTE_PATHS.STAFF_PROFILES,
    component: lazy(() => import('./pages/StaffProfiles' /* webpackChunkName: "app" */)),
    allowedRoles: [ROLES.SUPER_ADMIN, ROLES.IT_ADMIN],
  },
  {
    path: ROUTE_PATHS.STAFF_PROFILE_DETAIL,
    component: lazy(() => import('./pages/StaffProfileDetail' /* webpackChunkName: "app" */)),
    allowedRoles: [ROLES.SUPER_ADMIN, ROLES.IT_ADMIN],
  },
  {
    path: ROUTE_PATHS.STAFF_PROFILE_ADD,
    component: lazy(() => import('./pages/StaffProfileAdd' /* webpackChunkName: "app" */)),
    allowedRoles: [ROLES.SUPER_ADMIN, ROLES.IT_ADMIN],
  },
  {
    path: ROUTE_PATHS.SUBSCRIPTION_PACKAGE_MANAGEMENT,
    component: lazy(
      () => import('./pages/SubscriptionPackageManagement' /* webpackChunkName: "app" */)
    ),
    allowedRoles: [ROLES.SUPER_ADMIN],
  },
  {
    path: ROUTE_PATHS.CUSTOMER_PROFILE,
    component: lazy(() => import('./pages/CustomerProfile' /* webpackChunkName: "app" */)),
    allowedRoles: [
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
      ROLES.CUSTOMER_SUPPORT,
      ROLES.OPERATION,
      ROLES.MARKETING,
      ROLES.PRODUCT_SUPPORT,
      ROLES.CENTRE_OPERATION,
    ],
  },
  {
    path: ROUTE_PATHS.CUSTOMER_PROFILE_DETAIL,
    component: lazy(() => import('./pages/CustomerProfileDetail' /* webpackChunkName: "app" */)),
    allowedRoles: [
      ROLES.SUPER_ADMIN,
      ROLES.ADMIN,
      ROLES.CUSTOMER_SUPPORT,
      ROLES.OPERATION,
      ROLES.MARKETING,
      ROLES.PRODUCT_SUPPORT,
      ROLES.CENTRE_OPERATION,
    ],
  },
  {
    path: ROUTE_PATHS.LEAD_MANAGEMENT,
    component: lazy(() => import('./pages/LeadManagement' /* webpackChunkName: "app" */)),
    allowedRoles: [ROLES.SUPER_ADMIN, ROLES.OPERATION],
  },
  {
    path: ROUTE_PATHS.LEAD_MANAGEMENT_DETAIL,
    component: lazy(() => import('./pages/LeadManagementDetail' /* webpackChunkName: "app" */)),
    allowedRoles: [ROLES.SUPER_ADMIN, ROLES.OPERATION],
  },
  {
    path: ROUTE_PATHS.FORBIDDEN,
    isPublic: true,
    component: lazy(() => import('./pages/Error/Forbidden' /* webpackChunkName: "app" */)),
  },
  {
    path: ROUTE_PATHS.NOT_FOUND,
    isPublic: true,
    component: lazy(() => import('./pages/Error/NotFound' /* webpackChunkName: "app" */)),
  },
  // The order is important here. This route needs to be at the bottom
  {
    path: ROUTE_PATHS.ROOT,
    component: lazy(() => import('./pages/Home' /* webpackChunkName: "app" */)),
  },
])
