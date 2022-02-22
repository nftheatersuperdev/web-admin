export interface Pagination {
  size: number
  totalPage: number
  totalRecords: number
}

export interface Response {
  status: 'success' | 'error'
  data: unknown
}

export interface ResponseWithPagination extends Response {
  data: {
    pagination: Pagination
  }
}
