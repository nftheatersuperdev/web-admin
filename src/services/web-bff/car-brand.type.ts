export interface CarBrand {
  id: string
  name: string
  carModels: CarModel[]
}

export interface CarModel {
  id: string
  name: string
  subModelName: string
  year: number
  carSkus: CarSku[]
}

export interface CarSku {
  id: string
  color: string
  cars: Car[]
}

export interface Car {
  id: string
  plateNumber: string
  isActive: boolean
}
