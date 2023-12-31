export interface RegisterFirebaseUserData {
  kind: string
  idToken: string
  localId: string
  email: string
  refreshToken: string
  expiresIn: string
}

export interface LoginFirebaseUserData {
  kind: string
  localId: string
  idToken: string
  email: string
  display: string
  refreshToken: string
  registered: boolean
  expiresIn: string
}

export interface CreateNewUserProps {
  accessToken: string
  email: string
  password: string
  name: string
  role: string
}
