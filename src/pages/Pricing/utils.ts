import { TFunction, Namespace } from 'react-i18next'
import { PackagePriceInput } from 'services/evme.types'

export type Period = 'price3d' | 'price1w' | 'price1m' | 'price3m' | 'price6m' | 'price12m'

export type CarModelPrice = Pick<PackagePriceInput, 'price' | 'fullPrice' | 'description'>

export interface CarModelPrices {
  price3d: CarModelPrice
  price1w: CarModelPrice
  price1m: CarModelPrice
  price3m: CarModelPrice
  price6m: CarModelPrice
  price12m: CarModelPrice
}

export const defaultCarModelPrices = {
  price3d: {
    price: 0,
    fullPrice: 0,
    description: '',
  },
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
  isPrice3DChange: boolean
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
  const { price3d, price1w, price1m, price3m, price6m, price12m } = carModelPrices
  const {
    price3d: refPrice3d,
    price1w: refPrice1w,
    price1m: refPrice1m,
    price3m: refPrice3m,
    price6m: refPrice6m,
    price12m: refPrice12m,
  } = refCarModelPrices

  return {
    isPrice3DChange:
      price3d.price !== refPrice3d.price ||
      price3d.fullPrice !== refPrice3d.fullPrice ||
      price3d.description !== refPrice3d.description,
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

export const columnFormatDuration = (duration: string, t: TFunction<Namespace>): string => {
  switch (duration) {
    case '3d':
      return t('pricing.3d')
    case '1w':
      return t('pricing.1w')
    case '1m':
      return t('pricing.1m')
    case '3m':
      return t('pricing.3m')
    case '6m':
      return t('pricing.6m')
    case '12m':
      return t('pricing.12m')
    default:
      return '-'
  }
}

interface SelectOption {
  label: string
  value: string
}

export const getDurationOptions = (t: TFunction<Namespace>): SelectOption[] => [
  {
    label: t('pricing.3d'),
    value: '3d',
  },
  {
    label: t('pricing.1w'),
    value: '1w',
  },
  {
    label: t('pricing.1m'),
    value: '1m',
  },
  {
    label: t('pricing.3m'),
    value: '3m',
  },
  {
    label: t('pricing.6m'),
    value: '6m',
  },
  {
    label: t('pricing.12m'),
    value: '12m',
  },
]
