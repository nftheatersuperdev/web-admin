import { GridValueFormatterParams, GridCellParams } from '@material-ui/data-grid'
import { Link } from '@material-ui/core'
import dayjs from 'dayjs'

export function formatDates(params: GridValueFormatterParams): string {
  return dayjs(params.value as Date).format('DD/MM/YYYY')
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