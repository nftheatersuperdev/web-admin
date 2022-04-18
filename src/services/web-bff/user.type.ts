/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserGroupInput } from 'services/evme.types'
import { Maybe } from 'services/web-bff/general.type'
import { Response, ResponseWithPagination } from 'services/web-bff/response.type'

export interface User {
  id: string
  firebaseId: string
  firstName: string
  lastName: string
  role: 'user' | 'operator' | 'admin' | 'super_admin'
  disabled: false
  phoneNumber: string
  email: string
  omiseId: string | null
  carTrackId: string | null
  defaultAddress: string | null
  kycStatus: 'pending' | 'verified' | 'rejected'
  kycRejectReason: string | null
  locale: 'TH' | 'EN'
  creditCard: string | null
  userGroups: []
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
  limit?: number
  page?: number
}

export interface UserGroupInputProps {
  data?: UserGroupInput
}

export interface UserInputRequest {
  idEqual?: string
  firstNameContain?: string
  lastNameContain?: string
  emailContain?: string
  phoneNumberContain?: string
  kycStatusEqual?: string
  userGroupNameContain?: string
  createdDateEqual?: string
  updatedDateEqual?: string
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

export type UserListResponse = {
  data: {
    users: User[]
  }
} & ResponseWithPagination

export type UserGroupListResponse = {
  data: {
    userGroups: UserGroup[]
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
