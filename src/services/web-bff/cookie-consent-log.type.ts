import { ResponseWithPagination } from './response.type'

export interface CookieConsentLogListProps {
  ipAddress?: string
  category?: string
  isAccepted?: string
  size?: number
  page?: number
}

export interface CookieContent {
  id: string
  category: string
  nameTh: string
  nameEn: string
  descriptionTh: string
  descriptionEn: string
  version: number
  effectiveDate: string
}

export interface CookieConsentLog {
  id: string
  ipAddress: string
  status: string
  sessionId: string
  createdDate: string
  cookieContent: CookieContent
}

export interface ContentCategory {
  id: string
  category: string
  nameTh: string
  nameEn: string
  descriptionTh: string
  descriptionEn: string
  version: number
  effectiveDate: string
}

export type CookieConsentLogListResponse = {
  data: {
    consents: CookieConsentLog[]
  }
} & ResponseWithPagination

export interface CookieConsentCategoryListResponse {
  data: {
    contents: ContentCategory[]
  }
}
