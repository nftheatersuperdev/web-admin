import { BaseApi } from 'api/baseApi'
import {
  CarActivityResponse,
  CarActivitySchedule,
  CarActivityScheduleDeleteProps,
  CarActivityScheduleEditProps,
  CarActivityScheduleListProps,
  CarActivityCreateScheduleProps,
  CarActivityService,
  CarActivityListProps,
} from 'services/web-bff/car-activity.type'

export const createSchedule = async (body: CarActivityCreateScheduleProps): Promise<boolean> => {
  await BaseApi.post('/v1/bookings/reservation', body)
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

  return true
}

export const getActivities = async (
  params: CarActivityListProps
): Promise<CarActivityResponse['data']> => {
  const response: CarActivityResponse['data'] = await BaseApi.get('/v1/car-activities/search', {
    params,
  }).then((response) => response.data.data)

  return response
}

export const getSchedulesByCarId = async ({
  carId,
  bookingTypeId,
  startDate,
  endDate,
}: CarActivityScheduleListProps): Promise<CarActivitySchedule[]> => {
  /**
   * The API doesn't has pagination right now.
   */
  const response: CarActivitySchedule[] = await BaseApi.get(`/v1/bookings/carId/${carId}`, {
    params: {
      bookingTypeId,
      startDate,
      endDate,
    },
  })
    .then(({ data }) => data.data)
    .catch((error) => {
      if (error?.response?.data) {
        throw new Error(`${error.response.data.message} (${error.response.data.status})`)
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

export const editSchedule = async ({
  bookingId,
  bookingDetailId,
  data,
}: CarActivityScheduleEditProps): Promise<boolean> => {
  await BaseApi.patch(`/v1/bookings/reservation/${bookingId}/details/${bookingDetailId}`, data)

  return true
}

export const deleteSchedule = async ({
  bookingId,
  bookingDetailId,
}: CarActivityScheduleDeleteProps): Promise<boolean> => {
  await BaseApi.delete(`/v1/bookings/reservation/${bookingId}/details/${bookingDetailId}`).then(
    (response) => response.data.data
  )

  return true
}

export default {
  createSchedule,
  getActivities,
  getSchedulesByCarId,
  getServices,
  deleteSchedule,
}
