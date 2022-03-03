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
    .get(`https://run.mocky.io/v3/7f974300-5ee0-4816-bc4c-d73019bbc575`, {
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
