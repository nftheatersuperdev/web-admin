import { AdminBffAPI } from 'api/admin-bff'
import { CarBrand } from 'services/web-bff/car-brand.type'

export const getCarBrands = async (): Promise<CarBrand[]> => {
  const response: CarBrand[] = await AdminBffAPI.get('v1/car-brands').then(
    (response) => response.data.data
  )

  return response
}

export default {
  getCarBrands,
}
