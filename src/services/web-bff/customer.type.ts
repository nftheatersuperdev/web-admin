import { Pagination } from './response.type'

export interface CustomerListRequest {
  data?: CustomerListInputRequest
  size?: number
  page?: number
}

export interface CustomerListInputRequest {
  userId?: string
  customerName?: string
  email?: string
  phoneNumber?: string
  lineId?: string
}

export interface CustomerRequest {
  userId: string
}

export interface CustomerListResponse extends Response {
  data: {
    customer: Customer[]
    pagination: Pagination
  }
}

export interface CustomerResponse extends Response {
  data: Customer
}

export interface CustomerOptionList extends Response {
  data: CustomerOption[]
}

export interface CustomerOption {
  value: string
  label: string
  filterLabel: string
}

export interface Customer {
  userId: string
  password: string
  customerName: string
  email: string | null
  phoneNumber: string | null
  lineId: string
  lineUrl: string
  verifiedStatus: string | null
  customerStatus: string | null
  expiredDate: string
  dayLeft: number | null
  createdDate: string
  createdBy: string
  updatedDate: string
  updatedBy: string
}

export interface ExtendDayCustomerRequest {
  extendDay: number
}

export interface CreateCustomerRequest {
  customerName: string
  email: string | null
  phoneNumber: string | null
  lineId: string
  lineUrl: string
}

export interface CreateCustomerResponse {
  id: string
  userId: string
  password: string
}

export interface CreateCustomerResponseAPI extends Response {
  data: CreateCustomerResponse
}

export interface UpdateCustomerRequest {
  customerStatus: string
}
