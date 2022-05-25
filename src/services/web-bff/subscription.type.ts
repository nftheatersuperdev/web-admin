/* eslint-disable @typescript-eslint/no-explicit-any */
import { SortDirection } from 'services/web-bff/general.type'
import { ResponseWithPagination } from 'services/web-bff/response.type'
import { User } from 'services/web-bff/user.type'
import { CarModel } from 'services/web-bff/car.type'
import { Payment, Voucher } from 'services/evme.types'

export enum SubscriptionDuration {
  threeDays = '3d',
  oneWeek = '1w',
  oneMonth = '1m',
  threeMonths = '3m',
  sixMonths = '6m',
  twelveMonths = '12m',
}

export enum SubscriptionStatus {
  reserved = 'reserved',
  accepted = 'accepted',
  delivered = 'delivered',
  cancelled = 'cancelled',
  upcomingCancelled = 'upcoming_cancelled',
  refused = 'refused',
  completed = 'completed',
  extended = 'extended',
  manualExtended = 'manual_extended',
  acceptedCarDonditions = 'accepted_car_conditions',
  acceptedAgreement = 'accepted_agreement',
}

export interface Subscription {
  id?: string
  startDate?: string
  endDate?: string
  cleaningDate?: string
  userId: string
  carId: string
  status: string
  voucherId: string
  packagePriceId: string
  chargedPrice: number
  discountPrice: number
  tenantPrice: number
  durationDay: number
  deliveryDateTime: string
  deliveryFullAddress: string
  deliveryLatitude: number
  deliveryLongitude: number
  deliveryRemark: string
  returnDateTime: string
  returnFullAddress: string
  returnLatitude: number
  returnLongitude: number
  returnRemark: string
  car: Partial<SubscriptionCar>
  createdDate: string
  updatedDate: string
  user: User
  payments: Payment[]
  parentId: string
  voucher: Voucher
}

export interface SubscriptionCar {
  id: string
  plateNumber: string
  vin: string
  carTrackId: string
  isActive: boolean
  carSku: SubscriptionCarSku
  createdDate: string
  updatedDate: string
}

export interface SubscriptionCarSku {
  id: string
  images: []
  carModel: CarModel
  color: string
  colorHex: string
  createdDate: string
  updatedDate: string
}

export interface SubscriptionListQuery {
  id?: string
  carId?: string
  customerId?: string
  voucherId?: string
  deliveryDateTime?: string
  returnDateTime?: string
  startDate?: string
  endDate?: string
  statusList?: string[]
  size?: number
  page?: number
  parentId?: string
  isParent?: boolean
}

export interface SubscriptionOrder {
  [key: string]: SortDirection
}

export interface SubscriptionListProps {
  query?: SubscriptionListQuery
}

export type SubscriptionListResponse = {
  data: {
    records: Subscription[]
  }
} & ResponseWithPagination

export interface SubscriptionChangeCarProps {
  subscriptionId: string
  carId: string
}

export interface SubscriptionExtendEndDateProps {
  accessToken: string
  subscriptionId: string
  endDate: any
}
