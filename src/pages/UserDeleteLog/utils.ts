import ls from 'localstorage-slim'
import { Namespace, TFunction } from 'react-i18next'

export interface VisibilityColumns {
  [key: string]: boolean
}
const STORAGE_KEYS = {
  VISIBILITY_COLUMNS: 'evme:user_delete_log:visibility_columns',
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

export const getSearchTypeList = (t: TFunction<Namespace>): SelectOption[] => {
  return [
    {
      key: 'userId',
      value: 'userId',
      label: t('userDeleteLog.userId'),
      isDefault: true,
    },
    {
      key: 'email',
      value: 'email',
      label: t('userDeleteLog.email'),
    },
    {
      key: 'firstName',
      value: 'firstName',
      label: t('userDeleteLog.firstName'),
    },
    {
      key: 'lastName',
      value: 'lastName',
      label: t('userDeleteLog.lastName'),
    },
  ]
}

export const defaultVisibilityColumns: VisibilityColumns = {
  userId: true,
  email: true,
  firstName: true,
  lastName: true,
  createdDate: true,
  action: true,
  createdBy: true,
}
export const getVisibilityColumns = (): VisibilityColumns => {
  return (
    ls.get<VisibilityColumns | undefined>(STORAGE_KEYS.VISIBILITY_COLUMNS) ||
    defaultVisibilityColumns
  )
}
