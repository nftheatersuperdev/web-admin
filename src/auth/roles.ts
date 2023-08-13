import { TFunction, Namespace } from 'react-i18next'

export const ROLES = Object.freeze({
  SUPER_ADMIN: 'SUPER_ADMIN',
  NETFLIX_AUTHOR: 'NETFLIX_AUTHOR',
  NETFLIX_ADMIN: 'NETFLIX_ADMIN',
  YOUTUBE_AUTHOR: 'YOUTUBE_AUTHOR',
  YOUTUBE_ADMIN: 'YOUTUBE_ADMIN',
})

export type Role =
  | typeof ROLES.SUPER_ADMIN
  | typeof ROLES.NETFLIX_ADMIN
  | typeof ROLES.NETFLIX_AUTHOR
  | typeof ROLES.YOUTUBE_ADMIN
  | typeof ROLES.YOUTUBE_AUTHOR

export const hasAllowedRole = (role?: string | null, allowedRoles?: Role[]): boolean => {
  if (!allowedRoles || !allowedRoles.length) {
    return true
  }
  return !!role && allowedRoles.includes(role)
}

export const getAdminUserRoleLabel = (
  role: string | null | undefined,
  t: TFunction<Namespace>
): string => {
  switch (role) {
    case ROLES.SUPER_ADMIN:
      return t('role.superAdmin')
    case ROLES.NETFLIX_ADMIN:
      return t('role.netflixAdmin')
    case ROLES.NETFLIX_AUTHOR:
      return t('role.netflixAuthor')
    case ROLES.YOUTUBE_ADMIN:
      return t('role.youtubeAdmin')
    case ROLES.YOUTUBE_AUTHOR:
      return t('role.youtubeAuthor')
    default:
      return role ? role : ''
  }
}

export interface SelectOption {
  key: string
  name: string
  value: string
  isDefault?: boolean
}

export const getRoleList = (t: TFunction<Namespace>): SelectOption[] => {
  return [
    {
      key: ROLES.NETFLIX_ADMIN,
      value: ROLES.NETFLIX_ADMIN,
      name: t('role.admin'),
    },
    {
      key: ROLES.NETFLIX_AUTHOR,
      value: ROLES.NETFLIX_AUTHOR,
      name: t('role.authorizer'),
    },
  ]
}
