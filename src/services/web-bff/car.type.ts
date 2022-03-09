/* eslint-disable @typescript-eslint/no-explicit-any */
import { StringFieldComparison, DateRangeFieldComparison } from 'services/web-bff/general.type'
import { ResponseWithPagination } from 'services/web-bff/response.type'
import { Subscription } from 'services/web-bff/subscription.type'

export interface Car {
  id: string
  modelId: string
  name: string
  brand: string
  color: string
  colorHex: string
  plateNumber: string
  vin: string
  chargeTime: number
  fastChargeTime: number
  topSpeed: number
  seats: number
  acceleration: number
  range: number
  totalPower: number
  totalTorque: number
  batteryCapacity: number
  connectorType: {
    description: string
  }
  bodyType: {
    description: string
  }
  status: string
  createdAt: string
  updatedAt: string
  subscriptions: [Subscription]
}

export interface UpcomingCar {
  subscriptionId: string
  car: Partial<Car>
}

export interface CarListQuery {
  id?: StringFieldComparison
  modeId?: StringFieldComparison
  color?: StringFieldComparison
  vin?: StringFieldComparison
  plateNumber?: StringFieldComparison
  status?: StringFieldComparison
  subscription?: DateRangeFieldComparison
  availableDate?: DateRangeFieldComparison
}

export interface CarListProps {
  accessToken: string
  query?: CarListQuery
  sort?: CarListQuery
  limit?: number
  page?: number
}

export type CarListResponse = {
  data: {
    cars: Car[]
  }
} & ResponseWithPagination
