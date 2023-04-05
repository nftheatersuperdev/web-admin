import { TFunction, Namespace } from 'react-i18next'
import ls from 'localstorage-slim'

const STORAGE_KEYS = {
  VISIBILITY_COLUMNS: 'evme:car:visibility_columns',
}

export enum ActivityServices {
  Subscription = 'subscription',
  PreventiveMaintenance = 'preventiveMaintenance',
  Reserved = 'reserved',
  PR = 'PR',
  Marketing = 'marketing',
  Breakdown = 'breakdown',
  Repair = 'repair',
  Internal = 'internal',
  Carpool = 'carpool',
  B2BDelivered = 'b2bDelivered',
  B2BPendingDelivered = 'b2bPendingDelivered',
  RedPlate = 'redPlate',
  Other = 'other',
}

export interface ActivityService {
  id: string
  label: string
}

export const useActivityServiceList = (t: TFunction<Namespace>): ActivityService[] => {
  const services: ActivityService[] = [
    {
      id: 'subscription',
      label: t('carActivity.statuses.subscription'),
    },
    {
      id: 'preventiveMaintenance',
      label: t('carActivity.statuses.preventiveMaintenance'),
    },
    {
      id: 'reserved',
      label: t('carActivity.statuses.reserved'),
    },
    {
      id: 'pr',
      label: t('carActivity.statuses.pr'),
    },
    {
      id: 'marketing',
      label: t('carActivity.statuses.marketing'),
    },
    {
      id: 'breakdown',
      label: t('carActivity.statuses.breakdown'),
    },
    {
      id: 'repair',
      label: t('carActivity.statuses.repair'),
    },
    {
      id: 'internal',
      label: t('carActivity.statuses.internal'),
    },
    {
      id: 'carpool',
      label: t('carActivity.statuses.carpool'),
    },
    {
      id: 'b2bDelivered',
      label: t('carActivity.statuses.b2bDelivered'),
    },
    {
      id: 'b2bPendingDelivered',
      label: t('carActivity.statuses.b2bPendingDelivered'),
    },
    {
      id: 'redPlate',
      label: t('carActivity.statuses.redPlate'),
    },
    {
      id: 'other',
      label: t('carActivity.statuses.other'),
    },
  ]
  return services
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
