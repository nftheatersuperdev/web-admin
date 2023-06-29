import { TFunction, Namespace } from 'react-i18next'
import ls from 'localstorage-slim'
import { SelectOption } from 'utils'
import { CarOwnerResponse } from 'services/web-bff/car-owner.type'
import { ReSellerResponse } from 'services/web-bff/re-seller-area.type'
import { LocationResponse } from 'services/web-bff/location.type'

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

export const getCarStatusOnlyUsedInBackendOptions = (t: TFunction<Namespace>): SelectOption[] => [
  {
    label: t('car.statuses.published'),
    value: CarStatus.PUBLISHED,
  },
  {
    label: t('car.statuses.outOfService'),
    value: CarStatus.OUT_OF_SERVICE,
  },
]

export const columnFormatCarStatus = (status: string, t: TFunction<Namespace>): string => {
  if (!status) {
    return '-'
  }

  const enforceStatus = status.toLocaleLowerCase().replaceAll(' ', '_')
  switch (enforceStatus) {
    case CarStatus.AVAILABLE:
      return t('car.statuses.available')

    case CarStatus.OUT_OF_SERVICE:
      return t('car.statuses.outOfService')

    case CarStatus.PUBLISHED:
      return t('car.statuses.published')

    case CarStatus.IN_USE:
      return t('car.statuses.inUse')

    case CarStatus.RESERVED:
      return t('car.statuses.reserved')

    case CarStatus.ACCEPTED:
      return t('car.statuses.accepted')

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

export interface CarList {
  id: string
  carTrackId: string
  brand: string
  model: string
  color: string
  plateNumber: string
  vin: string
  status: string
  createdDate: string
  [key: string]: string
}

export interface CarCsv {
  carTrackId: string
  location: string
  brand: string
  model: string
  color: string
  plateNumber: string
  status: string
  owner: string
  reseller: string
  createdDate: string
}
export interface FilterSearch {
  [key: string]: string
}

export enum Keypress {
  ENTER = 'Enter',
}

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
