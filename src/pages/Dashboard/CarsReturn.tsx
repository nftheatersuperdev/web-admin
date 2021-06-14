import { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import { Card, CardContent, CardHeader, Grid } from '@material-ui/core'
import { DataGrid, GridColDef, GridToolbar } from '@material-ui/data-grid'
import { KeyboardDateTimePicker } from '@material-ui/pickers'
import { formatDateWithPattern } from 'utils'
import { useSearchSubscriptions } from 'services/evme'
import { SortDirection, SubSortFields } from 'services/evme.types'

const START_DAYS = 1
const NEXT_DAYS = 7

const initFromDate = dayjs(new Date()).add(START_DAYS, 'day').toDate()
const initToDate = dayjs(new Date())
  .add(START_DAYS + NEXT_DAYS, 'day')
  .toDate()

export default function CarsReturn(): JSX.Element {
  const [fromDate, setFromDate] = useState(initFromDate)
  const [toDate, setToDate] = useState(initToDate)

  const { data, refetch } = useSearchSubscriptions(
    'cars-return',
    { first: 10 },
    {
      and: [
        {
          endDate: {
            gte: fromDate.toISOString(),
          },
        },
        {
          endDate: {
            lte: toDate.toISOString(),
          },
        },
      ],
    },
    [{ direction: SortDirection.Asc, field: SubSortFields.StartDate }]
  )

  useEffect(() => {
    refetch()
  }, [fromDate, toDate, refetch])

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'Subscription ID', description: 'Subscription ID', flex: 1 },
    {
      field: 'userName',
      headerName: 'User Name',
      description: 'User Name',
      flex: 1,
    },
    { field: 'carDisplayName', headerName: 'Car', description: 'Car', flex: 1 },
    { field: 'plateNumber', headerName: 'Plate Number', description: 'Plate Number', flex: 1 },
    {
      field: 'endDate',
      headerName: 'Return Date',
      description: 'Return Date',
      valueFormatter: (params) => formatDateWithPattern(params, 'DD/MM/YYYY HH:mm'),
      flex: 1,
    },
  ]

  const rows =
    data?.edges?.map(({ node }) => {
      const { id, car, endDate } = node
      // todo: need update graphql types
      // const { firstName = '', lastName } = user || {}
      const { plateNumber, color, carModel } = car || {}
      const { brand, model } = carModel || {}
      const userName = ''
      const carDisplayName = `${brand}-${model} (${color})`
      return {
        id,
        userName,
        carDisplayName,
        plateNumber,
        endDate,
      }
    }) || []

  return (
    <Card>
      <CardHeader title="Upcoming Cars Return" />

      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <KeyboardDateTimePicker
              label="From"
              id="fromDate"
              name="fromDate"
              format="DD/MM/YYYY HH:mm"
              value={fromDate}
              onChange={(date: unknown) => {
                setFromDate(date as Date)
              }}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
          </Grid>

          <Grid item xs={6}>
            <KeyboardDateTimePicker
              label="To"
              id="toDate"
              name="toDate"
              format="DD/MM/YYYY HH:mm"
              value={toDate}
              onChange={(date: unknown) => {
                setToDate(date as Date)
              }}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
          </Grid>
        </Grid>

        <DataGrid
          autoHeight
          autoPageSize
          rows={rows}
          columns={columns}
          components={{
            Toolbar: GridToolbar,
          }}
        />
      </CardContent>
    </Card>
  )
}
