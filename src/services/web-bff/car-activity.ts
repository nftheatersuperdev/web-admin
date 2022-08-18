import { BaseApi } from 'api/baseApi'
import {
  CarActivity,
  CarActivityResponse,
  CarActivitySchedule,
  CarActivityCreateScheduleProps,
  CarActivityService,
  CarActivityListProps,
} from 'services/web-bff/car-activity.type'

export const createSchedule = async (
  body: CarActivityCreateScheduleProps
): Promise<CarActivity> => {
  const response: CarActivity = await BaseApi.post('/v1/bookings/reservation', body)
    .then(
      ({
        data: {
          data: { booking },
        },
      }) => booking
    )
    .catch((error) => {
      if (error.response) {
        throw error.response
      }
      throw error
    })

  return response
}

export const getActivities = async (
  params: CarActivityListProps
): Promise<CarActivityResponse['data']> => {
  const response: CarActivityResponse['data'] = await BaseApi.get('/v1/car-activities/search', {
    params,
  }).then((response) => response.data.data)

  return response
}

export const getSchedulesByCarId = async (carId: string): Promise<CarActivitySchedule[]> => {
  /**
   * The API doesn't has pagination right now.
   */
  const response: CarActivitySchedule[] = await BaseApi.get(`/v1/bookings/carId/${carId}`).then(
    (response) => response.data.data
  )

  return response
}

export const getServices = async (): Promise<CarActivityService[]> => {
  const response: CarActivityService[] = await BaseApi.get('/v1/bookings/types').then(
    (response) => response.data.data
  )

  return response
}

export default {
  createSchedule,
  getActivities,
  getSchedulesByCarId,
  getServices,
}
