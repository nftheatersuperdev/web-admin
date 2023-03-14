import { ResponseWithPagination } from 'services/web-bff/response.type'

export interface BookingRental {
  id: string
  bookingId: string
  customerId: string
  customer: BookingRentalCustomer
  rentDetail: BookingRentalDetail
  cars: BookingRentalCar[]
}

export interface BookingRentalCustomer {
  id: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
}

export interface BookingRentalDetail {
  id: string
  bookingDetailId: string
  packagePriceId: string
  voucherId: string | null
  voucherCode: string | null
  paymentTerm: string
  tenantPrice: number
  durationDay: number
  discountPrice: number | null
  chargePrice: number
  currency: string
  agreementId: string
  isAcceptedAgreement: boolean
  isAcceptedCarCondition: boolean
  createdDate: string
  updatedDate: string
}

export interface BookingRentalCar {
  carId: string
  detail: BookingRentalCarDetail
  delivery: BookingRentalCarDeliveryAndReturn
  return: BookingRentalCarDeliveryAndReturn
}

export interface BookingRentalCarDetail {
  // @TODO Confirm this object
  carModel: string
  carBrand: string
  topSpeed: string
  seat: string
}

export interface BookingRentalCarDeliveryAndReturn {
  bookingDetailId: string
  latitude: number
  longitude: number
  type: string
  status: string
  date: string
  externalTaskId: string
  fullAddress: string
  remark: string | null
  createdDate: string
  updatedDate: string
}

export type CarListResponse = {
  data: {
    bookingDetails: BookingRental[]
  }
} & ResponseWithPagination
