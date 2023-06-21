import { AdminBffAPI } from 'api/admin-bff'
import {
  CookieConsentLogListResponse,
  CookieConsentCategoryListResponse,
  CookieConsentLogListRequest,
} from './cookie-consent-log.type'

export const getCookieConsentLogList = async ({
  data,
  size,
  page,
}: CookieConsentLogListRequest): Promise<CookieConsentLogListResponse> => {
  const responseAPI: CookieConsentLogListResponse = await AdminBffAPI.post(
    '/v1/customer-cookie-contents/acceptance/search',
    data,
    { params: { page, size } }
  ).then((response) => response.data)
  return responseAPI
}

export const getCategories = async (): Promise<CookieConsentCategoryListResponse['data']> => {
  const response: CookieConsentCategoryListResponse = await AdminBffAPI.get(
    '/v1/documents/cookie-contents/categories'
  ).then((response) => response.data)
  return response.data
}
