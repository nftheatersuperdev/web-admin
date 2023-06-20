/* eslint-disable @typescript-eslint/no-explicit-any */
import { TFunction, Namespace } from 'react-i18next'
import ls from 'localstorage-slim'
import { formatDate, DEFAULT_DATETIME_FORMAT } from 'utils'
import { ResellerServiceArea } from 'services/web-bff/car.type'
import { CarOwnerResponse } from 'services/web-bff/car-owner.type'
import { ReSellerResponse } from 'services/web-bff/re-seller-area.type'
import { LocationResponse } from 'services/web-bff/location.type'
import {
  BookingCarActivity,
  BookingPayment,
  BookingRental,
  SubscriptionCar,
} from 'services/web-bff/booking.type'

export const getListFromQueryParam = (queryString: URLSearchParams, valueKey: string): string[] => {
  const results: string[] = []
  queryString.forEach((value, key) => {
    if (key.indexOf(valueKey) > -1) {
      results.push(value)
    }
  })

  return results
}

export interface SelectOption {
  label: string
  value: string
}

const STORAGE_KEYS = {
  VISIBILITY_COLUMNS: 'evme:car:visibility_columns',
}

export const CarStatus = {
  ACCEPTED: 'accepted',
  AVAILABLE: 'available',
  IN_USE: 'in_use',
  OUT_OF_SERVICE: 'out_of_service',
  PUBLISHED: 'published',
  RESERVED: 'reserved',
  UPCOMING_CANCELLED: 'upcoming_cancelled',
}

export const BookingStatus = {
  RESERVED: 'reserved',
  ACCEPTED: 'accepted',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  UPCOMING_CANCELLED: 'upcoming_cancelled',
  REFUSED: 'refused',
  COMPLETED: 'completed',
}

export const defaultVisibilityColumns: VisibilityColumns = {
  id: true,
  carTrackId: true,
  brand: true,
  model: true,
  price: true,
  duration: true,
  status: true,
  updatedAt: true,
  carModelId: false,
  seats: false,
  topSpeed: false,
  plateNumber: true,
  vin: true,
  fastChargeTime: false,
  startDate: false,
  endDate: false,
  startAddress: false,
  endAddress: false,
  createdAt: false,
}

export const getCarStatusOptions = (t: TFunction<Namespace>): SelectOption[] => [
  {
    label: t('car.statuses.published'),
    value: CarStatus.AVAILABLE,
  },
  {
    label: t('car.statuses.outOfService'),
    value: CarStatus.OUT_OF_SERVICE,
  },
  {
    label: t('car.statuses.published'),
    value: CarStatus.PUBLISHED,
  },
  {
    label: t('car.statuses.inUse'),
    value: CarStatus.IN_USE,
  },
]

export const getBookingStatusOnlyUsedInBackendOptions = (
  t: TFunction<Namespace>
): SelectOption[] => [
  {
    label: t('booking.statuses.reserved'),
    value: BookingStatus.RESERVED,
  },
  {
    label: t('booking.status.accepted'),
    value: BookingStatus.ACCEPTED,
  },
  {
    label: t('booking.status.delivered'),
    value: BookingStatus.DELIVERED,
  },
  {
    label: t('booking.status.cancelled'),
    value: BookingStatus.CANCELLED,
  },
  {
    label: t('booking.status.upcoming_cancelled'),
    value: BookingStatus.UPCOMING_CANCELLED,
  },
  {
    label: t('booking.status.refused'),
    value: BookingStatus.REFUSED,
  },
  {
    label: t('booking.status.completed'),
    value: BookingStatus.COMPLETED,
  },
]

export const columnFormatBookingStatus = (status: string, t: TFunction<Namespace>): string => {
  if (!status) {
    return '-'
  }

  const enforceStatus = status.toLocaleLowerCase().replaceAll(' ', '_')
  switch (enforceStatus) {
    case BookingStatus.RESERVED:
      return t('booking.status.reserved')

    case BookingStatus.ACCEPTED:
      return t('booking.status.accepted')

    case BookingStatus.DELIVERED:
      return t('booking.status.delivered')

    case BookingStatus.CANCELLED:
      return t('booking.status.cancelled')

    case BookingStatus.UPCOMING_CANCELLED:
      return t('booking.status.upcoming_cancelled')

    case BookingStatus.REFUSED:
      return t('booking.status.refused')

    case BookingStatus.COMPLETED:
      return t('booking.status.completed')

    default:
      return '-'
  }
}

export const columnFormatCarVisibility = (isActive: boolean, t: TFunction<Namespace>): string => {
  if (isActive) {
    return t('car.statuses.published')
  }
  return t('car.statuses.unpublished')
}

export interface VisibilityColumns {
  [key: string]: boolean
}

export const getVisibilityColumns = (): VisibilityColumns => {
  return (
    ls.get<VisibilityColumns | undefined>(STORAGE_KEYS.VISIBILITY_COLUMNS) ||
    defaultVisibilityColumns
  )
}

export const setVisibilityColumns = (columns: VisibilityColumns): void => {
  ls.set<VisibilityColumns>(STORAGE_KEYS.VISIBILITY_COLUMNS, columns)
}
export interface FilterSearch {
  [key: string]: string
}

export enum Keypress {
  ENTER = 'Enter',
}

export const getIsExtendOptions = (): SelectOption[] => [
  {
    label: 'True',
    value: 'true',
  },
]

export const getOwnerOptions = (carOwners: CarOwnerResponse | null | undefined): SelectOption[] => {
  const owners = carOwners?.owners || []
  return owners.map((owner) => ({
    label: owner.name,
    value: owner.id,
  }))
}

export const getResellerOptions = (
  carResellers: ReSellerResponse | null | undefined
): SelectOption[] => {
  const resellers = carResellers?.resellers || []
  return resellers.map((reseller) => ({
    label: reseller.name,
    value: reseller.id,
  }))
}

export const getLocationOptions = (
  carLocations: LocationResponse | null | undefined
): SelectOption[] => {
  const locations = carLocations?.locations || []
  return locations.map((location) => ({
    label: location.areaNameEn,
    value: location.id,
  }))
}

export const convertToDuration = (value: number, t: TFunction<Namespace>): string => {
  switch (value) {
    case 3:
      return t('pricing.3d')
    case 7:
      return t('pricing.1w')
    case 30:
      return t('pricing.1m')
    case 90:
      return t('pricing.3m')
    case 180:
      return t('pricing.6m')
    case 360:
      return t('pricing.12m')
  }
  return value.toString()
}

export const getUserResellerServiceAreaId = (userServiceAreas: ResellerServiceArea[]): string => {
  if (userServiceAreas && userServiceAreas.length >= 1) {
    return userServiceAreas[0].id
  }
  return ''
}

export interface BookingList {
  id: string
  detailId: string
  customerId: string
  firstName: string
  lastName: string
  email: string
  phone: string
  carId: string
  model: string
  brand: string
  seats: number
  topSpeed: number
  plateNumber: string
  vin: string
  fastChargeTime: number
  price: string
  duration: string
  startDate: string
  endDate: string
  deliveryAddress: string
  returnAddress: string
  status: string
  parentId: string
  isExtend: boolean
  location: string
  owner: string
  reseller: string
  voucherId: string
  voucherCode: string
  createdDate: string
  updatedDate: string
  paymentStatus: string
  paymentFailure: string
  paymentUpdated: string
  deliveryDate: string
  returnDate: string
  isReplacement: boolean
  displayReplacement: string
  isSelfPickUp: boolean
  cars: SubscriptionCar
  carActivities: BookingCarActivity[]
  payments: BookingPayment[]
  [key: string]: any
}

export interface BookingCsv {
  id: string
  detailId: string
  customerId: string
  firstName: string
  lastName: string
  email: string
  phone: string
  carId: string
  model: string
  brand: string
  seats: number
  topSpeed: number
  plateNumber: string
  vin: string
  fastChargeTime: number
  price: string
  duration: string
  startDate: string
  endDate: string
  deliveryAddress: string
  returnAddress: string
  status: string
  parentId: string
  isExtend: boolean
  location: string
  owner: string
  reseller: string
  voucherId: string
  voucherCode: string
  createdDate: string
  updatedDate: string
  paymentStatus: string
  paymentFailure: string
  paymentUpdated: string
  deliveryDate: string
  returnDate: string
  isReplacement: boolean
  displayReplacement: string
}

// eslint-disable-next-line
export const defaultVal = (value: any, defaultValue: any) => {
  if (value) {
    return value
  }

  return defaultValue
}

export const getBookingList = (
  bookings: BookingRental[] | undefined,
  t: TFunction<Namespace>
): BookingList[] => {
  const bookingDetails: BookingList[] = []

  if (bookings) {
    bookings.forEach((detail) => {
      const booking: BookingList = {} as BookingList
      booking.id = defaultVal(detail?.bookingId, '-')
      booking.detailId = defaultVal(detail?.id, '-')
      booking.customerId = defaultVal(detail.customer?.id, '-')
      booking.firstName = defaultVal(detail.customer?.firstName, '-')
      booking.lastName = defaultVal(detail.customer?.lastName, '-')
      booking.email = defaultVal(detail.customer?.email, '-')
      booking.phone = defaultVal(detail.customer?.phoneNumber, '-')
      booking.carId = defaultVal(detail.carId, '-')
      booking.model = defaultVal(detail.car?.carSku?.carModel?.name, '-')
      booking.brand = defaultVal(detail.car?.carSku?.carModel?.brand.name, '-')
      booking.seats = defaultVal(detail.car.carSku.carModel.seats, 0)
      booking.topSpeed = defaultVal(detail.car.carSku.carModel.topSpeed, 0)
      booking.plateNumber = defaultVal(detail.car?.plateNumber, '-')
      booking.vin = defaultVal(detail.car.vin, '-')
      booking.fastChargeTime = defaultVal(detail.car.carSku.carModel.fastChargeTime, 0)
      booking.price = defaultVal(detail.rentDetail?.chargePrice, '-')
      booking.duration = defaultVal(convertToDuration(detail.rentDetail?.durationDay, t), '-')
      booking.startDate = defaultVal(detail.startDate, '-')
      booking.endDate = defaultVal(detail.endDate, '-')
      booking.deliveryAddress = defaultVal('-', '-')
      booking.returnAddress = defaultVal('-', '-')
      booking.status = defaultVal(detail.displayStatus, '-')
      booking.parentId = defaultVal(detail.bookingId, '-')
      booking.isExtend = defaultVal(detail.isExtend, false)
      booking.location = defaultVal(detail.car?.resellerServiceArea?.areaNameTh, '-')
      booking.owner = defaultVal(detail.car.owner, '-')
      booking.reseller = defaultVal(detail.car.reSeller, '-')
      booking.voucherId = defaultVal(detail.rentDetail?.voucherId, '-')
      booking.voucherCode = defaultVal(detail.rentDetail?.voucherCode, '-')
      booking.createdDate = defaultVal(detail.rentDetail?.createdDate, '-')
      booking.updatedDate = defaultVal(detail.rentDetail?.updatedDate, '-')
      booking.paymentStatus = defaultVal('-', '-')
      booking.paymentFailure = defaultVal('-', '-')
      booking.paymentUpdated = defaultVal('-', '-')
      booking.deliveryDate = defaultVal('-', '-')
      booking.returnDate = defaultVal('-', '-')
      booking.isReplacement = defaultVal(detail.isReplacement, false)
      booking.displayReplacement = booking.isReplacement ? 'Y' : 'N'
      booking.isSelfPickUp = defaultVal(detail.isSelfPickUp, false)
      booking.cars = detail.car
      booking.carActivities = detail.carActivities
      booking.payments = detail.payments

      bookingDetails.push(booking)
    })
  }

  return bookingDetails
}

export interface ServiceTypeLocation {
  addressEn: string
  addressTh: string
  distance: number
  id: string
  isActive: boolean
  latitude: number
  longitude: number
  resellerServiceAreaId: string
  serviceType: string
}

const getServiceTypeLocation = (
  serviceTypeLocations: ServiceTypeLocation[],
  isSelfPickup: boolean | undefined
) => {
  const deliverBy = isSelfPickup === true ? 'SELF_PICK_UP' : 'DELIVERY_BY_EVME'
  const serviceLocation = serviceTypeLocations.find(
    (location: ServiceTypeLocation) =>
      location.isActive === true && location.serviceType === deliverBy
  )
  return serviceLocation
}

export const getCsvData = (bookings: BookingList[], t: TFunction<Namespace>): BookingCsv[] => {
  const csvData: BookingCsv[] = []
  bookings.forEach((book) => {
    const newBook = { ...book }
    const task = getServiceTypeLocation(
      newBook.cars.resellerServiceArea.serviceTypeLocations,
      newBook.isSelfPickUp
    )
    newBook.startDate = defaultVal(formatDate(newBook.startDate, DEFAULT_DATETIME_FORMAT), '-')
    newBook.endDate = defaultVal(formatDate(newBook.endDate, DEFAULT_DATETIME_FORMAT), '-')
    newBook.createdDate = defaultVal(formatDate(newBook.createdDate, DEFAULT_DATETIME_FORMAT), '-')
    newBook.updatedDate = defaultVal(formatDate(newBook.updatedDate, DEFAULT_DATETIME_FORMAT), '-')
    newBook.status = columnFormatBookingStatus(newBook.status, t)

    if (newBook.carActivities.length > 0) {
      newBook.carActivities.forEach((ac) => {
        const newCarActivity = { ...newBook }
        newCarActivity.carId = defaultVal(ac.carId, '-')
        newCarActivity.brand = defaultVal(ac.carDetail.carSku.carModel.brand.name, '-')
        newCarActivity.model = defaultVal(ac.carDetail.carSku.carModel.name, '-')
        newCarActivity.seats = defaultVal(ac.carDetail.carSku.carModel.seats, '-')
        newCarActivity.topSpeed = defaultVal(ac.carDetail.carSku.carModel.topSpeed, '-')
        newCarActivity.plateNumber = defaultVal(ac.carDetail.plateNumber, '-')
        newCarActivity.vin = defaultVal(ac.carDetail.vin, '-')
        newCarActivity.fastChargeTime = defaultVal(ac.carDetail.carSku.carModel.fastChargeTime, '-')
        newCarActivity.owner = defaultVal(ac?.carDetail?.owner, '-')
        newCarActivity.reseller = defaultVal(ac?.carDetail?.reSeller, '-')
        newCarActivity.location = defaultVal(ac?.carDetail?.location, '-')

        if (!ac?.deliveryTask) {
          newCarActivity.deliveryAddress = defaultVal(task?.addressTh, '-')
          newCarActivity.deliveryDate = newCarActivity.startDate
        } else {
          newCarActivity.deliveryAddress = defaultVal(ac?.deliveryTask?.fullAddress, '-')
          newCarActivity.deliveryDate = defaultVal(
            formatDate(ac?.deliveryTask?.createdDate, DEFAULT_DATETIME_FORMAT),
            '-'
          )
        }

        if (!ac?.returnTask) {
          newCarActivity.returnAddress = defaultVal(task?.addressTh, '-')
          newCarActivity.returnDate = newCarActivity.endDate
        } else {
          newCarActivity.returnAddress = defaultVal(ac?.returnTask?.fullAddress, '-')
          newCarActivity.returnDate = defaultVal(
            formatDate(ac?.returnTask?.createdDate, DEFAULT_DATETIME_FORMAT),
            '-'
          )
        }

        if (newCarActivity.payments.length > 0) {
          const pay = newCarActivity.payments[0]
          newCarActivity.paymentStatus = defaultVal(pay?.status, '-')
          newCarActivity.paymentFailure = defaultVal(pay?.statusMessage, '-')
          newCarActivity.paymentUpdated = defaultVal(
            formatDate(pay?.updatedDate, DEFAULT_DATETIME_FORMAT),
            '-'
          )
        }

        csvData.push(newCarActivity)
      })
    } else {
      newBook.deliveryAddress = defaultVal(task?.addressTh, '-')
      newBook.deliveryDate = newBook.startDate
      newBook.returnAddress = defaultVal(task?.addressTh, '-')
      newBook.returnDate = newBook.endDate

      if (newBook.payments.length > 0) {
        const pay = newBook.payments[0]
        newBook.paymentStatus = defaultVal(pay?.status, '-')
        newBook.paymentFailure = defaultVal(pay?.statusMessage, '-')
        newBook.paymentUpdated = defaultVal(
          formatDate(pay?.updatedDate, DEFAULT_DATETIME_FORMAT),
          '-'
        )
      }

      csvData.push(newBook)
    }
  })

  return csvData
}
