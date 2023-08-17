import { AdminBffAPI } from 'api/admin-bff'
import {
  CreateYoutubeAccountRequest,
  CreateYoutubeAccountResponse,
  GetYoutubePackageResponse,
  YoutubeAccountListRequest,
  YoutubeAccountListResponse,
} from './youtube.type'

export const createYoutubeAccount = async (
  data: CreateYoutubeAccountRequest
): Promise<CreateYoutubeAccountResponse> => {
  const response: CreateYoutubeAccountResponse = await AdminBffAPI.post(`/v1/youtube`, data)
    .then((response) => response.data)
    .catch((error) => {
      if (error.response) {
        throw error.response
      }
      throw error
    })
  return response
}

export const getYoutubeAccountList = async ({
  data,
  size,
  page,
}: YoutubeAccountListRequest): Promise<YoutubeAccountListResponse> => {
  const response: YoutubeAccountListResponse = await AdminBffAPI.post('/v1/youtube/search', data, {
    params: {
      page,
      size,
    },
  }).then((response) => response.data)
  return response
}

export const getYoutubePackageByType = async (type: string): Promise<GetYoutubePackageResponse> => {
  console.log(type)
  const response = await AdminBffAPI.get(`/v1/youtube/package/${type}`).then(
    (response) => response.data
  )
  return response.data
}
