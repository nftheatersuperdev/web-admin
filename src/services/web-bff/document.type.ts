import { User } from 'services/web-bff/user.type'
import { ResponseWithPagination } from 'services/web-bff/response.type'

export interface Document {
  id: string
  codeName: string
  nameEn: string
  nameTh: string
  contentEn: string
  contentTh: string
  version: number
  remark: string
  accepted: string
  effectiveDate: string
  createdBy: User['id']
  createdDate: string
  updatedDate: string
}

export interface GetDocumentProps {
  page: number
  size: number
}

export type DocumentListResponse = {
  data: {
    documents: Document[]
  }
} & ResponseWithPagination
