import { GridValueFormatterParams, GridCellParams } from '@material-ui/data-grid'
import { Link } from '@material-ui/core'
import dayjs from 'dayjs'

export function functionFormatRawDate(dateStr: string | undefined): string {
  if (!dateStr) {
    return '-'
  }
  return dayjs(dateStr).format('DD/MM/YYYY')
}

export function formatDates(params: GridValueFormatterParams): string {
  return functionFormatRawDate(params.value as string)
}

export function formatDateWithPattern(params: GridValueFormatterParams, pattern: string): string {
  return dayjs(params.value as Date).format(pattern || 'DD/MM/YYYY')
}

export function formatMoney(params: GridValueFormatterParams): string {
  const formatter = new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
  })
  return formatter.format(params.value as number)
}

export function renderEmailLink(params: GridCellParams): JSX.Element {
  return (
    <Link href={`mailto:${params.value}`} target="_top">
      {params.value}
    </Link>
  )
}

export const DEFAULT_DATE_FORMAT = 'DD/MM/YYYY HH:mm'
