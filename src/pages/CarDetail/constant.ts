import { TFunction, Namespace } from 'react-i18next'

export interface CarDetailParams {
  id: string
}

export interface SelectOption {
  label: string
  value: string
}

export const CarStatus = {
  PUBLISHED: 'published',
  AVAILABLE: 'available',
  OUT_OF_SERVICE: 'out_of_service',
}

export const getCarStatusOnlyUsedInBackendOptions = (t: TFunction<Namespace>): SelectOption[] => [
  {
    label: t('car.statuses.published'),
    value: CarStatus.PUBLISHED,
  },
  {
    label: t('car.statuses.outOfService'),
    value: CarStatus.OUT_OF_SERVICE,
  },
]
