import { AdminBffAPI } from 'api/admin-bff'
import { Package, UpdatePackage } from './package-type'

export const getAllPackage = async (): Promise<Package[]> => {
  const response = await AdminBffAPI.get('/v1/packages')
    .then((response) => response.data)
    .catch((error) => {
      if (error.response) {
        throw error.response
      }
      throw error
    })
  return response.data
}

export const getPackageById = async (id: string): Promise<Package> => {
  const response = await AdminBffAPI.get(`/v1/packages/${id}`)
    .then((response) => response.data)
    .catch((error) => {
      if (error.response) {
        throw error.response
      }
      throw error
    })
  return response.data
}

export const updatePackage = async (id: string, data: UpdatePackage): Promise<boolean> => {
  await AdminBffAPI.patch(`/v1/packages/${id}`, data)
    .then((response) => response.data)
    .catch((error) => {
      if (error.response) {
        throw error.response
      }
      throw error
    })
  return true
}
