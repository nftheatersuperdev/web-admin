import { Pagination } from './response.type'
import { Customer } from './customer.type'

export interface NetflixAccountListRequest {
  data?: NetflixAccountListInputRequest
  size?: number
  page?: number
}

export interface NetflixAccountListInputRequest {
  changeDate?: string
  userId?: string
  accountName?: string
  isActive?: boolean
}

export interface NetflixAccountRequest {
  id: string
}

export interface NetflixAccountListResponse extends Response {
  data: {
    netflix: Netflix[]
    pagination: Pagination
  }
}

export interface NetflixAccountResponse extends Response {
  data: Netflix
}

export interface Netflix {
  accountId: string
  accountName: string
  changeDate: string
  email: string
  password: string
  isActive: boolean
  createdDate: string
  createdBy: string
  updatedDate: string
  updatedBy: string
  additionalAccounts: AdditionalAccount[]
  users: NetflixUser[]
}

export interface AdditionalAccount {
  email: string
  password: string
  user: Customer
}

export interface NetflixUser {
  accountType: string
  user: Customer
  accountStatus: string
  color: string
  addedDate: string
  addedBy: string
}

export interface CreateNetflixAccountRequest {
  accountName: string
  changeDate: string
  email: string
  password: string
}

export interface CreateNetflixAccountResponse {
  id: string
  accountName: string
}

export interface CreateNetflixAccountResponseAPI {
  data: CreateNetflixAccountResponse
}

export interface UpdateLinkUserNetflixRequest {
  userId: string
  extendDay: number
  accountType: string
}

export interface UpdateLinkUserNetflixResponse {
  id: string
}
