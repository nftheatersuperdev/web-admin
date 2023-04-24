/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { StringFieldComparison, DateRangeFieldComparison } from 'services/web-bff/general.type'
import { ResponseWithPagination } from 'services/web-bff/response.type'
import { Subscription } from 'services/web-bff/subscription.type'
import { RentalPackage } from './package-price.type'

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

export interface CarBrand {
  name: string
  imageUrl: string
}
export interface CarModel {
  id: string
  connectorTypes: CarConnectorType[] | []
  name: string
  bodyType: string // 'SUV'
  brand: CarBrand
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

export interface CarBff {
  id: string
  carSku: CarSku
  resellerServiceArea: ResellerServiceArea
  carTrackId: string
  plateNumber: string
  vin: string
  isActive: boolean
  createdDate: string
  updatedDate: string
  ownerProfileId: string
  ownerProfileType: string
}

export interface ResellerServiceArea {
  id: string
  businessId: string
  areaNameTh: string
  areaNameEn: string
  serviceTypeLocations: ServiceTypeLocation
}

export interface ServiceTypeLocation {
  id: string
  resellerServiceAreaId: string
  serviceType: string
  isActive: boolean
  addressTh: string
  addressEn: string
  latitude: string
  longtitude: string
  distance: string
}

export interface CarModelPriceBff {
  id: string
  modelId: string
  vin: string
  plateNumber: string
  name: string
  brand: CarBrand
  color: string
  colorHex: string
  year: number
  acceleration: number
  batteryCapacity: number
  chargeTime: number
  fastChargeTime: number
  range: number
  topSpeed: number
  totalPower: number
  totalTorque: number
  horsePower: number
  priority: number
  seats: number
  segment: string
  subModelName: string
  connectorType: CarConnectorType
  bodyType: string
  status: 'out_of_service' | 'available'
  condition: string
  createdDate: string
  updatedDate: string
  carSkus: CarSku[]
  chargers: CarCharger[]
  rentalPackages: RentalPackage[]
}

export interface SubscriptionInCarModelPrice {
  id: string
  createdDate: string
}

export interface SubscriptionInCarAvailable {
  id: string
  carId: string
  userId: string
  status: string
  startDate: string
  endDate: string
}

export interface SubscriptionBookingDetail {
  id: string
  carId: string
  startDate: string
  endDate: string
  status: string
}

export interface SubscriptionBooking {
  id: string
  userId: string
  bookingDetail: SubscriptionBookingDetail
}

export interface CarAvaiableBff {
  availabilityStatus: 'In Use' | 'Available'
  car: CarBff
  subscriptions: SubscriptionInCarAvailable[]
  booking: SubscriptionBooking[]
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

export interface CarListFilterRequest {
  carId?: string
  colorContain?: string
  colorEqual?: string
  vinContain?: string
  vinEqual?: string
  plateNumberContain?: string
  plateNumberEqual?: string
  statusEqual?: string
}

export interface CarListFilterRequestProps {
  filter?: CarListFilterRequest
  sort?: CarListQuery
  size?: number
  page?: number
}

export interface CarAvailableListFilterRequest {
  carId?: string
  plateNumberContain?: string
  plateNumberEqual?: string
  startDate?: string | any
  endDate?: string | any
  isActive?: boolean | undefined
  isSkuNotNull?: boolean | undefined
}

export interface CarAvailableListBffFilterRequestProps {
  filter?: CarAvailableListFilterRequest
  sort?: CarListQuery
  size?: number
  page?: number
}

export interface CarUpdateInput {
  vin: string
  plateNumber: string
  status: string
}

export interface CarUpdateByIdProps {
  id: string
  vin: string
  plateNumber: string
  isActive: boolean
}

export interface CarModelInput {
  name: string
  seats: number
  bodyType: string
  year: number
  condition: string
  acceleration: number
  topSpeed: number
  range: number
  batteryCapacity: number
  horsePower: number
  fastChargeTime: number
  chargeTime: number
  chargers: string[]
}

export interface CarModelInputProps {
  id?: string
  carModel: CarModelInput
}

export interface CarModelPriceByIdProps {
  id: string
}

export type CarListResponse = {
  data: {
    cars: Car[]
  }
} & ResponseWithPagination

export type CarListBffResponse = {
  data: {
    cars: CarBff[]
  }
} & ResponseWithPagination

export type CarAvailableListBffResponse = {
  data: {
    records: CarAvaiableBff[]
  }
} & ResponseWithPagination
