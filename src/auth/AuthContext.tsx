import { ReactElement, createContext, useContext, useState, useEffect, Fragment } from 'react'
import ls from 'localstorage-slim'
import firebase from 'firebase/app'
import { GraphQLClient, gql } from 'graphql-request'
import { User } from 'services/evme.types'
import { Firebase } from './firebase'
import useErrorMessage from './useErrorMessage'
import { ROLES, Role } from './roles'
import { EVmeAuthError, ERROR_CODES } from './errors'

export const STORAGE_KEYS = {
  ROLE: 'evme:user_role',
  TOKEN: 'evme:user_token',
}

interface AuthProviderProps {
  fbase: Firebase
  gqlClient: GraphQLClient
  children: ReactElement
}

interface AuthProps {
  firebaseUser: firebase.User | null
  signInWithEmailAndPassword: (
    email: string,
    password: string,
    isRememberMe: boolean
  ) => Promise<void>
  signOut: () => Promise<void>
  setToken: (token: string) => void
  getToken: () => string | null | undefined
  setRole: (role: Role) => void
  getRole: () => string | null | undefined
}

const Auth = createContext<AuthProps>({
  firebaseUser: null,
  signInWithEmailAndPassword: (_email: string, _password: string, _isRememberMe: boolean) =>
    Promise.resolve(undefined),
  signOut: () => Promise.resolve(undefined),
  setToken: (_token: string) => undefined,
  getToken: () => undefined,
  setRole: (_role: Role) => undefined,
  getRole: () => undefined,
})

export function AuthProvider({ fbase, gqlClient, children }: AuthProviderProps): JSX.Element {
  const [firebaseUser, setFirebaseUser] = useState<firebase.User | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const errorMessage = useErrorMessage()

  useEffect(() => {
    const unsubscribeAuthStateChanged = fbase.onAuthStateChanged(setFirebaseUser, setIsLoading)
    return () => {
      unsubscribeAuthStateChanged()
    }
  }, [fbase])

  const setToken = (token: string) => {
    ls.set<string>(STORAGE_KEYS.TOKEN, token)
  }

  const getToken = (): string | null | undefined => {
    return ls.get<string | null | undefined>(STORAGE_KEYS.TOKEN)
  }

  const setRole = (role: Role) => {
    ls.set<string>(STORAGE_KEYS.ROLE, role, { encrypt: true })
  }

  const getRole = (): string | null | undefined => {
    return ls.get<string | null | undefined>(STORAGE_KEYS.ROLE, { encrypt: true })
  }

  const signInWithEmailAndPassword = async (
    email: string,
    password: string,
    isRememberMe = false
  ): Promise<void> => {
    try {
      const { user } = await fbase.signInWithEmailAndPassword(email, password, isRememberMe)
      const token = await user?.getIdToken()
      const response = await gqlClient.request(
        gql`
          query GetMe {
            me {
              id
              firebaseId
              firstName
              lastName
              role
              disabled
            }
          }
        `,
        {},
        {
          Authorization: `Bearer ${token}`,
        }
      )

      if (response.me) {
        const { disabled, role } = response.me as User

        if (disabled) {
          throw new EVmeAuthError('User disabled', ERROR_CODES.USER_DISABLED)
        }

        if (!Object.values(ROLES).includes(role.toLocaleLowerCase())) {
          throw new EVmeAuthError('Role is invalid', ERROR_CODES.USER_NOT_FOUND)
        }

        setToken(token || '')
        setRole(role)
      } else {
        throw new EVmeAuthError('User not found', ERROR_CODES.USER_NOT_FOUND)
      }
    } catch (error) {
      const message = errorMessage(error)
      throw new Error(message)
    }
  }

  const signOut = async (): Promise<void> => {
    try {
      await fbase.signOut()
      ls.remove(STORAGE_KEYS.TOKEN)
      ls.remove(STORAGE_KEYS.ROLE)
    } catch (error) {
      const message = errorMessage(error.code)
      throw new Error(message)
    }
  }

  if (isLoading) {
    return <Fragment>Loading...</Fragment>
  }

  return (
    <Auth.Provider
      value={{
        firebaseUser,
        signInWithEmailAndPassword,
        signOut,
        setToken,
        getToken,
        setRole,
        getRole,
      }}
    >
      {children}
    </Auth.Provider>
  )
}

export const useAuth = (): AuthProps => useContext<AuthProps>(Auth)
