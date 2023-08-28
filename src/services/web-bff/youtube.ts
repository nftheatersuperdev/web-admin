import { AdminBffAPI } from 'api/admin-bff'
import {
  CreateYoutubeAccountRequest,
  CreateYoutubeAccountResponse,
  GetYoutubePackageResponse,
  UpdateLinkUserYoutubeRequest,
  UpdateLinkUserYoutubeResponse,
  UpdateYoutubeAccountRequest,
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

export const updateYoutubeAccountStatus = async (
  accountId: string,
  status: string
): Promise<boolean> => {
  await AdminBffAPI.patch(`v1/youtube/${accountId}/status/${status}`)
    .then((response) => response.data)
    .catch((error) => {
      if (error.response) {
        throw error.response
      }
      throw error
    })
  return true
}

export const updateYoutubeAccount = async (
  data: UpdateYoutubeAccountRequest,
  accountId: string
): Promise<YoutubeAccountResponse> => {
  const response = await AdminBffAPI.patch(`/v1/youtube/${accountId}`, data)
    .then((response) => response.data)
    .catch((error) => {
      if (error.response) {
        throw error.response
      }
      throw error
    })
  return response.data
}

export const deleteUserFromYoutubeAccount = async (
  userId: string,
  accountId: string
): Promise<boolean> => {
  await AdminBffAPI.delete(`/v1/youtube/${accountId}/user/${userId}`)
    .then((response) => response.data)
    .catch((error) => {
      if (error.response) {
        throw error.response
      }
      throw error
    })
  return true
}
