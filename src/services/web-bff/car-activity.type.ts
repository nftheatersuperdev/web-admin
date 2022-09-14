import { AdminUser } from 'services/web-bff/admin-user.type'
import { Car } from 'services/web-bff/car.type'
import { Response, ResponseWithPagination } from 'services/web-bff/response.type'

export enum CarActivityBookingTypeIds {
  RENT = 1,
  PREVENTIVE_MAINTENANCE = 2,
  RESERVED = 3,
  PR = 4,
  MARKETING = 5,
  BREAKDOWN = 6,
  REPAIR = 7,
  EVME_INTERNAL = 8,
  CARPOOL = 9,
  B2B_DELIVERED = 10,
  B2B_PENDING_DELIVERY = 11,
  RED_PLATE = 12,
  OTHERS = 13,
}

export interface CarActivity {
  brandName: string
  modelName: string
  subModelName: string
  modelYear: string
  color: string
  plateNumber: string
  status: string
  carId: string
}

export interface Schedule {
  bookingId: string
  bookingDetailId: string
  carId: Car['id']
  startDate: string
  endDate: string
  status: string
  bookingType: ScheduleService
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

export interface ScheduleService {
  id: number
  nameEn: string
  nameTh: string
}

export interface CarActivityListProps {
  page: number
  size: number
  carBrandId?: string
  carModelId?: string
  carSkuId?: string // In the UI we called as color
  plateNumber?: string
}

export interface CarActivityScheduleListProps {
  carId: string
  bookingTypeId?: string
  startDate?: string
  endDate?: string
  statusList?: string
}
export interface CarActivityScheduleEditProps {
  bookingId: string
  bookingDetailId: string
  data: {
    startDate: string
    endDate: string
    remark: string | null
  }
}
export interface CarActivityScheduleDeleteProps {
  bookingId: string
  bookingDetailId: string
}

export type CarActivityResponse = {
  data: {
    cars: CarActivity[]
  }
} & ResponseWithPagination

export type CarActivityScheduleResponse = {
  data: {
    activities: Schedule[]
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

export type ScheduleServiceResponse = {
  data: ScheduleService[]
} & Response
