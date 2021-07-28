import { User } from 'services/evme.types'

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
