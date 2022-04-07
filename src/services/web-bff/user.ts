import { BaseApi } from 'api/baseApi'
import { UserListResponse, UserMeProps } from './user.type'

/*export const userMe: UserMeProps = async (accessToken): Promise<User> => {
  const response: UserMeResponse = await axios
    .get(`${config.evmeBff}/v1/admin-users/profiles`, {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    })
    .then((response) => response.data)

  return response.data.user
}*/

export const search = async ({ data, limit, page }: UserMeProps): Promise<UserListResponse> => {
  const response: UserListResponse = await BaseApi.post(
    '0eb0c48c-e5c6-4d6b-89b1-77fc22316816',
    data,
    {
      params: {
        limit,
        page,
      },
    }
  ).then((response) => response.data)
  return response
}

export default {
  search,
}
