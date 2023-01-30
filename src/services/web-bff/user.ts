import { BaseApi } from 'api/baseApi'
import { AdminBffAPI } from 'api/admin-bff'
import { UserGroupInput } from 'services/evme.types'
import {
  UserByUserGroupListResponse,
  UserDeleteLogListResponse,
  UserDeleteLogProps,
  UserGroupListResponse,
  UserGroupProps,
  UserGroupResponse,
  UserInGroupInputProps,
  UserListResponse,
  /*UserListResponse,*/
  UserMeProps,
  CustomerReActivateResponse,
} from './user.type'

export const searchUser = async ({ data, size, page }: UserMeProps): Promise<UserListResponse> => {
  const response: UserListResponse = await BaseApi.post('/v1/users/search', data, {
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
  const response: UserGroupResponse = await BaseApi.post('/v1/user-groups', data).then(
    (response) => response.data
  )
  return response
}

export const updateUserGroup = async (data: UserGroupInput): Promise<UserGroupResponse> => {
  const response: UserGroupResponse = await BaseApi.put('/v1/user-groups', data, {
    params: {
      id: data.id,
    },
  }).then((response) => response.data)
  return response
}

export const searchUserInUserGroup = async ({
  data,
}: UserMeProps): Promise<UserByUserGroupListResponse> => {
  /*/v1/user-groups/${id}/users/search*/
  const response: UserByUserGroupListResponse = await BaseApi.post(
    `b078b478-3b61-4dd8-92ec-bcd05a2c7571`,
    data
  ).then((response) => response.data)
  return response
}

export const getAllUser = async (): Promise<UserListResponse> => {
  /*/v1/users*/
  const response: UserListResponse = await BaseApi.get(`d8602965-6526-4fe3-86e4-04695dc7dd70`).then(
    (response) => response.data
  )
  return response
}

export const updateUserInUserGroup = async ({
  users,
}: UserInGroupInputProps): Promise<UserInGroupInputProps> => {
  /*/v1/user-groups/{id}/users*/
  const response: UserInGroupInputProps = await BaseApi.put(
    `a3644dec-12b4-4000-bfb9-f4ecbaa9320f`,
    users
  ).then((response) => response.data.userGroup)
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
  const response: UserDeleteLogListResponse = await AdminBffAPI.get(
    `/v1/account-deactivation/logs/search`,
    {
      params: {
        userId,
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
