import type { Response } from 'services/web-bff/response.type'

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
