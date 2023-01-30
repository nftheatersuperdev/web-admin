import { AdminBffAPI } from 'api/admin-bff'
import { PackagePriceBff } from 'services/web-bff/package-price.type'

export const getActive = async (): Promise<PackagePriceBff[]> => {
  const response: PackagePriceBff[] = await AdminBffAPI.get('/v1/package-prices/active').then(
    (response) => response.data.data.packages
  )

  return response
}

export default {
  getActive,
}
