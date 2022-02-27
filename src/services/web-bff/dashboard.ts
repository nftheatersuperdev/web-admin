import axios from 'axios'
import type { DashboardProps, DashboardResponse } from 'services/web-bff/dashboard.type'

export const getInformations: DashboardProps = async (
  accessToken: string
): Promise<DashboardResponse> => {
  const response: DashboardResponse = await axios
    .get(`https://run.mocky.io/v3/96c4fd29-072f-427e-915c-974dc5422457`, {
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    })
    .then((response) => response.data)

  return response
}

export default {
  getInformations,
}
