import { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import { Card, CardContent, Grid, Typography } from '@material-ui/core'
import {
  GridColDef,
  GridRowData,
  GridPageChangeParams,
  GridValueFormatterParams,
} from '@material-ui/data-grid'
import { useTranslation } from 'react-i18next'
import { DEFAULT_DATE_FORMAT, columnFormatDate } from 'utils'
import styled from 'styled-components'
import DataGridLocale from 'components/DataGridLocale'
import DatePicker from 'components/DatePicker'
import { useSubscriptionsFilterAndSort } from 'services/evme'
import { SortDirection, SubSortFields } from 'services/evme.types'
import { columnFormatSubEventStatus, SubEventStatus } from 'pages/Subscriptions/utils'
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

  const { data, refetch, isFetching } = useSubscriptionsFilterAndSort(
    {
      and: {
        events: {
          status: {
            eq: SubEventStatus.DELIVERED,
          },
        },
        endDate: {
          between: {
            lower: dayjs(selectedDate).startOf('day').format(),
            upper: dayjs(selectedDate).endOf('day').format(),
          },
        },
      },
    },
    { [SubSortFields.EndDate]: SortDirection.Desc },
    currentPageIndex,
    pageSize
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
      field: 'endDate',
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

  const rows =
    data?.data.map((node) => {
      const { id, car, endDate, user, endAddress, events } = node
      const { plateNumber, color, carModel } = car || {}
      const { brand, model } = carModel || {}
      const userName =
        user?.firstName || user?.lastName ? `${user?.firstName} ${user?.lastName}` : MISSING_VALUE
      const carDisplayName = `${brand}-${model} (${color})`
      const { full, latitude, longitude, remark } = endAddress || {}

      let status = '-'

      if (events?.length) {
        const latestEvent = events.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )[0]
        status = latestEvent.status
      }

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
          rowCount={data?.totalData}
          paginationMode="server"
          onPageSizeChange={handlePageSizeChange}
          onPageChange={setCurrentPageIndex}
          rows={rows}
          columns={columns}
          onRowClick={handleRowClick}
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
