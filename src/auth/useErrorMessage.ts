import { useTranslation } from 'react-i18next'
import { ClientError } from 'graphql-request'
import firebase from 'firebase/app'
import 'firebase/auth'
import { EVmeAuthError, ERROR_CODES } from './errors'

interface ErrorMessage {
  (error: firebase.auth.Error | ClientError | EVmeAuthError | Error): string
}

function useErrorMessage(): ErrorMessage {
  const { t } = useTranslation()

  const errorMessage = (
    error: firebase.auth.Error | ClientError | EVmeAuthError | Error
  ): string => {
    let errorCode = ''

    if (error instanceof ClientError) {
      const { response } = error as ClientError
      const { errors } = response

      if (errors?.length) {
        errorCode = ERROR_CODES.AUTHENTICATION_FAILED
        console.error('GraphQL error:', errors[0].message)
      }
    } else if (error instanceof EVmeAuthError) {
      const { code, message } = error as EVmeAuthError
      console.error('Auth error:', message)
      errorCode = code
    } else if ((error as firebase.auth.Error).code) {
      const { code, message } = error as firebase.auth.Error
      errorCode = code
      console.error('Firebase error:', message)
    } else {
      return error.message
    }

    switch (errorCode) {
      case 'auth/invalid-email':
        return t('authentication.error.invalidEmail')

      case 'auth/wrong-password':
        return t('authentication.error.invalidPassword')

      case 'auth/invalid-user-token':
        return t('authentication.error.invalidUserToken')

      case 'auth/user-not-found':
      case ERROR_CODES.USER_NOT_FOUND:
        return t('authentication.error.userNotFound')

      case 'auth/user-disabled':
      case ERROR_CODES.USER_DISABLED:
        return t('authentication.error.userDisabled')

      case 'auth/user-token-expired':
        return t('authentication.error.userTokenExpired')

      case 'auth/user-mismatch':
        return t('authentication.error.userMismatch')

      case 'auth/invalid-credential':
        return t('authentication.error.invalidCredential')

      case 'auth/weak-password':
        return t('authentication.error.weakPassword')

      case 'auth/requires-recent-login':
        return t('authentication.error.requiresRecentLogin')

      case ERROR_CODES.AUTHENTICATION_FAILED:
        return t('authentication.error.authenticationFailed')

      case ERROR_CODES.PERMISSION_NOT_ALLOWED:
        return t('authentication.error.permissionNotAllowed')

      default:
        return t('authentication.error.unknownError')
    }
  }

  return errorMessage
}

export default useErrorMessage
