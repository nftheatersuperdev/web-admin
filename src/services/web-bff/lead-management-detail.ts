import { AdminBffAPI } from 'api/admin-bff'
import {
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
