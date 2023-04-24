export interface CarOwner {
  id: string
  name: string
}
export type CarOwnerResponse = {
  owners: CarOwner[]
}
