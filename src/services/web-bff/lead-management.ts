import { AdminBffAPI } from 'api/admin-bff'
import { LeadSearchBodyProps, LeadSearchResponse } from './lead-management.type'

export const getLeadList = async ({
  sortBy,
  sortDirection,
  nameContain,
  page = 1,
  size = 10,
}: LeadSearchBodyProps): Promise<LeadSearchResponse> => {
  const response: LeadSearchResponse = await AdminBffAPI.post('/v1/referral/leads/forms/search', {
    page,
    size,
    sortBy,
    sortDirection,
    nameContain,
  }).then((response) => response.data)
  return response
}
