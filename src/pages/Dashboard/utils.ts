import { User } from 'services/evme.types'
import { LocationResponse } from 'services/web-bff/location.type'

export type DeliveryAndReturnUser = Pick<User, 'email' | 'firstName' | 'lastName' | 'phoneNumber'>

export interface DeliveryModelData {
  remark: string
  startDate: string
  user: DeliveryAndReturnUser
  address: string
  latitude: number
  longitude: number
  status: string
}

export interface ReturnModelData {
  remark: string
  endDate: string
  user: DeliveryAndReturnUser
  address: string
  latitude: number
  longitude: number
  status: string
}

export const MISSING_VALUE = '-'

export interface FilterSearch {
  [key: string]: string
}

export interface SelectOption {
  label: string
  value: string
}

export const getLocationOptions = (
  locationResponse: LocationResponse | null | undefined
): SelectOption[] => {
  const locations = locationResponse?.locations || []
  return locations.map((location) => ({
    label: location.areaNameEn,
    value: location.id,
  }))
}
