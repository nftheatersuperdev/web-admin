import { ResponseWithPagination } from './response.type'

export interface ConsentLogListProps {
  email?: string
  codeName?: string
  isAccepted?: string
  size?: number
  page?: number
}

export interface ConsentInputRequest {
  email?: string
  codeName?: string
  isAccepted?: string
}

export interface ConsentLogListRequest {
  data?: ConsentInputRequest
  size?: number
  page?: number
}

export interface ConsentLog {
  id: string
  createdDate: string
  isAccepted: boolean
  customer: CustomerConsentLog
  documentContent: DocumentConsentLog
}

export interface CustomerConsentLog {
  id: string
  email: string
  firstName: string
  lastName: string
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
