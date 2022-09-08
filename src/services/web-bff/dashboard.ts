import { BaseApi } from 'api/baseApi'
import { DashboardResponse } from 'services/web-bff/dashboard.type'

export const getInformations = async (): Promise<DashboardResponse> => {
  const response: DashboardResponse = await BaseApi.get('/v2/dashboard/summary').then(
    (response) => response.data
  )

  return response
}

export default {
  getInformations,
}
