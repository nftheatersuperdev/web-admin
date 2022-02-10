import { Dispatch, SetStateAction } from 'react'
import firebase from 'firebase/app'
import 'firebase/auth'
import config from 'config'

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

  onAuthStateChanged(
    setCurrentUser: Dispatch<SetStateAction<firebase.User | null>>,
    setIsLoading: Dispatch<SetStateAction<boolean>>
  ): firebase.Unsubscribe {
    return this.auth.onAuthStateChanged((user) => {
      setCurrentUser(user)
      setIsLoading(false)
    })
  }

  async signInWithEmailAndPassword(
    email: string,
    password: string,
    isRememberMe = false
  ): Promise<firebase.auth.UserCredential> {
    const persistence = isRememberMe
      ? firebase.auth.Auth.Persistence.LOCAL
      : firebase.auth.Auth.Persistence.SESSION

    await this.auth.setPersistence(persistence)

    return this.auth.signInWithEmailAndPassword(email, password)
  }

  signOut(): Promise<void> {
    return this.auth.signOut()
  }

  async updatePassword(currentPassword: string, newPassword: string): Promise<void> {
    const user = this.auth.currentUser
    const credential = firebase.auth.EmailAuthProvider.credential(
      user?.email || '',
      currentPassword
    )
    await user?.reauthenticateWithCredential(credential)
    return user?.updatePassword(newPassword)
  }
}
