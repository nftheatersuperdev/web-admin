import ls from 'localstorage-slim'

const STORAGE_KEYS = {
  VISIBILITY_COLUMNS: 'evme:user:visibility_columns',
}

export const defaultVisibilityColumns: VisibilityColumns = {
  id: false,
  code: true,
  description: true,
  percentDiscount: true,
  amount: true,
  limitPerUser: false,
  startAt: false,
  endAt: false,
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
