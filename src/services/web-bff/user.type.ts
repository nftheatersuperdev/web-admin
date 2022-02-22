import type { Response } from './response.type'

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

export interface UserMeProps {
  (fid: string, accessToken: string): Promise<User>
}
export interface UserMeResponse extends Response {
  data: {
    user: User
  }
}
