import { TFunction, Namespace, Resources } from 'react-i18next'
import { ResponseError } from 'services/web-bff/document.type'

export const mapAlertErrorField = (
  key: string,
  t: TFunction<Namespace<keyof Resources>>
): string => {
  switch (key) {
    case 'remark':
      return t('documents.addEdit.revisionSummary')
    case 'contentTh':
      return t('documents.addEdit.contentTh')
    case 'contentEn':
      return t('documents.addEdit.contentEn')
    default:
      return ''
  }
}

interface ErrorData {
  nextEffectiveDate?: string
}

export const mapErrorMessage = (
  error: ResponseError,
  t: TFunction<Namespace<keyof Resources>>,
  data?: ErrorData
): string => {
  const isInvalidReqeust = error.status === 'invalid_request'
  const errorMessage = error.message
  if (isInvalidReqeust) {
    if (errorMessage.includes('more than today')) {
      return t('documents.error.effectiveDateLessThanToday')
    }
    if (errorMessage.includes('must be before effective')) {
      return t('documents.error.effectiveDateLessThanNextVersion', {
        nextEffectiveDate: data?.nextEffectiveDate,
      })
    }
  }
  return t('error.unknown')
}

export default {
  mapAlertErrorField,
  mapErrorMessage,
}
