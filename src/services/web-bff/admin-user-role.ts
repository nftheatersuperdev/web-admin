import { AdminBffAPI } from 'api/admin-bff-local'
import { Role } from 'services/web-bff/admin-user-role.type'

export const getRoles = async (): Promise<Role[]> => {
  const response: Role[] = await AdminBffAPI.get('v1/roles').then((response) => response.data.data)

  return response
}

export default {
  getRoles,
}
