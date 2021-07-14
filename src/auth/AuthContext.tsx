import { ReactElement, createContext, useContext, useState, useEffect, Fragment } from 'react'
import firebase from 'firebase/app'
import { Firebase } from './firebase'
import useErrorMessage from './useErrorMessage'

interface AuthProviderProps {
  fb: Firebase
  children: ReactElement
}

interface AuthProps {
  currentUser: firebase.User | null
  signInWithEmailAndPassword: (
    email: string,
    password: string,
    isRememberMe: boolean
  ) => Promise<void>
  signOut: () => Promise<void>
  getToken: () => Promise<string>
}

const Auth = createContext<AuthProps>({
  currentUser: null,
  signInWithEmailAndPassword: (_email: string, _password: string, _isRememberMe: boolean) =>
    Promise.resolve(undefined),
  signOut: () => Promise.resolve(undefined),
  getToken: () => Promise.resolve(''),
})

export function AuthProvider({ fb, children }: AuthProviderProps): JSX.Element {
  const [currentUser, setCurrentUser] = useState<firebase.User | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const errorMessage = useErrorMessage()

  useEffect(() => {
    const unsubscribe = fb.onAuthStateChanged(setCurrentUser, setIsLoading)
    return () => unsubscribe()
  }, [fb])

  const signInWithEmailAndPassword = async (
    email: string,
    password: string,
    isRememberMe = false
  ): Promise<void> => {
    try {
      await fb.signInWithEmailAndPassword(email, password, isRememberMe)
    } catch (error) {
      const message = errorMessage(error.code)
      throw new Error(message)
    }
  }

  const signOut = async (): Promise<void> => {
    try {
      await fb.signOut()
    } catch (error) {
      const message = errorMessage(error.code)
      throw new Error(message)
    }
  }

  const getToken = (): Promise<string> => {
    return currentUser ? currentUser.getIdToken() : Promise.resolve('')
  }

  if (isLoading) {
    return <Fragment>Loading...</Fragment>
  }

  return (
    <Auth.Provider
      value={{
        currentUser,
        signInWithEmailAndPassword,
        signOut,
        getToken,
      }}
    >
      {children}
    </Auth.Provider>
  )
}

export const useAuth = (): AuthProps => useContext<AuthProps>(Auth)
