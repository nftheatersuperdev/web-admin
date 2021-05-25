import { ComponentType, lazy } from 'react'

export const ROUTE_PATHS = Object.freeze({
  CATCH_ALL: '**',
  ROOT: '/',
  LOGIN: '/login',
  USER: '/user',
  SUBSCRIPTION: '/subscription',
})

export interface RoutesInterface {
  component: ComponentType
  exact?: boolean
  noHeader?: boolean
  path: string
}

export const routes: Readonly<RoutesInterface[]> = Object.freeze([
  {
    path: ROUTE_PATHS.LOGIN,
    component: lazy(() => import('./pages/Login' /* webpackChunkName: "app" */)),
  },
  {
    path: ROUTE_PATHS.ROOT,
    component: lazy(() => import('./pages/Home' /* webpackChunkName: "app" */)),
  },
  {
    path: ROUTE_PATHS.USER,
    component: lazy(() => import('./pages/User' /* webpackChunkName: "app" */)),
  },
  {
    path: ROUTE_PATHS.SUBSCRIPTION,
    component: lazy(() => import('./pages/Subscription' /* webpackChunkName: "app" */)),
  },
])
