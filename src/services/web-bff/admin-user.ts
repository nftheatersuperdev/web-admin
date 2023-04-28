import { AdminBffAPI } from 'api/admin-bff'
import {
  CreateNewAdminUserProps,
  AdminUser,
  AdminUsersResponse,
  AdminUserProfileResponse,
  AdminUsersProps,
} from './admin-user.type'

export const searchAdminUser = async ({
  data,
  size,
  page,
}: AdminUsersProps): Promise<AdminUsersResponse> => {
  const response: AdminUsersResponse = await AdminBffAPI.post('/v1/admin-users/search', data, {
    params: {
      page,
      size,
    },
  }).then((response) => response.data)
  return response
}

export const getAdminUserProfile = async (): Promise<AdminUser> => {
  const response: AdminUserProfileResponse = await AdminBffAPI.get('/v1/admin-users/profiles').then(
    (response) => response.data.data
  )

  return response.adminUser
}

export const getAdminUsers = async (page = 1, size = 10): Promise<AdminUsersResponse> => {
  const response: AdminUsersResponse = await AdminBffAPI.post(
    '/v1/admin-users/search',
    {},
    {
      params: {
        page,
        size,
      },
    }
  ).then((response) => {
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
  const response: AdminUserProfileResponse = await AdminBffAPI.post(
    '/v1/admin-users',
    {
      firebaseToken,
      firstName: firstname,
      lastName: lastname,
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
