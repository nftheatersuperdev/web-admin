import { AdminBffAPI } from 'api/admin-bff'
import { DashboardResponse } from 'services/web-bff/dashboard.type'

export const getInformations = async (): Promise<DashboardResponse> => {
  const response: DashboardResponse = await AdminBffAPI.get('/v1/dashboard/summary').then(
    (response) => response.data
  )
  console.log('response ->', response)

  return response
}

export default {
  getInformations,
}
