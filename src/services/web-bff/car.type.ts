import type { StringFieldComparison } from 'services/web-bff/general.types'
import type { ResponseWithPagination } from 'services/web-bff/response.type'

export interface Car {
  id: string
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
}

export interface UpcomingCar {
  subscriptionId: string
  car: Partial<Car>
}

export interface CarListQuery {
  id?: StringFieldComparison
  color?: StringFieldComparison
  vin?: StringFieldComparison
  plateNumber?: StringFieldComparison
  status?: StringFieldComparison
}

export interface CarListProps {
  accessToken: string
  query?: CarListQuery
  sort?: CarListQuery
  limit?: number
  page?: number
}

// Promise<CarListResponse>

export type CarListResponse = {
  data: {
    cars: Car[]
  }
} & ResponseWithPagination
