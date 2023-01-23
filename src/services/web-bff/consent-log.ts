import { AdminBffAPI } from 'api/admin-bff'
import { ConsentLogListProps, ConsentLogListResponse } from './consent-log.type'

export const getList = async ({
  email,
  isAccepted,
  codeName,
  size = 10,
  page = 1,
}: ConsentLogListProps): Promise<ConsentLogListResponse> => {
  const response: ConsentLogListResponse = await AdminBffAPI.get('/v1/customer-agreements', {
    params: {
      email,
      isAccepted,
      codeName,
      page,
      size,
    },
  }).then((response) => response.data)
  return response
}
