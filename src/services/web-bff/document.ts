import { BaseApi } from 'api/baseApi'
import { DocumentListResponse, GetDocumentProps } from 'services/web-bff/document.type'

export const getList = async ({
  page,
  size,
}: GetDocumentProps): Promise<DocumentListResponse['data']> => {
  const response: DocumentListResponse = await BaseApi.get(`/v1/documents`, {
    params: {
      pageIndex: page,
      size,
    },
  }).then((result) => result.data)

  return response.data
}

export default {
  getList,
}
