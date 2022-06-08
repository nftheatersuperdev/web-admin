import { TFunction, Namespace, Resources } from 'react-i18next'
import { ResponseError } from 'services/web-bff/document.type'

export const mapErrorMessage = (
  error: ResponseError,
  t: TFunction<Namespace<keyof Resources>>
): string => {
  const isInvalidReqeust = error.status === 'invalid_request'
  if (isInvalidReqeust && error.message === 'Effective Date should more than today') {
    return t('documents.error.effectiveDateLessThanToday')
  }
  return t('error.unknown')
}

export default {
  mapErrorMessage,
}
