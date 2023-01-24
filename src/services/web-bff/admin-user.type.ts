import { Response, Pagination } from 'services/web-bff/response.type'

export enum AdminUserRole {
  CUSTOMER_SUPPORT = 'CUSTOMER_SUPPORT',
  OPERATION = 'OPERATION',
  MARKETING = 'MARKETING',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
  PRODUCT_SUPPORT = 'PRODUCT_SUPPORT',
}

export interface AdminUser {
  id: string
  firebaseUId: string
  email: string
  firstName: string
  lastName: string
  role: AdminUserRole
  isActive: false
  createdDate: string
  updatedDate: string
}

export interface GetAdminUsersProps {
  accessToken: string
}

export interface CreateNewAdminUserProps {
  accessToken: string
  firebaseToken: string
  firstname: string
  lastname: string
  role: AdminUserRole
}

export interface AdminUsersResponse extends Response {
  data: {
    adminUsers: AdminUser[]
    pagination: Pagination
  }
}

export interface AdminUserProfileResponse extends Response {
  adminUser: AdminUser
}
