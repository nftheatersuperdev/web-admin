export const ROLES = Object.freeze({
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin',
  CUSTOMER_SUPPORT: 'customer_support',
  OPERATION: 'operation',
  MARKETING: 'marketing',
})

export type Role =
  | typeof ROLES.SUPER_ADMIN
  | typeof ROLES.ADMIN
  | typeof ROLES.CUSTOMER_SUPPORT
  | typeof ROLES.OPERATION
  | typeof ROLES.MARKETING

export const hasAllowedRole = (role?: string | null, allowedRoles?: Role[]): boolean => {
  if (!allowedRoles || !allowedRoles.length) {
    return true
  }
  return !!role && allowedRoles.includes(role)
}
