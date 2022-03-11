import { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import { Card, CardContent, Grid, Typography } from '@material-ui/core'
import {
  GridColDef,
  GridRowData,
  GridPageChangeParams,
  GridValueFormatterParams,
} from '@material-ui/data-grid'
import { useQuery } from 'react-query'
import { useTranslation } from 'react-i18next'
import { DEFAULT_DATE_FORMAT, columnFormatDate } from 'utils'
import styled from 'styled-components'
import DataGridLocale from 'components/DataGridLocale'
import DatePicker from 'components/DatePicker'
import { getList, status as subscriptionStatus } from 'services/web-bff/subscription'
import { columnFormatSubEventStatus } from 'pages/Subscriptions/utils'
import CarDeliveryDialog from './CarDeliveryDialog'
import { DeliveryModelData, MISSING_VALUE } from './utils'

interface CarsDeliveryProps {
  accessToken: string
}

const GridInputItem = styled(Grid)`
  margin-bottom: 10px;
`

const initSelectedDate = dayjs(new Date()).toDate()

export default function CarsDelivery({ accessToken }: CarsDeliveryProps): JSX.Element {
  const [selectedDate, setSelectedDate] = useState(initSelectedDate)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [dialogData, setDialogData] = useState({} as DeliveryModelData)
  const { t } = useTranslation()

  const [pageSize, setPageSize] = useState(5)
  const [currentPageIndex, setCurrentPageIndex] = useState(0)

  const { data, refetch, isFetching } = useQuery('cars-delivery', () =>
    getList({
      accessToken,
      query: {
        status: subscriptionStatus.ACCEPTED,
        startDate: {
          between: {
            lower: dayjs(selectedDate).startOf('day').format(),
            upper: dayjs(selectedDate).endOf('day').format(),
          },
        },
      },
      limit: pageSize,
      page: currentPageIndex + 1,
    })
  )

  useEffect(() => {
    refetch()
  }, [selectedDate, refetch])

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
      filterable: false,
    },
    {
      field: 'userName',
      headerName: t('dashboard.userName'),
      description: t('dashboard.userName'),
      flex: 1,
      filterable: false,
    },
    {
      field: 'carDisplayName',
      headerName: t('dashboard.carDisplayName'),
      description: t('dashboard.carDisplayName'),
      flex: 1,
      filterable: false,
    },
    {
      field: 'plateNumber',
      headerName: t('dashboard.plateNumber'),
      description: t('dashboard.plateNumber'),
      flex: 1,
      filterable: false,
    },
    {
      field: 'startDate',
      headerName: t('dashboard.deliveryDate'),
      description: t('dashboard.deliveryDate'),
      valueFormatter: columnFormatDate,
      flex: 1,
      filterable: false,
    },
    {
      field: 'status',
      headerName: t('subscription.status.title'),
      description: t('subscription.status.title'),
      flex: 1,
      valueFormatter: (params: GridValueFormatterParams) =>
        columnFormatSubEventStatus(params.value as string, t),
      filterable: false,
    },
  ]

  const rowCount = data?.data.pagination.totalRecords
  const rows =
    data?.data.subscriptions.map((node) => {
      const { id, car, startDate, user, deliveryAddress, status } = node
      const { plateNumber, color, brand, name } = car || {}
      const userName =
        user?.firstName || user?.lastName ? `${user?.firstName} ${user?.lastName}` : MISSING_VALUE
      const carDisplayName = `${brand}-${name} (${color})`
      const { full, latitude, longitude, remark } = deliveryAddress || {}

      return {
        id,
        userName,
        carDisplayName,
        plateNumber,
        startDate,
        user,
        remark,
        address: full,
        latitude,
        longitude,
        status,
      }
    }) || []

  const handleRowClick = (param: GridRowData) => {
    setIsDetailDialogOpen(true)
    setDialogData({
      user: param.row.user,
      startDate: param.row.startDate,
      remark: param.row.remark,
      address: param.row.address,
      latitude: param.row.latitude,
      longitude: param.row.longitude,
      status: param.row.status,
    })
  }

  const handleDialogClose = () => {
    setIsDetailDialogOpen(false)
  }

  return (
    <Card>
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={12} justifyContent="space-between" container>
            <Typography color="textSecondary" gutterBottom variant="h6">
              {t('dashboard.carDelivery.title')}
            </Typography>
            <GridInputItem item>
              <DatePicker
                label={t('dashboard.selectedDate')}
                id="selectedDate"
                name="selectedDate"
                format={DEFAULT_DATE_FORMAT}
                value={selectedDate}
                onChange={(date) => {
                  date && setSelectedDate(date.toDate())
                }}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              />
            </GridInputItem>
          </Grid>
        </Grid>

        <DataGridLocale
          autoHeight
          pagination
          pageSize={pageSize}
          page={currentPageIndex}
          rowCount={rowCount}
          paginationMode="server"
          onPageSizeChange={handlePageSizeChange}
          onPageChange={setCurrentPageIndex}
          onRowClick={handleRowClick}
          rows={rows}
          columns={columns}
          loading={isFetching}
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
