import { AdminBffAPI } from 'api/admin-bff'
import { NetflixDashboard } from './netflix.type'
import { YoutubeDashboard } from './youtube.type'

export const getNetflixDashboard = async (filterDate: string): Promise<NetflixDashboard> => {
  const response: NetflixDashboard = await AdminBffAPI.get('/v1/dashboard/netflix', {
    params: {
      filterDate,
    },
  }).then((response) => response.data)
  return response
}

export const getYoutubeDashboard = async (filterDate: string): Promise<YoutubeDashboard> => {
  const response: YoutubeDashboard = await AdminBffAPI.get('/v1/dashboard/youtube', {
    params: {
      filterDate,
    },
  }).then((response) => response.data)
  return response
}
