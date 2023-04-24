import { AdminBffAPI } from 'api/admin-bff'
import { LocationResponse } from './location.type'

export const getLocationList = async (): Promise<LocationResponse> => {
  const response: LocationResponse = await AdminBffAPI.get('/v1/locations').then((response) => {
    return response.data.data
  })

  return response
}
export default {
  getLocationList,
}
