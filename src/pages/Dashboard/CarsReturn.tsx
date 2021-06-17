import { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import { Card, CardContent, CardHeader, Grid } from '@material-ui/core'
import { DataGrid, GridColDef, GridRowData, GridToolbar } from '@material-ui/data-grid'
import { KeyboardDateTimePicker } from '@material-ui/pickers'
import { DEFAULT_DATE_FORMAT, formatDateWithPattern } from 'utils'
import { useSearchSubscriptions } from 'services/evme'
import { SortDirection, SubSortFields } from 'services/evme.types'
import CarReturnDialog from './CarReturnDialog'
import { IReturnModelData, MISSING_VALUE } from './utils'

const START_DAYS = 1
const NEXT_DAYS = 7

const initFromDate = dayjs(new Date()).add(START_DAYS, 'day').toDate()
const initToDate = dayjs(new Date())
  .add(START_DAYS + NEXT_DAYS, 'day')
  .toDate()

export default function CarsReturn(): JSX.Element {
  const [fromDate, setFromDate] = useState(initFromDate)
  const [toDate, setToDate] = useState(initToDate)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [dialogData, setDialogData] = useState({} as IReturnModelData)

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
      valueFormatter: (params) => formatDateWithPattern(params, DEFAULT_DATE_FORMAT),
      flex: 1,
    },
  ]

  const rows =
    data?.edges?.map(({ node }) => {
      const { id, car, endDate, user, endAddress } = node
      const { plateNumber, color, carModel } = car || {}
      const { brand, model } = carModel || {}
      const userName =
        user?.firstName || user?.lastName ? `${user?.firstName} ${user?.lastName}` : MISSING_VALUE
      const carDisplayName = `${brand}-${model} (${color})`
      return {
        id,
        userName,
        carDisplayName,
        plateNumber,
        endDate,
        user,
        remark: endAddress?.remark,
      }
    }) || []

  const handleRowClick = (param: GridRowData) => {
    setIsDetailDialogOpen(true)
    setDialogData({
      user: param.row.user,
      endDate: param.row.endDate,
      remark: param.row.remark,
    })
  }

  const handleDialogClose = () => {
    setIsDetailDialogOpen(false)
  }

  return (
    <Card>
      <CardHeader title="Upcoming Cars Return" />

      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <KeyboardDateTimePicker
              ampm={false}
              label="From"
              id="fromDate"
              name="fromDate"
              format={DEFAULT_DATE_FORMAT}
              value={fromDate}
              onChange={(date) => {
                date && setFromDate(date.toDate())
              }}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
          </Grid>

          <Grid item xs={6}>
            <KeyboardDateTimePicker
              ampm={false}
              label="To"
              id="toDate"
              name="toDate"
              format={DEFAULT_DATE_FORMAT}
              value={toDate}
              onChange={(date) => {
                date && setToDate(date.toDate())
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
          onRowClick={handleRowClick}
        />
        <CarReturnDialog
          open={isDetailDialogOpen}
          onClose={handleDialogClose}
          modelData={dialogData}
        />
      </CardContent>
    </Card>
  )
}
