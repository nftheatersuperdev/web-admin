/* eslint-disable @typescript-eslint/no-explicit-any */
import { Car } from 'services/web-bff/car.type'
import { PackagePriceInput } from 'services/evme.types'

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
