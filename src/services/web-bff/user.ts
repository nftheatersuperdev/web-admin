import axios from 'axios'
import { User, UserMeProps, UserMeResponse } from './user.type'

export const userMe: UserMeProps = async (firebaseId, accessToken): Promise<User> => {
  const response: UserMeResponse = await axios
    .get(`https://run.mocky.io/v3/64743c3e-e534-477a-86c8-165aca4a9668/${firebaseId}`, {
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
