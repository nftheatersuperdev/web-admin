export interface Pagination {
  page: number
  size: number
  totalPage: number
  totalRecords: number
}

export interface Response {
  status: 'success' | 'error'
  data: unknown
  message: string
}

export interface ResponseWithPagination extends Response {
  data: {
    pagination: Pagination
  }
}
