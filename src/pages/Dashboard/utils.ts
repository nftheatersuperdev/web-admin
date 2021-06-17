import { User } from 'services/evme.types'

export type DeliveryAndReturnUser = Pick<User, 'email' | 'firstName' | 'lastName' | 'phoneNumber'>
export interface IDeliveryModelData {
  remark: string
  startDate: string
  user: DeliveryAndReturnUser
}

export interface IReturnModelData {
  remark: string
  endDate: string
  user: DeliveryAndReturnUser
}

export const MISSING_VALUE = 'N/A'
