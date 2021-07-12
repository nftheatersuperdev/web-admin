import { Dispatch, SetStateAction } from 'react'
import firebase from 'firebase/app'
import 'firebase/auth'
import config from 'config'
import { AuthState, AUTHENTICATED, UNAUTHENTICATED } from './utils'

export class Firebase {
  auth!: firebase.auth.Auth

  constructor() {
    if (!firebase.apps.length) {
      firebase.initializeApp({
        ...config.firebase,
      })
    }

    if (firebase.apps.length) {
      this.auth = firebase.auth()
    }
  }

  subscribeAuthStateChanged(
    setAuthState: Dispatch<SetStateAction<AuthState>>
  ): firebase.Unsubscribe {
    return this.auth.onAuthStateChanged(async (user) => {
      if (user && !user.isAnonymous) {
        const token = await user.getIdToken()
        setAuthState({
          status: AUTHENTICATED,
          userInfo: {
            displayName: user.displayName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            photoURL: user.photoURL,
            providerId: user.providerId,
            uid: user.uid,
          },
          metadata: {
            creationTime: user.metadata.creationTime,
            lastSignInTime: user.metadata.lastSignInTime,
          },
          token,
        })
      } else {
        setAuthState({
          status: UNAUTHENTICATED,
          userInfo: undefined,
          metadata: undefined,
          token: undefined,
        })
      }
    })
  }

  signInWithEmailAndPassword(
    email: string,
    password: string
  ): Promise<firebase.auth.UserCredential> {
    return this.auth.signInWithEmailAndPassword(email, password)
  }

  signOut(): Promise<void> {
    return this.auth.signOut()
  }
}
