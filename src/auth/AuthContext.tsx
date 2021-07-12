import { ReactElement, createContext, useContext, useState, useEffect } from 'react'
import { UNAUTHENTICATED, AUTHENTICATED, AuthState } from './utils'
import { Firebase } from './firebase'
import useErrorMessage from './useErrorMessage'

interface AuthContextProviderProps {
  firebaseInstance: Firebase
  children: ReactElement
}

interface AuthContextProps {
  authState: AuthState
  signInWithEmailAndPassword: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  isLoggedIn: boolean
}

const AuthContext = createContext<AuthContextProps>({
  authState: {
    status: UNAUTHENTICATED,
  },
  signInWithEmailAndPassword: (_email: string, _password: string) => Promise.resolve(undefined),
  signOut: () => Promise.resolve(undefined),
  isLoggedIn: false,
})

export function AuthContextProvider({
  firebaseInstance,
  children,
}: AuthContextProviderProps): JSX.Element {
  const [authState, setAuthState] = useState<AuthState>({
    status: UNAUTHENTICATED,
  })
  const errorMessage = useErrorMessage()

  useEffect(() => {
    const subscribeAuthStateChanged = firebaseInstance.subscribeAuthStateChanged(setAuthState)
    // unsubscribe observed auth state
    return () => subscribeAuthStateChanged?.()
  }, [firebaseInstance])

  const signInWithEmailAndPassword = async (email: string, password: string): Promise<void> => {
    try {
      await firebaseInstance.signInWithEmailAndPassword(email, password)
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

  const isLoggedIn = authState.status === AUTHENTICATED

  return (
    <AuthContext.Provider
      value={{
        authState,
        signInWithEmailAndPassword,
        signOut,
        isLoggedIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = (): AuthContextProps => useContext<AuthContextProps>(AuthContext)
