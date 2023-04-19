import { AdminBffAPI } from 'api/admin-bff'
import {
  NewSubscriptionBodyProps,
  NewSubscriptionResponses,
} from 'services/web-bff/new-subscription.type'

export const createPackage = async (
  body: NewSubscriptionBodyProps
): Promise<NewSubscriptionResponses['data']> => {
  const accessToken = body.accessToken

  const response: NewSubscriptionResponses['data'] = await AdminBffAPI.post(
    '/v1/subscription/packages',
    body,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  ).then((response) => response.data.data)

  return response
}
