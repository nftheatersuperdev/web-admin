import { AdminUserRole } from 'services/web-bff/admin-user.type'

export interface RegisterUserData {
  kind: string
  idToken: string
  localId: string
  email: string
  refreshToken: string
  expiresIn: string
}

export interface CreateNewUserProps {
  email: string
  password: string
  firstname: string
  lastname: string
  role: AdminUserRole
}
