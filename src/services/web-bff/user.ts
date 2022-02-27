import axios from 'axios'
import { User, UserMeProps, UserMeResponse } from './user.type'

export const userMe: UserMeProps = async (firebaseId, accessToken): Promise<User> => {
  const response: UserMeResponse = await axios
    .get(`https://run.mocky.io/v3/f8e91b2c-e313-4f5f-acae-16d62a618bb0/${firebaseId}`, {
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
