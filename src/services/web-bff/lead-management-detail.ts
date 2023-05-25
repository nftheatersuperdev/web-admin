import { AdminBffAPI } from 'api/admin-bff'
import { AxiosRequestConfig } from 'axios'
import {
  ExportExcelLeadFormSubmittionBodyProps,
  LeadFormSubmissionsBodyProps,
  LeadFormSubmissionsResponse,
} from './lead-management-detail.type'

export const getLeadFormSubmittion = async ({
  leadFormId,
  sortBy,
  sortDirection,
  page = 1,
  size = 10,
}: LeadFormSubmissionsBodyProps): Promise<LeadFormSubmissionsResponse> => {
  const response: LeadFormSubmissionsResponse = await AdminBffAPI.post(
    `/v1/referral/leads/forms/${leadFormId}/submissions/search`,
    {
      page,
      size,
      sortBy,
      sortDirection,
    }
  ).then((response) => response.data)
  return response
}

export const exportExcellLeadFormSubmittion = async ({
  leadFormId,
  startDate,
  endDate,
}: ExportExcelLeadFormSubmittionBodyProps): Promise<Blob> => {
  const config: AxiosRequestConfig = {
    headers: {
      'Content-Type': 'application/json',
    },
    responseType: 'blob',
  }
  const response: Blob = await AdminBffAPI.post(
    `/v1/referral/leads/forms/${leadFormId}/submissions/export`,
    { startDate, endDate },
    config
  ).then((response) => response.data)
  return response
}
