import { TFunction, Namespace } from 'react-i18next'
import ls from 'localstorage-slim'

export const SubEventStatus = {
  RESERVED: 'reserved',
  ACCEPTED: 'accepted',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  UPCOMING_CANCELLED: 'upcoming_cancelled',
  REFUSED: 'refused',
  COMPLETED: 'completed',
  EXTENDED: 'extended',
}

export const columnFormatSubEventStatus = (status: string, t: TFunction<Namespace>): string => {
  switch (status) {
    case SubEventStatus.RESERVED:
      return t('subscription.status.reserved')

    case SubEventStatus.ACCEPTED:
      return t('subscription.status.accepted')

    case SubEventStatus.DELIVERED:
      return t('subscription.status.delivered')

    case SubEventStatus.CANCELLED:
      return t('subscription.status.cancelled')

    case SubEventStatus.UPCOMING_CANCELLED:
      return t('subscription.status.upcoming_cancelled')

    case SubEventStatus.REFUSED:
      return t('subscription.status.refused')

    case SubEventStatus.COMPLETED:
      return t('subscription.status.completed')

    case SubEventStatus.EXTENDED:
      return t('subscription.status.extended')

    default:
      return '-'
  }
}

const STORAGE_KEYS = {
  VISIBILITY_COLUMNS: 'evme:subscription:visibility_columns',
}

export interface VisibilityColumns {
  [key: string]: boolean
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
  plateNumber: false,
  vin: false,
  fastChargeTime: false,
  startDate: false,
  endDate: false,
  startAddress: false,
  endAddress: false,
  createdAt: false,
}

export const setVisibilityColumns = (columns: VisibilityColumns): void => {
  ls.set<VisibilityColumns>(STORAGE_KEYS.VISIBILITY_COLUMNS, columns)
}

export const getVisibilityColumns = (): VisibilityColumns => {
  return (
    ls.get<VisibilityColumns | undefined>(STORAGE_KEYS.VISIBILITY_COLUMNS) ||
    defaultVisibilityColumns
  )
}
