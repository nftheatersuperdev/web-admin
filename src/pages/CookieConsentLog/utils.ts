import { TFunction, Namespace } from 'react-i18next'
import { SelectOption } from 'components/SelectOption'

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
