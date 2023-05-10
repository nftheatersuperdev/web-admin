import { AdminBffAPI } from 'api/admin-bff'
import {
  BookingRental,
  SubscriptionBookingListProps,
  SubscriptionListResponse,
  SubscriptionChangeCarInBookingProps,
  UpdateCarReplacementRequestBody,
} from 'services/web-bff/booking.type'

export const status = {
  RESERVED: 'reserved',
  ACCEPTED: 'accepted',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  UPCOMING_CANCELLED: 'upcoming_cancelled',
  REFUSED: 'refused',
  COMPLETED: 'completed',
  EXTENDED: 'extended',
  MANUAL_EXTENDED: 'manual_extended',
  ACCEPTED_CAR_CONDITIONS: 'accepted_car_conditions',
  ACCEPTED_AGREEMENT: 'accepted_agreement',
}

export const getList = async ({
  query,
  filters,
}: SubscriptionBookingListProps): Promise<SubscriptionListResponse> => {
  const response: SubscriptionListResponse = await AdminBffAPI.post(
    '/v2/bookings/rental/search',
    {
      ...filters,
    },
    {
      params: query,
    }
  )
    .then((response) => response.data)
    .catch(() => {
      return {
        data: {
          bookingDetails: [],
        },
      }
    })

  return response
}

export const getDetailById = async (id: string): Promise<BookingRental> => {
  const response: BookingRental = await AdminBffAPI.post('/v2/bookings/rental/search', {
    bookingDetailId: id,
  }).then(({ data }) => data.data.bookingDetails[0])

  return response
}

export const getDetailsById = async (bookingId: string): Promise<BookingRental[]> => {
  const response: BookingRental[] = await AdminBffAPI.post('/v2/bookings/rental/search', {
    bookingId,
  }).then(({ data }) => data.data.bookingDetails)

  return response
}

/**
 * This function allows operators to update a car with changing plate numbers.
 */
export const changeCarInBooking = async ({
  bookingId,
  bookingDetailId,
  carId,
}: SubscriptionChangeCarInBookingProps): Promise<boolean> => {
  await AdminBffAPI.patch(
    `/v1/bookings/rental/${bookingId}/details/${bookingDetailId}/delivery/cars`,
    {
      carId,
    }
  )

  return true
}

export const updateCarReplacement = async ({
  bookingId,
  bookingDetailId,
  carId,
  deliveryDate,
  deliveryTime,
  deliveryAddress,
}: UpdateCarReplacementRequestBody): Promise<string> => {
  const result = await AdminBffAPI.patch(
    `/v1/bookings/${bookingId}/details/${bookingDetailId}/rental/car-replacement`,
    {
      carId,
      deliveryDate,
      deliveryTime,
      deliveryAddress,
    }
  )
    .then(({ data }) => data.data.bookingDetailId)
    .catch((error) => {
      if (error.response) {
        throw error.response
      }
      throw error
    })

  return result
}

export default {
  getList,
  getDetailById,
  changeCarInBooking,
  updateCarReplacement,
}
