/* eslint-disable no-constant-condition */
/* eslint-disable react-hooks/exhaustive-deps */
import dayjs, { Dayjs } from 'dayjs'
import toast from 'react-hot-toast'
import { Fragment, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { TFunction, Namespace, useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import {
  Button,
  Card,
  FormControl,
  Grid,
  MenuItem,
  IconButton,
  InputLabel,
  Select,
  Typography,
  Tooltip,
  OutlinedInput,
  Box,
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
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import { DEFAULT_DATE_FORMAT, DEFAULT_DATE_FORMAT_BFF } from 'utils'
import DatePicker from 'components/DatePicker'
import { Page } from 'layout/LayoutRoute'
import { columnFormatCarVisibility } from 'pages/Car/utils'
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
} from 'services/web-bff/car-activity'
import { CarActivityBookingTypeIds, Schedule } from 'services/web-bff/car-activity.type'
import PageTitle, { PageBreadcrumbs } from 'components/PageTitle'

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
  textPrimary: {
    fontSize: '20px',
  },
  textSecondary: {
    fontSize: '14px',
    color: 'rgba(0, 0, 0, 0.6)',
  },
  detailPadding: {
    padding: '2px 16px',
  },
  backgroundSecondaty: {
    background: '#FAFAFA',
  },
  secondaryButton: {
    background: '#424E63',
    color: 'white',
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
        page: page + 1,
        size: pageSize,
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
      carSchedulesData.schedules.length > 0 &&
      carSchedulesData.schedules.map((schedule) => {
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

    const { bookingDetailId, bookingType, startDate, endDate } = schedule
    const { nameEn, nameTh } = bookingType

    return template
      .replace(':scheduleId', bookingDetailId)
      .replace(':startDate', dayjs(startDate).format(DEFAULT_DATE_FORMAT))
      .replace(':endDate', dayjs(endDate).format(DEFAULT_DATE_FORMAT))
      .replace(':service', isThaiLanguage ? nameTh : nameEn)
  }

  const generateLinkToSubscription = (subscriptionId: string) => {
    return `/subscription?bookingDetailId=${subscriptionId}`
  }

  const columns: GridColDef[] = [
    {
      field: 'bookingId',
      headerName: t('carActivity.scheduleId.label'),
      description: t('carActivity.scheduleId.label'),
      flex: 1,
      filterable: false,
      sortable: false,
    },
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

        const bookingTypeLabel = mapBookingTypeLabel()

        return (
          <Tooltip title={bookingTypeLabel}>
            <Typography variant="inherit" noWrap>
              {bookingTypeLabel}
            </Typography>
          </Tooltip>
        )
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
        const isBlockToDelete =
          dayjs().diff(dayjs(params.row.startDate).startOf('day'), 'seconds') > 0
        const isBlockToEdit = dayjs().diff(dayjs(params.row.endDate).endOf('day'), 'seconds') > 0

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
              disabled={isBlockToDelete}
              onClick={() => handleOnClickButton(params.id as string, ScheduleActions.Delete)}
            >
              <DeleteIcon />
            </IconButton>
            <IconButton
              className={buttonClass}
              disabled={isBlockToEdit}
              onClick={() => handleOnClickButton(params.id as string, ScheduleActions.Edit)}
            >
              <EditIcon />
            </IconButton>
          </Fragment>
        )
      },
    },
  ]

  const carDetailLabel = (primaryText: string, secondaryText: string) => {
    return (
      <Fragment>
        <Typography className={classes.textPrimary} gutterBottom>
          {primaryText}
        </Typography>
        <Typography className={classes.textSecondary} gutterBottom>
          {secondaryText}
        </Typography>
      </Fragment>
    )
  }

  const breadcrumbs: PageBreadcrumbs[] = [
    {
      text: t('sidebar.carManagement.title'),
      link: '/',
    },
    {
      text: t('sidebar.carActivity'),
      link: '/car-activity',
    },
    {
      text: 'Car Activity Detail',
      link: `/car-activity/${carId}`,
    },
  ]

  return (
    <Page>
      <PageTitle title="Car Activity Detail" breadcrumbs={breadcrumbs} />
      {/* <Typography variant="h5" component="h1" gutterBottom>
        {t('sidebar.carActivity')}
      </Typography>
      <Breadcrumbs>
        <Link to="/">{t('carActivity.breadcrumbs.vehicle')}</Link>
        <Link to="/car-activity">{t('sidebar.carActivity')}</Link>
        <Typography color="textPrimary">{carDetail?.plateNumber || '-'}</Typography>
      </Breadcrumbs> */}

      <Card className={classes.cardWrapper}>
        <Typography variant="h5" component="h2" gutterBottom>
          {t('carActivity.overview.header')}
        </Typography>
        <Box>
          <Grid className={classes.detailPadding} container spacing={4}>
            <Grid item xs={12} className={classes.textBold}>
              {carDetailLabel(carDetail?.id || '-', t('carActivity.activityId.label'))}
            </Grid>
          </Grid>
          <Grid
            className={[classes.detailPadding, classes.backgroundSecondaty].join(' ')}
            container
            spacing={4}
          >
            <Grid item xs={12} sm={6} className={classes.textBold}>
              {carDetailLabel(
                carDetail?.carSku?.carModel.brand.name || '-',
                t('carActivity.brand.detailLabel')
              )}
            </Grid>
            <Grid item xs={12} sm={6} className={classes.textBold}>
              {carDetailLabel(
                carDetail?.carSku?.carModel.name || '-',
                t('carActivity.model.detailLabel')
              )}
            </Grid>
          </Grid>
          <Grid className={classes.detailPadding} container spacing={4}>
            <Grid item xs={12} className={classes.textBold}>
              {carDetailLabel(carDetail?.carSku?.color || '-', t('carActivity.color.label'))}
            </Grid>
          </Grid>
          <Grid
            className={[classes.detailPadding, classes.backgroundSecondaty].join(' ')}
            container
            spacing={4}
          >
            <Grid item xs={12} sm={6} className={classes.textBold}>
              {carDetailLabel(carDetail?.plateNumber || '-', t('carActivity.plateNumber.label'))}
            </Grid>
            <Grid item xs={12} sm={6} className={classes.textBold}>
              {carDetailLabel(
                carDetail ? columnFormatCarVisibility(carDetail.isActive, t) : '-' || '-',
                t('carActivity.visibility.label')
              )}
            </Grid>
          </Grid>
        </Box>
      </Card>

      <Card className={classes.cardWrapper}>
        <Grid className="id" container spacing={4}>
          <Grid item xs={12}>
            <Typography variant="h5" component="h2" gutterBottom>
              {t('carActivity.history.label')}
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={2} className={classes.marginSpace}>
          <Grid container xs={12} sm={12} lg={8} spacing={2}>
            <Grid item xs={12} sm={3}>
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
            <Grid item xs={12} sm={3}>
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
            <Grid item xs={12} sm={3}>
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
            <Grid item xs={12} sm={3}>
              <Button
                variant="contained"
                color="primary"
                className={classes.buttonWithoutShadow}
                onClick={() => refetch()}
              >
                {t('button.search')}
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
          <Grid container className={classes.textAlignRight} xs={12} sm={12} lg={4}>
            <Grid item xs={12}>
              <Button
                variant="contained"
                className={[classes.buttonWithoutShadow, classes.secondaryButton].join(' ')}
              >
                {t('button.export')}
              </Button>
              <Button
                variant="contained"
                className={[
                  classes.buttonWithoutShadow,
                  classes.secondaryButton,
                  classes.marginTextButton,
                ].join(' ')}
                onClick={() => {
                  setServiceSchedule(null)
                  setVisibleUpdateDialog(true)
                }}
                endIcon={<AddCircleOutlineIcon />}
              >
                {t('carActivity.addSchedule.header')}
              </Button>
            </Grid>
            {/* <Grid item xs={12} md={7}>
              <Button
                variant="contained"
                className={[classes.buttonWithoutShadow, classes.secondaryButton].join(' ')}
                onClick={() => {
                  setServiceSchedule(null)
                  setVisibleUpdateDialog(true)
                }}
              >
                {t('carActivity.addSchedule.header')}
              </Button>
            </Grid> */}
          </Grid>
        </Grid>

        {isNoData ? (
          <NoResultCard />
        ) : (
          <DataGridLocale
            className={[classes.marginSpace, classes.table].join(' ')}
            autoHeight
            pagination
            pageSize={carSchedulesData?.pagination.size}
            page={page}
            rowCount={carSchedulesData?.pagination.totalRecords}
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
