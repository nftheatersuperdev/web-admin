import { AdminBffAPI } from 'api/admin-bff'
import { NetflixDashboard } from './netflix.type'

export const getNetflixDashboard = async (): Promise<NetflixDashboard> => {
  const response: NetflixDashboard = await AdminBffAPI.get('/v1/dashboard/netflix').then(
    (response) => response.data
  )
  return response
}
