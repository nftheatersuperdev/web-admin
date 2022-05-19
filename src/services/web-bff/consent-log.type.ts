import { ResponseWithPagination } from './response.type'

export interface ConsentLogListProps {
  email?: string
  codeName?: string
  isAccepted?: string
  size?: number
  pageIndex?: number
}

export interface ConsentLog {
  id: string
  createdDate: string
  isAccepted: boolean
  customer: CustomerConsentLog
  document: DocumentConsentLog
}

export interface CustomerConsentLog {
  id: string
  email: string
  firstname: string
  lastname: string
  phoneNumber: string
}

export interface DocumentConsentLog {
  id: string
  nameTh: string
  nameEn: string
  version: number
  effectiveDate: string
  updatedDate: string
  createdBy: string
}

export type ConsentLogListResponse = {
  data: {
    agreements: ConsentLog[]
  }
} & ResponseWithPagination
