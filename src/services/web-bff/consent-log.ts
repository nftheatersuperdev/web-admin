import { AdminBffAPI } from 'api/admin-bff'
import {
  ConsentLogListRequest,
  ConsentLogListProps,
  ConsentLogListResponse,
} from './consent-log.type'

export const getList = async ({
  email,
  isAccepted,
  codeName,
  size = 10,
  page = 1,
}: ConsentLogListProps): Promise<ConsentLogListResponse> => {
  const response: ConsentLogListResponse = await AdminBffAPI.post(
    '/v1/customer-agreements/search',
    {
      email,
      isAccepted,
      codeName,
    },
    { params: { page, size } }
  ).then((response) => response.data)
  return response
}

export const getConsentLogList = async ({
  data,
  size,
  page,
}: ConsentLogListRequest): Promise<ConsentLogListResponse> => {
  const response: ConsentLogListResponse = await AdminBffAPI.post(
    '/v1/customer-agreements/search',
    data,
    { params: { page, size } }
  ).then((response) => response.data)
  return response
}
