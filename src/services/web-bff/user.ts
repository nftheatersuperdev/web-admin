import { BaseApi } from 'api/baseApi'
import { UserGroupInput } from 'services/evme.types'
import {
  UserByUserGroupListResponse,
  UserGroupListResponse,
  UserGroupProps,
  UserGroupResponse,
  UserListResponse,
  /*UserListResponse,*/
  UserMeProps,
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

export const searchUserGroup = async ({ data }: UserGroupProps): Promise<UserGroupListResponse> => {
  /*/v1/user-groups/search*/
  const response: UserGroupListResponse = await BaseApi.post(
    '123ca793-f4d3-4a53-8b4a-c8e15dcae876',
    data
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
  id,
  data,
}: UserMeProps): Promise<UserByUserGroupListResponse> => {
  /*/v1/user-groups/${id}/users/search*/
  console.log(id)
  const response: UserByUserGroupListResponse = await BaseApi.post(
    `b078b478-3b61-4dd8-92ec-bcd05a2c7571`,
    data
  ).then((response) => response.data)
  return response
}
