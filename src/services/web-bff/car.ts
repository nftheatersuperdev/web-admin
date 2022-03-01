import axios from 'axios'
import type { CarListProps, CarListResponse } from 'services/web-bff/car.type'

export const getList = async ({
  accessToken,
  query,
  sort,
  limit = 10,
  page = 1,
}: CarListProps): Promise<CarListResponse> => {
  const response: CarListResponse = await axios
    .get(`https://run.mocky.io/v3/bbac756a-3b8a-4e99-94e7-1b50a584b1ee`, {
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

export default {
  getList,
}
