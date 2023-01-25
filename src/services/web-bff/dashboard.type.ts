import { Response } from 'services/web-bff/response.type'
import { SubscriptionListResponse, SubscriptionStatus } from 'services/web-bff/subscription.type'

export interface DashboardResponse extends Response {
  data: {
    summary: {
      car: CarSummaryResponse
      booking: SubscriptionSummaryResponse
      customer: UserSummaryResponse
    }
  }
}

export interface CarSummaryResponse extends Response {
  numberOfCarInService: number
  total: number
}

export interface SubscriptionSummaryResponse extends Response {
  numberOfDeliveryTaskInThisDay: number
  numberOfReturnTaskInThisDay: number
  total: number
}

export interface UserSummaryResponse extends Response {
  numberOfKycPendingStatus: number
  numberOfKycRejectedStatus: number
  numberOfKycVerifiedStatus: number
  total: number
}

export interface DashboardProps {
  (accessToken: string): Promise<DashboardResponse>
}

export interface DashboardUpcomingCarsProps {
  (accessToken: string, status: SubscriptionStatus, date: string): Promise<SubscriptionListResponse>
}
