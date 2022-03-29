import { Response } from 'services/web-bff/response.type'

export interface AdminUser {
  id: string
  firebaseUId: string
  email: string
  firstName: string
  lastName: string
  role: 'ADMIN' | 'SUPER_ADMIN'
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

export interface AdminUsersResponse extends Response {
  data: {
    adminUsers: AdminUser[]
  }
}

export interface AdminUserProfileResponse extends Response {
  data: AdminUser
}
