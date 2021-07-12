import { useTranslation } from 'react-i18next'

interface ErrorMessage {
  (errorCode: string): string
}

function useErrorMessage(): ErrorMessage {
  const { t } = useTranslation()

  const errorMessage = (errorCode: string): string => {
    switch (errorCode) {
      case 'auth/invalid-email':
        return t('authentication.error.invalidEmail')
      case 'auth/wrong-password':
        return t('authentication.error.invalidPassword')
      case 'auth/invalid-user-token':
        return t('authentication.error.invalidUserToken')
      case 'auth/user-not-found':
        return t('authentication.error.userNotFound')
      case 'auth/user-disabled':
        return t('authentication.error.userDisabled')
      case 'auth/user-token-expired':
        return t('authentication.error.userTokenExpired')
      default:
        return t('authentication.error.unknownError')
    }
  }

  return errorMessage
}

export default useErrorMessage
