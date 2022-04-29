import { TFunction, Namespace } from 'react-i18next'
import ls from 'localstorage-slim'
import { compareDateIsAfter, compareDateIsBefore } from 'utils'
import { Payment } from 'services/web-bff/payment.type'

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
]

export const getIsParentOptions = (t: TFunction<Namespace>): SelectOption[] => [
  {
    label: t('subscription.isParentValue'),
    value: 'true',
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
  price: false,
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
  failureMessage: false,
  paymentCreateDate: false,
  parentId: false,
  isParent: false,
}

export const getListFromQueryParam = (queryString: URLSearchParams, valueKey: string): string[] => {
  const results: string[] = []
  queryString.forEach((value, key) => {
    if (key.indexOf(valueKey) > -1) {
      results.push(value)
    }
  })

  return results
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

export const getLastedPayment = (payments: Payment[]): Payment => {
  if (payments && payments.length === 0) {
    return {} as Payment
  }
  const sortedList = [...payments].sort((n1, n2) => {
    if (compareDateIsBefore(n1.updatedDate, n2.updatedDate)) {
      return 1
    }

    if (compareDateIsAfter(n1.updatedDate, n2.updatedDate)) {
      return -1
    }

    return 0
  })

  return sortedList.length > 0 ? sortedList[0] : ({} as Payment)
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
