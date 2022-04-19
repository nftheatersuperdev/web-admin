import axios from 'axios'
import {
  Voucher,
  VoucherListProps,
  VoucherListResponse,
  VoucherByIdProps,
  VoucherCreateProps,
  VoucherUpdateProps,
  VoucherDeleteByIdProps,
} from 'services/web-bff/voucher.type'

export const getList = async ({
  accessToken,
  query,
  sort,
  limit = 10,
  page = 1,
}: VoucherListProps): Promise<VoucherListResponse> => {
  const response: VoucherListResponse = await axios
    .get(`https://run.mocky.io/v3/5bac4eeb-26b0-46c8-99b6-ab1e0b9250a4`, {
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

export const getById = async ({ accessToken, id }: VoucherByIdProps): Promise<Voucher> => {
  const response: Voucher = await axios
    .get(`https://run.mocky.io/v3/f5b24ff3-06a4-4851-b566-081606dd49fd/${id}`, {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    })
    .then((response) => response.data.data.voucher)

  return response
}

export const create = async ({ accessToken, data }: VoucherCreateProps): Promise<Voucher> => {
  const response: Voucher = await axios
    .post(`https://run.mocky.io/v3/f5b24ff3-06a4-4851-b566-081606dd49fd`, data, {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    })
    .then((response) => response.data.data.voucher)

  return response
}

export const update = async ({ accessToken, data }: VoucherUpdateProps): Promise<Voucher> => {
  const response: Voucher = await axios
    .patch(`https://run.mocky.io/v3/f5b24ff3-06a4-4851-b566-081606dd49fd`, data, {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    })
    .then((response) => response.data.data.voucher)

  return response
}

export const deleteById = async ({ accessToken, id }: VoucherDeleteByIdProps): Promise<Voucher> => {
  const response: Voucher = await axios
    .delete(`https://run.mocky.io/v3/f5b24ff3-06a4-4851-b566-081606dd49fd`, {
      data: {
        id,
      },
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    })
    .then((response) => response.data.data.voucher)

  return response
}

export default {
  getList,
  getById,
  create,
  update,
  deleteById,
}
