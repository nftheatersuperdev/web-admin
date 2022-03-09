/* eslint-disable @typescript-eslint/no-explicit-any */
import { SortDirection } from 'services/web-bff/general.type'
import { ResponseWithPagination } from 'services/web-bff/response.type'
import { User, UserAddress } from 'services/web-bff/user.type'
import { Car } from 'services/web-bff/car.type'

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
  id: string
  user: User
  car: Partial<Car>
  duration: SubscriptionDuration
  startDate: string
  endDate: string
  deliveryAddress: UserAddress
  returnAddress: UserAddress
  voucherCode: string
  status: SubscriptionStatus
  paymentVersion: number
  paymentStatus: string
  price: number
  createdDate: string
  updatedDate: string
}

export interface SubscriptionListQuery {
  status?: string
  startDate?: {
    between: {
      lower: string
      upper: string
    }
  }
  endDate?: {
    between: {
      lower: string
      upper: string
    }
  }
}

export interface SubscriptionOrder {
  [key: string]: SortDirection
}

export interface SubscriptionListProps {
  accessToken: string
  query?: SubscriptionListQuery
  sort?: SubscriptionOrder
  limit?: number
  page?: number
}

export type SubscriptionListResponse = {
  data: {
    subscriptions: Subscription[]
  }
} & ResponseWithPagination

export interface SubscriptionChangeCarProps {
  accessToken: string
  subscriptionId: string
  carId: string
}

export interface SubscriptionExtendEndDateProps {
  accessToken: string
  subscriptionId: string
  endDate: any
}
