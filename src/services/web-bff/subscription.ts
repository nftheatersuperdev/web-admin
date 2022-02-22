import axios from 'axios'
import { SubscriptionListProps, SubscriptionListResponse } from './subscription.type'

export const getList: SubscriptionListProps = async (
  accessToken,
  query,
  limit,
  page
): Promise<SubscriptionListResponse> => {
  const response: SubscriptionListResponse = await axios
    .get(`https://run.mocky.io/v3/68480f9b-e9c3-4b1a-b8a0-19ac98d49cc5/subscriptions`, {
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
