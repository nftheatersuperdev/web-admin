import { AdminBffAPI } from 'api/admin-bff'
import {
  CookieConsentLogListProps,
  CookieConsentLogListResponse,
  ContentCategory,
} from './cookie-consent-log.type'

export const getList = async ({
  ipAddress,
  category,
  isAccepted,
  size = 10,
  page = 1,
}: CookieConsentLogListProps): Promise<CookieConsentLogListResponse> => {
  const response: CookieConsentLogListResponse = await AdminBffAPI.post(
    '/v1/customer-cookie-contents/acceptance/search',
    {
      ipAddress,
      category,
      isAccepted,
    },
    {
      params: {
        page,
        size,
      },
    }
  ).then((response) => response.data)
  return response
}

export const getCategories = async (): Promise<ContentCategory[]> => {
  const response: ContentCategory[] = await AdminBffAPI.get(
    '/v1/documents/cookie-contents/categories'
  ).then((response) => response.data.data.categories)
  return response
}
