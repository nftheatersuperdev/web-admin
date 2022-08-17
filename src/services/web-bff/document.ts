import config from 'config'
import dayjs from 'dayjs'
import dayjsUtc from 'dayjs/plugin/utc'
import dayjsTimezone from 'dayjs/plugin/timezone'
import { DEFAULT_DATETIME_FORMAT_ISO } from 'utils'
import { BaseApi } from 'api/baseApi'
import {
  GetDocumentProps,
  GetDocumentsProps,
  GetDocumentVersionProps,
  GetDocumentVersionsProps,
  Document,
  DocumentListResponse,
  DocumentVersionListResponse,
  CreateOrUpdateDocumentInput,
} from 'services/web-bff/document.type'

dayjs.extend(dayjsUtc)
dayjs.extend(dayjsTimezone)

const convertDateISO = (datetime: dayjs.Dayjs | string): string => {
  return dayjs(datetime).tz(config.timezone).format(DEFAULT_DATETIME_FORMAT_ISO)
}

/**
 * getDetail returns current version of document
 * @param GetDocumentProps
 * @returns Document
 */
export const getDetail = async ({ code }: GetDocumentProps): Promise<Document> => {
  const response: Document = await BaseApi.get(`/v1/documents/${code}`).then(
    (result) => result.data.data
  )

  return response
}

export const getVersionDetail = async ({
  code,
  version,
}: GetDocumentVersionProps): Promise<Document> => {
  const response: Document = await BaseApi.get(
    `/v1/document-contents/${code}/versions/${version}`
  ).then((result) => result.data.data)

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

export const getLatestVersion = async (code: string): Promise<Document> => {
  const response = await getVersionList({ code, page: 1, size: 1 })

  return response.versions[0]
}

export const createNew = async (documentInput: CreateOrUpdateDocumentInput): Promise<string> => {
  const { code, effectiveDate } = documentInput
  const documentObject = {
    ...documentInput,
    effectiveDate: convertDateISO(effectiveDate),
  }
  delete documentObject.code

  const documentId: string = await BaseApi.post(
    `/v1/document-contents/${code}/versions`,
    documentObject
  ).then((result) => result.data)

  return documentId
}

export const updateByVersion = async (
  documentInput: CreateOrUpdateDocumentInput
): Promise<string> => {
  const { code, version, effectiveDate } = documentInput
  const documentObject = {
    ...documentInput,
    effectiveDate: convertDateISO(effectiveDate),
  }
  delete documentObject.code
  delete documentObject.version

  const documentId: string = await BaseApi.put(
    `/v1/document-contents/${code}/versions/${version}`,
    documentObject
  )
    .then((result) => result.data)
    .catch((error) => {
      throw error.response.data
    })

  return documentId
}

export default {
  getDetail,
  getList,
  getVersionList,
  getLatestVersion,
  createNew,
  updateByVersion,
}