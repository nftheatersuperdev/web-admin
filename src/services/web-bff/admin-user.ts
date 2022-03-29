import axios from 'axios'
import config from 'config'
import {
  GetAdminUsersProps,
  GetAdminUserProfileProps,
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

export const getAdminUsers = async ({
  accessToken,
}: GetAdminUsersProps): Promise<AdminUsersResponse> => {
  const response: AdminUsersResponse = await axios
    .get(`${config.evmeBff}/v1/admin-users`, {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    })
    .then((response) => response.data)

  return response
}

export default {
  getAdminUserProfile,
  getAdminUsers,
}
