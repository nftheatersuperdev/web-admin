import { Response } from 'services/web-bff/response.type'
import { SubscriptionListResponse, SubscriptionStatus } from 'services/web-bff/subscription.type'

export interface DashboardResponse extends Response {
  data: {
    dashboard: {
      totalCars: number
      totalAvailableCars: number
      totalSubscriptions: number
      totalUsers: number
      totalPayments: number
      totalKYC: number
      totalKYCApproved: number
      totalKYCRejected: number
      totalUpcomingCarsDelivery: number
      totalUpcomingCarsReturn: number
    }
  }
}

export interface DashboardProps {
  (accessToken: string): Promise<DashboardResponse>
}

export interface DashboardUpcomingCarsProps {
  (accessToken: string, status: SubscriptionStatus, date: string): Promise<SubscriptionListResponse>
}
