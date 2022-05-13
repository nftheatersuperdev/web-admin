import ls from 'localstorage-slim'

const STORAGE_KEYS = {
  VISIBILITY_COLUMNS: 'evme:vouchers:visibility_columns',
}

export const events = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
}

export const defaultVisibilityColumns: VisibilityColumns = {
  id: false,
  code: true,
  description: true,
  discountPercent: true,
  amount: true,
  limitPerUser: true,
  startAt: true,
  endAt: true,
  createdAt: false,
  updatedAt: false,
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
