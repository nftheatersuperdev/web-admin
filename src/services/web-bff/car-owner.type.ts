export interface CarOwner {
  id: string
  name: string
  profileType: string
}
export type CarOwnerResponse = {
  owners: CarOwner[]
}
