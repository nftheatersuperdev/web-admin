export interface ICarModelItem {
  id: string
  modelName: string
}

export interface ICreateCarMutationParam {
  vin: string
  plateNumber: string
}

export interface IAddCarToCarModelParam {
  carId: string
  carModelId: string
}

export interface ICreateCarMutationResponse {
  createCar: ICreateCarMutationResItem
}

export interface ICreateCarMutationResItem {
  id: string
  vin: string
  plateNumber: string
}
