export interface ResellerServiceArea {
  id: string
  areaNameTh: string
  areaNameEn: string
}
export type LocationResponse = {
  locations: ResellerServiceArea[]
}
