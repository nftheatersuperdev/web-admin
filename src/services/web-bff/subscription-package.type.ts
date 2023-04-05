import { ResponseWithPagination } from 'services/web-bff/response.type'

export interface SubscriptionPackage {
  id: string
  badge: string
  publish_date: string
  is_display: boolean
  full_price: number
  price: number
  period: number
  list_banner: string
  name_en: string
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
