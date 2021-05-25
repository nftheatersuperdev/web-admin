import { lazy } from 'react'
import { LayoutRouteProps } from './layout/LayoutRoute'

export const ROUTE_PATHS = Object.freeze({
  CATCH_ALL: '**',
  ROOT: '/',
  LOGIN: '/login',
  USER: '/user',
  SUBSCRIPTION: '/subscription',
  CAR: '/car',
})

export const routes: Readonly<LayoutRouteProps[]> = Object.freeze([
  {
    path: ROUTE_PATHS.LOGIN,
    component: lazy(() => import('./pages/Login' /* webpackChunkName: "app" */)),
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
    path: ROUTE_PATHS.CAR,
    component: lazy(() => import('./pages/Car' /* webpackChunkName: "app" */)),
  },
  // The order is important here. This route needs to be at the bottom
  {
    path: ROUTE_PATHS.ROOT,
    component: lazy(() => import('./pages/Home' /* webpackChunkName: "app" */)),
  },
])
