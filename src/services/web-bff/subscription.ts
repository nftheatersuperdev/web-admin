import axios from 'axios'
import { SubscriptionListProps, SubscriptionListResponse } from 'services/web-bff/subscription.type'

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

export const getList: SubscriptionListProps = async (
  accessToken,
  query,
  limit = 10,
  page = 1
): Promise<SubscriptionListResponse> => {
  const response: SubscriptionListResponse = await axios
    .get(`https://run.mocky.io/v3/9c1191c1-6bd1-41f5-95ed-40ab94c5cd91/subscriptions`, {
      params: {
        ...query,
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

export default {
  getList,
}
