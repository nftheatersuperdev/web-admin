import { BaseApi } from 'api/baseApi'
import {
  CookieConsentLogListProps,
  CookieConsentLogListResponse,
  ContentCategory,
} from './cookie-consent-log.type'

export const getList = async ({
  size = 10,
  page = 1,
}: CookieConsentLogListProps): Promise<CookieConsentLogListResponse> => {
  const response: CookieConsentLogListResponse = await BaseApi.get(
    '/v1/documents/cookie-contents',
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
  const response: ContentCategory[] = await BaseApi.get('/v1/documents/cookie-contents').then(
    (response) => response.data.data.contents
  )
  return response
}
