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

export interface BookingCarTrack {
  id: string
  bookingDetailId: string
  date: string
  externalTaskId: string | null
  fullAddress: string
  latitude: number
  longitude: number
  remark: string | null
  status: string
  type: string
  createdDate: string
  updatedDate: string
}

export interface BookingCarActivity {
  carId: string
  carDetail: SubscriptionCar
  deliveryTask: BookingCarTrack
  returnTask: BookingCarTrack
}

export interface BookingCustomer {
  id: string
  firstName: string
  lastName: string
  phoneNumber: string
  email: string
}

export interface BookingRentalDetail {
  id: string
  agreementId: string
  bookingDetailId: string
  voucherId: string | null
  voucherCode: string | null
  packagePriceId: string
  chargePrice: number
  tenantPrice: number
  currency: string | null
  discountPrice: string | null
  durationDay: number
  isAcceptedAgreement: boolean
  isAcceptedCarCondition: boolean
  paymentTerm: string | null
  status: string
  createdDate: string
  updatedDate: string
}

export interface BookingPayment {
  id: string
  bookingDetailId: string
  paymentId: string
  bookingSchedulePaymentId: string | null
  type: string
  description: string
  status: string
  statusMessage: string | null
  amount: number | null
  currency: string | null
  externalTransactionId: string
  createdDate: string
  updatedDate: string
}

export interface BookingRental {
  id: string
  bookingId: string
  bookingTypeId: string
  startDate: string
  endDate: string
  car: SubscriptionCar
  carId: string
  carTasks: BookingCarTrack[]
  carActivities: BookingCarActivity[]
  createdBy: string
  customer: BookingCustomer
  customerId: string
  displayStatus: string
  status: string
  isExtend: boolean
  isReplacement: boolean
  isPaymentRequired: boolean
  isTimeslotRequired: boolean
  rentDetail: BookingRentalDetail
  remark: string | null
  payments: BookingPayment[]
  updatedBy: string
  isSelfPickUp: boolean
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

export interface SubscriptionListFilter {
  bookingId?: string
  bookingDetailId?: string
  customerId?: string
  carId?: string
  voucherId?: string
  isExtend?: boolean | null
  deliveryDate?: string
  returnDate?: string
  startDate?: string
  endDate?: string
  statusList?: string[]
}

export interface SubscriptionOrder {
  [key: string]: SortDirection
}

export interface SubscriptionListProps {
  query?: SubscriptionListQuery
}

export interface SubscriptionBookingListQuery {
  page?: number
  size?: number
}
export interface SubscriptionBookingListFilters {
  bookingId?: string | null
  bookingDetailId?: string | null
  customerId?: string | null
  carId?: string | null
  voucherId?: string | null
  isExtend?: boolean | null
  deliveryDate?: string | null
  returnDate?: string | null
  startDate?: string | null
  endDate?: string | null
  statusList?: SubscriptionStatus[] | string[]
  email?: string | null
  plateNumber?: string | null
}

export interface SubscriptionBookingListProps {
  query?: SubscriptionBookingListQuery
  filters?: SubscriptionBookingListFilters
}

export interface CarReplacementDeliveryAddress {
  full: string
  latitude: number
  longitude: number
  remark?: string | null
}
export interface UpdateCarReplacementRequestBody {
  bookingId: string
  bookingDetailId: string
  carId: string
  deliveryDate: string
  deliveryTime: string
  deliveryAddress: CarReplacementDeliveryAddress
}

export type SubscriptionListResponse = {
  data: {
    records: Subscription[]
    bookingDetails: BookingRental[]
  }
} & ResponseWithPagination

export interface SubscriptionChangeCarProps {
  subscriptionId: string
  carId: string
}

export interface SubscriptionChangeCarInBookingProps {
  bookingId: string
  bookingDetailId: string
  carId: string
}

export interface SubscriptionExtendEndDateProps {
  accessToken: string
  subscriptionId: string
  endDate: any
}
