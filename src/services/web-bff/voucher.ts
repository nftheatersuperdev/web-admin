import { AdminBffAPI } from 'api/admin-bff'
import {
  Voucher,
  VoucherListProps,
  VoucherListResponse,
  VoucherInputBff,
} from 'services/web-bff/voucher.type'

export const getList = async ({
  data,
  size = 10,
  page = 1,
}: VoucherListProps): Promise<VoucherListResponse> => {
  const response: VoucherListResponse = await AdminBffAPI.post('/v1/vouchers/search', data, {
    params: {
      page,
      size,
    },
  }).then((response) => response.data)

  return response
}

export const createBff = async (data: VoucherInputBff): Promise<string> => {
  const voucherId: string = await AdminBffAPI.post('/v1/vouchers', data).then(
    (response) => response.data.data.id
  )

  return voucherId
}

export const updateBff = async (data: VoucherInputBff): Promise<string> => {
  const updateData = { ...data }
  delete updateData.id
  const voucherId: string = await AdminBffAPI.put(`/v1/vouchers/${data.id}`, updateData).then(
    (response) => response.data.data.id
  )

  return voucherId
}

export const getByCodeBff = async (code: string, isEdit = false): Promise<Voucher | undefined> => {
  if (!isEdit) {
    return undefined
  }

  const response: Voucher = await AdminBffAPI.get(`/v1/vouchers/${code}`).then(
    (response) => response.data.data.voucher
  )

  return response
}

export default {
  getList,
  getByCodeBff,
  createBff,
  updateBff,
}
