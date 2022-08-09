import { BaseApi } from 'api/baseApi'
import {
  CarActivity,
  CarActivityCreateProps,
  CarActivityServices,
} from 'services/web-bff/car-activity.type'

export const create = async (body: CarActivityCreateProps): Promise<CarActivity> => {
  const response: CarActivity = await BaseApi.post('/v1/bookings/reservation', body).then(
    (response) => response.data.data.data.booking
  )

  return response
}

export const getServices = async (): Promise<CarActivityServices[]> => {
  const response: CarActivityServices[] = await BaseApi.get('/v1/bookings/types').then(
    (response) => response.data.data
  )

  return response
}

export default {
  create,
  getServices,
}
