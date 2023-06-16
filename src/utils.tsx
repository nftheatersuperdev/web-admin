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
import GridFilterDatePickerV2 from 'components/GridFilterDatePickerV2'
import GridFilterInputDateTimePicker from 'components/GridFilterDateTimePicker'

export const DEFAULT_DATETIME_FORMAT = 'DD/MM/YYYY HH:mm'
export const DEFAULT_DATETIME_FORMAT_MONTH_TEXT = 'DD MMM YYYY HH:mm'
export const DEFAULT_TIME_FORMAT = 'HH:mm'
export const DEFAULT_DATE_FORMAT = 'DD/MM/YYYY'
export const DEFAULT_DATE_FORMAT_MONTH_TEXT = 'DD MMM YYYY'
export const DEFAULT_DATE_FORMAT_BFF = 'YYYY-MM-DD'

export const DEFAULT_DATETIME_FORMAT_ISO = 'YYYY-MM-DDTHH:mm:ssZ'

export function formatDate(dateStr?: string, pattern: string = DEFAULT_DATETIME_FORMAT): string {
  return dateStr ? dayjs(dateStr).format(pattern) : '-'
}

export function formatStringToDate(
  dateStr?: string,
  pattern: string = DEFAULT_DATETIME_FORMAT_ISO
): Date {
  return dayjs(dateStr, pattern).toDate()
}

export function compareDateIsBefore(
  dateStr1?: string,
  dateStr2?: string,
  pattern: string = DEFAULT_DATETIME_FORMAT_ISO
): boolean {
  return dayjs(dateStr1, pattern).isBefore(dayjs(dateStr2, pattern))
}

export function compareDateIsAfter(
  dateStr1?: string,
  dateStr2?: string,
  pattern: string = DEFAULT_DATETIME_FORMAT_ISO
): boolean {
  return dayjs(dateStr1, pattern).isAfter(dayjs(dateStr2, pattern))
}
export function formatDateWithPattern(params: GridValueFormatterParams, pattern: string): string {
  return params.value ? dayjs(params.value as Date).format(pattern || 'DD/MM/YYYY') : ''
}

export function columnFormatDate(params: GridValueFormatterParams): string {
  return formatDate(params.value as string) === 'Invalid Date'
    ? '-'
    : formatDate(params.value as string)
}

export function formatMoney(amount: number, fractionDigits = 0): string {
  const formatter = new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: fractionDigits,
  })
  return formatter.format(amount)
}

export function columnFormatMoney(params: GridValueFormatterParams): string {
  return formatMoney(params.value as number)
}

export function columnFormatText(params: GridValueFormatterParams): string {
  return params.value ? (params.value as string) : '-'
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

export const FieldComparisons = {
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

export const FieldKeyOparators = {
  equals: 'Equal',
  notEquals: 'neq',
  greaterThan: 'gt',
  greaterThanOrEquals: 'gte',
  lessThan: 'lt',
  lessThanOrEquals: 'lte',
  onDay: 'between',
  notOnDay: 'notBetween',
  contains: 'Contain',
  is: 'is',
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const nowLowerUpper = () => {
  return {
    lower: dayjs().startOf('day').format(),
    upper: dayjs().endOf('day').format(),
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

export const getSelectEqualFilterOperators = (t: TFunction<Namespace>): GridFilterOperator[] => [
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

export const validateEmail = (email: string): boolean => {
  const emailSplit = email.split('@')
  const prefixEmail = emailSplit[0]
  const suffixEmail = '@' + emailSplit[1]
  return validateEmailPrefix(prefixEmail) && validateEmailSuffix(suffixEmail)
}

const validateEmailPrefix = (email: string): boolean => {
  const rule = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))$/
  return rule.test(String(email).toLowerCase())
}

const validateEmailSuffix = (email: string): boolean => {
  const rule = /^@((\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return rule.test(String(email).toLowerCase())
}

export const validateIpAddress = (ipAddress: string): boolean => {
  const ipAddressSplit = ipAddress.split('.')
  const firstDigit = ipAddressSplit[0] + '.'
  const secondDigit = ipAddressSplit[1] + '.'
  const thirdDigit = ipAddressSplit[2] + '.'
  const lastDigit = ipAddressSplit[3]
  return (
    validateIpAddressDigits(firstDigit) &&
    validateIpAddressDigits(secondDigit) &&
    validateIpAddressDigits(thirdDigit) &&
    validateIpAddressLastDigit(lastDigit)
  )
}

const validateIpAddressDigits = (ipAddress: string): boolean => {
  const keywordRule = /^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.$/
  return keywordRule.test(ipAddress)
}

const validateIpAddressLastDigit = (ipAddress: string): boolean => {
  const keywordRule = /^(25[0-5]|2[0-4]\d|[01]?\d\d?)$/
  return keywordRule.test(ipAddress)
}

export const validatePhoneNumberSearch = (searchValue: string): boolean => {
  const keywordRule = /^\d{4,15}$/g
  return keywordRule.test(searchValue)
}

export const validateKeywordText = (value: string): boolean => {
  const keywordRule = /^[ก-๛a-zA-Z0-9 ]{2,}$/g
  return keywordRule.test(value)
}

export const validateKeywordTextWithSpecialChar = (value: string): boolean => {
  // eslint-disable-next-line
  const keywordRule = /^[a-zA-Z0-9_@.+-\/]{2,}$/g // Add validate special character
  return keywordRule.test(value)
}

export const validateRemarkText = (value: string): boolean => {
  const remarkRule = /^[ก-๛a-zA-Z0-9 ]*$/g
  return remarkRule.test(value)
}
export const validateKeywordUUID = (value: string): boolean => {
  const remarkRule = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/
  return remarkRule.test(value)
}
export const getContainFilterOperators = (t: TFunction<Namespace>): GridFilterOperator[] => [
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
]

export const getEqualFilterOperators = (t: TFunction<Namespace>): GridFilterOperator[] => [
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
]

export const getEqualAndContainFilterOperators = (
  t: TFunction<Namespace>
): GridFilterOperator[] => [
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
]

export const geEqualtDateOperators = (t: TFunction<Namespace>): GridFilterOperator[] => [
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
    InputComponent: GridFilterDatePickerV2,
  },
]

export const geEqualtDateTimeOperators = (t: TFunction<Namespace>): GridFilterOperator[] => [
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
    InputComponent: GridFilterInputDateTimePicker,
  },
]

export const getOnlyEqualFilterOperator = (t: TFunction<Namespace>): GridFilterOperator[] => [
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
]

export const convertMoneyFormat = (value: number, minimunDigit = 2): string => {
  return value ? value.toLocaleString('th', { minimumFractionDigits: minimunDigit }) : ''
}

// export const stripHtml = (string: string): string => string.replace(/<\/?[^>]+(>|$)/gi, '')
export const stripHtml = (string: string): string => {
  const div = document.createElement('div')
  div.innerHTML = string
  return div.textContent || div.innerText || ''
}

export const firstCapitalize = (string: string): string => {
  if (!string) {
    return string
  }
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export const convertPhoneNumber = (value: string | null | undefined): string => {
  if (value) {
    return value.includes('+66') ? value.replaceAll('+66', '0') : value
  }
  return ''
}

export function formaDateStringWithPattern(dateStr?: string, pattern?: string): string {
  return dateStr ? dayjs(dateStr).format(pattern || DEFAULT_DATE_FORMAT) : '-'
}

export function formatStringForInputText(str?: string | null | undefined, digit?: number): string {
  if (!digit) {
    digit = 20
  }
  let formatStr, firstRowStr, secondRowStr
  if (str) {
    if (str.length > digit && str?.length < digit * 2) {
      firstRowStr = str.substring(0, 20)
      secondRowStr = str.substring(20)
      formatStr = firstRowStr + '\r\n' + secondRowStr
    } else if (str.length > digit * 2) {
      firstRowStr = str.substring(0, 20)
      secondRowStr = str.substring(20, 40)
      formatStr = firstRowStr + '\r\n' + secondRowStr + '...'
    } else {
      formatStr = str
    }
  }
  return formatStr ? formatStr : ''
}
