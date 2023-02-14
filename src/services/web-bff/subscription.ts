import { AdminBffAPI } from 'api/admin-bff'
import {
  SubscriptionBookingListProps,
  SubscriptionListResponse,
  SubscriptionChangeCarInBookingProps,
} from 'services/web-bff/subscription.type'

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
    '/v1/bookings/rental/search',
    {
      ...filters,
      isExtend: !!filters?.isExtend || null,
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

export default {
  getList,
  changeCarInBooking,
}
