import { AdminBffAPI } from 'api/admin-bff'
import {
  CustomerGroupListResponse,
  CustomerGroupProps,
  CustomerGroupResponse,
  CustomerListResponse,
  CustomerMeProps,
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
  )
    .then((response) => response.data)
    .catch(() => {
      return {
        status: 'error',
        data: {
          customerGroups: [],
          pagination: {
            page,
            size,
            totalPage: 0,
            totalRecords: 0,
          },
        },
      }
    })
  return response
}

export const creatCustomerGroup = async (
  data: CustomerGroupInput
): Promise<CustomerGroupResponse> => {
  const response: CustomerGroupResponse = await AdminBffAPI.post('/v1/customer-groups', data).then(
    (response) => response.data
  )
  return response
}

export const updateCustomerGroup = async (
  data: CustomerGroupInput
): Promise<CustomerGroupResponse> => {
  const customerGroupId = data.id
  const updateObject = {
    name: data.name,
  }
  const response: CustomerGroupResponse = await AdminBffAPI.put(
    `/v1/customer-groups/${customerGroupId}`,
    updateObject
  ).then((response) => response.data)
  return response
}
