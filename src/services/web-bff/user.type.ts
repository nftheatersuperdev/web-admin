/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserGroupInput } from 'services/evme.types'
import { Maybe } from 'services/web-bff/general.type'
import { Response, ResponseWithPagination } from 'services/web-bff/response.type'

export interface User {
  id: string
  firebaseId: string | null
  firstName: string | null
  lastName: string | null
  role: 'user' | 'operator' | 'admin' | 'super_admin'
  disabled: false
  phoneNumber?: string | null
  email: string
  isActive: boolean
  omiseId: string | null
  carTrackId: string | null
  defaultAddress: string | null
  kycStatus: 'pending' | 'verified' | 'rejected'
  kycReason: string | null
  locale: 'TH' | 'EN'
  creditCard: string | null
  customerGroups: string[]
  createdDate: string
  updatedDate: string
}

export interface UserAddress {
  id: string
  full: string
  latitude: number
  longitude: number
  remark?: Maybe<string>
}

export interface CustomerGroup {
  id: string
  name: string
  createdDate?: any
  updatedDate?: any
}

export interface UserGroup {
  id: string
  name: string
  createdDate?: any
  updatedDate?: any
}

export interface UserGroup {
  id: string
  users: User[]
}

export interface UserMeProps {
  (
    accessToken: string,
    data?: UserInputRequest,
    size?: number,
    page?: number
  ): Promise<UserListResponse>
}

export interface UserMeProps {
  id?: string
  data?: UserInputRequest
  size?: number
  page?: number
}

export interface UserMeProps {
  data?: UserInputRequest
  size?: number
  page?: number
}

export interface UserGroupProps {
  data?: UserGroupInputRequest
  size?: number
  page?: number
}

export interface UserGroupInputProps {
  data?: UserGroupInput
}

export interface UserInGroupInputProps {
  id?: string
  users?: string[]
}

export interface UserInputRequest {
  idEqual?: string
  firstNameContain?: string
  lastNameContain?: string
  emailContain?: string
  phoneNumberContain?: string
  kycStatusEqual?: string
  userGroupNameContain?: string
  isActive?: boolean
  createdDateEqual?: string
  updatedDateEqual?: string
}

export interface UserDeleteLog {
  userId: string
  firstName: string
  lastName: string
  email: string
  createdDate: string
  action: string
  createdBy: string
}

export interface UserMeResponse extends Response {
  data: {
    user: User
  }
}

export interface UserGroupInputRequest {
  idEqual?: string
  nameContain?: string
  createdDateEqual?: string
  updatedDateEqual?: string
}

export interface UserDeleteLogProps {
  userId?: string
  firstName?: string
  lastName?: string
  email?: string
  size?: number
  page?: number
}

export type UserListResponse = {
  data: {
    users: User[]
  }
} & ResponseWithPagination

export type UserGroupListResponse = {
  data: {
    customerGroups: CustomerGroup[]
  }
} & ResponseWithPagination

export interface UserGroupResponse {
  data: {
    UserGroup: UserGroup
  }
}

export type UserByUserGroupListResponse = {
  data: {
    userGroup: UserGroup
  }
} & ResponseWithPagination

export type UserDeleteLogListResponse = {
  data: {
    logs: UserDeleteLog[]
  }
} & ResponseWithPagination

export interface CustomerReActivateResponse {
  status: string
}
