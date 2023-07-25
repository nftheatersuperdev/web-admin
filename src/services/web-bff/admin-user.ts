import { AdminBffAPI } from 'api/admin-bff'
import {
  CreateNewAdminUserProps,
  AdminUser,
  AdminUsersResponse,
  AdminUserProfileResponse,
  AdminUsersProps,
  UpdateAdminUserProps,
  AdminUserById,
  UpdateAdminUserResponse,
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
  const response: AdminUserProfileResponse = await AdminBffAPI.get('/v1/admin-user/profile').then(
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
  resellerServiceAreaIds,
}: CreateNewAdminUserProps): Promise<AdminUser> => {
  const response: AdminUserProfileResponse = await AdminBffAPI.post(
    '/v1/admin-users',
    {
      firebaseToken,
      firstName: firstname,
      lastName: lastname,
      role,
      resellerServiceAreaIds,
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  ).then((response) => response.data)

  return response.adminUser
}

export const updateAdminUser = async ({
  id,
  firstname,
  email,
  lastname,
  role,
  resellerServiceAreaIds,
}: UpdateAdminUserProps): Promise<AdminUserById> => {
  const response: UpdateAdminUserResponse = await AdminBffAPI.patch(`/v1/admin-users/${id}`, {
    firstName: firstname,
    lastName: lastname,
    email,
    role,
    resellerServiceAreaIds,
  }).then((response) => response.data)

  return response.data
}

export default {
  getAdminUserProfile,
  getAdminUsers,
  createNewAdminUser,
}
