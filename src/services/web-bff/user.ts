import { BaseApi } from 'api/baseApi'
import { UserGroupInput } from 'services/evme.types'
import {
  UserByUserGroupListResponse,
  UserGroupListResponse,
  UserGroupProps,
  UserGroupResponse,
  UserInGroupInputProps,
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

export const searchUserGroup = async ({
  data,
  page,
  size,
}: UserGroupProps): Promise<UserGroupListResponse> => {
  /*/v1/user-groups/search*/
  /*123ca793-f4d3-4a53-8b4a-c8e15dcae876 */
  const response: UserGroupListResponse = await BaseApi.post('/v1/user-groups/search', data, {
    params: {
      page,
      size,
    },
  }).then((response) => response.data)
  return response
}

export const creatUserGroup = async (data: UserGroupInput): Promise<UserGroupResponse> => {
  /*v1/user-groups*/
  const response: UserGroupResponse = await BaseApi.post('/v1/user-groups', data).then(
    (response) => response.data
  )
  return response
}

export const updateUserGroup = async (data: UserGroupInput): Promise<UserGroupResponse> => {
  /* v1/user-groups/{id}*/
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
