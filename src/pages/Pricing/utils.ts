import { PackagePriceInput } from 'services/evme.types'

export type Period = 'price1w' | 'price1m' | 'price3m' | 'price6m' | 'price9m'

export type CarModelPrice = Pick<PackagePriceInput, 'price' | 'fullPrice' | 'description'>

export interface CarModelPrices {
  price1w: CarModelPrice
  price1m: CarModelPrice
  price3m: CarModelPrice
  price6m: CarModelPrice
  price9m: CarModelPrice
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
  price9m: {
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
  isPrice9MChange: boolean
}

export const getPriceChanges = (
  carModelPrices: CarModelPrices,
  refCarModelPrices: CarModelPrices
): PriceChangeResult => {
  const { price1w, price1m, price3m, price6m, price9m } = carModelPrices
  const {
    price1w: refPrice1w,
    price1m: refPrice1m,
    price3m: refPrice3m,
    price6m: refPrice6m,
    price9m: refPrice9m,
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
    isPrice9MChange:
      price9m.price !== refPrice9m.price ||
      price9m.fullPrice !== refPrice9m.fullPrice ||
      price9m.description !== refPrice9m.description,
  }
}
