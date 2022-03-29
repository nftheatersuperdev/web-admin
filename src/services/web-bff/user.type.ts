import { Maybe } from 'services/web-bff/general.type'
import { Response } from 'services/web-bff/response.type'

export interface User {
  id: string
  firebaseId: string
  firstName: string
  lastName: string
  role: 'user' | 'operator' | 'admin' | 'super_admin'
  disabled: false
  phoneNumber: string
  email: string
  omiseId: string | null
  carTrackId: string | null
  defaultAddress: string | null
  kycStatus: 'pending' | 'verified' | 'rejected'
  kycRejectReason: string | null
  locale: 'TH' | 'EN'
  creditCard: string | null
  userGroups: []
  createdAt: string
  updatedAt: string
}

export interface UserAddress {
  id: string
  full: string
  latitude: number
  longitude: number
  remark?: Maybe<string>
}

export interface UserMeProps {
  (accessToken: string): Promise<User>
}
export interface UserMeResponse extends Response {
  data: {
    user: User
  }
}
