/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  SortDirection,
  StringFieldComparison,
  DateRangeFieldComparison,
  BooleanFieldComparison,
} from 'services/web-bff/general.type'
import { UserGroup } from 'services/web-bff/user.type'
import { PackagePrice } from 'services/web-bff/package-price.type'
import { ResponseWithPagination } from 'services/web-bff/response.type'

export interface Voucher {
  id: string
  code: string
  descriptionEn?: string
  descriptionTh?: string
  percentDiscount: number
  amount: number
  limitPerUser: number
  isAllPackages: boolean
  userGroups: UserGroup[]
  packagePrices: PackagePrice[]
  startDate: any
  endDate: any
  createdDate: any
  updatedDate: any
}

export interface VoucherListQuery {
  firebaseId?: StringFieldComparison
  firstName?: StringFieldComparison
  lastName?: StringFieldComparison
  role?: StringFieldComparison
  disabled?: BooleanFieldComparison
  phoneNumber?: StringFieldComparison
  email?: StringFieldComparison
  kycStatus?: StringFieldComparison
  createdAt?: DateRangeFieldComparison
  updatedAt?: DateRangeFieldComparison
}

export interface VoucherOrder {
  [key: string]: SortDirection
}

export interface VoucherListProps {
  accessToken: string
  query?: VoucherListQuery
  sort?: VoucherOrder
  limit?: number
  page?: number
}

export type VoucherListResponse = {
  data: {
    vouchers: Voucher[]
  }
} & ResponseWithPagination

export interface VoucherByIdProps {
  accessToken: string
  id: string
}

export interface VoucherCreateProps {
  accessToken: string
  data: VoucherInput
}

export interface VoucherUpdateProps {
  accessToken: string
  data: VoucherInput
}

export interface VoucherDeleteByIdProps {
  accessToken: string
  id: string
}

export interface VoucherInput {
  id?: string | number
  code?: string
  descriptionEn?: string
  descriptionTh?: string
  percentDiscount?: number
  amount?: number
  limitPerUser?: number
  isAllPackages?: boolean
  startDate?: any
  endDate?: any
}
