import { Customer } from './customer.type'
import { Pagination } from './response.type'

export interface CreateYoutubeAccountRequest {
  accountName: string
  changeDate: string
  billDate: string
  email: string
  password: string
}

export interface CreateYoutubeAccountResponse {
  data: {
    id: string
    accountName: string
  }
}

export interface UpdateYoutubeAccountRequest {
  changeDate: string
  billDate: string
  password: string
}

export interface YoutubeAccountRequest {
  id: string
}

export interface YoutubeAccountResponse {
  data: Youtube
}

export interface YoutubeAccountListRequest {
  data?: YoutubeAccountListInputRequest
  size?: number
  page?: number
}

export interface YoutubeAccountListInputRequest {
  changeDate: string
  billDate: string
  userId: string
  accountName: string
  accountStatus: []
  customerStatus: []
}

export interface YoutubeAccountRequest {
  id: string
}

export interface YoutubeAccountListResponse extends Response {
  data: {
    youtube: Youtube[]
    pagination: Pagination
  }
}

export interface Youtube {
  accountId: string
  accountName: string
  changeDate: string
  billDate: string
  email: string
  password: string
  accountStatus: string
  createdDate: string
  createdBy: string
  updatedDate: string
  updatedBy: string
  users: YoutubeUser[]
}

export interface YoutubeUser {
  accountType: string
  user: Customer
  selected: boolean
  accountStatus: string
  color: string
  addedDate: string
  addedBy: string
}

export interface YoutubePackage {
  packageId: string
  packageName: string
  packageDay: number
  packagePrice: number
  packageType: string
}

export interface GetYoutubePackageResponse {
  data: YoutubePackage[]
}

export interface UpdateLinkUserYoutubeRequest {
  userId: string
  packageId: string
}

export interface UpdateLinkUserYoutubeResponse {
  id: string
}

export interface YoutubeChangeDateInfo {
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

export interface YoutubeCustomerInfo {
  countWaitingExpired: number
  countWaitingAsk2Status: number
  countWaitingAsk1Status: number
  countWaitingAskStatus: number
  totalCustomer: number
  totalActiveCustomer: number
}

export interface YoutubeDashboard {
  data: {
    changeDateInfo: YoutubeChangeDateInfo
    customerInfo: YoutubeCustomerInfo
    todayTransition: number
  }
}

export interface TransferUsersRequest {
  fromAccountId: string
  userIds: string[]
}

export interface YoutubeAccounts {
  accountId: string
  accountName: string
}

export interface AllYoutubeAccount extends Response {
  data: YoutubeAccounts[]
}
