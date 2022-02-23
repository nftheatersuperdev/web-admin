import axios from 'axios'
import { SubscriptionListProps, SubscriptionListResponse } from 'services/web-bff/subscription.type'

export const getList: SubscriptionListProps = async (
  accessToken,
  query,
  limit,
  page
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
