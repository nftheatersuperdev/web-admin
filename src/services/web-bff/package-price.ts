import { BaseApi } from 'api/baseApi'
import axios from 'axios'
import {
  PackagePrice,
  PackagePriceBff,
  PackagePriceByCarIdProps,
  PackagePriceCreateByCarIdProps,
} from 'services/web-bff/package-price.type'

export const getByCarId = async ({
  accessToken,
  carId,
}: PackagePriceByCarIdProps): Promise<PackagePrice[]> => {
  const response = await axios
    .get(`https://run.mocky.io/v3/226adcd1-6fe9-417b-ae08-f4295101b75a/${carId}`, {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    })
    .then((response) => response.data.data.packagePrices)

  return response
}

export const createByCarId = async ({
  accessToken,
  data,
}: PackagePriceCreateByCarIdProps): Promise<boolean> => {
  await axios.post(`https://run.mocky.io/v3/226adcd1-6fe9-417b-ae08-f4295101b75a`, data, {
    headers: {
      authorization: `Bearer ${accessToken}`,
    },
  })

  return true
}

export const getActive = async (): Promise<PackagePriceBff[]> => {
  const response: PackagePriceBff[] = await BaseApi.get('/v2/package-prices/active').then(
    (response) => response.data.data.packages
  )

  return response
}

export default {
  getByCarId,
  getActive,
  createByCarId,
}
