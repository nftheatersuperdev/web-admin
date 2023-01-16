import { BaseApi } from 'api/baseApi'
import { AdminBffAPI } from 'api/admin-bff'
import {
  CustomerByCustomerGroupListResponse,
  CustomerDeleteLogListResponse,
  CustomerDeleteLogProps,
  CustomerGroupListResponse,
  CustomerGroupProps,
  CustomerGroupResponse,
  CustomerListResponse,
  CustomerMeProps,
  CustomerReActivateResponse,
  CustomerGroupInput,
} from './customer.type'

export const searchCustomer = async ({
  data,
  size,
  page,
}: CustomerMeProps): Promise<CustomerListResponse> => {
  const response: CustomerListResponse = await AdminBffAPI.post('/v1/customers/search', data, {
    params: {
      page,
      size,
    },
  }).then((response) => response.data)
  return response
}

export const searchCustomerGroup = async ({
  data,
  page,
  size,
}: CustomerGroupProps): Promise<CustomerGroupListResponse> => {
  const response: CustomerGroupListResponse = await AdminBffAPI.post(
    '/v1/customer-groups/search',
    data,
    {
      params: {
        page,
        size,
      },
    }
  ).then((response) => response.data)
  return response
}

export const creatCustomerGroup = async (
  data: CustomerGroupInput
): Promise<CustomerGroupResponse> => {
  const response: CustomerGroupResponse = await BaseApi.post('/v1/customer-groups', data).then(
    (response) => response.data
  )
  return response
}

export const updateCustomerGroup = async (
  data: CustomerGroupInput
): Promise<CustomerGroupResponse> => {
  const response: CustomerGroupResponse = await BaseApi.put('/v1/customer-groups', data, {
    params: {
      id: data.id,
    },
  }).then((response) => response.data)
  return response
}

export const searchCustomerInCustomerGroup = async ({
  data,
}: CustomerMeProps): Promise<CustomerByCustomerGroupListResponse> => {
  const response: CustomerByCustomerGroupListResponse = await BaseApi.post(
    `b078b478-3b61-4dd8-92ec-bcd05a2c7571`,
    data
  ).then((response) => response.data)
  return response
}

export const getAllCustomerDeleteLog = async ({
  customerId,
  firstName,
  lastName,
  email,
  page = 1,
  size = 10,
}: CustomerDeleteLogProps): Promise<CustomerDeleteLogListResponse> => {
  const response: CustomerDeleteLogListResponse = await BaseApi.get(
    `/v1/account-deactivation/logs/search`,
    {
      params: {
        customerId,
        firstName,
        lastName,
        email,
        page,
        size,
      },
    }
  ).then((response) => response.data)
  return response
}

export const reActivateCustomer = async (customerId: string): Promise<boolean> => {
  const response: CustomerReActivateResponse = await BaseApi.post(
    `/v1/customers/${customerId}/activation`
  ).then((response) => response.data)
  return response.status === 'success'
}
