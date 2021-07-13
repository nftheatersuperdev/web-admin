import { ReactElement, createContext, useContext, useState, useEffect, Fragment } from 'react'
import firebase from 'firebase/app'
import { Firebase } from './firebase'
import useErrorMessage from './useErrorMessage'

interface AuthContextProviderProps {
  firebaseInstance: Firebase
  children: ReactElement
}

interface AuthContextProps {
  currentUser: firebase.User | null
  signInWithEmailAndPassword: (
    email: string,
    password: string,
    isRememberMe: boolean
  ) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextProps>({
  currentUser: null,
  signInWithEmailAndPassword: (_email: string, _password: string, _isRememberMe: boolean) =>
    Promise.resolve(undefined),
  signOut: () => Promise.resolve(undefined),
})

export function AuthContextProvider({
  firebaseInstance,
  children,
}: AuthContextProviderProps): JSX.Element {
  const [currentUser, setCurrentUser] = useState<firebase.User | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const errorMessage = useErrorMessage()

  useEffect(() => {
    const unsubscribe = firebaseInstance.onAuthStateChanged(setCurrentUser, setIsLoading)
    return () => unsubscribe()
  }, [firebaseInstance])

  const signInWithEmailAndPassword = async (
    email: string,
    password: string,
    isRememberMe = false
  ): Promise<void> => {
    try {
      await firebaseInstance.signInWithEmailAndPassword(email, password, isRememberMe)
    } catch (error) {
      const message = errorMessage(error.code)
      throw new Error(message)
    }
  }

  const signOut = async (): Promise<void> => {
    try {
      await firebaseInstance.signOut()
    } catch (error) {
      const message = errorMessage(error.code)
      throw new Error(message)
    }
  }

  if (isLoading) {
    return <Fragment>Loading...</Fragment>
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        signInWithEmailAndPassword,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = (): AuthContextProps => useContext<AuthContextProps>(AuthContext)
