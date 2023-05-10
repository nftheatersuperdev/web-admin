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
import { getList, status as subscriptionStatus } from 'services/web-bff/booking'
import { columnFormatSubEventStatus } from 'pages/Subscriptions/utils'
import { SubscriptionListQuery } from 'services/web-bff/booking.type'
import CarReturnDialog from './CarReturnDialog'
import { ReturnModelData, MISSING_VALUE } from './utils'

const GridInputItem = styled(Grid)`
  margin-bottom: 10px;
`

const initSelectedDate = dayjs(new Date()).toDate()

export default function CarsReturn(): JSX.Element {
  const [selectedDate, setSelectedDate] = useState(initSelectedDate)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [dialogData, setDialogData] = useState({} as ReturnModelData)
  const { t } = useTranslation()

  const [pageSize, setPageSize] = useState(5)
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const defaultFilter: SubscriptionListQuery = {
    statusList: [subscriptionStatus.DELIVERED],
    startDate: dayjs(selectedDate).startOf('day').format(),
    endDate: dayjs(selectedDate).endOf('day').format(),
    page: currentPageIndex + 1,
    size: pageSize,
  } as SubscriptionListQuery
  const [query] = useState<SubscriptionListQuery>({ ...defaultFilter })
  const { data, refetch, isFetching } = useQuery('cars-return', () => getList({ query }))

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
      headerName: t('dashboard.returnDate'),
      description: t('dashboard.returnDate'),
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
    data?.data.records.map((node) => {
      const {
        id,
        car,
        startDate,
        user,
        status,
        returnRemark,
        returnFullAddress,
        returnLatitude,
        returnLongitude,
      } = node
      const { carSku, plateNumber } = car || {}
      const { carModel, color } = carSku || {}
      const { brand, name } = carModel || {}
      const userName =
        user?.firstName || user?.lastName ? `${user?.firstName} ${user?.lastName}` : MISSING_VALUE
      const carDisplayName = `${brand}-${name} (${color})`

      return {
        id,
        userName,
        carDisplayName,
        plateNumber,
        startDate,
        user,
        returnRemark,
        address: returnFullAddress,
        returnLatitude,
        returnLongitude,
        status,
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
              {t('dashboard.carReturn.title')}
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
        <CarReturnDialog
          open={isDetailDialogOpen}
          onClose={handleDialogClose}
          modelData={dialogData}
        />
      </CardContent>
    </Card>
  )
}
