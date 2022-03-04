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
  USER_GROUP_USERS: '/user-groups/:ugid/users',
  SUBSCRIPTION: '/subscription',
  PRICING: '/pricing',
  MODEL_AND_PRICING: '/model-and-pricing',
  MODEL_AND_PRICING_EDIT: '/model-and-pricing/:carModelId/edit',
  CAR: '/car',
  CAR_AVAILABILITY: '/car-availability',
  VOUCHER: '/vouchers',
  VOUCHER_CREATE: '/vouchers/create',
  VOUCHER_EDIT: '/vouchers/:voucherId/edit',
  VOUCHER_EVENTS: '/vouchers/:voucherId/events',
  CHARGING_LOCATIONS: '/charging-locations',
  ADDITIONAL_EXPENSE: '/additional-expense',
  ADMIN_USERS: '/admin-users',
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
    // allowedRoles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.CUSTOMER_SUPPORT, ROLES.OPERATION],
  },
  {
    path: ROUTE_PATHS.ACCOUNT_SETTINGS,
    component: lazy(() => import('./pages/Account/Settings' /* webpackChunkName: "app" */)),
    allowedRoles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.CUSTOMER_SUPPORT, ROLES.OPERATION],
  },
  {
    path: ROUTE_PATHS.ACCOUNT,
    component: lazy(() => import('./pages/Account' /* webpackChunkName: "app" */)),
    allowedRoles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.CUSTOMER_SUPPORT, ROLES.OPERATION],
  },
  {
    path: ROUTE_PATHS.USER,
    component: lazy(() => import('./pages/User' /* webpackChunkName: "app" */)),
    allowedRoles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.CUSTOMER_SUPPORT],
  },
  {
    path: ROUTE_PATHS.USER_GROUP_USERS,
    component: lazy(() => import('./pages/UserGroupUsers' /* webpackChunkName: "app" */)),
    allowedRoles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.OPERATION],
  },
  {
    path: ROUTE_PATHS.USER_GROUPS,
    component: lazy(() => import('./pages/UserGroups' /* webpackChunkName: "app" */)),
    allowedRoles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.OPERATION],
  },
  {
    path: ROUTE_PATHS.SUBSCRIPTION,
    component: lazy(() => import('./pages/Subscriptions' /* webpackChunkName: "app" */)),
    // allowedRoles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.CUSTOMER_SUPPORT, ROLES.OPERATION],
  },
  {
    path: ROUTE_PATHS.PRICING,
    component: lazy(() => import('./pages/Pricing' /* webpackChunkName: "app" */)),
    allowedRoles: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
  },
  {
    path: ROUTE_PATHS.MODEL_AND_PRICING_EDIT,
    component: lazy(() => import('./pages/ModelAndPricingEdit' /* webpackChunkName: "app" */)),
    allowedRoles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.OPERATION],
  },
  {
    path: ROUTE_PATHS.MODEL_AND_PRICING,
    component: lazy(() => import('./pages/ModelAndPricing' /* webpackChunkName: "app" */)),
    allowedRoles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.OPERATION],
  },
  {
    path: ROUTE_PATHS.CAR,
    component: lazy(() => import('./pages/Car' /* webpackChunkName: "app" */)),
    // allowedRoles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.OPERATION],
  },
  {
    path: ROUTE_PATHS.CAR_AVAILABILITY,
    component: lazy(() => import('./pages/CarAvailability' /* webpackChunkName: "app" */)),
    // allowedRoles: [
    //   ROLES.SUPER_ADMIN,
    //   ROLES.ADMIN,
    //   ROLES.CUSTOMER_SUPPORT,
    //   ROLES.OPERATION,
    //   ROLES.MARKETING,
    // ],
  },
  {
    path: ROUTE_PATHS.VOUCHER_CREATE,
    component: lazy(() => import('./pages/VoucherCreateEdit' /* webpackChunkName: "app" */)),
    allowedRoles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.OPERATION],
  },
  {
    path: ROUTE_PATHS.VOUCHER_EDIT,
    component: lazy(() => import('./pages/VoucherCreateEdit' /* webpackChunkName: "app" */)),
    allowedRoles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.OPERATION],
  },
  {
    path: ROUTE_PATHS.VOUCHER_EVENTS,
    component: lazy(() => import('./pages/VoucherEvents' /* webpackChunkName: "app" */)),
    allowedRoles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.OPERATION],
  },
  {
    path: ROUTE_PATHS.VOUCHER,
    component: lazy(() => import('./pages/Voucher' /* webpackChunkName: "app" */)),
    allowedRoles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.OPERATION],
  },
  {
    path: ROUTE_PATHS.CHARGING_LOCATIONS,
    component: lazy(() => import('./pages/ChargingLocations' /* webpackChunkName: "app" */)),
    allowedRoles: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
  },
  {
    path: ROUTE_PATHS.ADDITIONAL_EXPENSE,
    component: lazy(() => import('./pages/AdditionalExpenses' /* webpackChunkName: "app" */)),
    allowedRoles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.OPERATION],
  },
  {
    path: ROUTE_PATHS.ADMIN_USERS,
    component: lazy(() => import('./pages/AdminUsers' /* webpackChunkName: "app" */)),
    allowedRoles: [ROLES.SUPER_ADMIN],
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
