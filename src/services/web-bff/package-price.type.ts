/* eslint-disable @typescript-eslint/no-explicit-any */
import { Car } from 'services/web-bff/car.type'
import { PackagePriceInput } from 'services/evme.types'

export interface RentalPackage {
  id: string
  description: string
  durationDay: number
  durationLabel: string
  fullPrice: number
  price: number
  disabled: boolean
}

export interface PackagePrice {
  id: string
  carId: string
  car?: Car
  duration: string
  disabled: boolean
  price: number
  description?: string
  fullPrice?: number
  createdDate: any
  updatedDate: any
}

export interface PackagePriceCreateData {
  carModelId: string
  duration: string
  price: number
  description?: string
  fullPrice?: number
}

export interface PackagePriceByCarIdProps {
  accessToken: string
  carId: string
}

export interface PackagePriceCreateByCarIdProps {
  accessToken: string
  data: PackagePriceInput[]
}

export interface PackagePriceBff {
  id: string
  price: number
  fullprice: number
  durationDay: number
  durationLabel: string
  description: string
  disabled: boolean
  carModel: {
    id: string
    brand: string
    name: string
  }
}
