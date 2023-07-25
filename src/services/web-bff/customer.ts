import { AdminBffAPI } from 'api/admin-bff'
import {
  CreateCustomerRequest,
  CreateCustomerResponseAPI,
  CustomerListRequest,
  CustomerListResponse,
  CustomerOptionList,
  CustomerRequest,
  CustomerResponse,
  ExtendDayCustomerRequest,
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

export const getCustomerOptionList = async (): Promise<CustomerOptionList['data']> => {
  const response: CustomerOptionList = await AdminBffAPI.get('/v1/customer/list').then(
    (response) => response.data
  )
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
