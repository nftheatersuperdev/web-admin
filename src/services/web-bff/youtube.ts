import { AdminBffAPI } from 'api/admin-bff'
import {
  CreateYoutubeAccountRequest,
  CreateYoutubeAccountResponse,
  GetYoutubePackageResponse,
  UpdateLinkUserYoutubeRequest,
  UpdateLinkUserYoutubeResponse,
  YoutubeAccountListRequest,
  YoutubeAccountListResponse,
  YoutubeAccountRequest,
  YoutubeAccountResponse,
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

export const getYoutubeAccount = async ({
  id,
}: YoutubeAccountRequest): Promise<YoutubeAccountResponse> => {
  const response: YoutubeAccountResponse = await AdminBffAPI.get(`/v1/youtube/${id}`).then(
    (response) => response.data
  )
  return response
}

export const getYoutubePackageByType = async (type: string): Promise<GetYoutubePackageResponse> => {
  const response = await AdminBffAPI.get(`/v1/youtube/package/${type}`).then(
    (response) => response.data
  )
  return response.data
}

export const linkUserToYoutubeAccount = async (
  data: UpdateLinkUserYoutubeRequest,
  accountId: string
): Promise<UpdateLinkUserYoutubeResponse> => {
  const response: UpdateLinkUserYoutubeResponse = await AdminBffAPI.patch(
    `/v1/youtube/${accountId}/user`,
    data
  )
    .then((response) => response.data)
    .catch((error) => {
      if (error.response) {
        throw error.response
      }
      throw error
    })
  return response
}
