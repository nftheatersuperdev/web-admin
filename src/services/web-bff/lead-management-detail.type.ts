import { ResponseWithPagination } from './response.type'

export interface LeadFormSubmissions {
  id: string
  no: number
  firstName: string
  lastName: string
  phoneNumber: string
  email: string
  leadSource: string
  interesting: string
  timeline: string
  createdDate: string
}

export interface LeadFormSubmissionsBodyProps {
  leadFormId: string
  page?: number
  size?: number
  sortBy?: string
  sortDirection?: string
}

export type LeadFormSubmissionsResponse = {
  data: {
    leadFormSubmissions: LeadFormSubmissions[]
  }
} & ResponseWithPagination
