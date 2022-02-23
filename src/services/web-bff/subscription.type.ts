import type { ResponseWithPagination } from 'services/web-bff/response.type'
import type { User, UserAddress } from 'services/web-bff/user.type'
import type { Car } from 'services/web-bff/car.type'

export enum SubscriptionDuration {
  threeDays = '3d',
  oneWeek = '1w',
  oneMonth = '1m',
  threeMonths = '3m',
  sixMonths = '6m',
  twelveMonths = '12m',
}

export interface Subscription {
  id: string
  user: User
  car: Car
  duration: SubscriptionDuration
  startDate: string
  endDate: string
  deliveryAddress: UserAddress
  returnAddress: UserAddress
  voucherCode: string
  status: string
  paymentVersion: number
  paymentStatus: string
  price: number
  createdDate: string
  updatedDate: string
}

export type SubscriptionListQuery = Partial<Subscription>

export interface SubscriptionListProps {
  (
    accessToken: string,
    query?: SubscriptionListQuery,
    limit?: 10,
    page?: 1
  ): Promise<SubscriptionListResponse>
}

export type SubscriptionListResponse = {
  data: {
    subscriptions: Subscription[]
  }
} & ResponseWithPagination
