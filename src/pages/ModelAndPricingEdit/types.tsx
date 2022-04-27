import { CarModelPriceBff } from 'services/web-bff/car.type'

export interface ModelAndPricingEditParams {
  id: string
}

export interface CarModelDataAndRefetchProps {
  car?: CarModelPriceBff
}
