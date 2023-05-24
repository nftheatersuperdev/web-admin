/* eslint-disable @typescript-eslint/no-explicit-any */
import { Maybe } from 'services/web-bff/general.type'
import { Response, ResponseWithPagination } from 'services/web-bff/response.type'

export interface Customer {
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

export interface CustomerAddress {
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

export interface CustomerGroup {
  id: string
  customers: Customer[]
}

export interface CustomerMeProps {
  (
    accessToken: string,
    data?: CustomerInputRequest,
    size?: number,
    page?: number
  ): Promise<CustomerListResponse>
}

export interface CustomerMeProps {
  id?: string
  data?: CustomerInputRequest
  size?: number
  page?: number
}

export interface CustomerMeProps {
  data?: CustomerInputRequest
  size?: number
  page?: number
}

export interface CustomerGroupProps {
  data?: CustomerGroupInputRequest
  size?: number
  page?: number
}

export interface CustomerGroupInputProps {
  data?: CustomerGroupInput
}

export interface CustomerInGroupInputProps {
  id?: string
  customers?: string[]
}

export interface CustomerInputRequest {
  id?: string
  firstName?: string
  lastName?: string
  email?: string
  phoneNumber?: string
  kycStatus?: string
  customerGroupName?: string
  isActive?: boolean
  createdDate?: string
  updatedDate?: string
  mobileNumberContain?: string
  countryCodeEqual?: string
}

export interface CustomerDeleteLog {
  customerId: string
  firstName: string
  lastName: string
  email: string
  createdDate: string
  action: string
  createdBy: string
}

export interface CustomerMeResponse extends Response {
  data: {
    customer: Customer
  }
}

export interface CustomerGroupInput {
  id?: string | null
  name: string
}

export interface CustomerGroupInputRequest {
  idEqual?: string
  nameContain?: string
  createdDateEqual?: string
  updatedDateEqual?: string
}

export interface CustomerDeleteLogProps {
  customerId?: string
  firstName?: string
  lastName?: string
  email?: string
  size?: number
  page?: number
}

export type CustomerListResponse = {
  data: {
    customers: Customer[]
  }
} & ResponseWithPagination

export type CustomerGroupListResponse = {
  data: {
    customerGroups: CustomerGroup[]
  }
} & ResponseWithPagination

export interface CustomerGroupResponse {
  data: {
    customerGroups: CustomerGroup
  }
}

export type CustomerByCustomerGroupListResponse = {
  data: {
    customerGroup: CustomerGroup
  }
} & ResponseWithPagination

export type CustomerDeleteLogListResponse = {
  data: {
    logs: CustomerDeleteLog[]
  }
} & ResponseWithPagination

export interface CustomerReActivateResponse {
  status: string
}

export interface CustomerFilterRequest {
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
  mobileNumberContain?: string
  countryCodeEqual?: string
}
