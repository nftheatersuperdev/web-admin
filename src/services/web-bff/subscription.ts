import { AdminBffAPI } from 'api/admin-bff'
import { BaseApi } from 'api/baseApi'
import axios from 'axios'
import {
  SubscriptionBookingListProps,
  SubscriptionListResponse,
  SubscriptionChangeCarProps,
  SubscriptionChangeCarInBookingProps,
  SubscriptionExtendEndDateProps,
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
  ).then((response) => response.data)

  return response
}

/**
 * This function allows operators to update a car with changing plate numbers.
 */
export const changeCar = async ({
  subscriptionId,
  carId,
}: SubscriptionChangeCarProps): Promise<boolean> => {
  await BaseApi.patch(`/v1/subscriptions/${subscriptionId}/delivery/cars`, {
    carId,
  })

  return true
}

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

/**
 * This function allows operators to extend the end date of a subscription
 */
export const extend = async ({
  accessToken,
  subscriptionId,
  endDate,
}: SubscriptionExtendEndDateProps): Promise<boolean> => {
  await axios.patch(
    `https://run.mocky.io/v3/bf06262b-712b-48de-9808-0b71c8c3958d`,
    {
      subscriptionId,
      endDate,
    },
    {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    }
  )

  return true
}

export default {
  getList,
  changeCar,
  changeCarInBooking,
}
