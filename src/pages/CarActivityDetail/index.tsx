/* eslint-disable no-constant-condition */
/* eslint-disable react-hooks/exhaustive-deps */
import dayjs, { Dayjs } from 'dayjs'
import toast from 'react-hot-toast'
import { Fragment, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { TFunction, Namespace, useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import {
  Breadcrumbs,
  Button,
  Card,
  FormControl,
  Grid,
  MenuItem,
  IconButton,
  InputLabel,
  Select,
  Typography,
  OutlinedInput,
} from '@material-ui/core'
import {
  GridColDef,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridCellParams,
  GridPageChangeParams,
} from '@material-ui/data-grid'
import { Delete as DeleteIcon, Edit as EditIcon } from '@material-ui/icons'
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date'
import { makeStyles } from '@material-ui/core/styles'
import { DEFAULT_DATE_FORMAT, DEFAULT_DATE_FORMAT_BFF } from 'utils'
import DatePicker from 'components/DatePicker'
import { Page } from 'layout/LayoutRoute'
import { columnFormatCarVisibility } from 'pages/Car/utils'
import { getServiceLabel } from 'pages/CarActivity/utils'
import DataGridLocale from 'components/DataGridLocale'
import ActivityScheduleDialog from 'components/ActivityScheduleDialog'
import ConfirmDialog from 'components/ConfirmDialog'
import NoResultCard from 'components/NoResultCard'
import Backdrop from 'components/Backdrop'
import { getCarById } from 'services/web-bff/car'
import {
  getSchedulesByCarId,
  getScheduleServices,
  deleteSchedule,
  // ScheduleStatus,
} from 'services/web-bff/car-activity'
import { CarActivityBookingTypeIds, Schedule } from 'services/web-bff/car-activity.type'

interface CarActivityDetailParams {
  id: string
}
enum ScheduleActions {
  Edit = 'edit',
  Delete = 'delete',
}

const useStyles = makeStyles({
  cardWrapper: {
    width: '100%',
    padding: '20px',
    margin: '20px 0',
  },
  marginSpace: {
    margin: '20px 0',
  },
  marginTextButton: {
    marginLeft: '18px',
  },
  textBold: {
    fontWeight: 'bold',
  },
  textAlignRight: {
    textAlign: 'right',
  },
  hide: {
    display: 'none',
  },
  fullWidth: {
    width: '100%',
  },
  buttonWithoutShadow: {
    display: 'inline-flexbox',
    boxShadow: 'none',
    padding: '16px 20px',
  },
  buttonClearAllFilters: {
    // padding: '16px 9px 16px 9px !important',
    color: '#3f51b5',
    '&:hover, &:focus': {
      background: 'none',
    },
  },
  primaryTextColor: {
    color: '#3793FF',
  },
  table: {
    '& .MuiDataGrid-columnHeaderTitle': {
      fontWeight: 'bold',
    },
  },
})

function CustomToolBar() {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
    </GridToolbarContainer>
  )
}

export default function CarActivityDetail(): JSX.Element {
  const classes = useStyles()
  const { id: carId } = useParams<CarActivityDetailParams>()
  const { t, i18n } = useTranslation()
  const isThaiLanguage = i18n.language === 'th'
  const fixEndDateDays = 31 // the number of date from our PO to fix it
  const fixFilterStartDate = dayjs()
  const fixFilterEndDate = fixFilterStartDate.add(fixEndDateDays, 'days')

  const [page, setPage] = useState<number>(0)
  const [pageSize, setPageSize] = useState<number>(10)
  const [totalSchedules] = useState<number>(0)
  const [serviceSchedule, setServiceSchedule] = useState<Schedule | null>(null)
  const [visibleDeleteConfirmationDialog, setVisibleDeleteConfirmationDialog] =
    useState<boolean>(false)
  const [visibleUpdateDialog, setVisibleUpdateDialog] = useState<boolean>(false)
  const [filterStartDate, setFilterStartDate] =
    useState<MaterialUiPickersDate | Dayjs | null>(fixFilterStartDate)
  const [filterEndDate, setFilterEndDate] =
    useState<MaterialUiPickersDate | Dayjs | null>(fixFilterEndDate)
  const [filterService, setFilterService] = useState<string>('')
  const [resetFilters, setResetFilters] = useState<boolean>(false)

  const { data: scheduleServices, isFetching: isFetchingScheduleServices } = useQuery(
    'schedule-services',
    () => getScheduleServices()
  )
  const { data: carDetail, isFetching: isFetchingCarDetail } = useQuery('car-detail', () =>
    getCarById(carId)
  )
  const {
    data: carSchedulesData,
    refetch,
    isFetching: isFetchingCarSchedulesData,
  } = useQuery(
    'car-schedules',
    () =>
      getSchedulesByCarId({
        carId,
        bookingTypeId: filterService,
        startDate: filterStartDate?.format(DEFAULT_DATE_FORMAT_BFF),
        endDate: filterEndDate?.format(DEFAULT_DATE_FORMAT_BFF),
      }),
    {
      retry: 0,
      onError: (error) => {
        if (error instanceof Error) {
          return toast.error(error.message)
        }
        return toast.error(t('error.unknown'))
      },
    }
  )

  const carSchedules =
    (carSchedulesData &&
      carSchedulesData.length > 0 &&
      carSchedulesData
        /**
         * Filtering the deleted status out of the list.
         * @TODO Remove the filter after the API is done.
         */
        // .filter((schedule) => schedule.status !== ScheduleStatus.UPCOMING_CANCELLED)
        .map((schedule) => {
          return {
            id: schedule.bookingId,
            ...schedule,
          }
        })) ||
    []

  const isNoData = carSchedules.length < 1
  const isThereFilter =
    filterStartDate?.format(DEFAULT_DATE_FORMAT_BFF) !==
      fixFilterStartDate.format(DEFAULT_DATE_FORMAT_BFF) ||
    filterEndDate?.format(DEFAULT_DATE_FORMAT_BFF) !==
      fixFilterEndDate.format(DEFAULT_DATE_FORMAT_BFF) ||
    filterService

  useEffect(() => {
    refetch()
  }, [totalSchedules, page, pageSize])

  /**
   * Use for triggering to reset all filters and fetch data again.
   */
  useEffect(() => {
    if (resetFilters) {
      refetch()
      setResetFilters(false)
    }
  }, [resetFilters])

  const handleOnClickClearAllFilters = () => {
    setFilterStartDate(fixFilterStartDate)
    setFilterEndDate(fixFilterEndDate)
    setFilterService('')
    setResetFilters(true)
  }

  const handleOnClickButton = (scheduleId: string, action: ScheduleActions) => {
    const schedule = carSchedules.find((row) => row.id === scheduleId)
    if (!schedule) {
      return false
    }
    setServiceSchedule(schedule)

    if (action === ScheduleActions.Edit) {
      setVisibleUpdateDialog(true)
    } else if (action === ScheduleActions.Delete) {
      setVisibleDeleteConfirmationDialog(true)
    }
  }

  const handleOnCloseDeleteConfirmationDialog = () => {
    setVisibleDeleteConfirmationDialog(false)
    if (!serviceSchedule) {
      return toast.error('Service schedule not found')
    }
    toast.promise(
      deleteSchedule({
        bookingId: serviceSchedule.bookingId,
        bookingDetailId: serviceSchedule.bookingDetailId,
      }),
      {
        loading: t('toast.loading'),
        success: () => {
          refetch()
          return t('carActivity.deleteDialog.success')
        },
        error: t('carActivity.deleteDialog.error'),
      },
      {
        duration: 5000,
      }
    )
  }

  const generatelDeleteConfirmationHTML = (
    schedule: Schedule | null,
    t: TFunction<Namespace>
  ): string => {
    if (!schedule) {
      return ''
    }

    const template = `
      <div>
        <p style="margin-bottom: 20px">${t(
          'carActivity.deleteDialog.message'
        )} <strong>:scheduleId</strong>?</p>
        <div>
          <div style="clear: both;">
            <div style="width: 100px; float: left; font-weight: bold;">${t(
              'carActivity.deleteDialog.startDate'
            )}</div>
            <div style="float: left">:startDate</div>
          </div>
          <div style="clear: both;">
            <div style="width: 100px; float: left; font-weight: bold;">${t(
              'carActivity.deleteDialog.endDate'
            )}</div>
            <div style="float: left">:endDate</div>
          </div>
          <div style="clear: both;">
            <div style="width: 100px; float: left; font-weight: bold;">${t(
              'carActivity.deleteDialog.service'
            )}</div>
            <div style="float: left">:service</div>
          </div>
        </div>
      </div>
    `

    return template
      .replace(':scheduleId', schedule.bookingDetailId)
      .replace(':startDate', dayjs(schedule.startDate).format(DEFAULT_DATE_FORMAT))
      .replace(':endDate', dayjs(schedule.endDate).format(DEFAULT_DATE_FORMAT))
      .replace(':service', getServiceLabel(schedule.bookingType.nameEn, t))
  }

  const generateLinkToSubscription = (subscriptionId: string) => {
    return `/subscription?subscriptionId=${subscriptionId}`
  }

  const columns: GridColDef[] = [
    {
      field: 'startDate',
      headerName: t('carActivity.startDate.label'),
      description: t('carActivity.startDate.label'),
      flex: 1,
      filterable: false,
      sortable: false,
      renderCell: (params: GridCellParams) =>
        dayjs(params.value as string).format(DEFAULT_DATE_FORMAT),
    },
    {
      field: 'endDate',
      headerName: t('carActivity.endDate.label'),
      description: t('carActivity.endDate.label'),
      flex: 1,
      filterable: false,
      sortable: false,
      renderCell: (params: GridCellParams) =>
        dayjs(params.value as string).format(DEFAULT_DATE_FORMAT),
    },
    {
      field: 'bookingId',
      headerName: t('carActivity.scheduleId.label'),
      description: t('carActivity.scheduleId.label'),
      flex: 1,
      filterable: false,
      sortable: false,
    },
    {
      field: 'status',
      headerName: t('carActivity.status.label'),
      description: t('carActivity.status.label'),
      flex: 1,
      filterable: false,
      sortable: false,
      renderCell: (params: GridCellParams) => {
        if (params.row.bookingType.id === CarActivityBookingTypeIds.RENT) {
          return t('car.statuses.inUse')
        }
        return t('car.statuses.outOfService')
      },
    },
    {
      field: 'bookingType',
      headerName: t('carActivity.service.label'),
      description: t('carActivity.service.label'),
      flex: 1,
      filterable: false,
      sortable: false,
      renderCell: (params: GridCellParams) => {
        const bookingType = params.value as Schedule['bookingType']
        if (!bookingType) {
          return '-'
        }

        const mapBookingTypeLabel = () => {
          if (isThaiLanguage) {
            if (bookingType.nameTh) {
              return bookingType.nameTh
            }
            return `[${bookingType.nameEn}]`
          }
          return bookingType.nameEn
        }

        if (bookingType.id === CarActivityBookingTypeIds.RENT) {
          return (
            <Link to={generateLinkToSubscription(params.row.bookingDetailId)}>
              {t('carActivity.statuses.rent')}
            </Link>
          )
        }

        return mapBookingTypeLabel()
      },
    },
    {
      field: 'remark',
      headerName: t('carActivity.remark.label'),
      description: t('carActivity.remark.label'),
      flex: 1,
      filterable: false,
      sortable: false,
      renderCell: (params: GridCellParams) => params.value || '-',
    },
    {
      field: 'updatedDate',
      headerName: t('carActivity.modifyDate.label'),
      description: t('carActivity.modifyDate.label'),
      flex: 1,
      filterable: false,
      sortable: false,
      renderCell: (params: GridCellParams) =>
        dayjs(params.value as string).format(DEFAULT_DATE_FORMAT),
    },
    {
      field: 'updatedBy',
      headerName: t('carActivity.modifyBy.label'),
      description: t('carActivity.modifyBy.label'),
      flex: 1,
      filterable: false,
      sortable: false,
      renderCell: (params: GridCellParams) => params.value || '-',
    },
    {
      field: 'action',
      headerName: t('carActivity.action.label'),
      description: t('carActivity.action.label'),
      flex: 1,
      renderCell: (params: GridCellParams) => {
        const isInRent = params.row.bookingType.id === CarActivityBookingTypeIds.RENT
        const buttonClass = isInRent ? classes.hide : ''
        const subscriptionLinkClass = !isInRent ? classes.hide : ''
        const isServiceStarted = dayjs(params.row.startDate).diff(dayjs(), 'day') <= 0
        const isServiceFinished = dayjs(params.row.endDate).diff(dayjs(), 'day') < 0

        return (
          <Fragment>
            <Link
              className={[subscriptionLinkClass, classes.marginTextButton].join(' ')}
              to={generateLinkToSubscription(params.row.bookingDetailId)}
            >
              {t('carActivity.view.label')}
            </Link>
            <IconButton
              className={buttonClass}
              disabled={isServiceStarted}
              onClick={() => handleOnClickButton(params.id as string, ScheduleActions.Delete)}
            >
              <DeleteIcon />
            </IconButton>
            <IconButton
              className={buttonClass}
              disabled={isServiceFinished}
              onClick={() => handleOnClickButton(params.id as string, ScheduleActions.Edit)}
            >
              <EditIcon />
            </IconButton>
          </Fragment>
        )
      },
    },
  ]

  return (
    <Page>
      <Typography variant="h5" component="h1" gutterBottom>
        {t('sidebar.carActivity')}
      </Typography>
      <Breadcrumbs>
        <Link to="/">{t('carActivity.breadcrumbs.vehicle')}</Link>
        <Link to="/car-activity">{t('sidebar.carActivity')}</Link>
        <Typography color="textPrimary">{carDetail?.plateNumber || '-'}</Typography>
      </Breadcrumbs>

      <Card className={classes.cardWrapper}>
        <Typography variant="h5" component="h2" gutterBottom>
          {t('carActivity.overview.header')}:
        </Typography>
        <Grid className="id" container spacing={4}>
          <Grid item xs={4} sm={2} className={classes.textBold}>
            {t('carActivity.activityId.label')}:
          </Grid>
          <Grid className={classes.primaryTextColor} item xs={8} sm={10}>
            {carDetail?.id || '-'}
          </Grid>
        </Grid>
        <Grid className="brand" container spacing={4}>
          <Grid item xs={4} sm={2} className={classes.textBold}>
            {t('carActivity.brand.label')}:
          </Grid>

          <Grid item xs={8} sm={10}>
            {carDetail?.carSku?.carModel.brand.name || '-'}
          </Grid>
        </Grid>
        <Grid className="model" container spacing={4}>
          <Grid item xs={4} sm={2} className={classes.textBold}>
            {t('carActivity.model.label')}:
          </Grid>
          <Grid item xs={8} sm={10}>
            {carDetail?.carSku?.carModel.name || '-'}
          </Grid>
        </Grid>
        <Grid className="color" container spacing={4}>
          <Grid item xs={4} sm={2} className={classes.textBold}>
            {t('carActivity.color.label')}:
          </Grid>
          <Grid item xs={8} sm={10}>
            {carDetail?.carSku?.color || '-'}
          </Grid>
        </Grid>
        <Grid className="plateNumber" container spacing={4}>
          <Grid item xs={4} sm={2} className={classes.textBold}>
            {t('carActivity.plateNumber.label')}:
          </Grid>
          <Grid item xs={8} sm={10}>
            {carDetail?.plateNumber || '-'}
          </Grid>
        </Grid>
        <Grid className="visibility" container spacing={4}>
          <Grid item xs={4} sm={2} className={classes.textBold}>
            {t('carActivity.visibility.label')}:
          </Grid>
          <Grid item xs={8} sm={10}>
            {carDetail ? columnFormatCarVisibility(carDetail.isActive, t) : '-'}
          </Grid>
        </Grid>
      </Card>

      <Card className={classes.cardWrapper}>
        <Grid className="id" container spacing={4}>
          <Grid item xs={6}>
            <Typography variant="h5" component="h2" gutterBottom>
              {t('sidebar.carActivity')}
            </Typography>
          </Grid>
          <Grid item xs={6} className={classes.textAlignRight}>
            <Button
              variant="contained"
              color="primary"
              className={classes.buttonWithoutShadow}
              onClick={() => setVisibleUpdateDialog(true)}
            >
              {t('button.add')}
            </Button>
          </Grid>
        </Grid>
        <Grid container spacing={2} className={classes.marginSpace}>
          <Grid item xs={12} sm={6} md={3} lg={2}>
            <FormControl variant="outlined" className={classes.fullWidth}>
              <DatePicker
                inputVariant="outlined"
                label={t('carActivity.startDate.label')}
                format="DD/MM/YYYY"
                onChange={(date) => {
                  if (date) {
                    setFilterStartDate(date)
                    setFilterEndDate(date.add(fixEndDateDays, 'days'))
                  }
                }}
                value={filterStartDate}
                defaultValue={filterStartDate}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={2}>
            <FormControl variant="outlined" className={classes.fullWidth}>
              <DatePicker
                inputVariant="outlined"
                label={t('carActivity.endDate.label')}
                format="DD/MM/YYYY"
                onChange={(date) => setFilterEndDate(date)}
                value={filterEndDate}
                defaultValue={filterEndDate}
                minDate={filterStartDate?.add(2, 'days')}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={2}>
            <FormControl variant="outlined" className={classes.fullWidth}>
              <InputLabel shrink id="service-label">
                {t('carActivity.service.label')}
              </InputLabel>
              <Select
                labelId="service-label"
                id="service"
                onChange={({ target: { value } }) => setFilterService(value as string)}
                value={filterService}
                displayEmpty
                input={<OutlinedInput notched label={t('carActivity.service.label')} />}
              >
                <MenuItem value="">{t('all')}</MenuItem>
                {scheduleServices &&
                  scheduleServices.length > 0 &&
                  scheduleServices
                    .filter((service) => service.id !== CarActivityBookingTypeIds.RENT)
                    .map((service, index) => {
                      return (
                        <MenuItem key={`${index}-${service.id}`} value={service.id}>
                          {isThaiLanguage ? service.nameTh : service.nameEn}
                        </MenuItem>
                      )
                    })}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={2}>
            <Button
              variant="contained"
              color="primary"
              className={classes.buttonWithoutShadow}
              onClick={() => refetch()}
            >
              {t('button.filter')}
            </Button>
            <Button
              color="secondary"
              className={[
                classes.hide,
                classes.buttonWithoutShadow,
                classes.buttonClearAllFilters,
                !isThereFilter ? classes.hide : '',
              ].join(' ')}
              onClick={() => handleOnClickClearAllFilters()}
            >
              {t('button.clearAll')}
            </Button>
          </Grid>
        </Grid>

        {isNoData ? (
          <NoResultCard />
        ) : (
          <DataGridLocale
            className={[classes.marginSpace, classes.table].join(' ')}
            autoHeight
            pagination
            pageSize={pageSize}
            page={page}
            rowCount={totalSchedules}
            paginationMode="server"
            onPageSizeChange={(param: GridPageChangeParams) => setPageSize(param.pageSize)}
            onPageChange={(index: number) => setPage(index)}
            rows={carSchedules}
            columns={columns}
            disableSelectionOnClick
            components={{
              Toolbar: CustomToolBar,
            }}
          />
        )}

        <ActivityScheduleDialog
          visible={visibleUpdateDialog}
          serviceSchedule={serviceSchedule}
          carId={carId}
          onClose={() => {
            refetch()
            setServiceSchedule(null)
            setVisibleUpdateDialog(false)
          }}
        />
        <ConfirmDialog
          open={visibleDeleteConfirmationDialog}
          title={t('carActivity.deleteDialog.title')}
          htmlContent={generatelDeleteConfirmationHTML(serviceSchedule, t)}
          confirmText={t('carActivity.deleteDialog.confirm')}
          cancelText={t('carActivity.deleteDialog.close')}
          onConfirm={handleOnCloseDeleteConfirmationDialog}
          onCancel={() => setVisibleDeleteConfirmationDialog(false)}
        />
      </Card>
      <Backdrop
        open={isFetchingScheduleServices || isFetchingCarDetail || isFetchingCarSchedulesData}
      />
    </Page>
  )
}
