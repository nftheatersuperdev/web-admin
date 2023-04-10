import dayjs from 'dayjs'
import { Response } from 'services/web-bff/response.type'

export interface NewSubscriptionBodyProps {
  accessToken: string
  badge: string
  publishDate: string | dayjs.Dayjs
  isPublish: boolean
  fullPrice: number
  price: number
  listBanner: string
  detailBanner: string
  periodMonth: number
  nameEn: string
  nameTh: string
  descriptionEn: string
  descriptionTh: string
  featureEn: string
  featureTh: string
}

export interface NewSubscription {
  id: string
}

export type NewSubscriptionResponses = {
  data: {
    NewSubscription: NewSubscription
  }
} & Response
