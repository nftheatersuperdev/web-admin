import { AdminBffAPI } from 'api/admin-bff'
import { CarOwnerResponse } from './car-owner.type'

export const getCarOwnerList = async (): Promise<CarOwnerResponse> => {
  const response: CarOwnerResponse = await AdminBffAPI.get('/v1/cars/owners').then((response) => {
    return response.data.data
  })

  return response
}
export default {
  getCarOwnerList,
}
