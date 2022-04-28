/* eslint-disable @typescript-eslint/no-explicit-any */
import { SortDirection } from 'services/web-bff/general.type'
import { UserGroup } from 'services/web-bff/user.type'
import { PackagePrice } from 'services/web-bff/package-price.type'
import { ResponseWithPagination } from 'services/web-bff/response.type'

export interface Voucher {
  id: string
  code: string
  descriptionEn?: string
  descriptionTh?: string
  discountPercent: number
  limitPerUser: number
  isAllPackages: boolean
  userGroups: UserGroup[]
  packagePrices: PackagePrice[]
  startAt: any
  endAt: any
  createdDate: any
  updatedDate: any
  quantity: number
}

export interface VoucherListQuery {
  idEqual?: string
  codeContain?: string
  descriptionEnContain?: string
  startAtEqual?: string
  endAtEqual?: string
}

export interface VoucherOrder {
  [key: string]: SortDirection
}

export interface VoucherListProps {
  data?: VoucherListQuery
  size?: number
  page?: number
}

export type VoucherListResponse = {
  data: {
    vouchers: Voucher[]
  }
} & ResponseWithPagination

export interface VoucherByIdProps {
  id: string
}

export interface VoucherCreateProps {
  accessToken: string
  data: VoucherInput
}

export interface VoucherBff {
  id?: string
  code: string
  descriptionEn?: string
  descriptionTh?: string
  discountPercent: number
  quantity: number
  limitPerUser: number
  startAt: string
  endAt: string
  isAllPackages?: boolean
  packagePrices?: PackagePrice[]
  userGroups?: UserGroup[]
}

export interface VoucherUpdateProps {
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
