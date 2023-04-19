/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactElement, createContext, useContext, useState, useEffect, Fragment } from 'react'
import ls from 'localstorage-slim'
import firebase from 'firebase/app'
import { useTranslation } from 'react-i18next'
import { getAdminUserProfile } from 'services/web-bff/admin-user'
import { Firebase } from './firebase'
import useErrorMessage from './useErrorMessage'
import { Role, getAdminUserRoleLabel } from './roles'

export const STORAGE_KEYS = {
  ROLE: 'evme:user_role',
  TOKEN: 'evme:user_token',
  ID: 'evme:user_id',
}

interface AuthProviderProps {
  fbase: Firebase
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
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>
  setToken: (token: string) => void
  getToken: () => string | null | undefined
  refreshPersistentToken: () => Promise<void>
  setRole: (role: Role) => void
  getRole: () => string | null | undefined
  getRoleDisplayName: () => string
  setUserId: (id: string) => void
  getUserId: () => string | null | undefined
  getRemoteConfig: (key: string) => firebase.remoteConfig.Value | undefined
}

const Auth = createContext<AuthProps>({
  firebaseUser: null,
  signInWithEmailAndPassword: (_email: string, _password: string, _isRememberMe: boolean) =>
    Promise.resolve(),
  signOut: () => Promise.resolve(),
  updatePassword: (_currentPassword: string, _newPassword: string) => Promise.resolve(),
  setToken: (_token: string) => undefined,
  getToken: () => undefined,
  refreshPersistentToken: () => Promise.resolve(),
  setRole: (_role: Role) => undefined,
  getRole: () => undefined,
  getRoleDisplayName: () => '',
  setUserId: (_id: string) => undefined,
  getUserId: () => undefined,
  getRemoteConfig: (_key: string) => undefined,
})

export function AuthProvider({ fbase, children }: AuthProviderProps): JSX.Element {
  const [firebaseUser, setFirebaseUser] = useState<firebase.User | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const { t } = useTranslation()

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

  const refreshPersistentToken = async (): Promise<void> => {
    if (firebaseUser) {
      const newToken = await firebaseUser.getIdToken(true)
      setToken(newToken)
    }
  }

  const setUserId = (id: string) => {
    ls.set<string>(STORAGE_KEYS.ID, id)
  }

  const getUserId = (): string | null | undefined => {
    return ls.get<string | null | undefined>(STORAGE_KEYS.ID)
  }

  const setRole = (role: Role) => {
    ls.set<string>(STORAGE_KEYS.ROLE, role, { encrypt: true })
  }

  const getRole = (): string | null | undefined => {
    return ls.get<string | null | undefined>(STORAGE_KEYS.ROLE, { encrypt: true })
  }

  const getRoleDisplayName = (): string => {
    const role = getRole()
    return getAdminUserRoleLabel(role, t)
  }

  const signInWithEmailAndPassword = async (
    email: string,
    password: string,
    isRememberMe = false
  ): Promise<void> => {
    try {
      const { user } = await fbase.signInWithEmailAndPassword(email, password, isRememberMe)
      if (!user) {
        throw new Error('User not found')
      }
      await fbase.fetchRemoteConfig()
      const token = await user.getIdToken()
      setToken(token || '')

      const userProfile = await getAdminUserProfile()

      setUserId(user.uid)
      setRole(userProfile.role.toLocaleLowerCase())
    } catch (error: any) {
      const message = errorMessage(error.code as string)
      throw new Error(message)
    }
  }

  const signOut = async (): Promise<void> => {
    try {
      await fbase.signOut()
      ls.remove(STORAGE_KEYS.TOKEN)
      ls.remove(STORAGE_KEYS.ROLE)
    } catch (error: any) {
      const message = errorMessage(error.code as string)
      throw new Error(message)
    }
  }

  const updatePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
    try {
      await fbase.updatePassword(currentPassword, newPassword)
    } catch (error: any) {
      const message = errorMessage(error.code as string)
      throw new Error(message)
    }
  }

  const getRemoteConfig = (key: string): firebase.remoteConfig.Value | undefined => {
    return fbase.getRemoteConfig(key)
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
        updatePassword,
        setToken,
        getToken,
        refreshPersistentToken,
        setRole,
        getRole,
        getRoleDisplayName,
        setUserId,
        getUserId,
        getRemoteConfig,
      }}
    >
      {children}
    </Auth.Provider>
  )
}

export const useAuth = (): AuthProps => useContext<AuthProps>(Auth)
