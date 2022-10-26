import { ResponseWithPagination } from './response.type'

export interface CookieConsentLogListProps {
  ipAddress?: string
  category?: string
  isAccepted?: string
  size?: number
  page?: number
}

export interface CookieConsentLog {
  id: string
  sessionId: string
  ipAddress: string
  cookieContent: ContentCategory
  isAccepted: boolean
  createdDate: string
}

export interface ContentCategory {
  id: string
  category: string
  nameTh: string
  nameEn: string
  descriptionTh?: string
  descriptionEn?: string
  version: number
  effectiveDate: string
}

export type CookieConsentLogListResponse = {
  data: {
    cookieConsents: CookieConsentLog[]
  }
} & ResponseWithPagination

export interface CookieConsentCategoryListResponse {
  data: {
    contents: ContentCategory[]
  }
}
