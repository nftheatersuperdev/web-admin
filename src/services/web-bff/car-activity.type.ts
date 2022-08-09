import { Response, ResponseWithPagination } from 'services/web-bff/response.type'

export interface CarActivity {
  brandName: string
  modelName: string
  subModelName: string
  modelYear: string
  color: string
  plateNumer: string
  status: string
  carId: string
}

export interface CarActivityCreateProps {
  carId: string
  startDate: string
  endDate: string
  bookingTypeId: string
  remark: string | null
}

export interface CarActivityServices {
  id: string
  name: string
}

export type CarActivityResponse = {
  data: {
    activities: CarActivity[]
  }
} & ResponseWithPagination

export type CarActivityCreatedResponse = {
  data: {
    booking: {
      id: string
      bookingDetailId: string
    }
  }
} & Response

export type CarActivityServicesResponse = {
  data: CarActivityServices[]
} & Response
