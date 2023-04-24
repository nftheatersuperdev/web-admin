export interface Location {
  id: string
  areaNameTh: string
  areaNameEn: string
}
export type LocationResponse = {
  locations: Location[]
}
