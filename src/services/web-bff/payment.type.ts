export interface Payment {
  id: string
  userId: string
  scheduleId: string
  subscriptionId: string
  amount: number
  currency: string
  status: string
  statusMessage: string
  paymentMethod: string
  paymentType: string
  externalTrxId: string
  purpose: string
  updatedDate: string
  createdDate: string
}
