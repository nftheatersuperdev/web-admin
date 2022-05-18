export const carConnectorTypes: CarConnectorType[] = [
  {
    chargingType: 'ac',
    description: 'Type 2 (Mennekes)',
    id: '603e14c5-fa3e-43a3-a754-8d611fdf6f1b',
    type: 'TYPE_2',
  },
  {
    chargingType: 'dc',
    description: 'SAE Combo DC CCS',
    id: 'd3015805-f3ba-4f4c-88eb-bff2ff43bbc5',
    type: 'CCS',
  },
  {
    chargingType: 'ac',
    description: 'J-1772',
    id: 'ad4ef227-790d-485d-872a-b640e1aa9ce3',
    type: 'TYPE_1',
  },
  {
    chargingType: 'dc',
    description: 'CHAdeMO',
    id: 'c59b8141-13cf-40c0-9b10-8b5f69f97819',
    type: 'CHADEMO',
  },
]

export interface CarConnectorType {
  id: string
  type: string
  description: string
  chargingType: 'ac' | 'dc'
}
