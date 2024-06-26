import { ReactElement, createContext, useContext, useState, useEffect, Fragment } from 'react'
import ls from 'localstorage-slim'
import firebase from 'firebase/app'
import { useTranslation } from 'react-i18next'
import { getAdminUserProfile } from 'services/web-bff/admin-user'
import { Firebase } from './firebase'
import useErrorMessage from './useErrorMessage'
import { Role, getAdminUserRoleLabel } from './roles'

export const STORAGE_KEYS = {
  ROLE: 'nftheater:user_role',
  TOKEN: 'nftheater:user_token',
  ID: 'nftheater:user_id',
  ACCOUNT: 'nftheater:account',
  USERNAME: 'nftheater:username',
}

type Text = string | null | undefined

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
  getToken: () => Text
  refreshPersistentToken: () => Promise<void>
  setRole: (role: Role) => void
  getRole: () => Text
  getRoleDisplayName: () => string
  setUserId: (id: string) => void
  getUserId: () => Text
  setAccount: (account: string) => void
  getAccount: () => Text
  setUsername: (username: string) => void
  getUsername: () => Text
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
  setAccount: (_id: string) => undefined,
  getAccount: () => undefined,
  setUsername: (_id: string) => undefined,
  getUsername: () => undefined,
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

  const getToken = (): Text => {
    return ls.get<Text>(STORAGE_KEYS.TOKEN)
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

  const getUserId = (): Text => {
    return ls.get<Text>(STORAGE_KEYS.ID)
  }

  const setRole = (role: string | Role) => {
    ls.set<string>(STORAGE_KEYS.ROLE, role)
  }

  const getRole = (): Text => {
    return ls.get<Text>(STORAGE_KEYS.ROLE)
  }

  const setAccount = (account: string) => {
    ls.set<string>(STORAGE_KEYS.ACCOUNT, account)
  }

  const getAccount = (): Text => {
    return ls.get<Text>(STORAGE_KEYS.ACCOUNT)
  }

  const setUsername = (username: string) => {
    ls.set<string>(STORAGE_KEYS.USERNAME, username)
  }

  const getUsername = (): Text => {
    return ls.get<Text>(STORAGE_KEYS.USERNAME)
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
      console.log(JSON.stringify(userProfile))
      setUserId(user.uid)
      setRole(userProfile.role)
      setAccount(userProfile.account)
      setUsername(userProfile.adminName)
    } catch (error: any) {
      console.error(error)
      const errMessage = error.code || error.response.data.message.toLowerCase()
      const message = errorMessage(errMessage as string)
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
        setAccount,
        getAccount,
        setUsername,
        getUsername,
        getRemoteConfig,
      }}
    >
      {children}
    </Auth.Provider>
  )
}

export const useAuth = (): AuthProps => useContext<AuthProps>(Auth)
