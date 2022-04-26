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
  MANUAL_EXTENDED: 'manual_extended',
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

    case SubEventStatus.MANUAL_EXTENDED:
      return t('subscription.status.manual_extended')

    default:
      return '-'
  }
}

export const PaymentEventStatus = {
  PENDING: 'pending',
  SUCCESSFUL: 'success',
  FAILED: 'failed',
  AUTHORIZED_REFUND: 'authorized_refund',
}

export const columnFormatPaymentEventStatus = (status: string, t: TFunction<Namespace>): string => {
  switch (status) {
    case PaymentEventStatus.PENDING:
      return t('paymentEvent.status.pending')

    case PaymentEventStatus.SUCCESSFUL:
      return t('paymentEvent.status.successful')

    case PaymentEventStatus.FAILED:
      return t('paymentEvent.status.failed')

    case PaymentEventStatus.AUTHORIZED_REFUND:
      return t('paymentEvent.status.authorizedRefund')

    default:
      return '-'
  }
}

interface SelectOption {
  label: string
  value: string
}

export const getSubEventStatusOptions = (t: TFunction<Namespace>): SelectOption[] => [
  {
    label: t('subscription.status.reserved'),
    value: SubEventStatus.RESERVED,
  },
  {
    label: t('subscription.status.accepted'),
    value: SubEventStatus.ACCEPTED,
  },
  {
    label: t('subscription.status.delivered'),
    value: SubEventStatus.DELIVERED,
  },
  {
    label: t('subscription.status.cancelled'),
    value: SubEventStatus.CANCELLED,
  },
  {
    label: t('subscription.status.upcoming_cancelled'),
    value: SubEventStatus.UPCOMING_CANCELLED,
  },
  {
    label: t('subscription.status.refused'),
    value: SubEventStatus.REFUSED,
  },
  {
    label: t('subscription.status.completed'),
    value: SubEventStatus.COMPLETED,
  },
  {
    label: t('subscription.status.extended'),
    value: SubEventStatus.EXTENDED,
  },
]

const STORAGE_KEYS = {
  VISIBILITY_COLUMNS: 'evme:subscription:visibility_columns',
}

export interface VisibilityColumns {
  [key: string]: boolean
}

export const defaultVisibilityColumns: VisibilityColumns = {
  id: true,
  userFirstName: true,
  userLastName: true,
  userEmail: true,
  userPhoneNumber: true,
  carId: true,
  carName: true,
  carBrand: true,
  carPlateNumber: true,
  carVin: false,
  carSeats: false,
  carTopSpeed: false,
  carFastChargeTime: false,
  price: true,
  duration: true,
  startDate: true,
  endDate: true,
  deliveryAddress: false,
  returnAddress: false,
  status: true,
  voucherCode: false,
  paymentVersion: false,
  createdDate: false,
  updatedDate: false,
  paymentStatus: false,
  deliveryDate: false,
  returnDate: false,
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
