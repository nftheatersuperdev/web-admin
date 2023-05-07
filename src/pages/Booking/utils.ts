import { TFunction, Namespace } from 'react-i18next'
import ls from 'localstorage-slim'
import { CarOwnerResponse } from 'services/web-bff/car-owner.type'
import { ReSellerResponse } from 'services/web-bff/re-seller-area.type'
import { LocationResponse } from 'services/web-bff/location.type'

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

export interface BookingList {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  brand: string
  model: string
  plateNumber: string
  duration: string
  status: string
  startDate: string
  endDate: string
  [key: string]: string
}

export interface BookingCsv {
  firstName: string
  lastName: string
  email: string
  phone: string
  brand: string
  model: string
  plateNumber: string
  duration: string
  status: string
  startDate: string
  endDate: string
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
