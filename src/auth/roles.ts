import { TFunction, Namespace } from 'react-i18next'

export const ROLES = Object.freeze({
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin',
  CUSTOMER_SUPPORT: 'customer_support',
  OPERATION: 'operation',
  MARKETING: 'marketing',
  PRODUCT_SUPPORT: 'product_support',
  IT_ADMIN: 'it_admin',
})

export type Role =
  | typeof ROLES.SUPER_ADMIN
  | typeof ROLES.ADMIN
  | typeof ROLES.CUSTOMER_SUPPORT
  | typeof ROLES.OPERATION
  | typeof ROLES.MARKETING
  | typeof ROLES.PRODUCT_SUPPORT
  | typeof ROLES.IT_ADMIN

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
    case ROLES.ADMIN:
      return t('role.admin')
    case ROLES.CUSTOMER_SUPPORT:
      return t('role.customerSupport')
    case ROLES.OPERATION:
      return t('role.operation')
    case ROLES.MARKETING:
      return t('role.marketing')
    case ROLES.PRODUCT_SUPPORT:
      return t('role.productSupport')
    case ROLES.IT_ADMIN:
      return t('role.itAdmin')
    default:
      return role ? role.toLowerCase() : ''
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
      key: ROLES.ADMIN,
      value: ROLES.ADMIN,
      name: t('role.admin'),
    },
    {
      key: ROLES.SUPER_ADMIN,
      value: ROLES.SUPER_ADMIN,
      name: t('role.superAdmin'),
    },
    {
      key: ROLES.IT_ADMIN,
      value: ROLES.IT_ADMIN,
      name: t('role.itAdmin'),
    },
    {
      key: ROLES.OPERATION,
      value: ROLES.OPERATION,
      name: t('role.operation'),
    },
    {
      key: ROLES.CUSTOMER_SUPPORT,
      value: ROLES.CUSTOMER_SUPPORT,
      name: t('role.customerSupport'),
    },
    {
      key: ROLES.PRODUCT_SUPPORT,
      value: ROLES.PRODUCT_SUPPORT,
      name: t('role.productSupport'),
    },
  ]
}
