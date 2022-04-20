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

export interface CarCharger {
  id: string
  type: string
  description: string
  chargingType: 'ac' | 'dc'
  createdDate: string
  updatedDate: string
}
export interface CarModel {
  id: string
  name: string
  bodyType: string // 'SUV'
  brand: {
    name: string
    imageUrl: string
  }
  carSkus: CarSku[]
  chargers: CarCharger[]
  year: number
  chargeTime: number
  acceleration: number
  batteryCapacity: number
  fastChargeTime: number
  horsePower: number
  priority: number
  range: number
  topSpeed: number
  totalPower: number
  totalTorque: number
  seats: number
  segment: string
  subModelName: string
  condition: string
  rentalPackages: null
  createdDate: string
  updatedDate: string
}
export interface CarSku {
  id: string
  carModel: CarModel
  color: string
  colorHex: string
  createdDate: string
  updatedDate: string
}

export interface CarBBF {
  id: string
  carSku: CarSku
  carTrackId: string
  plateNumber: string
  vin: string
  isActive: boolean
  createdDate: string
  updatedDate: string
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

export interface CarListFilterRequest {
  colorContain?: string
  colorEqual?: string
  vinContain?: string
  vinEqual?: string
  plateNumberContain?: string
  plateNumberEqual?: string
  statusEqual?: string
}

export interface CarListProps {
  accessToken: string
  query?: CarListQuery
  sort?: CarListQuery
  limit?: number
  page?: number
}

export interface CarListFilterRequestProps {
  filter?: CarListFilterRequest
  sort?: CarListQuery
  size?: number
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

export type CarListBBFResponse = {
  data: {
    cars: CarBBF[]
  }
} & ResponseWithPagination
