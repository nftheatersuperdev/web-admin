import { AdminBffAPI } from 'api/admin-bff'
import {
  CarActivityResponse,
  CarActivityScheduleDeleteProps,
  CarActivityScheduleEditProps,
  CarActivityScheduleListProps,
  CarActivityScheduleListResponse,
  CarActivityCreateScheduleProps,
  CarActivityListParamsProps,
  CarActivityListBodyProps,
  ScheduleService,
} from 'services/web-bff/car-activity.type'

export const ScheduleStatus = {
  UPCOMING_CANCELLED: 'upcoming_cancelled',
}

export const createSchedule = async (body: CarActivityCreateScheduleProps): Promise<boolean> => {
  await AdminBffAPI.post('/v1/bookings/reservation', body)
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
  params: CarActivityListParamsProps,
  body: CarActivityListBodyProps
): Promise<CarActivityResponse['data']> => {
  const response: CarActivityResponse['data'] = await AdminBffAPI.post(
    '/v1/car-activities/search',
    body,
    {
      params,
    }
  ).then((response) => response.data.data)

  return response
}

export const getSchedulesByCarId = async ({
  page = 1,
  size = 10,
  carId,
  bookingTypeId,
  startDate,
  endDate,
  statusList = ['accepted', 'reserved', 'cancelled'],
}: CarActivityScheduleListProps): Promise<CarActivityScheduleListResponse['data']> => {
  /**
   * The API doesn't has pagination right now.
   */
  const response: CarActivityScheduleListResponse['data'] = await AdminBffAPI.post(
    `/v1/bookings/cars/${carId}/search`,
    {
      bookingTypeId,
      startDate,
      endDate,
      statusList,
    },
    {
      params: {
        page,
        size,
      },
    }
  )
    .then(({ data }) => data.data)
    .catch((error) => {
      if (error?.response?.data) {
        throw new Error(`${error.response.data.message} (${error.response.data.status})`)
      }
      throw error
    })

  return response
}

export const getScheduleServices = async (): Promise<ScheduleService[]> => {
  const response: ScheduleService[] = await AdminBffAPI.get('/v1/bookings/types').then(
    (response) => response.data.data
  )

  return response
}

export const editSchedule = async ({
  bookingId,
  bookingDetailId,
  data,
}: CarActivityScheduleEditProps): Promise<boolean> => {
  await AdminBffAPI.patch(
    `/v1/bookings/reservation/${bookingId}/details/${bookingDetailId}`,
    data
  ).catch((error) => {
    if (error.response) {
      throw error.response
    }
    throw error
  })

  return true
}

export const deleteSchedule = async ({
  bookingId,
  bookingDetailId,
}: CarActivityScheduleDeleteProps): Promise<boolean> => {
  await AdminBffAPI.delete(`/v1/bookings/reservation/${bookingId}/details/${bookingDetailId}`).then(
    (response) => response.data.data
  )

  return true
}

export default {
  createSchedule,
  getActivities,
  getSchedulesByCarId,
  getScheduleServices,
  deleteSchedule,
}
