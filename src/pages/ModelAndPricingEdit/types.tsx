import { CarModel } from 'services/evme.types'

export interface ModelAndPricingEditParams {
  carModelId: string
}

export interface CarModelDataAndRefetchProps {
  carModel?: CarModel
  refetch: () => void
}
