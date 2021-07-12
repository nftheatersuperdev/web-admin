import firebase from 'firebase/app'

export const AUTHENTICATED = 'AUTHENTICATED'
export const UNAUTHENTICATED = 'UNAUTHENTICATED'
export const AUTHENTICATION_FAILED = 'AUTHENTICATION_FAILED'

export interface AuthState {
  status: string
  userInfo?: firebase.UserInfo
  metadata?: firebase.auth.UserMetadata
  token?: string
}
