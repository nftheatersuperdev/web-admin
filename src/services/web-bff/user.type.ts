import type { Response } from './response.type'

export interface User {
  id: string
  firebase_id: string
  first_name: string
  last_name: string
  role: 'user' | 'operator' | 'admin' | 'super_admin'
  disabled: false
  phone_number: string
  email: string
  omise_id: string | null
  car_track_id: string | null
  default_address: string | null
  kyc_status: 'pending' | 'verified' | 'rejected'
  kyc_reject_reason: string | null
  locale: 'TH' | 'EN'
  credit_card: string | null
  user_groups: []
  created_at: string
  updated_at: string
}

export interface UserMeProps {
  (fid: string, accessToken: string): Promise<User>
}
export interface UserMeResponse extends Response {
  data: {
    user: User
  }
}
