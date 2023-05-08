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
