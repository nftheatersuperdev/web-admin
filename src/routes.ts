import { lazy } from 'react'
import { ROLES } from 'auth/roles'
import { LayoutRouteProps } from './layout/LayoutRoute'

export const ROUTE_PATHS = Object.freeze({
  CATCH_ALL: '**',
  ROOT: '/',
  DASHBOARD: '/dashboard',
  LOGIN: '/login',
  SETTINGS: '/settings',
  USER: '/user',
  SUBSCRIPTION: '/subscription',
  PRICING: '/pricing',
  CAR: '/car',
  CHARGING_LOCATIONS: '/charging-locations',
  ADDITIONAL_EXPENSE: '/additional-expense',
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
    path: ROUTE_PATHS.DASHBOARD,
    component: lazy(() => import('./pages/Dashboard' /* webpackChunkName: "app" */)),
    allowedRoles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.CUSTOMER_SUPPORT, ROLES.OPERATION],
  },
  {
    path: ROUTE_PATHS.SETTINGS,
    component: lazy(() => import('./pages/Settings' /* webpackChunkName: "app" */)),
    allowedRoles: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
  },
  {
    path: ROUTE_PATHS.USER,
    component: lazy(() => import('./pages/User' /* webpackChunkName: "app" */)),
    allowedRoles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.CUSTOMER_SUPPORT],
  },
  {
    path: ROUTE_PATHS.SUBSCRIPTION,
    component: lazy(() => import('./pages/Subscriptions' /* webpackChunkName: "app" */)),
    allowedRoles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.CUSTOMER_SUPPORT],
  },
  {
    path: ROUTE_PATHS.PRICING,
    component: lazy(() => import('./pages/Pricing' /* webpackChunkName: "app" */)),
    allowedRoles: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
  },
  {
    path: ROUTE_PATHS.CAR,
    component: lazy(() => import('./pages/Car' /* webpackChunkName: "app" */)),
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
