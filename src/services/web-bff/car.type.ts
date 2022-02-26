export interface Car {
  id: string
  name: string
  brand: string
  color: string
  plateNumber: string
  vin: string
  chargeTime: string
  fastChargeTime: string
  topSpeed: number
  seats: number
  acceleration: number
  range: number
  totalPower: number
  totalTorque: number
  batteryCapacity: number
  connectorType: {
    description: string
  }
  bodyType: {
    description: string
  }
}

export interface UpcomingCar {
  subscriptionId: string
  car: Partial<Car>
}
