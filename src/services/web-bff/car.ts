import axios from 'axios'
import { BaseApi } from 'api/baseApi'
import {
  CarListProps,
  CarListFilterRequestProps,
  CarListResponse,
  CarListBffResponse,
  CarAvailableListBffResponse,
  CarAvailableListBffFilterRequestProps,
  CarModelPriceBff,
  CarUpdateByIdProps,
  CarModelPriceByIdProps,
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

export const getModelPriceById = async ({
  id,
}: CarModelPriceByIdProps): Promise<CarModelPriceBff> => {
  const response: CarModelPriceBff = await BaseApi.get(`/v1/car-models/${id}`).then(
    (response) => response.data.data
  )

  return response
}

export const updateById = async ({
  id,
  vin,
  plateNumber,
  isActive,
}: CarUpdateByIdProps): Promise<boolean> => {
  await BaseApi.patch(`/v1/cars/${id}`, {
    vin,
    plateNumber,
    isActive,
  })

  return true
}

export default {
  getList,
  getModelPriceById,
  updateById,
}
