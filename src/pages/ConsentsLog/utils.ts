import { TFunction, Namespace } from 'react-i18next'
import ls from 'localstorage-slim'

export interface VisibilityColumns {
  [key: string]: boolean
}
const STORAGE_KEYS = {
  VISIBILITY_COLUMNS: 'evme:consent_log:visibility_columns',
}

export const setVisibilityColumns = (columns: VisibilityColumns): void => {
  ls.set<VisibilityColumns>(STORAGE_KEYS.VISIBILITY_COLUMNS, columns)
}

export interface SelectOption {
  key: string
  label: string
  value: string
  isDefault?: boolean
}

export const getStatusList = (t: TFunction<Namespace>): SelectOption[] => {
  return [
    {
      key: 'all',
      value: 'all',
      label: t('all'),
      isDefault: true,
    },
    {
      key: 'accept',
      value: 'True',
      label: t('consentLog.documentStatus.accept'),
    },
    {
      key: 'decline',
      value: 'False',
      label: t('consentLog.documentStatus.decline'),
    },
  ]
}

export const defaultVisibilityColumns: VisibilityColumns = {
  userId: true,
  email: true,
  firstName: false,
  lastName: false,
  phoneNumber: false,
  documentNameEn: true,
  documentNameTh: true,
  acceptedDate: true,
  status: true,
  documentVersion: true,
}
export const getVisibilityColumns = (): VisibilityColumns => {
  return (
    ls.get<VisibilityColumns | undefined>(STORAGE_KEYS.VISIBILITY_COLUMNS) ||
    defaultVisibilityColumns
  )
}