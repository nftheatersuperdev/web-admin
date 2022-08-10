import { BaseApi } from 'api/baseApi'
import {
  CarActivity,
  CarActivitySchedule,
  CarActivityCreateScheduleProps,
  CarActivityService,
} from 'services/web-bff/car-activity.type'

export const createSchedule = async (
  body: CarActivityCreateScheduleProps
): Promise<CarActivity> => {
  const response: CarActivity = await BaseApi.post('/v1/bookings/reservation', body)
    .then((response) => response.data.data.data.booking)
    .catch((error) => {
      if (error.response) {
        throw error.response
      }
      throw error
    })

  return response
}

export const getServices = async (): Promise<CarActivityService[]> => {
  const response: CarActivityService[] = await BaseApi.get('/v1/bookings/types').then(
    (response) => response.data.data
  )

  return response
}

export const getActivitiesByCarId = async (carId: string): Promise<CarActivitySchedule[]> => {
  const response: CarActivitySchedule[] = await BaseApi.get(`/v1/bookings/carId/${carId}`).then(
    (response) => response.data.data
  )

  return response
}

export default {
  createSchedule,
  getServices,
  getActivitiesByCarId,
}
