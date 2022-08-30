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
import carActivitiesJson from 'data/car-activity.json'
import { DEFAULT_DATE_FORMAT } from 'utils'
import DatePicker from 'components/DatePicker'
import { Page } from 'layout/LayoutRoute'
import { columnFormatCarStatus, CarStatus } from 'pages/Car/utils'
import { getServiceLabel } from 'pages/CarActivity/utils'
import DataGridLocale from 'components/DataGridLocale'
import ActivityScheduleDialog from 'components/ActivityScheduleDialog'
import ConfirmDialog from 'components/ConfirmDialog'
import NoResultCard from 'components/NoResultCard'
import { getSchedulesByCarId, deleteSchedule } from 'services/web-bff/car-activity'
import { CarActivityBookingTypeIds, CarActivitySchedule } from 'services/web-bff/car-activity.type'

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
  const { id } = useParams<CarActivityDetailParams>()
  const { t, i18n } = useTranslation()
  const isThaiLanguage = i18n.language === 'th'

  const [page, setPage] = useState<number>(0)
  const [pageSize, setPageSize] = useState<number>(10)
  const [visibleConfirmDialog, setVisibleConfirmDialog] = useState<boolean>(false)
  const [totalSchedules] = useState<number>(0)
  const [serviceSchedule, setServiceSchedule] = useState<CarActivitySchedule | null>(null)
  const [visibleScheduleDialog, setVisibleScheduleDialog] = useState<boolean>(false)
  const [filterStartDate, setFilterStartDate] = useState<MaterialUiPickersDate | Dayjs>(
    dayjs().startOf('day')
  )
  const [filterEndDate, setFilterEndDate] = useState<MaterialUiPickersDate | Dayjs>(
    dayjs().endOf('day').add(1, 'day')
  )
  const [filterCarStatus, setFilterCarStatus] = useState<string>('')

  const carActivity = carActivitiesJson.activities.find((activity) => activity.id === id)
  const { data: carActivityData, refetch } = useQuery('get-car-activities', () =>
    getSchedulesByCarId(id)
  )

  const serviceSchedules =
    (carActivityData &&
      carActivityData.length > 0 &&
      carActivityData.map((carActivity) => {
        return {
          id: carActivity.bookingId,
          ...carActivity,
        }
      })) ||
    []

  const isNoData = serviceSchedules.length < 1

  useEffect(() => {
    refetch()
  }, [totalSchedules, page, pageSize])

  const handleOnClickFilters = () => {
    // console.log('handleOnClickFilters ->', {
    //   filterStartDate,
    //   filterEndDate,
    //   filterService,
    // })
  }

  const handleOnClickButton = (scheduleId: string, action: ScheduleActions) => {
    const schedule = serviceSchedules.find((row) => row.id === scheduleId)
    if (!schedule) {
      return false
    }
    setServiceSchedule(schedule)

    if (action === ScheduleActions.Edit) {
      setVisibleScheduleDialog(true)
    } else if (action === ScheduleActions.Delete) {
      setVisibleConfirmDialog(true)
    }
  }

  const handleOnCloseConfirmDialog = () => {
    setVisibleConfirmDialog(false)
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
        success: t('carActivity.deleteDialog.success'),
        error: t('carActivity.deleteDialog.error'),
      },
      {
        duration: 5000,
      }
    )
  }

  const generatelConfirmDeleteHtml = (
    schedule: CarActivitySchedule | null,
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

        switch (params.value) {
          case CarStatus.ACCEPTED:
            return t('car.statuses.accepted')
          case CarStatus.AVAILABLE:
            return t('car.statuses.available')
          case CarStatus.OUT_OF_SERVICE:
            return t('car.statuses.outOfService')
          case CarStatus.PUBLISHED:
            return t('car.statuses.published')
          case CarStatus.RESERVED:
            return t('car.statuses.reserved')
          case CarStatus.UPCOMING_CANCELLED:
            return t('car.statuses.upcomingCancelled')
          default:
            return t('car.statuses.unknown')
        }
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
        const bookingType = params.value as CarActivitySchedule['bookingType']
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
        const isUnableToEditOrDelete = dayjs(params.row.endDate).diff(dayjs()) < 0
        const isInRent = params.row.bookingType.id === CarActivityBookingTypeIds.RENT
        const hideButton =
          params.row.status === CarStatus.OUT_OF_SERVICE && !isInRent ? 'show-icons' : classes.hide
        const hideSubscriptionLink = isInRent ? '' : classes.hide

        return (
          <Fragment>
            <Link
              className={[hideSubscriptionLink, classes.marginTextButton].join(' ')}
              to={generateLinkToSubscription(params.row.bookingDetailId)}
            >
              {t('carActivity.view.label')}
            </Link>
            <IconButton
              className={hideButton}
              onClick={() => handleOnClickButton(params.id as string, ScheduleActions.Delete)}
              disabled={isUnableToEditOrDelete}
            >
              <DeleteIcon />
            </IconButton>
            <IconButton
              // className={hideButton}
              onClick={() => handleOnClickButton(params.id as string, ScheduleActions.Edit)}
              disabled={isUnableToEditOrDelete}
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
        <Typography color="textPrimary">{carActivity?.plateNumber}</Typography>
      </Breadcrumbs>

      <Card className={classes.cardWrapper}>
        <Typography variant="h5" component="h2" gutterBottom>
          {t('carActivity.overview.header')}:
        </Typography>
        <Grid className="id" container spacing={4}>
          <Grid item xs={4} sm={2} className={classes.textBold}>
            {t('carActivity.activityId.label')}:
          </Grid>
          <Grid item xs={8} sm={10}>
            {carActivity?.id}
          </Grid>
        </Grid>
        <Grid className="brand" container spacing={4}>
          <Grid item xs={4} sm={2} className={classes.textBold}>
            {t('carActivity.brand.label')}:
          </Grid>
          <Grid item xs={8} sm={10}>
            {carActivity?.carModel.brand_name}
          </Grid>
        </Grid>
        <Grid className="model" container spacing={4}>
          <Grid item xs={4} sm={2} className={classes.textBold}>
            {t('carActivity.model.label')}:
          </Grid>
          <Grid item xs={8} sm={10}>
            {carActivity?.carModel.model_name}
          </Grid>
        </Grid>
        <Grid className="color" container spacing={4}>
          <Grid item xs={4} sm={2} className={classes.textBold}>
            {t('carActivity.color.label')}:
          </Grid>
          <Grid item xs={8} sm={10}>
            {carActivity?.carModel.color_name}
          </Grid>
        </Grid>
        <Grid className="plateNumber" container spacing={4}>
          <Grid item xs={4} sm={2} className={classes.textBold}>
            {t('carActivity.plateNumber.label')}:
          </Grid>
          <Grid item xs={8} sm={10}>
            {carActivity?.plateNumber}
          </Grid>
        </Grid>
        <Grid className="visibility" container spacing={4}>
          <Grid item xs={4} sm={2} className={classes.textBold}>
            {t('carActivity.visibility.label')}:
          </Grid>
          <Grid item xs={8} sm={10}>
            {columnFormatCarStatus(carActivity?.status as string, t)}
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
              onClick={() => setVisibleScheduleDialog(true)}
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
                onChange={(date) => setFilterStartDate(date)}
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
                minDate={filterStartDate}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={2}>
            <FormControl variant="outlined" className={classes.fullWidth}>
              <InputLabel id="status-label">{t('carActivity.status.label')}</InputLabel>
              <Select
                labelId="status-label"
                id="status"
                label={t('carActivity.status.label')}
                onChange={({ target: { value } }) => setFilterCarStatus(value as string)}
                value={filterCarStatus}
                defaultValue={filterCarStatus}
              >
                <MenuItem value="in_use">{t('car.statuses.inUse')}</MenuItem>
                <MenuItem value="available">{t('car.statuses.available')}</MenuItem>
                <MenuItem value="out_of_service">{t('car.statuses.outOfService')}</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3} lg={2}>
            <Button
              variant="contained"
              color="primary"
              className={classes.buttonWithoutShadow}
              onClick={() => handleOnClickFilters()}
            >
              {t('button.filter')}
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
            rows={serviceSchedules}
            columns={columns}
            disableSelectionOnClick
            components={{
              Toolbar: CustomToolBar,
            }}
          />
        )}

        <ActivityScheduleDialog
          visible={visibleScheduleDialog}
          serviceSchedule={serviceSchedule}
          carId={id}
          onClose={() => {
            refetch()
            setServiceSchedule(null)
            setVisibleScheduleDialog(false)
          }}
        />
        <ConfirmDialog
          open={visibleConfirmDialog}
          title={t('carActivity.deleteDialog.title')}
          htmlContent={generatelConfirmDeleteHtml(serviceSchedule, t)}
          confirmText={t('carActivity.deleteDialog.confirm')}
          cancelText={t('carActivity.deleteDialog.close')}
          onConfirm={handleOnCloseConfirmDialog}
          onCancel={() => setVisibleConfirmDialog(false)}
        />
      </Card>
    </Page>
  )
}
