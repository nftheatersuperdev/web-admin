import { BaseApi } from 'api/baseApi'
import {
  GetDocumentProps,
  GetDocumentsProps,
  GetDocumentVersionsProps,
  Document,
  DocumentListResponse,
  DocumentVersionListResponse,
  CreateOrUpdateDocumentInput,
} from 'services/web-bff/document.type'

export const getDetail = async ({ code }: GetDocumentProps): Promise<Document> => {
  const response: Document = await BaseApi.get(`/v1/documents/${code}`).then(
    (result) => result.data.data
  )

  return response
}

export const getList = async ({
  page,
  size,
}: GetDocumentsProps): Promise<DocumentListResponse['data']> => {
  const response: DocumentListResponse = await BaseApi.get(`/v1/documents`, {
    params: {
      pageIndex: page,
      size,
    },
  }).then((result) => result.data)

  return response.data
}

export const getVersionList = async ({
  code,
  page,
  size,
}: GetDocumentVersionsProps): Promise<DocumentVersionListResponse['data']> => {
  const response: DocumentVersionListResponse = await BaseApi.get(
    `/v1/document-contents/${code}/versions`,
    {
      params: {
        pageIndex: page,
        size,
      },
    }
  ).then((result) => result.data)

  return response.data
}

export const createNew = async (documentInput: CreateOrUpdateDocumentInput): Promise<string> => {
  const { code } = documentInput
  const bodyObject = { ...documentInput }
  delete bodyObject.code

  const documentId: string = await BaseApi.post(
    `/v1/document-contents/${code}/versions`,
    bodyObject
  ).then((result) => result.data)

  return documentId
}

export const updateByVersion = async (
  documentInput: CreateOrUpdateDocumentInput
): Promise<string> => {
  const { code, version } = documentInput
  const bodyObject = { ...documentInput }
  delete bodyObject.code
  delete bodyObject.version

  const documentId: string = await BaseApi.patch(
    `/v1/document-contents/${code}/versions/${version}`,
    bodyObject
  ).then((result) => result.data)

  return documentId
}

export default {
  getDetail,
  getList,
  getVersionList,
  createNew,
  updateByVersion,
}
