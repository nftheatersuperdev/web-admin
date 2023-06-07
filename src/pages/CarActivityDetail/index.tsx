/* eslint-disable no-constant-condition */
/* eslint-disable react-hooks/exhaustive-deps */
import dayjs, { Dayjs } from 'dayjs'
import toast from 'react-hot-toast'
import { Fragment, useEffect, useState } from 'react'
import { Link, useHistory, useLocation, useParams } from 'react-router-dom'
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
  Chip,
  TextField,
} from '@material-ui/core'
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
} from '@material-ui/icons'
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date'
import { makeStyles } from '@material-ui/core/styles'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import { CSVLink } from 'react-csv'
import { PRIVILEGES, hasAllowedPrivilege } from 'auth/privileges'
import { useAuth } from 'auth/AuthContext'
import styled from 'styled-components'
import config from 'config'
import {
  DEFAULT_DATE_FORMAT,
  DEFAULT_DATE_FORMAT_BFF,
  DEFAULT_DATETIME_FORMAT_MONTH_TEXT,
} from 'utils'
import {
  CircularProgress,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import DatePicker from 'components/DatePicker'
import { Page } from 'layout/LayoutRoute'
import ActivityScheduleDialog from 'components/ActivityScheduleDialog'
import ConfirmDialog from 'components/ConfirmDialog'
import Backdrop from 'components/Backdrop'
import { getCarById } from 'services/web-bff/car'
import {
  getSchedulesByCarId,
  getScheduleServices,
  deleteSchedule,
} from 'services/web-bff/car-activity'
import {
  CarActivityBookingTypeIds,
  Schedule,
  ScheduleService,
} from 'services/web-bff/car-activity.type'
import PageTitle, { PageBreadcrumbs } from 'components/PageTitle'

interface CarActivityDetailParams {
  id: string
}
interface CarActivityStateParams {
  location: string
  owner: string
  reSeller: string
  resellerServiceAreaId: string
}
enum ScheduleActions {
  Edit = 'edit',
  Delete = 'delete',
}

const ButtonExport = styled(Button)`
  background-color: #424e63 !important;
  padding: 8px 16px !important;
  color: white;
`
const CsvButton = styled(CSVLink)`
  color: white !important;
  text-decoration: none !important;
`

export default function CarActivityDetail(): JSX.Element {
  const { getPrivileges } = useAuth()
  const currentUserPrivileges = getPrivileges()
  const isValidPrivilege = hasAllowedPrivilege(currentUserPrivileges, [
    PRIVILEGES.PERM_CAR_ACTIVITY_EDIT,
  ])

  const location = useLocation()
  const history = useHistory()
  const { id: carId } = useParams<CarActivityDetailParams>()
  const carActivityStateParams = location.state as CarActivityStateParams
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
    dropdownService: {
      // height: '0.8rem',
      '& .MuiSelect-selectMenu': {
        height: '12px',
      },
    },
    buttonSearch: {
      display: 'inline-flexbox',
      boxShadow: 'none',
      padding: '10px 12px',
    },
    buttonWithoutShadow: {
      display: 'inline-flexbox',
      boxShadow: 'none',
      padding: '8px 16px',
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
    greenBackground: {
      background: '#00a152',
      color: 'white',
    },
    textField: {
      '& .MuiInputBase-input': {
        height: '1.4rem',
      },
      '& input.Mui-disabled': {
        WebkitTextFillColor: '#000000',
        color: '#000000',
        background: '#F5F5F5',
      },
    },
    textBoldBorder: {
      borderLeft: '2px solid #E0E0E0',
      fontWeight: 'bold',
      padding: '0px 8px',
    },
    noResultMessage: {
      textAlign: 'center',
      fontSize: '1.2em',
      fontWeight: 'bold',
      padding: '48px 0',
    },
    paginationContrainer: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: '20px',
    },
    inlineElement: {
      display: 'inline-flex',
    },
    datePickerFromTo: {
      '&& .MuiOutlinedInput-input': {
        padding: '16px 14px',
        fontSize: '12px',
      },
      '&& .MuiIconButton-root': {
        padding: '0px',
      },
    },
    centerInGrid: {
      display: 'flex',
      justifyContent: 'end',
      alignItems: 'center',
    },
    dataPadding: {
      paddingLeft: '8px',
    },
    wrapWidth: {
      width: '110px',
    },
    rowOverflow: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      display: '-webkit-box',
      '-webkit-line-clamp': 2,
      '-webkit-box-orient': 'vertical',
    },
  })

  const classes = useStyles()
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

  const checkAndRenderValue = (value: string | null | undefined) => {
    if (!value) {
      return '-'
    }
    return value
  }

  const generateLinkToSubscription = (subscriptionId: string) => {
    return `/subscription?bookingDetailId=${subscriptionId}`
  }

  const generateBookingTypeChip = (bookingType: ScheduleService, bookingDetailId: string) => {
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
        <Link to={generateLinkToSubscription(bookingDetailId)}>
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
  }

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

  const carActivityHistoryRowData =
    carSchedules?.map((carSchedule) => {
      const isInRent = carSchedule.bookingType.id === CarActivityBookingTypeIds.RENT
      const buttonClass = isInRent ? classes.hide : ''
      const subscriptionLinkClass = !isInRent ? classes.hide : ''
      const isBlockToDelete =
        dayjs().diff(dayjs(carSchedule.startDate).startOf('day'), 'seconds') > 0
      const isBlockToEdit = dayjs().diff(dayjs(carSchedule.endDate).endOf('day'), 'seconds') > 0
      const bookingType = carSchedule.bookingType

      return (
        <TableRow hover key={`car-activity-history-${carSchedule.id}`}>
          <TableCell>
            <div className={classes.dataPadding}>{checkAndRenderValue(carSchedule.id)}</div>
          </TableCell>
          <TableCell>
            <div className={[classes.dataPadding, classes.wrapWidth].join(' ')}>
              <div className={classes.rowOverflow}>
                {dayjs(carSchedule.startDate as string).format(DEFAULT_DATETIME_FORMAT_MONTH_TEXT)}
              </div>
            </div>
          </TableCell>
          <TableCell>
            <div className={[classes.dataPadding, classes.wrapWidth].join(' ')}>
              <div className={classes.rowOverflow}>
                {dayjs(carSchedule.endDate as string).format(DEFAULT_DATETIME_FORMAT_MONTH_TEXT)}
              </div>
            </div>
          </TableCell>
          <TableCell>
            <div className={classes.dataPadding}>
              {carSchedule.bookingType.id === CarActivityBookingTypeIds.RENT ? (
                <Chip
                  size="small"
                  label={t('car.statuses.inUse')}
                  className={classes.greenBackground}
                />
              ) : (
                <Chip size="small" label={t('car.statuses.outOfService')} />
              )}
            </div>
          </TableCell>
          <TableCell>
            <div className={classes.dataPadding}>
              {generateBookingTypeChip(bookingType, carSchedule.bookingDetailId)}
            </div>
          </TableCell>
          <TableCell>
            <div className={classes.dataPadding}>{checkAndRenderValue(carSchedule.remark)}</div>
          </TableCell>
          <TableCell>
            <div className={[classes.dataPadding, classes.wrapWidth].join(' ')}>
              <div className={classes.rowOverflow}>
                {dayjs(carSchedule.updatedDate as string).format(
                  DEFAULT_DATETIME_FORMAT_MONTH_TEXT
                )}
              </div>
            </div>
          </TableCell>
          <TableCell>
            <div className={classes.dataPadding}>{checkAndRenderValue(carSchedule.updatedBy)}</div>
          </TableCell>
          <TableCell>
            <Fragment>
              <IconButton
                className={subscriptionLinkClass}
                onClick={() =>
                  history.push(generateLinkToSubscription(carSchedule.bookingDetailId))
                }
              >
                <VisibilityIcon />
              </IconButton>
              <IconButton
                className={buttonClass}
                disabled={isBlockToDelete || !isValidPrivilege}
                onClick={() =>
                  handleOnClickButton(carSchedule.id as string, ScheduleActions.Delete)
                }
              >
                <DeleteIcon />
              </IconButton>
              <IconButton
                className={buttonClass}
                disabled={isBlockToEdit || !isValidPrivilege}
                onClick={() => handleOnClickButton(carSchedule.id as string, ScheduleActions.Edit)}
              >
                <EditIcon />
              </IconButton>
            </Fragment>
          </TableCell>
        </TableRow>
      )
    }) || []

  const isThereFilter =
    filterStartDate?.format(DEFAULT_DATE_FORMAT_BFF) !==
      fixFilterStartDate.format(DEFAULT_DATE_FORMAT_BFF) ||
    filterEndDate?.format(DEFAULT_DATE_FORMAT_BFF) !==
      fixFilterEndDate.format(DEFAULT_DATE_FORMAT_BFF) ||
    filterService

  const csvHeaders = [
    { label: t('carActivity.history.export.header.bookingId'), key: 'bookingId' },
    { label: t('carActivity.history.export.header.bookingDetailId'), key: 'bookingDetailId' },
    { label: t('carActivity.history.export.header.carId'), key: 'carId' },
    { label: t('carActivity.history.export.header.startDate'), key: 'startDate' },
    { label: t('carActivity.history.export.header.endDate'), key: 'endDate' },
    { label: t('carActivity.history.export.header.status'), key: 'status' },
    { label: t('carActivity.history.export.header.bookingType'), key: 'bookingType' },
    { label: t('carActivity.history.export.header.remark'), key: 'remark' },
    { label: t('carActivity.history.export.header.updatedBy'), key: 'updatedBy' },
    { label: t('carActivity.history.export.header.updatedDate'), key: 'updatedDate' },
  ]
  // eslint-disable-next-line
  const csvData: any = carSchedules.map((schedule) => {
    return {
      ...schedule,
      bookingType: schedule.bookingType.nameEn,
    }
  })

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

  const generateDataToTable = () => {
    if (carActivityHistoryRowData.length > 0) {
      return <TableBody>{carActivityHistoryRowData}</TableBody>
    }

    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={9}>
            <div className={classes.noResultMessage}>{t('warning.noResult')}</div>
          </TableCell>
        </TableRow>
      </TableBody>
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

      <Card className={classes.cardWrapper}>
        <Typography variant="h5" component="h2" gutterBottom>
          {t('carActivity.overview.header')}
        </Typography>
        <Box>
          <Grid className={classes.detailPadding} container spacing={6}>
            <Grid item xs={12} sm={6} className={classes.textBold}>
              <TextField
                type="text"
                id="caractivity_detail__id"
                className={classes.textField}
                label={t('carActivity.activityId.label')}
                fullWidth
                disabled
                variant="outlined"
                value={carDetail?.id || '-'}
              />
            </Grid>
            <Grid item xs={12} sm={6} className={classes.textBold}>
              <TextField
                type="text"
                id="caractivity_detail__location"
                className={classes.textField}
                label={t('carActivity.location.label')}
                fullWidth
                disabled
                variant="outlined"
                value={carActivityStateParams?.location || '-'}
              />
            </Grid>
          </Grid>

          <Grid className={classes.detailPadding} container spacing={6}>
            <Grid item xs={12} sm={6} className={classes.textBold}>
              <TextField
                type="text"
                id="caractivity_detail__brand"
                className={classes.textField}
                label={t('carActivity.brand.detailLabel')}
                fullWidth
                disabled
                variant="outlined"
                value={carDetail?.carSku?.carModel.brand.name || '-'}
              />
            </Grid>
            <Grid item xs={12} sm={6} className={classes.textBold}>
              <TextField
                type="text"
                id="caractivity_detail__model"
                className={classes.textField}
                label={t('carActivity.model.detailLabel')}
                fullWidth
                disabled
                variant="outlined"
                value={carDetail?.carSku?.carModel.name || '-'}
              />
            </Grid>
          </Grid>

          <Grid className={classes.detailPadding} container spacing={6}>
            <Grid item xs={12} sm={6} className={classes.textBold}>
              <TextField
                type="text"
                id="caractivity_detail__color"
                className={classes.textField}
                label={t('carActivity.color.label')}
                fullWidth
                disabled
                variant="outlined"
                value={carDetail?.carSku?.color || '-'}
              />
            </Grid>
          </Grid>

          <Grid className={classes.detailPadding} container spacing={6}>
            <Grid item xs={12} sm={6} className={classes.textBold}>
              <TextField
                type="text"
                id="caractivity_detail__plate"
                className={classes.textField}
                label={t('carActivity.plateNumber.label')}
                fullWidth
                disabled
                variant="outlined"
                value={carDetail?.plateNumber || '-'}
              />
            </Grid>
            <Grid item xs={12} sm={6} className={classes.textBold}>
              <TextField
                type="text"
                id="caractivity_detail__visibility"
                className={classes.textField}
                label={t('carActivity.visibility.label')}
                fullWidth
                disabled
                variant="outlined"
                value={
                  carDetail?.isActive ? t('car.statuses.published') : t('car.statuses.unpublished')
                }
              />
            </Grid>
          </Grid>

          <Grid className={classes.detailPadding} container spacing={6}>
            <Grid item xs={12} sm={6} className={classes.textBold}>
              <TextField
                type="text"
                id="caractivity_detail__owner"
                className={classes.textField}
                label={t('carActivity.table.header.owner')}
                fullWidth
                disabled
                variant="outlined"
                value={carActivityStateParams?.owner || '-'}
              />
            </Grid>
            <Grid item xs={12} sm={6} className={classes.textBold}>
              <TextField
                type="text"
                id="caractivity_detail__reseller"
                className={classes.textField}
                label={t('carActivity.table.header.reseller')}
                fullWidth
                disabled
                variant="outlined"
                value={carActivityStateParams?.reSeller || '-'}
              />
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
        <Grid
          container
          spacing={2}
          className={[classes.marginSpace, classes.datePickerFromTo].join(' ')}
        >
          <Grid container xs={12} sm={12} lg={8} spacing={2}>
            <Grid item xs={12} sm={3}>
              <FormControl variant="outlined" className={classes.fullWidth}>
                <DatePicker
                  inputVariant="outlined"
                  label={t('carActivity.startDate.label')}
                  format="DD MMM YYYY"
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
                  format="DD MMM YYYY"
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
                  className={classes.dropdownService}
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
                className={classes.buttonSearch}
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
            <Grid item xs={12} className={classes.centerInGrid}>
              {/* <Button
                variant="contained"
                className={[classes.buttonWithoutShadow, classes.secondaryButton].join(' ')}
              >
                {t('button.export')}
              </Button> */}
              <ButtonExport
                id="car_activity_history__export_btn"
                variant="contained"
                className={[classes.buttonWithoutShadow, classes.secondaryButton].join(' ')}
              >
                <CsvButton
                  data={csvData}
                  headers={csvHeaders}
                  filename={t('sidebar.carActivity') + '.csv'}
                >
                  {t('button.export').toUpperCase()}
                </CsvButton>
              </ButtonExport>
              <Button
                disabled={!isValidPrivilege}
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
          </Grid>
        </Grid>
        <Fragment>
          <TableContainer component={Paper} className={classes.table}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <div className={classes.textBoldBorder}>
                      {t('carActivity.history.export.header.id')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className={classes.textBoldBorder}>
                      {t('carActivity.history.export.header.startDate')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className={classes.textBoldBorder}>
                      {t('carActivity.history.export.header.endDate')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className={classes.textBoldBorder}>
                      {t('carActivity.history.export.header.status')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className={classes.textBoldBorder}>
                      {t('carActivity.history.export.header.bookingType')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className={classes.textBoldBorder}>
                      {t('carActivity.history.export.header.remark')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className={classes.textBoldBorder}>
                      {t('carActivity.history.export.header.updatedDate')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className={classes.textBoldBorder}>
                      {t('carActivity.history.export.header.updatedBy')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className={classes.textBoldBorder}>
                      {t('carActivity.history.export.header.action')}
                    </div>
                  </TableCell>
                </TableRow>
              </TableHead>

              {isFetchingScheduleServices ? (
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                </TableBody>
              ) : (
                generateDataToTable()
              )}
            </Table>
          </TableContainer>
          <Card>
            <div className={classes.paginationContrainer}>
              Rows per page:&nbsp;
              <FormControl className={classes.inlineElement} variant="standard">
                <Select
                  value={carSchedulesData?.pagination?.size || pageSize}
                  defaultValue={carSchedulesData?.pagination?.size || pageSize}
                  onChange={(event) => {
                    setPage(1)
                    setPageSize(event.target.value as number)
                  }}
                >
                  {config.tableRowsPerPageOptions.map((rowOption) => {
                    return (
                      <MenuItem key={rowOption} value={rowOption}>
                        {rowOption}
                      </MenuItem>
                    )
                  })}
                </Select>
              </FormControl>
              <Pagination
                count={carSchedulesData?.pagination?.totalPage}
                page={carSchedulesData?.pagination?.page || page}
                defaultPage={carSchedulesData?.pagination?.page || page}
                variant="text"
                color="primary"
                onChange={(_event: React.ChangeEvent<unknown>, value: number) => {
                  setPage(value)
                }}
              />
            </div>
          </Card>
        </Fragment>

        <ActivityScheduleDialog
          visible={visibleUpdateDialog}
          serviceSchedule={serviceSchedule}
          resellerServiceAreaId={carActivityStateParams.resellerServiceAreaId}
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
