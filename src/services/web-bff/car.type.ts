/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { StringFieldComparison, DateRangeFieldComparison } from 'services/web-bff/general.type'
import { ResponseWithPagination } from 'services/web-bff/response.type'
import { Subscription } from 'services/web-bff/subscription.type'

export interface Car {
  id: string
  modelId: string
  name: string
  brand: string
  modelYear: number
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
  horsePower: number
  connectorType: {
    id: string
    description: string
  }
  bodyType: {
    id: string
    description: string
  }
  condition: string
  status: string
  createdDate: string
  updatedDate: string
  subscriptions: Subscription[]
  connectorTypes: CarConnectorType[] // Using for get all connector types on database.
}

export interface CarUpdate extends Partial<Car> {}

export interface CarBodyType {
  id: number
  description: number
}

export interface CarConnectorType {
  id: string
  description: number
  chargingType: string
  type: string
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

export interface CarByIdProps {
  accessToken: string
  id: string
}

export interface CarBodyTypesProps {
  accessToken: string
}

export interface CarConnectorTypesProps {
  accessToken: string
}

export interface CarUpdateProps {
  accessToken: string
  updatedFields: CarUpdate
}

export type CarListResponse = {
  data: {
    cars: Car[]
  }
} & ResponseWithPagination
