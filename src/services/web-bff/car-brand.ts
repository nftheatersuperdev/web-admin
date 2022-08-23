import { BaseApi } from 'api/baseApi'
import { CarBrand } from 'services/web-bff/car-brand.type'

export const getCarBrands = async (): Promise<CarBrand[]> => {
  const response: CarBrand[] = await BaseApi.get('v1/car-brands').then(
    (response) => response.data.data
  )

  return response
}

export default {
  getCarBrands,
}
