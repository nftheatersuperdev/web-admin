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
  status: 'Active' | 'Inactive'
  remark: string | null
  accepted: string
  effectiveDate: string
  createdBy: User['id']
  createdDate: string
  updatedDate: string
}

export interface GetDocumentProps {
  code: string
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
  contentEn: string
  contentTh: string
  effectiveDate: string
  remark?: string | null
}

export type DocumentListResponse = {
  data: {
    documents: Document[]
  }
} & ResponseWithPagination

export type DocumentVersionListResponse = {
  data: {
    versions: Document[]
  }
} & ResponseWithPagination
