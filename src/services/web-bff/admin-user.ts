import config from 'config'
import { AdminBffAPI } from 'api/admin-bff'
import { BaseApi } from 'api/baseApi'
import {
  CreateNewAdminUserProps,
  AdminUser,
  AdminUsersResponse,
  AdminUserProfileResponse,
} from 'services/web-bff/admin-user.type'

export const getAdminUserProfile = async (): Promise<AdminUser> => {
  const response: AdminUserProfileResponse = await AdminBffAPI.get('/v1/admin-users/profiles').then(
    (response) => response.data.data
  )

  return response.adminUser
}

export const getAdminUsers = async (): Promise<AdminUsersResponse> => {
  const response: AdminUsersResponse = await BaseApi.get('/v1/admin-users').then((response) => {
    return response.data
  })

  return response
}

export const createNewAdminUser = async ({
  accessToken,
  firebaseToken,
  firstname,
  lastname,
  role,
}: CreateNewAdminUserProps): Promise<AdminUser> => {
  const response: AdminUserProfileResponse = await BaseApi.post(
    `${config.evmeBff}/v1/admin-users`,
    {
      firebaseToken,
      firstname,
      lastname,
      role,
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  ).then((response) => response.data)

  return response.adminUser
}

export default {
  getAdminUserProfile,
  getAdminUsers,
  createNewAdminUser,
}
