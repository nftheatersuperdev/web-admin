import ls from 'localstorage-slim'

const STORAGE_KEYS = {
  VISIBILITY_COLUMNS: 'evme:voucher-events:visibility_columns',
}

export const defaultVisibilityColumns: VisibilityColumns = {
  id: false,
  code: true,
  event: true,
  descriptionEn: false,
  descriptionTh: false,
  percentDiscount: false,
  amount: false,
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
