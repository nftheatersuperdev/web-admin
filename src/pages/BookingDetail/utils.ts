import { TFunction, Namespace } from 'react-i18next'
import { BookingRental } from 'services/web-bff/booking.type'

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

interface DeliveryTask {
  latitude: number
  longitude: number
  date: string
  fullAddress: string
  remark: string
  createdDate: string
}

interface ReturnTask {
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

const defaultServiceType = [
  {
    id: '',
    resellerServiceAreaId: '',
    serviceType: '',
    isActive: false,
    addressTh: '',
    addressEn: '',
    latitude: 0,
    longitude: 0,
    distance: 0,
  },
]

export const defaultBookingDetail = (): BookingRental => ({
  id: '',
  bookingId: '',
  bookingTypeId: '',
  startDate: '',
  endDate: '',
  car: {
    id: '',
    plateNumber: '',
    vin: '',
    carTrackId: '',
    isActive: false,
    carSku: {
      id: '',
      images: [],
      carModel: {
        id: '',
        connectorTypes: [],
        name: '',
        bodyType: '',
        brand: {
          name: '',
          imageUrl: '',
        },
        carSkus: [],
        chargers: [],
        year: 0,
        chargeTime: 0,
        acceleration: 0,
        batteryCapacity: 0,
        fastChargeTime: 0,
        horsePower: 0,
        priority: 0,
        range: 0,
        topSpeed: 0,
        totalPower: 0,
        totalTorque: 0,
        seats: 0,
        segment: '',
        subModelName: '',
        condition: '',
        rentalPackages: null,
        createdDate: '',
        updatedDate: '',
      },
      color: '',
      colorHex: '',
      createdDate: '',
      updatedDate: '',
    },
    resellerServiceArea: {
      id: '',
      businessId: '',
      areaNameTh: '',
      areaNameEn: '',
      serviceTypeLocations: defaultServiceType,
    },
    createdDate: '',
    updatedDate: '',
  },
  carId: '',
  carTasks: [],
  carActivities: [],
  createdBy: '',
  customer: {
    id: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
  },
  customerId: '',
  displayStatus: '',
  status: '',
  isExtend: false,
  isReplacement: false,
  isPaymentRequired: false,
  isTimeslotRequired: false,
  rentDetail: {
    id: '',
    agreementId: '',
    bookingDetailId: '',
    voucherId: '',
    voucherCode: '',
    packagePriceId: '',
    chargePrice: 0,
    tenantPrice: 0,
    currency: '',
    discountPrice: '',
    durationDay: 0,
    isAcceptedAgreement: false,
    isAcceptedCarCondition: false,
    paymentTerm: '',
    status: '',
    createdDate: '',
    updatedDate: '',
  },
  remark: '',
  payments: [],
  updatedBy: '',
  isSelfPickUp: false,
  createdDate: '',
  updatedDate: '',
})

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
