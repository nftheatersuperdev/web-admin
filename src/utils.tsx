import {
  GridValueFormatterParams,
  GridCellParams,
  GridFilterItem,
  GridFilterInputValue,
  GridFilterOperator,
} from '@material-ui/data-grid'
import { Link } from '@material-ui/core'
import dayjs from 'dayjs'
import { TFunction, Namespace } from 'react-i18next'
import { DateFieldComparisonBetween, DateFieldComparisonGreaterOrLess } from 'services/evme.types'
import GridFilterDatePicker from 'components/GridFilterDatePicker'
import GridFilterBooleanRadio from 'components/GridFilterBooleanRadio'

export const DEFAULT_DATETIME_FORMAT = 'DD/MM/YYYY HH:mm'
export const DEFAULT_DATE_FORMAT = 'DD/MM/YYYY'

export function formatDate(dateStr?: string, pattern: string = DEFAULT_DATETIME_FORMAT): string {
  return dateStr ? dayjs(dateStr).format(pattern) : '-'
}

export function formatDateWithPattern(params: GridValueFormatterParams, pattern: string): string {
  return params.value ? dayjs(params.value as Date).format(pattern || 'DD/MM/YYYY') : ''
}

export function columnFormatDate(params: GridValueFormatterParams): string {
  return formatDate(params.value as string)
}

export function formatMoney(amount: number, fractionDigits = 0): string {
  const formatter = new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    maximumFractionDigits: fractionDigits,
  })
  return formatter.format(amount)
}

export function columnFormatMoney(params: GridValueFormatterParams): string {
  return formatMoney(params.value as number)
}

export function renderEmailLink(params: GridCellParams): JSX.Element {
  return (
    <Link href={`mailto:${params.value}`} target="_top">
      {params.value}
    </Link>
  )
}

export function escapeRegExp(value: string): string {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
}

const FieldComparisons = {
  equals: 'eq',
  notEquals: 'neq',
  greaterThan: 'gt',
  greaterThanOrEquals: 'gte',
  lessThan: 'lt',
  lessThanOrEquals: 'lte',
  onDay: 'between',
  notOnDay: 'notBetween',
  contains: 'iLike',
  is: 'is',
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const nowLowerUpper = () => {
  return {
    lower: dayjs().startOf('day'),
    upper: dayjs().endOf('day'),
  }
}

export const dateToFilterOnDay = (date: Date): DateFieldComparisonBetween => {
  return {
    upper: dayjs(date).endOf('day').toDate(),
    lower: dayjs(date).startOf('day').toDate(),
  }
}

export const dateToFilterNotOnDay = (date: Date): DateFieldComparisonBetween => {
  return {
    upper: dayjs(date).endOf('day').toDate(),
    lower: dayjs(date).startOf('day').toDate(),
  }
}

export const dateToFilterGreaterOrLess = (
  date: Date,
  isGreaterThan = false
): DateFieldComparisonGreaterOrLess => {
  let filterDate = dayjs(date)
  if (isGreaterThan) {
    filterDate = filterDate.endOf('day')
  } else {
    filterDate = filterDate.startOf('day')
  }
  return filterDate.toDate()
}

export const stringToFilterContains = (value: string): string => {
  return value ? `%${value}%` : ''
}

export const booleanStringToFilterBoolean = (value: string, isReverse = false): boolean => {
  if (value === 'true') {
    return isReverse ? false : true
  } else if (value === 'false') {
    return isReverse ? true : false
  }
  return false
}

export const getIdFilterOperators = (t: TFunction<Namespace>): GridFilterOperator[] => [
  {
    label: t('filter.equals'),
    value: FieldComparisons.equals,
    getApplyFilterFn: (filterItem: GridFilterItem) => {
      if (!filterItem.value) {
        return null
      }
      return ({ value }: GridCellParams): boolean => {
        return filterItem.value === value
      }
    },
    InputComponent: GridFilterInputValue,
  },
  {
    label: t('filter.notEquals'),
    value: FieldComparisons.notEquals,
    getApplyFilterFn: (filterItem: GridFilterItem) => {
      if (!filterItem.value) {
        return null
      }
      return ({ value }: GridCellParams): boolean => {
        return filterItem.value !== value
      }
    },
    InputComponent: GridFilterInputValue,
  },
]

export const getStringFilterOperators = (t: TFunction<Namespace>): GridFilterOperator[] => [
  {
    label: t('filter.contains'),
    value: FieldComparisons.contains,
    getApplyFilterFn: (filterItem: GridFilterItem) => {
      if (!filterItem.value) {
        return null
      }
      const filterRegex = new RegExp(escapeRegExp(filterItem.value), 'i')
      return ({ value }: GridCellParams): boolean => {
        return filterRegex.test(value?.toString() || '')
      }
    },
    InputComponent: GridFilterInputValue,
  },
  {
    label: t('filter.equals'),
    value: FieldComparisons.equals,
    getApplyFilterFn: (filterItem: GridFilterItem) => {
      if (!filterItem.value) {
        return null
      }
      const collator = new Intl.Collator(undefined, { sensitivity: 'base', usage: 'search' })
      return ({ value }: GridCellParams): boolean => {
        return collator.compare(filterItem.value, value?.toString() || '') === 0
      }
    },
    InputComponent: GridFilterInputValue,
  },
]

export const getNumericFilterOperators = (t: TFunction<Namespace>): GridFilterOperator[] => [
  {
    label: t('filter.equals'),
    value: FieldComparisons.equals,
    getApplyFilterFn: (filterItem: GridFilterItem) => {
      if (!filterItem.value) {
        return null
      }

      return ({ value }): boolean => {
        return Number(value) === filterItem.value
      }
    },
    InputComponent: GridFilterInputValue,
    InputComponentProps: { type: 'number' },
  },
  {
    label: t('filter.notEquals'),
    value: FieldComparisons.notEquals,
    getApplyFilterFn: (filterItem: GridFilterItem) => {
      if (!filterItem.value) {
        return null
      }

      return ({ value }): boolean => {
        return Number(value) !== filterItem.value
      }
    },
    InputComponent: GridFilterInputValue,
    InputComponentProps: { type: 'number' },
  },
  {
    label: t('filter.greaterThan'),
    value: FieldComparisons.greaterThan,
    getApplyFilterFn: (filterItem: GridFilterItem) => {
      if (!filterItem.value) {
        return null
      }

      return ({ value }): boolean => {
        return Number(value) > filterItem.value
      }
    },
    InputComponent: GridFilterInputValue,
    InputComponentProps: { type: 'number' },
  },
  {
    label: t('filter.greaterThanOrEquals'),
    value: FieldComparisons.greaterThanOrEquals,
    getApplyFilterFn: (filterItem: GridFilterItem) => {
      if (!filterItem.value) {
        return null
      }

      return ({ value }): boolean => {
        return Number(value) >= filterItem.value
      }
    },
    InputComponent: GridFilterInputValue,
    InputComponentProps: { type: 'number' },
  },
  {
    label: t('filter.lessThan'),
    value: FieldComparisons.lessThan,
    getApplyFilterFn: (filterItem: GridFilterItem) => {
      if (!filterItem.value) {
        return null
      }

      return ({ value }): boolean => {
        return Number(value) < filterItem.value
      }
    },
    InputComponent: GridFilterInputValue,
    InputComponentProps: { type: 'number' },
  },
  {
    label: t('filter.lessThanOrEquals'),
    value: FieldComparisons.lessThanOrEquals,
    getApplyFilterFn: (filterItem: GridFilterItem) => {
      if (!filterItem.value) {
        return null
      }

      return ({ value }): boolean => {
        return Number(value) <= filterItem.value
      }
    },
    InputComponent: GridFilterInputValue,
    InputComponentProps: { type: 'number' },
  },
]

export const getDateFilterOperators = (t: TFunction<Namespace>): GridFilterOperator[] => [
  {
    label: t('filter.equals'),
    value: FieldComparisons.onDay,
    getApplyFilterFn: (filterItem: GridFilterItem) => {
      if (!filterItem.value) {
        return null
      }

      return ({ value }: GridCellParams): boolean => {
        return filterItem.value === value
      }
    },
    InputComponent: GridFilterDatePicker,
  },
  {
    label: t('filter.notEquals'),
    value: FieldComparisons.notOnDay,
    getApplyFilterFn: (filterItem: GridFilterItem) => {
      if (!filterItem.value) {
        return null
      }

      return ({ value }: GridCellParams): boolean => {
        return filterItem.value !== value
      }
    },
    InputComponent: GridFilterDatePicker,
  },
]

export const getDateFilterMoreOperators = (t: TFunction<Namespace>): GridFilterOperator[] => [
  {
    label: t('filter.equals'),
    value: FieldComparisons.onDay,
    getApplyFilterFn: (filterItem: GridFilterItem) => {
      if (!filterItem.value) {
        return null
      }

      return ({ value }: GridCellParams): boolean => {
        return filterItem.value === value
      }
    },
    InputComponent: GridFilterDatePicker,
  },
  {
    label: t('filter.notEquals'),
    value: FieldComparisons.notOnDay,
    getApplyFilterFn: (filterItem: GridFilterItem) => {
      if (!filterItem.value) {
        return null
      }

      return ({ value }: GridCellParams): boolean => {
        return filterItem.value !== value
      }
    },
    InputComponent: GridFilterDatePicker,
  },
  {
    label: t('filter.greaterThan'),
    value: FieldComparisons.greaterThan,
    getApplyFilterFn: (filterItem: GridFilterItem) => {
      if (!filterItem.value) {
        return null
      }

      return ({ value }: GridCellParams): boolean => {
        if (!value) {
          return false
        }
        return new Date(filterItem.value) > new Date(value as string)
      }
    },
    InputComponent: GridFilterDatePicker,
  },
  {
    label: t('filter.greaterThanOrEquals'),
    value: FieldComparisons.greaterThanOrEquals,
    getApplyFilterFn: (filterItem: GridFilterItem) => {
      if (!filterItem.value) {
        return null
      }

      return ({ value }: GridCellParams): boolean => {
        if (!value) {
          return false
        }
        return new Date(filterItem.value) >= new Date(value as string)
      }
    },
    InputComponent: GridFilterDatePicker,
  },
  {
    label: t('filter.lessThan'),
    value: FieldComparisons.lessThan,
    getApplyFilterFn: (filterItem: GridFilterItem) => {
      if (!filterItem.value) {
        return null
      }

      return ({ value }: GridCellParams): boolean => {
        if (!value) {
          return false
        }
        return new Date(filterItem.value) < new Date(value as string)
      }
    },
    InputComponent: GridFilterDatePicker,
  },
  {
    label: t('filter.lessThanOrEquals'),
    value: FieldComparisons.lessThanOrEquals,
    getApplyFilterFn: (filterItem: GridFilterItem) => {
      if (!filterItem.value) {
        return null
      }

      return ({ value }: GridCellParams): boolean => {
        if (!value) {
          return false
        }
        return new Date(filterItem.value) <= new Date(value as string)
      }
    },
    InputComponent: GridFilterDatePicker,
  },
]

export const getSelectFilterOperators = (t: TFunction<Namespace>): GridFilterOperator[] => [
  {
    label: t('filter.equals'),
    value: FieldComparisons.equals,
    getApplyFilterFn: (filterItem: GridFilterItem) => {
      if (!filterItem.value) {
        return null
      }
      return ({ value }: GridCellParams): boolean => {
        return filterItem.value === value
      }
    },
    InputComponent: GridFilterInputValue,
    InputComponentProps: { type: 'singleSelect' },
  },
  {
    label: t('filter.notEquals'),
    value: FieldComparisons.notEquals,
    getApplyFilterFn: (filterItem: GridFilterItem) => {
      if (!filterItem.value) {
        return null
      }
      return ({ value }: GridCellParams): boolean => {
        return filterItem.value !== value
      }
    },
    InputComponent: GridFilterInputValue,
    InputComponentProps: { type: 'singleSelect' },
  },
]

export const getBooleanFilterOperators = (t: TFunction<Namespace>): GridFilterOperator[] => [
  {
    label: t('filter.is'),
    value: FieldComparisons.is,
    getApplyFilterFn: (filterItem: GridFilterItem) => {
      if (filterItem.value === null || filterItem.value === undefined) {
        return null
      }
      return ({ value }: GridCellParams): boolean => {
        return filterItem.value === value
      }
    },
    InputComponent: GridFilterBooleanRadio,
  },
]
