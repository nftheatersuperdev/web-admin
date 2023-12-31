import { Response, Pagination } from 'services/web-bff/response.type'

export enum AdminUserRole {
  CUSTOMER_SUPPORT = 'CUSTOMER_SUPPORT',
  OPERATION = 'OPERATION',
  MARKETING = 'MARKETING',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
  PRODUCT_SUPPORT = 'PRODUCT_SUPPORT',
  IT_ADMIN = 'IT_ADMIN',
  CENTRE_OPERATION = 'CENTRE_OPERATION',
  BRANCH_MANAGER = 'BRANCH_MANAGER',
  BRANCH_OFFICER = 'BRANCH_OFFICER',
}

export interface ResellerServiceArea {
  id: string
  areaNameTh: string
  areaNameEn: string
}

export interface AdminUser {
  id: string
  firebaseId: string
  email: string
  adminName: string
  role: string
  account: string
  isActive: false
  createdDate: string
  updatedDate: string
}
export interface AdminUserById {
  id: string
}

export interface AdminUserByCriteria {
  adminName?: string
  email?: string
  module?: string
  role?: string
  isActive?: boolean
}

export interface GetAdminUsersProps {
  accessToken: string
}

export interface GetAdminUsersByCriteriaProps {
  (data?: AdminUserByCriteria, size?: number, page?: number): Promise<AdminUsersResponse>
}

export interface AdminUsersProps {
  (data?: AdminUserByCriteria, size?: number, page?: number): Promise<AdminUsersResponse>
}

export interface AdminUsersProps {
  id?: string
  data?: AdminUserByCriteria
  size?: number
  page?: number
}

export interface AdminUsersProps {
  data?: AdminUserByCriteria
  size?: number
  page?: number
}

export interface CreateNewAdminUserProps {
  accessToken: string
  firebaseToken: string
  name: string
  role: string
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

export interface UpdateAdminUserProps {
  id: string
  firstname: string | null
  lastname: string | null
  email: string | null
  role: string
  resellerServiceAreaIds: string[]
}

export interface UpdateAdminUserResponse extends Response {
  data: {
    id: string
  }
}
