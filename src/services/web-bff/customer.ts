import { AdminBffAPI } from 'api/admin-bff'
import { AxiosResponse } from 'axios'
import { response } from 'msw'
import {
  CreateCustomerRequest,
  CreateCustomerResponseAPI,
  CustomerListRequest,
  CustomerListResponse,
  CustomerOptionList,
  CustomerRequest,
  CustomerResponse,
  ExtendDayCustomerRequest,
  GetRegisteredUsers,
  IsDuplicateUrlResponse,
  RegisteredUsers,
  UpdateCustomerRequest,
} from './customer.type'

export const getCustomerList = async ({
  data,
  size,
  page,
}: CustomerListRequest): Promise<CustomerListResponse> => {
  const response: CustomerListResponse = await AdminBffAPI.post('/v1/customer/search', data, {
    params: {
      page,
      size,
    },
  }).then((response) => response.data)
  return response
}

export const getCustomerDetails = async ({
  userId,
}: CustomerRequest): Promise<CustomerResponse> => {
  const response: CustomerResponse = await AdminBffAPI.get(`/v1/customer/${userId}`).then(
    (response) => response.data
  )
  return response
}

export const getCustomerOptionList = async (
  account: string
): Promise<CustomerOptionList['data']> => {
  const response: CustomerOptionList = await AdminBffAPI.get(
    `/v1/customer/account/${account}`
  ).then((response) => response.data)
  return response.data
}

export const extendCustomerExpiredDay = async (
  data: ExtendDayCustomerRequest,
  userId: string
): Promise<CustomerResponse> => {
  const response: CustomerResponse = await AdminBffAPI.patch(
    `/v1/customer/${userId}/extend-day`,
    data
  ).then((response) => response.data)
  return response
}

export const createCustomer = async (
  data: CreateCustomerRequest
): Promise<CreateCustomerResponseAPI> => {
  const response: CreateCustomerResponseAPI = await AdminBffAPI.post('/v1/customer', data).then(
    (response) => response.data
  )
  return response
}

export const getNextStatus = async (status: string): Promise<string> => {
  const response = await AdminBffAPI.get(`/v1/customer/status/${status}/next`)
    .then((response) => response.data)
    .catch((error) => {
      if (error.response) {
        throw error.response
      }
      throw error
    })
  return response.data
}

export const updateCustomer = async (
  data: UpdateCustomerRequest,
  userId: string
): Promise<CustomerResponse> => {
  const response: CustomerResponse = await AdminBffAPI.patch(`/v1/customer/${userId}`, data)
    .then((response) => response.data)
    .catch((error) => {
      if (error.response) {
        throw error.response
      }
      throw error
    })
  return response
}

export const isUrlDeplicate = async (url: string): Promise<IsDuplicateUrlResponse> => {
  const response: IsDuplicateUrlResponse = await AdminBffAPI.post(
    `/v1/customer/line-url/isduplicate`,
    { url }
  ).then((response) => response.data)

  return response
}

export const deleteCustomer = async (userId: string): Promise<boolean> => {
  await AdminBffAPI.delete(`/v1/customer/${userId}`)
    .then((response) => response.data)
    .catch((error) => {
      if (error.response) {
        throw error.response
      }
      throw error
    })
  return true
}

export const getAllRegisteredUsers = async (): Promise<RegisteredUsers[]> => {
  const response = await AdminBffAPI.get(`/v1/event/register/members`)
    .then((response) => response.data)
    .catch((error) => {
      if (error.response) {
        throw error.response
      }
      throw error
    })
  return response.data
}
