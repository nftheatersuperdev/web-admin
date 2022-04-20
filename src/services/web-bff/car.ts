import axios from 'axios'
import { BaseApi } from 'api/baseApi'
import {
  CarListProps,
  CarListFilterRequestProps,
  CarListResponse,
  CarListBffResponse,
  CarAvailableListBffResponse,
  CarAvailableListBffFilterRequestProps,
  CarByIdProps,
  Car,
  CarBodyTypesProps,
  CarBodyType,
  CarConnectorTypesProps,
  CarConnectorType,
  CarUpdateProps,
} from 'services/web-bff/car.type'

export const getList = async ({
  accessToken,
  query,
  sort,
  limit = 10,
  page = 1,
}: CarListProps): Promise<CarListResponse> => {
  const response: CarListResponse = await axios
    .get(`https://run.mocky.io/v3/962511e2-ef15-48f1-af5d-9fce95655af6`, {
      params: {
        ...query,
        ...sort,
        limit,
        page,
      },
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    })
    .then((response) => response.data)

  return response
}

export const getListBFF = async ({
  filter,
  sort,
  size = 10,
  page = 0,
}: CarListFilterRequestProps): Promise<CarListBffResponse> => {
  const pageIndex = page + 1
  const response: CarListBffResponse = await BaseApi.get('/v1/cars', {
    params: {
      ...filter,
      ...sort,
      pageIndex,
      size,
    },
  }).then((response) => response.data)

  return response
}

export const getAvailableListBFF = async ({
  filter,
  sort,
  size = 10,
  page = 0,
}: CarAvailableListBffFilterRequestProps): Promise<CarAvailableListBffResponse> => {
  const pageIndex = page + 1
  const response: CarAvailableListBffResponse = await BaseApi.post('/v1/cars/usability/search', {
    ...filter,
    ...sort,
    pageIndex,
    size,
  }).then((response) => response.data)

  return response
}

export const getById = async ({ accessToken, id }: CarByIdProps): Promise<Car> => {
  const response: Car = await axios
    .get(`https://run.mocky.io/v3/61fa6035-4660-47c8-9f3f-7d18f92fcc69/${id}`, {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    })
    .then((response) => response.data.data.car)

  return response
}

export const getBodyTypes = async ({ accessToken }: CarBodyTypesProps): Promise<CarBodyType[]> => {
  const response: CarBodyType[] = await axios
    .get(`https://run.mocky.io/v3/9ac8ded1-5e70-483c-9847-af36c35eeb41`, {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    })
    .then((response) => response.data.data.bodyTypes)

  return response
}

export const getConnectorTypes = async ({
  accessToken,
}: CarConnectorTypesProps): Promise<CarConnectorType[]> => {
  const response: CarConnectorType[] = await axios
    .get(`https://run.mocky.io/v3/866fbe05-0b7f-48f6-a52f-29c8032fbfea`, {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    })
    .then((response) => response.data.data.connectorTypes)

  return response
}

export const update = async ({ accessToken, updatedFields }: CarUpdateProps): Promise<boolean> => {
  await axios
    .patch(`https://run.mocky.io/v3/866fbe05-0b7f-48f6-a52f-29c8032fbfea`, updatedFields, {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    })
    .then((response) => response.data)

  return true
}

export default {
  getList,
  getById,
  getBodyTypes,
  getConnectorTypes,
  update,
}
