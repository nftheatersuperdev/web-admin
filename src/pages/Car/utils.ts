import { TFunction, Namespace } from 'react-i18next'

interface SelectOption {
  label: string
  value: string
}

export const CarStatus = {
  AVAILABLE: 'available',
  OUT_OF_SERVICE: 'out_of_service',
}

export const getCarStatusOptions = (t: TFunction<Namespace>): SelectOption[] => [
  {
    label: t('car.statuses.available'),
    value: CarStatus.AVAILABLE,
  },
  {
    label: t('car.statuses.outOfService'),
    value: CarStatus.OUT_OF_SERVICE,
  },
]

export const columnFormatCarStatus = (status: string, t: TFunction<Namespace>): string => {
  const enforceStatus = status.toLocaleLowerCase().replaceAll(' ', '_')

  switch (enforceStatus) {
    case CarStatus.AVAILABLE:
      return t('car.statuses.available')

    case CarStatus.OUT_OF_SERVICE:
      return t('car.statuses.outOfService')

    default:
      return '-'
  }
}
