/* eslint-disable @typescript-eslint/no-explicit-any */
import { TFunction, Namespace } from 'react-i18next'
import { formatDate, DEFAULT_DATETIME_FORMAT } from 'utils'
import { ResellerServiceArea } from 'services/web-bff/car.type'
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

export interface BookingList extends BookingObject {
  isSelfPickUp: boolean
  cars: SubscriptionCar
  carActivities: BookingCarActivity[]
  payments: BookingPayment[]
  [key: string]: any
}

export interface BookingObject {
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

export const getCsvData = (bookings: BookingList[], t: TFunction<Namespace>): BookingObject[] => {
  const csvData: BookingObject[] = []
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

export const getHeaderCsvFile = (t: TFunction<Namespace>): any[] => {
  return [
    { label: t('booking.tableHeader.detailId'), key: 'detailId' },
    { label: t('booking.tableHeader.customerId'), key: 'customerId' },
    { label: t('booking.tableHeader.firstName'), key: 'firstName' },
    { label: t('booking.tableHeader.lastName'), key: 'lastName' },
    { label: t('booking.tableHeader.email'), key: 'email' },
    { label: t('booking.tableHeader.phone'), key: 'phone' },
    { label: t('booking.tableHeader.carId'), key: 'carId' },
    { label: t('booking.tableHeader.model'), key: 'model' },
    { label: t('booking.tableHeader.brand'), key: 'brand' },
    { label: t('booking.tableHeader.seats'), key: 'seats' },
    { label: t('booking.tableHeader.topSpeed'), key: 'topSpeed' },
    { label: t('booking.tableHeader.plateNumber'), key: 'plateNumber' },
    { label: t('booking.tableHeader.vin'), key: 'vin' },
    { label: t('booking.tableHeader.fastChargeTime'), key: 'fastChargeTime' },
    { label: t('booking.tableHeader.price'), key: 'price' },
    { label: t('booking.tableHeader.duration'), key: 'duration' },
    { label: t('booking.tableHeader.startDate'), key: 'startDate' },
    { label: t('booking.tableHeader.endDate'), key: 'endDate' },
    { label: t('booking.tableHeader.deliveryAddress'), key: 'deliveryAddress' },
    { label: t('booking.tableHeader.returnAddress'), key: 'returnAddress' },
    { label: t('booking.tableHeader.statusCsv'), key: 'status' },
    { label: t('booking.tableHeader.parentId'), key: 'parentId' },
    { label: t('booking.tableHeader.isExtend'), key: 'isExtend' },
    { label: t('booking.tableHeader.location'), key: 'location' },
    { label: t('booking.tableHeader.owner'), key: 'owner' },
    { label: t('booking.tableHeader.reseller'), key: 'reseller' },
    { label: t('booking.tableHeader.voucherId'), key: 'voucherId' },
    { label: t('booking.tableHeader.voucherCode'), key: 'voucherCode' },
    { label: t('booking.tableHeader.createdDate'), key: 'createdDate' },
    { label: t('booking.tableHeader.updatedDate'), key: 'updatedDate' },
    { label: t('booking.tableHeader.paymentStatus'), key: 'paymentStatus' },
    { label: t('booking.tableHeader.paymentFailureMessage'), key: 'paymentFailureMessage' },
    { label: t('booking.tableHeader.paymentUpdatedDate'), key: 'paymentUpdatedDate' },
    { label: t('booking.tableHeader.deliveryDate'), key: 'deliveryDate' },
    { label: t('booking.tableHeader.returnDate'), key: 'returnDate' },
    { label: t('booking.tableHeader.isReplacement'), key: 'displayReplacement' },
  ]
}

const createOption = (label: string, value: string): SelectOption => {
  return {
    label: label,
    value: value,
  }
}

export const getSearchOptions = (t: TFunction<Namespace>): SelectOption[] => {
  return [
    createOption(t('booking.search.detailId'), 'bookingDetailId'),
    createOption(t('booking.search.customer'), 'customerId'),
    createOption(t('booking.search.email'), 'email'),
    createOption(t('booking.search.carId'), 'carId'),
    createOption(t('booking.search.plateNumber'), 'plateNumber'),
    createOption(t('booking.search.startDate'), 'startDate'),
    createOption(t('booking.search.endDate'), 'endDate'),
    createOption(t('booking.search.status'), 'statusList'),
    createOption(t('booking.search.isExtend'), 'isExtend'),
    createOption(t('booking.search.voucherId'), 'voucherId'),
    createOption(t('booking.search.deliveryDate'), 'deliveryDate'),
    createOption(t('booking.search.returnDate'), 'returnDate'),
  ]
}
