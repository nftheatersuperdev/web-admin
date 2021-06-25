import { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import { Card, CardContent, CardHeader, Grid } from '@material-ui/core'
import { GridColDef, GridRowData, GridPageChangeParams } from '@material-ui/data-grid'
import { useTranslation } from 'react-i18next'
import { DEFAULT_DATE_FORMAT, formatDateWithPattern } from 'utils'
import DataGridLocale from 'components/DataGridLocale'
import DateTimePicker from 'components/DateTimePicker'
import { useSubscriptions } from 'services/evme'
import { SortDirection, SubSortFields } from 'services/evme.types'
import CarDeliveryDialog from './CarDeliveryDialog'
import { IDeliveryModelData, MISSING_VALUE } from './utils'

const START_DAYS = 1
const NEXT_DAYS = 7

const initFromDate = dayjs(new Date()).add(START_DAYS, 'day').toDate()
const initToDate = dayjs(new Date())
  .add(START_DAYS + NEXT_DAYS, 'day')
  .toDate()

export default function CarsDelivery(): JSX.Element {
  const [fromDate, setFromDate] = useState(initFromDate)
  const [toDate, setToDate] = useState(initToDate)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [dialogData, setDialogData] = useState({} as IDeliveryModelData)
  const { t } = useTranslation()

  const [pageSize, setPageSize] = useState(5)
  const [currentPageIndex, setCurrentPageIndex] = useState(0)

  const { data, refetch, fetchNextPage, fetchPreviousPage } = useSubscriptions(
    pageSize,
    'cars-delivery',
    {
      and: [
        {
          startDate: {
            gte: fromDate.toISOString(),
          },
        },
        {
          startDate: {
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

  const handlePageSizeChange = (params: GridPageChangeParams) => {
    setPageSize(params.pageSize)
  }

  const handlePageChange = (params: GridPageChangeParams) => {
    if (params.page > currentPageIndex) {
      fetchNextPage()
    } else {
      fetchPreviousPage()
    }
    setCurrentPageIndex(params.page)
  }

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: t('dashboard.subscriptionId'),
      description: t('dashboard.subscriptionId'),
      flex: 1,
      hide: true,
    },
    {
      field: 'userName',
      headerName: t('dashboard.userName'),
      description: t('dashboard.userName'),
      flex: 1,
    },
    {
      field: 'carDisplayName',
      headerName: t('dashboard.carDisplayName'),
      description: t('dashboard.carDisplayName'),
      flex: 1,
    },
    {
      field: 'plateNumber',
      headerName: t('dashboard.plateNumber'),
      description: t('dashboard.plateNumber'),
      flex: 1,
    },
    {
      field: 'startDate',
      headerName: t('dashboard.deliveryDate'),
      description: t('dashboard.deliveryDate'),
      valueFormatter: (params) => formatDateWithPattern(params, DEFAULT_DATE_FORMAT),
      flex: 1,
    },
  ]

  const rows =
    data?.pages[currentPageIndex]?.edges?.map(({ node }) => {
      const { id, car, startDate, user, startAddress } = node
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
        startDate,
        user,
        remark: startAddress?.remark,
      }
    }) || []

  const handleRowClick = (param: GridRowData) => {
    setIsDetailDialogOpen(true)
    setDialogData({
      user: param.row.user,
      startDate: param.row.startDate,
      remark: param.row.remark,
    })
  }

  const handleDialogClose = () => {
    setIsDetailDialogOpen(false)
  }

  return (
    <Card>
      <CardHeader title={t('dashboard.carDelivery.title')} />

      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <DateTimePicker
              ampm={false}
              label={t('dashboard.fromDate')}
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
            <DateTimePicker
              ampm={false}
              label={t('dashboard.toDate')}
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

        <DataGridLocale
          autoHeight
          pagination
          pageSize={pageSize}
          page={currentPageIndex}
          rowCount={data?.pages[currentPageIndex]?.totalCount}
          paginationMode="server"
          onPageSizeChange={handlePageSizeChange}
          onPageChange={handlePageChange}
          onRowClick={handleRowClick}
          rows={rows}
          columns={columns}
        />

        <CarDeliveryDialog
          open={isDetailDialogOpen}
          onClose={handleDialogClose}
          modelData={dialogData}
        />
      </CardContent>
    </Card>
  )
}
