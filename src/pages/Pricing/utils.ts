import { PackagePriceInput } from 'services/evme.types'

export type Period = 'price1w' | 'price1m' | 'price3m' | 'price6m' | 'price12m'

export type CarModelPrice = Pick<PackagePriceInput, 'price' | 'fullPrice' | 'description'>

export interface CarModelPrices {
  price1w: CarModelPrice
  price1m: CarModelPrice
  price3m: CarModelPrice
  price6m: CarModelPrice
  price12m: CarModelPrice
}

export const defaultCarModelPrices = {
  price1w: {
    price: 0,
    fullPrice: 0,
    description: '',
  },
  price1m: {
    price: 0,
    fullPrice: 0,
    description: '',
  },
  price3m: {
    price: 0,
    fullPrice: 0,
    description: '',
  },
  price6m: {
    price: 0,
    fullPrice: 0,
    description: '',
  },
  price12m: {
    price: 0,
    fullPrice: 0,
    description: '',
  },
}

interface PriceChangeResult {
  isPrice1WChange: boolean
  isPrice1MChange: boolean
  isPrice3MChange: boolean
  isPrice6MChange: boolean
  isPrice12MChange: boolean
}

export const getPriceChanges = (
  carModelPrices: CarModelPrices,
  refCarModelPrices: CarModelPrices
): PriceChangeResult => {
  const { price1w, price1m, price3m, price6m, price12m } = carModelPrices
  const {
    price1w: refPrice1w,
    price1m: refPrice1m,
    price3m: refPrice3m,
    price6m: refPrice6m,
    price12m: refPrice12m,
  } = refCarModelPrices

  return {
    isPrice1WChange:
      price1w.price !== refPrice1w.price ||
      price1w.fullPrice !== refPrice1w.fullPrice ||
      price1w.description !== refPrice1w.description,
    isPrice1MChange:
      price1m.price !== refPrice1m.price ||
      price1m.fullPrice !== refPrice1m.fullPrice ||
      price1m.description !== refPrice1m.description,
    isPrice3MChange:
      price3m.price !== refPrice3m.price ||
      price3m.fullPrice !== refPrice3m.fullPrice ||
      price3m.description !== refPrice3m.description,
    isPrice6MChange:
      price6m.price !== refPrice6m.price ||
      price6m.fullPrice !== refPrice6m.fullPrice ||
      price6m.description !== refPrice6m.description,
    isPrice12MChange:
      price12m.price !== refPrice12m.price ||
      price12m.fullPrice !== refPrice12m.fullPrice ||
      price12m.description !== refPrice12m.description,
  }
}

export const getFieldComparator = (operator?: string): string => {
  switch (operator) {
    case 'equals':
    case '=':
      return 'eq'
    case '!=':
      return 'neq'
    case '>':
      return 'gt'
    case '>=':
      return 'gte'
    case '<':
      return 'lt'
    case '<=':
      return 'lte'
    default:
      return 'eq'
  }
}
