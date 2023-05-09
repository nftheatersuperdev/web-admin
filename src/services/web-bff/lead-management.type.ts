import { ResponseWithPagination } from './response.type'

export interface Lead {
  id: string
  name: string
  banner_image: string
  titleTh: string
  titleEn: string
  descriptionTh: string
  descriptionEn: string
  createdDate: string
  updatedDate: string
}

export interface LeadSearchBodyProps {
  page?: number
  size?: number
  sortBy?: string
  sortDirection?: string
  nameContain?: string
}

export type LeadSearchResponse = {
  data: {
    leads: Lead[]
  }
} & ResponseWithPagination
