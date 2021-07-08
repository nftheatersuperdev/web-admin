import { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import { Card, CardContent, Grid, Typography } from '@material-ui/core'
import { GridColDef, GridRowData, GridPageChangeParams } from '@material-ui/data-grid'
import { useTranslation } from 'react-i18next'
import { DEFAULT_DATETIME_FORMAT, formatDateWithPattern } from 'utils'
import styled from 'styled-components'
import DataGridLocale from 'components/DataGridLocale'
import DateTimePicker from 'components/DateTimePicker'
import { useSubscriptions } from 'services/evme'
import { SortDirection, SubSortFields } from 'services/evme.types'
import CarReturnDialog from './CarReturnDialog'
import { IReturnModelData, MISSING_VALUE } from './utils'

const GridInputItem = styled(Grid)`
  margin-bottom: 10px;
`

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
  const { t } = useTranslation()

  const [pageSize, setPageSize] = useState(5)
  const [currentPageIndex, setCurrentPageIndex] = useState(0)

  const { data, refetch, fetchNextPage, fetchPreviousPage } = useSubscriptions(
    pageSize,
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

  const handlePageSizeChange = (params: GridPageChangeParams) => {
    setPageSize(params.pageSize)
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
      field: 'endDate',
      headerName: t('dashboard.returnDate'),
      description: t('dashboard.returnDate'),
      valueFormatter: (params) => formatDateWithPattern(params, DEFAULT_DATETIME_FORMAT),
      flex: 1,
    },
  ]

  const rows =
    data?.pages[currentPageIndex]?.edges?.map(({ node }) => {
      const { id, car, endDate, user, endAddress } = node
      const { plateNumber, color, carModel } = car || {}
      const { brand, model } = carModel || {}
      const userName =
        user?.firstName || user?.lastName ? `${user?.firstName} ${user?.lastName}` : MISSING_VALUE
      const carDisplayName = `${brand}-${model} (${color})`
      const { full, latitude, longitude, remark } = endAddress || {}

      return {
        id,
        userName,
        carDisplayName,
        plateNumber,
        endDate,
        user,
        remark,
        address: full,
        latitude,
        longitude,
      }
    }) || []

  const handleRowClick = (param: GridRowData) => {
    setIsDetailDialogOpen(true)
    setDialogData({
      user: param.row.user,
      endDate: param.row.endDate,
      remark: param.row.remark,
      address: param.row.address,
      latitude: param.row.latitude,
      longitude: param.row.longitude,
    })
  }

  const handleDialogClose = () => {
    setIsDetailDialogOpen(false)
  }

  return (
    <Card>
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography color="textSecondary" gutterBottom variant="h6">
              {t('dashboard.carReturn.title')}
            </Typography>
          </Grid>

          <GridInputItem item xs={6}>
            <DateTimePicker
              ampm={false}
              label={t('dashboard.fromDate')}
              id="fromDate"
              name="fromDate"
              format={DEFAULT_DATETIME_FORMAT}
              value={fromDate}
              onChange={(date) => {
                date && setFromDate(date.toDate())
              }}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
          </GridInputItem>

          <GridInputItem item xs={6}>
            <DateTimePicker
              ampm={false}
              label={t('dashboard.toDate')}
              id="toDate"
              name="toDate"
              format={DEFAULT_DATETIME_FORMAT}
              value={toDate}
              onChange={(date) => {
                date && setToDate(date.toDate())
              }}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
          </GridInputItem>
        </Grid>

        <DataGridLocale
          autoHeight
          pagination
          pageSize={pageSize}
          page={currentPageIndex}
          rowCount={data?.pages[currentPageIndex]?.totalCount}
          paginationMode="server"
          onPageSizeChange={handlePageSizeChange}
          onFetchNextPage={fetchNextPage}
          onFetchPreviousPage={fetchPreviousPage}
          onPageChange={setCurrentPageIndex}
          rows={rows}
          columns={columns}
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
