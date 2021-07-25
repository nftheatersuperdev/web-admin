import { GridValueFormatterParams, GridCellParams } from '@material-ui/data-grid'
import { Link } from '@material-ui/core'
import dayjs from 'dayjs'

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
