import { Pagination } from './response.type'
import { Customer } from './customer.type'

export interface NetflixAccountListRequest {
  data?: NetflixAccountListInputRequest
  size?: number
  page?: number
}

export interface NetflixAccountListInputRequest {
  changeDate: string
  billDate: string
  userId: string
  accountName: string
  isActive: boolean
  customerStatus: [string]
  filterTVAvailable: boolean
  filterOtherAvailable: boolean
  filterAdditionalAvailable: boolean
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

export interface AvailableAdditionResponse extends Response {
  data: AvailableAddition[]
}

export interface AllNetflixAccount extends Response {
  data: NetflixAccounts[]
}

export interface Netflix {
  accountId: string
  accountName: string
  changeDate: string
  billDate: string
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
  additionalId: string
  email: string
  password: string
  user: Customer
}

export interface NetflixUser {
  accountType: string
  user: Customer
  selected: boolean
  accountStatus: string
  color: string
  addedDate: string
  addedBy: string
}

export interface CreateNetflixAccountRequest {
  accountName: string
  changeDate: string
  billDate: string
  email: string
  password: string
}

export interface CreateNetflixAccountResponse {
  id: string
  accountName: string
}

export interface CreateAdditionAccountRequest {
  email: string
  password: string
}

export interface CreateAdditionAccountResponse {
  data: {
    id: string
  }
}

export interface CreateNetflixAccountResponseAPI {
  data: CreateNetflixAccountResponse
}

export interface UpdateLinkUserNetflixRequest {
  userId: string
  packageId: string
  accountType: string
}

export interface UpdateLinkUserNetflixResponse {
  id: string
}

export interface AvailableAddition {
  additionalId: string
  email: string
}

export interface NetflixAccounts {
  accountId: string
  accountName: string
}

export interface UpdateNetflixAccountRequest {
  changeDate: string
  billDate: string
  email?: string
  password: string
}

export interface UpdateNetflixAccountResponse {
  data: {
    id: string
  }
}

export interface UpdateAdditionalAccountRequest {
  email: string
  password: string
}

export interface TransferUsersRequest {
  fromAccountId: string
  userIds: string[]
}

export interface NetflixChangeDateInfo {
  changeDateToday: string
  countToday: number
  changeDateTomorrow: string
  countTomorrow: number
  changeDateDayPlusTwo: string
  countDayPlusTwo: number
  changeDateDayPlusThree: string
  countDayPlusThree: number
  totalAccount: number
}

export interface NetflixCustomerInfo {
  countWaitingExpired: number
  countWaitingAsk2Status: number
  countWaitingAsk1Status: number
  countWaitingAskStatus: number
  totalCustomer: number
  totalActiveCustomer: number
}

export interface NetflixDeviceInfo {
  availableTV: number
  totalTV: number
  availableAdditional: number
  totalAdditional: number
  availableOther: number
  totalOther: number
}

export interface NetflixDashboard {
  data: {
    changeDateInfo: NetflixChangeDateInfo
    customerInfo: NetflixCustomerInfo
    deviceInfo: NetflixDeviceInfo
    todayTransaction: number
  }
}

export interface NetflixPackage {
  packageId: string
  packageName: string
  packageDay: number
  packagePrice: number
  packageType: string
}

export interface GetNetflixPackageResponse {
  data: NetflixPackage[]
}
