/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactElement, createContext, useContext, useState, useEffect, Fragment } from 'react'
import ls from 'localstorage-slim'
import firebase from 'firebase/app'
import { useTranslation } from 'react-i18next'
import { getAdminUserProfile } from 'services/web-bff/admin-user'
import { ResellerServiceArea } from 'services/web-bff/admin-user.type'
import { Firebase } from './firebase'
import useErrorMessage from './useErrorMessage'
import { Role, getAdminUserRoleLabel } from './roles'

export const STORAGE_KEYS = {
  ROLE: 'evme:user_role',
  TOKEN: 'evme:user_token',
  ID: 'evme:user_id',
  RESELLER_SERVICE_AREA: 'evme:user_reseller_service_area',
  LOCATION: 'evme:user_location',
}

type Text = string | null | undefined
type ArrayText = string[] | null | undefined
type ResellerServices = ResellerServiceArea[] | null | undefined

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
  getRemoteConfig: (key: string) => firebase.remoteConfig.Value | undefined
  setPrivileges: (privilege: string[]) => void
  getPrivileges: () => ArrayText
  setResellerServiceAreas: (areas: ResellerServiceArea[]) => void
  getResellerServiceAreas: () => ResellerServices
  getResellerServiceAreaWithSort: () => ResellerServices
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
  setPrivileges: (_privilege: string[]) => undefined,
  getPrivileges: () => undefined,
  setResellerServiceAreas: (_areas: ResellerServiceArea[]) => undefined,
  getResellerServiceAreas: () => undefined,
  getResellerServiceAreaWithSort: () => undefined,
})

export function AuthProvider({ fbase, children }: AuthProviderProps): JSX.Element {
  const [firebaseUser, setFirebaseUser] = useState<firebase.User | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const { t, i18n } = useTranslation()

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
    ls.set<string>(STORAGE_KEYS.ROLE, role, { encrypt: true })
  }

  const getRole = (): Text => {
    return ls.get<Text>(STORAGE_KEYS.ROLE, { encrypt: true })
  }

  const setPrivileges = (privilege: string[]) => {
    ls.set<string[]>('PRIVILEGES', privilege, { encrypt: true })
  }

  const getPrivileges = (): ArrayText => {
    return ls.get<ArrayText>('PRIVILEGES', { encrypt: true })
  }

  const setResellerServiceAreas = (areas: ResellerServiceArea[]) => {
    ls.set<ResellerServiceArea[]>(STORAGE_KEYS.RESELLER_SERVICE_AREA, areas)
  }

  const getResellerServiceAreas = (): ResellerServices => {
    return ls.get<ResellerServices>(STORAGE_KEYS.RESELLER_SERVICE_AREA)
  }

  const getResellerServiceAreaWithSort = (): ResellerServices => {
    const resellerStorage = ls.get<ResellerServices>(STORAGE_KEYS.RESELLER_SERVICE_AREA)
    const sortedAreas = resellerStorage?.sort((a, b) => {
      const areaA = a[i18n.language === 'th' ? 'areaNameTh' : 'areaNameEn']
      const areaB = b[i18n.language === 'th' ? 'areaNameTh' : 'areaNameEn']
      if (areaA < areaB) {
        return -1
      }
      if (areaA < areaB) {
        return 1
      }
      return 0
    })
    return sortedAreas
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
      setPrivileges(userProfile.privileges)
      setResellerServiceAreas(userProfile.resellerServiceAreas)
    } catch (error: any) {
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
        getRemoteConfig,
        setPrivileges,
        getPrivileges,
        setResellerServiceAreas,
        getResellerServiceAreas,
        getResellerServiceAreaWithSort,
      }}
    >
      {children}
    </Auth.Provider>
  )
}

export const useAuth = (): AuthProps => useContext<AuthProps>(Auth)
