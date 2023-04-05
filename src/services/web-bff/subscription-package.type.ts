import { ResponseWithPagination } from 'services/web-bff/response.type'

export interface SubscriptionPackageListParamsProps {
  page: number
  size: number
}

export interface SubscriptionPackage {
  id: string
  badge: string
  publishDate: string
  is_display: boolean
  full_price: number
  price: number
  periodMonth: number
  list_banner: string
  nameEn: string
  feature_en: string
  name_th: string
  feature_th: string
  detail_banner: string
  description_en: string
  description_th: string
  created_by: string
  created_date: string
  updated_date: string
  status: string
}

export type SubscriptionPackageListResponse = {
  data: {
    packages: SubscriptionPackage[]
  }
} & ResponseWithPagination
