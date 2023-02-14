import dayjs from 'dayjs'
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
  status: 'Active' | 'Inactive' | 'Scheduled'
  remark: string | null
  accepted: string
  effectiveDate: string
  createdBy: User['id']
  createdDate: string
  updatedDate: string
}
export interface DocumentType {
  codeName: string
  nameTh: string
  nameEn: string
}

export interface GetDocumentVersionProps {
  code: string
  version?: number
}

export interface GetDocumentsProps {
  page: number
  size: number
}

export interface GetDocumentVersionsProps {
  code: string
  page: number
  size: number
}

export interface CreateOrUpdateDocumentInput {
  code?: string | undefined
  version?: number | undefined
  contentEn?: string | undefined
  contentTh?: string | undefined
  effectiveDate: string | dayjs.Dayjs
  remark?: string | null
}

export type DocumentListResponse = {
  data: {
    documents: Document[]
  }
} & ResponseWithPagination

export type DocumentTypeListResponse = {
  data: {
    documents: DocumentType[]
  }
} & ResponseWithPagination

export type DocumentVersionListResponse = {
  data: {
    versions: Document[]
  }
} & ResponseWithPagination

export interface ResponseError {
  data?: string | null
  message: string
  status: string
}
