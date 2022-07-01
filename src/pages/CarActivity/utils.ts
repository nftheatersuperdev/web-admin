import { TFunction, Namespace } from 'react-i18next'
import ls from 'localstorage-slim'

interface SelectOption {
  label: string
  value: string
}

const STORAGE_KEYS = {
  VISIBILITY_COLUMNS: 'evme:car:visibility_columns',
}

export const CarStatus = {
  PUBLISHED: 'published',
  AVAILABLE: 'available',
  OUT_OF_SERVICE: 'out_of_service',
}

export const defaultVisibilityColumns: VisibilityColumns = {
  firstName: true,
  lastName: true,
  email: true,
  phoneNumber: true,
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
]

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
