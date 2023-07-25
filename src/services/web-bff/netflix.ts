import { AdminBffAPI } from 'api/admin-bff'
import {
  CreateNetflixAccountRequest,
  CreateNetflixAccountResponseAPI,
  NetflixAccountListRequest,
  NetflixAccountListResponse,
  NetflixAccountRequest,
  NetflixAccountResponse,
  UpdateLinkUserNetflixRequest,
  UpdateLinkUserNetflixResponse,
} from './netflix.type'

export const getNetflixAccountList = async ({
  data,
  size,
  page,
}: NetflixAccountListRequest): Promise<NetflixAccountListResponse> => {
  const response: NetflixAccountListResponse = await AdminBffAPI.post('/v1/netflix/search', data, {
    params: {
      page,
      size,
    },
  }).then((response) => response.data)
  return response
}

export const getNetflixAccount = async ({
  id,
}: NetflixAccountRequest): Promise<NetflixAccountResponse> => {
  const response: NetflixAccountResponse = await AdminBffAPI.get(`/v1/netflix/${id}`).then(
    (response) => response.data
  )
  return response
}

export const createNetflixAccount = async (
  data: CreateNetflixAccountRequest
): Promise<CreateNetflixAccountResponseAPI> => {
  const response: CreateNetflixAccountResponseAPI = await AdminBffAPI.post(
    `/v1/netflix`,
    data
  ).then((response) => response.data)
  return response
}

export const linkUserToNetflixAccount = async (
  data: UpdateLinkUserNetflixRequest,
  accountId: string
): Promise<UpdateLinkUserNetflixResponse> => {
  const response: UpdateLinkUserNetflixResponse = await AdminBffAPI.patch(
    `/v1/netflix/${accountId}/user`,
    data
  ).then((response) => response.data)
  return response
}

export const deleteUserFromNetflixAccount = async (
  userId: string,
  accountId: string
): Promise<boolean> => {
  await AdminBffAPI.delete(`/v1/netflix/${accountId}/user/${userId}`).then(
    (response) => response.data
  )
  return true
}

export const updateNetflixAccount = async (
  accountId: string,
  status: boolean
): Promise<boolean> => {
  await AdminBffAPI.patch(`/v1/netflix/${accountId}/status/${status}`).then(
    (response) => response.data
  )
  return true
}
