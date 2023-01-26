import { AdminBffAPI } from 'api/admin-bff'
import { BaseApi } from 'api/baseApi'
import {
  CarBff,
  CarListFilterRequestProps,
  CarListBffResponse,
  CarAvailableListBffResponse,
  CarAvailableListBffFilterRequestProps,
  CarModelPriceBff,
  CarUpdateByIdProps,
  CarModelPriceByIdProps,
  CarModelInputProps,
} from 'services/web-bff/car.type'

export const getCarById = async (carId: string): Promise<CarBff> => {
  const carDetail: CarBff = await AdminBffAPI.get(`/v1/cars/${carId}`).then(
    (response) => response?.data.data.car
  )
  return carDetail
}

export const getList = async ({
  filter,
  sort,
  size = 10,
  page = 0,
}: CarListFilterRequestProps): Promise<CarListBffResponse> => {
  const pageIndex = page + 1
  const response: CarListBffResponse = await AdminBffAPI.get('/v1/cars', {
    params: {
      ...filter,
      ...sort,
      pageIndex,
      size,
    },
  }).then((response) => response.data)

  return response
}

export const getListBFF = async ({
  filter,
  sort,
  size = 10,
  page = 0,
}: CarListFilterRequestProps): Promise<CarListBffResponse> => {
  const pageIndex = page + 1
  const response: CarListBffResponse = await BaseApi.get('/v2/cars', {
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
  const response: CarAvailableListBffResponse = await BaseApi.post('/v2/cars/usability/search', {
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
  const response: CarModelPriceBff = await BaseApi.get(`/v2/car-models/${id}`).then(
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
  await BaseApi.patch(`/v2/cars/${id}`, {
    vin,
    plateNumber,
    isActive,
  })

  return true
}

export const updateCarModelById = async ({
  id,
  carModel,
}: CarModelInputProps): Promise<boolean> => {
  await AdminBffAPI.patch(`/v2/car-models/${id}`, carModel)

  return true
}

export default {
  getCarById,
  getList,
  getModelPriceById,
  updateById,
  updateCarModelById,
}
