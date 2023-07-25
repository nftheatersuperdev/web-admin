import { AdminBffAPI } from 'api/admin-bff'
import { SystemConfigListRequest, SystemConfigResponse } from './setting-config.type'

export const getSystemConfigList = async ({
  data,
  size,
  page,
}: SystemConfigListRequest): Promise<SystemConfigResponse> => {
  const responseAPI: SystemConfigResponse = await AdminBffAPI.post(
    '/v1/system-config/search',
    data,
    { params: { page, size } }
  ).then((response) => response.data)
  return responseAPI
}
