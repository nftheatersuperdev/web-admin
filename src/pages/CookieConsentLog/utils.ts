import { TFunction, Namespace } from 'react-i18next'

export interface SelectOption {
  key: string
  label: string
  value: string
  isDefault?: boolean
}

export const getStatusList = (t: TFunction<Namespace>): SelectOption[] => {
  return [
    {
      key: 'accept',
      value: 'true',
      label: t('cookieConsentLog.documentStatus.accept'),
    },
    {
      key: 'decline',
      value: 'false',
      label: t('cookieConsentLog.documentStatus.decline'),
    },
  ]
}
