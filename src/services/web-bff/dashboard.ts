import { AdminBffAPI } from 'api/admin-bff'
import { NetflixDashboard } from './netflix.type'
import { YoutubeDashboard } from './youtube.type'

export const getNetflixDashboard = async (): Promise<NetflixDashboard> => {
  const response: NetflixDashboard = await AdminBffAPI.get('/v1/dashboard/netflix').then(
    (response) => response.data
  )
  return response
}

export const getYoutubeDashboard = async (): Promise<YoutubeDashboard> => {
  const response: YoutubeDashboard = await AdminBffAPI.get('/v1/dashboard/youtube').then(
    (response) => response.data
  )
  return response
}
