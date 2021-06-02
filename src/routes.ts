import { lazy } from 'react'
import { LayoutRouteProps } from './layout/LayoutRoute'

export const ROUTE_PATHS = Object.freeze({
  CATCH_ALL: '**',
  ROOT: '/',
  LOGIN: '/login',
  SETTINGS: '/settings',
  USER: '/user',
  SUBSCRIPTION: '/subscription',
  PRICING: '/pricing',
  CAR: '/car',
  CHARGING_STATIONS: '/charging-stations',
  INSURANCE: '/insurance',
})

export const routes: Readonly<LayoutRouteProps[]> = Object.freeze([
  {
    path: ROUTE_PATHS.LOGIN,
    isPublic: true,
    component: lazy(() => import('./pages/Login' /* webpackChunkName: "app" */)),
  },
  {
    path: ROUTE_PATHS.SETTINGS,
    component: lazy(() => import('./pages/Settings' /* webpackChunkName: "app" */)),
  },
  {
    path: ROUTE_PATHS.USER,
    component: lazy(() => import('./pages/User' /* webpackChunkName: "app" */)),
  },
  {
    path: ROUTE_PATHS.SUBSCRIPTION,
    component: lazy(() => import('./pages/Subscription' /* webpackChunkName: "app" */)),
  },
  {
    path: ROUTE_PATHS.PRICING,
    component: lazy(() => import('./pages/Pricing' /* webpackChunkName: "app" */)),
  },
  {
    path: ROUTE_PATHS.CAR,
    component: lazy(() => import('./pages/Car' /* webpackChunkName: "app" */)),
  },
  {
    path: ROUTE_PATHS.CHARGING_STATIONS,
    component: lazy(() => import('./pages/ChargingStations' /* webpackChunkName: "app" */)),
  },
  {
    path: ROUTE_PATHS.INSURANCE,
    component: lazy(() => import('./pages/Insurance' /* webpackChunkName: "app" */)),
  },
  // The order is important here. This route needs to be at the bottom
  {
    path: ROUTE_PATHS.ROOT,
    component: lazy(() => import('./pages/Dashboard' /* webpackChunkName: "app" */)),
  },
])
