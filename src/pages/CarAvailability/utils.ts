import { TFunction, Namespace } from 'react-i18next'
import ls from 'localstorage-slim'

const STORAGE_KEYS = {
  VISIBILITY_COLUMNS: 'evme:car:visibility_columns',
}

export const CarStatus = {
  PUBLISHED: 'published',
  AVAILABLE: 'available',
  OUT_OF_SERVICE: 'out_of_service',
}

export const defaultVisibilityColumns: VisibilityColumns = {
  location: true,
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

export const columnFormatCarStatus = (status: string, t: TFunction<Namespace>): string => {
  const enforceStatus = status.toLocaleLowerCase().replaceAll(' ', '_')

  switch (enforceStatus) {
    case CarStatus.AVAILABLE:
      return t('car.statuses.available')

    case CarStatus.OUT_OF_SERVICE:
      return t('car.statuses.outOfService')

    case CarStatus.PUBLISHED:
      return t('car.statuses.published')

    default:
      return '-'
  }
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
export interface SelectOption {
  key: string
  name: string
  value: string
  isDefault?: boolean
}

export const getSearchTypeList = (t: TFunction<Namespace>): SelectOption[] => {
  return [
    {
      key: 'carId',
      value: 'carId',
      name: t('carAvailabilityDetail.carId'),
    },
    {
      key: 'plateNumber',
      value: 'plateNumber',
      name: t('carAvailabilityDetail.plateNumber'),
    },
    {
      key: 'owner',
      value: 'ownerProfileId',
      name: t('carAvailabilityDetail.owner'),
    },
    {
      key: 'reseller',
      value: 'resellerServiceAreaId',
      name: t('carAvailabilityDetail.reSeller'),
    },
  ]
}
