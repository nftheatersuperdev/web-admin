import { Response } from 'services/web-bff/response.type'

export enum AdminUserRole {
  CUSTOMER_SUPPORT = 'CUSTOMER_SUPPORT',
  OPERATION = 'OPERATION',
  MARKETING = 'MARKETING',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
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

export interface GetAdminUserProfileProps {
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
  }
}

export interface AdminUserProfileResponse extends Response {
  data: AdminUser
}
