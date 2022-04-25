import axios from 'axios'
import { BaseApi } from 'api/baseApi'
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
  data,
  size = 10,
  page = 1,
}: VoucherListProps): Promise<VoucherListResponse> => {
  const response: VoucherListResponse = await BaseApi.post('/v1/vouchers/search', data, {
    params: {
      page,
      size,
    },
  }).then((response) => response.data)

  return response
}

export const getById = async ({ id }: VoucherByIdProps): Promise<Voucher> => {
  const response: Voucher = await BaseApi.get('f5b24ff3-06a4-4851-b566-081606dd49fd', {
    params: {
      id,
    },
  }).then((response) => response.data.data.voucher)

  return response
}

export const create = async ({ data }: VoucherCreateProps): Promise<Voucher> => {
  const response: Voucher = await BaseApi.post('f5b24ff3-06a4-4851-b566-081606dd49fd', data).then(
    (response) => response.data.data.voucher
  )

  return response
}

export const update = async ({ data }: VoucherUpdateProps): Promise<Voucher> => {
  const response: Voucher = await BaseApi.put('f5b24ff3-06a4-4851-b566-081606dd49fd', data).then(
    (response) => response.data.data.voucher
  )

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
