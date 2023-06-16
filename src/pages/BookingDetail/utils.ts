import { TFunction, Namespace } from 'react-i18next'
import { BookingRental, BookingCarActivity } from 'services/web-bff/booking.type'

export interface BookingDetailParams {
  bookingId: string
  bookingDetailId: string
}

export interface BookingPart {
  detailId: string
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

export interface DeliveryTask {
  latitude: number
  longitude: number
  date: string
  fullAddress: string
  remark: string
  createdDate: string
}

export interface ReturnTask {
  latitude: number
  longitude: number
  date: string
  fullAddress: string
  remark: string
}
export interface DefaultCarDetail {
  no: number
  carId: string
  location: string
  brand: string
  model: string
  colour: string
  plateNumber: string
  pickupDate: string
  returnDate: string
  serviceType: boolean
  owner: string
  reseller: string
  deliveryTask: DeliveryTask
  returnTask: ReturnTask
  [key: string]: string | number | boolean | DeliveryTask | ReturnTask
}

export const BookingStatus = {
  RESERVED: 'reserved',
  ACCEPTED: 'accepted',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  UPCOMING_CANCELLED: 'upcoming_cancelled',
  REFUSED: 'refused',
  COMPLETED: 'completed',
  EXTENDED: 'extended',
  MANUAL_EXTENDED: 'manual_extended',
}

const initialCarDetail = (): DefaultCarDetail => {
  return {
    no: 0,
    carId: '',
    location: '',
    brand: '',
    model: '',
    colour: '',
    plateNumber: '',
    pickupDate: '',
    returnDate: '',
    serviceType: false,
    owner: '',
    reseller: '',
    deliveryTask: {
      latitude: 0,
      longitude: 0,
      date: '',
      fullAddress: '',
      remark: '',
      createdDate: '',
    },
    returnTask: {
      latitude: 0,
      longitude: 0,
      date: '',
      fullAddress: '',
      remark: '',
    },
  }
}

export const convertToDuration = (value: number | undefined, t: TFunction<Namespace>): string => {
  if (value === undefined) {
    return '-'
  }

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

export const columnFormatBookingStatus = (
  status: string | undefined,
  t: TFunction<Namespace>
): string => {
  switch (status) {
    case BookingStatus.RESERVED:
      return t('subscription.status.reserved')

    case BookingStatus.ACCEPTED:
      return t('subscription.status.accepted')

    case BookingStatus.DELIVERED:
      return t('subscription.status.delivered')

    case BookingStatus.CANCELLED:
      return t('subscription.status.cancelled')

    case BookingStatus.UPCOMING_CANCELLED:
      return t('subscription.status.upcoming_cancelled')

    case BookingStatus.REFUSED:
      return t('subscription.status.refused')

    case BookingStatus.COMPLETED:
      return t('subscription.status.completed')

    case BookingStatus.EXTENDED:
      return t('subscription.status.extended')

    case BookingStatus.MANUAL_EXTENDED:
      return t('subscription.status.manual_extended')

    default:
      return t('booking.statuses.unknown')
  }
}

export const formatIsExtend = (isExtend: boolean | undefined): string => {
  if (isExtend) {
    return 'Yes'
  }
  return 'No'
}

export function hasStatusAllowedToDoCarReplacement(status: string): boolean {
  if (!status) {
    return false
  }
  return [BookingStatus.ACCEPTED, BookingStatus.DELIVERED].includes(status.toLowerCase())
}

export function getMaxEndDate(bookingDetails: BookingRental[] | undefined): Date {
  let endDate = new Date()
  if (bookingDetails && bookingDetails.length > 0) {
    endDate = new Date(
      Math.max(...bookingDetails.map((bookingDetail) => new Date(bookingDetail.endDate).getTime()))
    )
  }
  return endDate
}

export function getBookingDetail(
  bookingDetails: BookingRental[] | undefined,
  bookingDetailId: string
): BookingRental {
  let bookingDetail = {} as BookingRental
  if (bookingDetails && bookingDetails.length > 0) {
    const detail = bookingDetails.find((booking) => booking.id === bookingDetailId)
    if (detail) {
      bookingDetail = detail
    }
  }
  return bookingDetail
}

// eslint-disable-next-line
export const defaultVal = (value: any, defaultValue?: any) => {
  if (value) {
    return value
  }

  return defaultValue
}

const createCarDetailFromCarActivity = (
  car: BookingCarActivity,
  booking: BookingRental,
  index: number
): DefaultCarDetail => {
  const carDetail = initialCarDetail()

  carDetail.no = index + 1
  carDetail.carId = defaultVal(car.carId, '-')
  carDetail.location = defaultVal(car?.carDetail?.resellerServiceArea?.areaNameEn, '-')
  carDetail.brand = defaultVal(car?.carDetail?.carSku?.carModel?.brand?.name, '-')
  carDetail.model = defaultVal(car?.carDetail?.carSku?.carModel?.name, '-')
  carDetail.colour = defaultVal(car?.carDetail?.carSku?.color, '-')
  carDetail.plateNumber = defaultVal(car?.carDetail?.plateNumber, '-')
  carDetail.pickupDate = defaultVal(car?.deliveryTask?.date, '-')
  carDetail.returnDate = defaultVal(car?.returnTask?.date, '-')
  carDetail.serviceType = defaultVal(booking?.isSelfPickUp, false)
  carDetail.owner = defaultVal(car?.carDetail?.owner, '-')
  carDetail.reseller = defaultVal(car?.carDetail?.reSeller, '-')
  carDetail.deliveryTask.latitude = defaultVal(car?.deliveryTask?.latitude, '-')
  carDetail.deliveryTask.longitude = defaultVal(car?.deliveryTask?.longitude, '-')
  carDetail.deliveryTask.fullAddress = defaultVal(car?.deliveryTask?.fullAddress, '-')
  carDetail.deliveryTask.date = defaultVal(car?.deliveryTask?.date, '-')
  carDetail.deliveryTask.createdDate = defaultVal(car?.deliveryTask?.createdDate, '-')
  carDetail.deliveryTask.remark = defaultVal(car?.deliveryTask?.remark, '-')
  carDetail.returnTask.latitude = defaultVal(car?.returnTask?.latitude, 0)
  carDetail.returnTask.longitude = defaultVal(car?.returnTask?.longitude, 0)
  carDetail.returnTask.fullAddress = defaultVal(car?.returnTask?.fullAddress, '-')
  carDetail.returnTask.date = defaultVal(car?.returnTask?.date, '-')
  carDetail.returnTask.remark = defaultVal(car?.returnTask?.remark, '-')

  return carDetail
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

const createCarDetailFromCar = (booking: BookingRental, index: number): DefaultCarDetail => {
  const car = booking?.car
  const carDetail = initialCarDetail()
  const task = getServiceTypeLocation(
    car.resellerServiceArea.serviceTypeLocations,
    booking.isSelfPickUp
  )

  carDetail.no = index + 1
  carDetail.carId = defaultVal(booking?.carId, '-')
  carDetail.location = defaultVal(car?.location, '-')
  carDetail.brand = defaultVal(car?.carSku?.carModel?.brand?.name, '-')
  carDetail.model = defaultVal(car?.carSku?.carModel?.name, '-')
  carDetail.colour = defaultVal(car?.carSku?.color, '-')
  carDetail.plateNumber = defaultVal(car?.plateNumber, '-')
  carDetail.pickupDate = defaultVal(booking?.startDate, '-')
  carDetail.returnDate = defaultVal(booking?.endDate, '-')
  carDetail.serviceType = defaultVal(booking?.isSelfPickUp, false)
  carDetail.owner = defaultVal(car?.owner, '-')
  carDetail.reseller = defaultVal(car?.reSeller, '-')
  carDetail.deliveryTask.latitude = defaultVal(task?.latitude, '-')
  carDetail.deliveryTask.longitude = defaultVal(task?.longitude, '-')
  carDetail.deliveryTask.fullAddress = defaultVal(task?.addressTh, '-')
  carDetail.deliveryTask.date = defaultVal(booking?.startDate, '-')
  carDetail.deliveryTask.createdDate = defaultVal(booking?.createdDate, '-')
  carDetail.deliveryTask.remark = defaultVal(booking?.remark, '-')
  carDetail.returnTask.latitude = defaultVal(task?.latitude, 0)
  carDetail.returnTask.longitude = defaultVal(task?.longitude, 0)
  carDetail.returnTask.fullAddress = defaultVal(task?.addressTh, '-')
  carDetail.returnTask.date = defaultVal(booking?.endDate, '-')
  carDetail.returnTask.remark = defaultVal(booking?.remark, '-')

  return carDetail
}

export const checkDateOverToday = (bookingDetail: BookingRental | undefined): boolean => {
  if (bookingDetail) {
    return new Date(bookingDetail?.endDate) < new Date()
  }
  return false
}

export const getResellerServiceAreaId = (state: string, localReseller: string): string | null => {
  return state || localReseller || null
}

export const getCarActivities = (
  bookingDetail: BookingRental | undefined
): BookingCarActivity[] => {
  if (bookingDetail?.carActivities) {
    return bookingDetail.carActivities.reverse()
  }
  return [{} as BookingCarActivity]
}

export const getCarDetails = (
  carActivities: BookingCarActivity[],
  bookingDetail: BookingRental
): DefaultCarDetail[] => {
  if (carActivities.length > 0) {
    return carActivities.map((carActivity, index) =>
      createCarDetailFromCarActivity(carActivity, bookingDetail, index)
    )
  }

  if (bookingDetail?.car) {
    return [createCarDetailFromCar(bookingDetail, 0)]
  }

  return []
}

export const permissionToReplacement = (
  bookingDetail: BookingRental,
  isAllowToDoCarReplacement: boolean,
  isTherePermissionToDoCarReplacement: boolean,
  isEndDateOverToday: boolean
): boolean => {
  return (
    !bookingDetail ||
    !isAllowToDoCarReplacement ||
    !isTherePermissionToDoCarReplacement ||
    isEndDateOverToday
  )
}
