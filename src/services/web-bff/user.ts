import { AdminBffAPI } from 'api/admin-bff'
import { UserGroupInput } from 'services/evme.types'
import {
  UserDeleteLogListResponse,
  UserDeleteLogProps,
  UserGroupListResponse,
  UserGroupProps,
  UserGroupResponse,
  UserListResponse,
  UserMeProps,
  CustomerReActivateResponse,
} from './user.type'

export const searchUser = async ({ data, size, page }: UserMeProps): Promise<UserListResponse> => {
  const response: UserListResponse = await AdminBffAPI.post('/v1/users/search', data, {
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
}: UserGroupProps): Promise<UserGroupListResponse> => {
  const response: UserGroupListResponse = await AdminBffAPI.post(
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

export const creatUserGroup = async (data: UserGroupInput): Promise<UserGroupResponse> => {
  const response: UserGroupResponse = await AdminBffAPI.post('/v1/customer-groups', data).then(
    (response) => response.data
  )
  return response
}

export const updateUserGroup = async (data: UserGroupInput): Promise<UserGroupResponse> => {
  const response: UserGroupResponse = await AdminBffAPI.patch(
    `/v1/customer-groups/${data.id}`,
    data
  ).then((response) => response.data)
  return response
}

export const getAllUserDeleteLog = async ({
  userId,
  firstName,
  lastName,
  email,
  page = 1,
  size = 10,
}: UserDeleteLogProps): Promise<UserDeleteLogListResponse> => {
  const response: UserDeleteLogListResponse = await AdminBffAPI.post(
    `/v1/account-deactivation/logs/search`,
    {
      customerId: userId,
      firstName,
      lastName,
      email,
    },
    {
      params: {
        page,
        size,
      },
    }
  ).then((response) => response.data)
  return response
}

export const reActivateCustomer = async (customerId: string): Promise<boolean> => {
  const response: CustomerReActivateResponse = await AdminBffAPI.post(
    `/v1/customers/${customerId}/activation`
  ).then((response) => response.data)
  return response.status === 'success'
}
