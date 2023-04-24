import { AdminBffAPI } from 'api/admin-bff'
import { ReSellerResponse } from './re-seller-area.type'

export const getReSellerList = async (): Promise<ReSellerResponse> => {
  const response: ReSellerResponse = await AdminBffAPI.get('/v1/reseller-list').then((response) => {
    return response.data.data
  })

  return response
}
export default {
  getReSellerList,
}
