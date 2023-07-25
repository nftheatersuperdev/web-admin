export interface User {
  userId: string
  password: string
  customerName: string
  email: string | null
  phoneNumber: string | null
  lineId: string
  lineUrl: string
  verifiedStatus: string | null
  customerStatus: string | null
  expiredDate: string
  dayLeft: number | null
  createdDate: string
  createdBy: string
  updatedDate: string
  updatedBy: string
}
