import axios from 'axios'
import config from 'config'
import { User, UserMeProps, UserMeResponse } from './user.type'

export const userMe: UserMeProps = async (accessToken): Promise<User> => {
  const response: UserMeResponse = await axios
    .get(`${config.evmeBff}/v1/admin-users/profiles`, {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    })
    .then((response) => response.data)

  return response.data.user
}

export default {
  userMe,
}
