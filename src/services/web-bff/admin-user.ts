import axios from 'axios'
import config from 'config'
import { BaseApi } from 'api/baseApi'
import {
  GetAdminUserProfileProps,
  CreateNewAdminUserProps,
  AdminUser,
  AdminUsersResponse,
  AdminUserProfileResponse,
} from 'services/web-bff/admin-user.type'

export const getAdminUserProfile = async ({
  accessToken,
}: GetAdminUserProfileProps): Promise<AdminUser> => {
  const response: AdminUserProfileResponse = await axios
    .get(`${config.evmeBff}/v1/admin-users/profiles`, {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    })
    .then((response) => response.data)

  return response.data
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
  const response: AdminUserProfileResponse = await axios
    .post(
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
    )
    .then((response) => response.data)

  return response.data
}

export default {
  getAdminUserProfile,
  getAdminUsers,
  createNewAdminUser,
}
