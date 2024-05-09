export interface Package {
  id: string
  module: string
  name: string
  day: number
  price: number
  device: string
  type: string
  isActive: boolean
  updatedDate: string
}

export interface UpdatePackage extends Package {
  updatedBy: string
}
