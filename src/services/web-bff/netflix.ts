import { AdminBffAPI } from 'api/admin-bff'
import {
  AllNetflixAccount,
  AvailableAdditionResponse,
  CreateAdditionAccountRequest,
  CreateAdditionAccountResponse,
  CreateNetflixAccountRequest,
  CreateNetflixAccountResponseAPI,
  NetflixAccountListRequest,
  NetflixAccountListResponse,
  NetflixAccountRequest,
  NetflixAccountResponse,
  TransferUsersRequest,
  UpdateAdditionalAccountRequest,
  UpdateLinkUserNetflixRequest,
  UpdateLinkUserNetflixResponse,
  UpdateNetflixAccountRequest,
  UpdateNetflixAccountResponse,
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
  const response: CreateNetflixAccountResponseAPI = await AdminBffAPI.post(`/v1/netflix`, data)
    .then((response) => response.data)
    .catch((error) => {
      if (error.response) {
        throw error.response
      }
      throw error
    })
  return response
}

export const linkUserToNetflixAccount = async (
  data: UpdateLinkUserNetflixRequest,
  accountId: string
): Promise<UpdateLinkUserNetflixResponse> => {
  const response: UpdateLinkUserNetflixResponse = await AdminBffAPI.patch(
    `/v1/netflix/${accountId}/user`,
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

export const deleteUserFromNetflixAccount = async (
  userId: string,
  accountId: string
): Promise<boolean> => {
  await AdminBffAPI.delete(`/v1/netflix/${accountId}/user/${userId}`)
    .then((response) => response.data)
    .catch((error) => {
      if (error.response) {
        throw error.response
      }
      throw error
    })
  return true
}

export const updateNetflixAccountStatus = async (
  accountId: string,
  status: boolean
): Promise<boolean> => {
  await AdminBffAPI.patch(`/v1/netflix/${accountId}/status/${status}`)
    .then((response) => response.data)
    .catch((error) => {
      if (error.response) {
        throw error.response
      }
      throw error
    })
  return true
}

export const unlinkAdditionalAccounts = async (
  accountId: string,
  additionalId: string
): Promise<boolean> => {
  await AdminBffAPI.delete(`/v1/netflix/${accountId}/additional/${additionalId}`)
    .then((response) => response.data)
    .catch((error) => {
      if (error.response) {
        throw error.response
      }
      throw error
    })
  return true
}

export const deleteUserFromAdditionalAccount = async (
  userId: string,
  additionalId: string,
  accountId: string
): Promise<boolean> => {
  await AdminBffAPI.delete(`/v1/netflix/${accountId}/additional/${additionalId}/user/${userId}`)
    .then((response) => response.data)
    .catch((error) => {
      if (error.response) {
        throw error.response
      }
      throw error
    })
  return true
}

export const getAvailableAdditionalAccounts = async (): Promise<
  AvailableAdditionResponse['data']
> => {
  const response: AvailableAdditionResponse = await AdminBffAPI.get(
    `/v1/netflix/additional/available`
  ).then((response) => response.data)
  return response.data
}

export const linkAdditionalAccounts = async (
  accountId: string,
  additionalId: string
): Promise<boolean> => {
  await AdminBffAPI.patch(`/v1/netflix/${accountId}/additional/${additionalId}`)
    .then((response) => response.data)
    .catch((error) => {
      if (error.response) {
        throw error.response
      }
      throw error
    })
  return true
}

export const createAndLinkAdditionalAccounts = async (
  data: CreateAdditionAccountRequest,
  accountId: string
): Promise<CreateAdditionAccountResponse['data']> => {
  const response: CreateAdditionAccountResponse = await AdminBffAPI.post(
    `/v1/netflix/${accountId}/additional`,
    data
  )
    .then((response) => response.data)
    .catch((error) => {
      if (error.response) {
        throw error.response
      }
      throw error
    })
  return response.data
}

export const updateNetflixAccount = async (
  data: UpdateNetflixAccountRequest,
  accountId: string
): Promise<UpdateNetflixAccountResponse['data']> => {
  const response: UpdateNetflixAccountResponse = await AdminBffAPI.patch(
    `/v1/netflix/${accountId}`,
    data
  )
    .then((response) => response.data)
    .catch((error) => {
      if (error.response) {
        throw error.response
      }
      throw error
    })
  return response.data
}

export const getAllNetflixAccounts = async (): Promise<AllNetflixAccount['data']> => {
  const response: AllNetflixAccount = await AdminBffAPI.get(`/v1/netflixes`).then(
    (response) => response.data
  )
  return response.data
}

export const updateAdditionalAccount = async (
  data: UpdateAdditionalAccountRequest,
  accountId: string,
  additionalId: string
): Promise<UpdateNetflixAccountResponse['data']> => {
  const response: UpdateNetflixAccountResponse = await AdminBffAPI.patch(
    `/v1/netflix/${accountId}/additional/${additionalId}/edit`,
    data
  ).then((response) => response.data)
  return response.data
}

export const transferUsers = async (
  data: TransferUsersRequest,
  accountId: string
): Promise<boolean> => {
  await AdminBffAPI.post(`/v1/netflix/${accountId}/user/transfer`, data)
    .then((response) => response.data)
    .catch((error) => {
      if (error.response) {
        throw error.response
      }
      throw error
    })
  return true
}
