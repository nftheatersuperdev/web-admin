import { AdminBffAPI } from 'api/admin-bff'
import {
  SubscriptionPackageListParamsProps,
  SubscriptionPackageListResponse,
} from './subscription-package.type'

export const getSubscriptionPackages = async (
  params: SubscriptionPackageListParamsProps
): Promise<SubscriptionPackageListResponse['data']> => {
  const response: SubscriptionPackageListResponse['data'] = await AdminBffAPI.get(
    '/v1/subscription/packages',
    {
      params,
    }
  ).then((response) => response.data.data)

  return response
}

export default {
  getSubscriptionPackages,
}
