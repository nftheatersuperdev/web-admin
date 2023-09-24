import { lazy } from 'react'
import { ROLES } from 'auth/roles'
import { LayoutRouteProps } from './layout/LayoutRoute'

export const ROUTE_PATHS = Object.freeze({
  CATCH_ALL: '**',
  ROOT: '/',
  DASHBOARD: '/dashboard',
  LOGIN: '/login',
  LOGOUT: '/logout',
  FORBIDDEN: '/403',
  NOT_FOUND: '/404',
  CUSTOMER: '/customers',
  NETFLIX: '/netflixes',
  NETFLIX_ACCOUNT: '/netflix/:id',
  YOUTUBE: '/youtubes',
  YOUTUBE_ACCOUNT: '/youtube/:id',
  SETTING_CONFIGS: '/setting-configs',
  SETTING_CONFIG_EDIT: '/setting-config/:id',
  SETTING_CONFIG_ADD: '/setting-config/add',
  REWARD: '/rewards',
  ADMIN: '/admins',
  ADMIN_EDIT: '/admin/:id',
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
      ROLES.NETFLIX_ADMIN,
      ROLES.NETFLIX_AUTHOR,
      ROLES.YOUTUBE_ADMIN,
      ROLES.YOUTUBE_AUTHOR,
    ],
  },
  {
    path: ROUTE_PATHS.ADMIN,
    component: lazy(() => import('./pages/AdminUser' /* webpackChunkName: "app" */)),
    allowedRoles: [ROLES.SUPER_ADMIN],
  },

  {
    path: ROUTE_PATHS.ADMIN_EDIT,
    component: lazy(() => import('./pages/AdminUser' /* webpackChunkName: "app" */)),
    allowedRoles: [ROLES.SUPER_ADMIN],
  },
  {
    path: ROUTE_PATHS.CUSTOMER,
    component: lazy(() => import('./pages/Customer' /* webpackChunkName: "app" */)),
    allowedRoles: [
      ROLES.SUPER_ADMIN,
      ROLES.NETFLIX_ADMIN,
      ROLES.NETFLIX_AUTHOR,
      ROLES.YOUTUBE_ADMIN,
      ROLES.YOUTUBE_AUTHOR,
    ],
  },
  {
    path: ROUTE_PATHS.NETFLIX,
    component: lazy(() => import('./pages/Netflix' /* webpackChunkName: "app" */)),
    allowedRoles: [ROLES.SUPER_ADMIN, ROLES.NETFLIX_ADMIN, ROLES.NETFLIX_AUTHOR],
  },
  {
    path: ROUTE_PATHS.NETFLIX_ACCOUNT,
    component: lazy(() => import('./pages/NetflixAccount' /* webpackChunkName: "app" */)),
    allowedRoles: [ROLES.SUPER_ADMIN, ROLES.NETFLIX_ADMIN, ROLES.NETFLIX_AUTHOR],
  },
  {
    path: ROUTE_PATHS.YOUTUBE,
    component: lazy(() => import('./pages/Youtube' /* webpackChunkName: "app" */)),
    allowedRoles: [ROLES.SUPER_ADMIN, ROLES.YOUTUBE_ADMIN, ROLES.YOUTUBE_AUTHOR],
  },
  {
    path: ROUTE_PATHS.YOUTUBE_ACCOUNT,
    component: lazy(() => import('./pages/YoutubeAccount' /* webpackChunkName: "app" */)),
    allowedRoles: [ROLES.SUPER_ADMIN, ROLES.YOUTUBE_ADMIN, ROLES.YOUTUBE_AUTHOR],
  },
  {
    path: ROUTE_PATHS.FORBIDDEN,
    isPublic: true,
    component: lazy(() => import('./pages/Error/Forbidden' /* webpackChunkName: "app" */)),
  },
  {
    path: ROUTE_PATHS.REWARD,
    component: lazy(() => import('./pages/Reward' /* webpackChunkName: "app" */)),
    allowedRoles: [ROLES.SUPER_ADMIN],
  },
  {
    path: ROUTE_PATHS.SETTING_CONFIGS,
    component: lazy(() => import('./pages/SettingConfig' /* webpackChunkName: "app" */)),
    allowedRoles: [ROLES.SUPER_ADMIN],
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
