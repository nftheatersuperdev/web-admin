import axios from 'axios'
import {
  SubscriptionListProps,
  SubscriptionListResponse,
  SubscriptionChangeCarProps,
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
  accessToken,
  query,
  sort,
  limit = 10,
  page = 1,
}: SubscriptionListProps): Promise<SubscriptionListResponse> => {
  const response: SubscriptionListResponse = await axios
    .get(`https://run.mocky.io/v3/02fef5e9-cfe4-496a-9c18-deb2d9a07fdc`, {
      params: {
        ...query,
        ...sort,
        limit,
        page,
      },
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    })
    .then((response) => response.data)

  return response
}

/**
 * This function allows operators to update a car with changing plate numbers.
 */
export const changeCar = async ({
  accessToken,
  subscriptionId,
  carId,
}: SubscriptionChangeCarProps): Promise<boolean> => {
  await axios.patch(
    `https://run.mocky.io/v3/bf06262b-712b-48de-9808-0b71c8c3958d`,
    {
      subscriptionId,
      carId,
    },
    {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
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
}
