import { AdminBffAPI } from 'api/admin-bff'
import { DashboardResponse } from 'services/web-bff/dashboard.type'

export const getInformations = async (resellerId?: string | null): Promise<DashboardResponse> => {
  const response: DashboardResponse = await AdminBffAPI.get('/v1/dashboard/summary', {
    params: { resellerServiceAreaId: resellerId },
  }).then((response) => response.data)

  return response
}

export default {
  getInformations,
}
