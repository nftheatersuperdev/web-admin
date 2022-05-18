import ls from 'localstorage-slim'

const STORAGE_KEYS = {
  VISIBILITY_COLUMNS: 'evme:car-model_pricing:visibility_columns',
}

export const defaultVisibilityColumns: VisibilityColumns = {
  id: true,
  brand: true,
  name: true,
  createdDate: true,
  updatedDate: true,
  actions: true,
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
