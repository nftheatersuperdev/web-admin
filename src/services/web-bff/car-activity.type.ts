import { AdminUser } from 'services/web-bff/admin-user.type'
import { Car } from 'services/web-bff/car.type'
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

export interface CarActivitySchedule {
  bookingId: string
  bookingDetailId: string
  carId: Car['id']
  startDate: string
  endDate: string
  status: string
  bookingType: CarActivityService
  remark: string | null
  updatedBy: AdminUser['id']
  updatedDate: string
}

export interface CarActivityCreateScheduleProps {
  carId: string
  startDate: string
  endDate: string
  bookingTypeId: string
  remark: string | null
}

export interface CarActivityService {
  id: string
  name: string
}

export type CarActivityScheduleResponse = {
  data: {
    activities: CarActivitySchedule[]
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

export type CarActivityServiceResponse = {
  data: CarActivityService[]
} & Response
