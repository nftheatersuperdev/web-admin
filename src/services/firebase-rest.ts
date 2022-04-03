import axios from 'axios'
import config from 'config'
import { createNewAdminUser } from 'services/web-bff/admin-user'
import { CreateNewUserProps, RegisterUserData } from 'services/firebase-rest.type'

const instance = axios.create({
  baseURL: config.firebaseRest,
  timeout: 5000,
  params: {
    key: config.firebaseRestKey,
  },
})

export const createNewUser = async ({
  email,
  password,
  firstname,
  lastname,
  role,
}: CreateNewUserProps): Promise<boolean> => {
  let idToken = ''

  try {
    const data: RegisterUserData = await instance
      .post('/v1/accounts:signUp', {
        email,
        password,
        returnSecureToken: true,
      })
      .then((response) => response.data)

    idToken = data.idToken

    await createNewAdminUser({
      firebaseToken: idToken,
      firstname,
      lastname,
      role,
    })

    return true
  } catch (error) {
    if (idToken) {
      await deleteUserByIdToken(idToken)
    }
    throw error.response.data
  }
}

export const deleteUserByIdToken = async (idToken: string): Promise<boolean> => {
  await instance.post('/v1/accounts:delete', {
    idToken,
  })
  return true
}

export default {
  createNewUser,
  deleteUserByIdToken,
}
