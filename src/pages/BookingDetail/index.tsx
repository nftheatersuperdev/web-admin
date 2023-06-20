import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { useParams, useHistory, useLocation } from 'react-router-dom'
import dayjs from 'dayjs'
import ls from 'localstorage-slim'
import {
  Button,
  Card,
  Grid,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useAuth } from 'auth/AuthContext'
import { PRIVILEGES, hasAllowedPrivilege } from 'auth/privileges'
import {
  DEFAULT_DATETIME_FORMAT_MONTH_TEXT,
  DEFAULT_DATE_FORMAT_MONTH_TEXT,
  formatDate,
} from 'utils'
import { Page } from 'layout/LayoutRoute'
import Backdrop from 'components/Backdrop'
import PageTitle, { PageBreadcrumbs } from 'components/PageTitle'
import { getDetailsById } from 'services/web-bff/booking'
import { BookingCarActivity, BookingPayment, BookingRental } from 'services/web-bff/booking.type'
import { useStyles, ChipServiceType, ChipPaymentType, DisabledField } from './styles'
import {
  convertToDuration,
  columnFormatBookingStatus,
  hasStatusAllowedToDoCarReplacement,
  formatIsExtend,
  getMaxEndDate,
  getBookingDetail,
  checkDateOverToday,
  getResellerServiceAreaId,
  getCarActivities,
  getCarDetails,
  permissionToReplacement,
  DefaultCarDetail,
  BookingDetailParams,
} from './utils'

export const formatCell = (value: string, classes: string, dateFormat?: string): JSX.Element => {
  if (dateFormat) {
    value = formatDate(value, DEFAULT_DATETIME_FORMAT_MONTH_TEXT)
    return (
      <div className={classes}>
        {value === 'Invalid Date' ? '-' : formatDate(value, DEFAULT_DATETIME_FORMAT_MONTH_TEXT)}
      </div>
    )
  }
  return <div className={classes}>{value}</div>
}

export default function SubscriptionDetail(): JSX.Element {
  const classes = useStyles()
  const { t } = useTranslation()
  const history = useHistory()
  const { state: routeState } = useLocation()
  const resellerCar = ls.get<string>('reseller_car') as string
  const resellerServiceAreaId = getResellerServiceAreaId(routeState as string, resellerCar)
  const { bookingId, bookingDetailId } = useParams<BookingDetailParams>()

  const breadcrumbs: PageBreadcrumbs[] = [
    {
      text: t('sidebar.bookingManagement.title'),
      link: '/',
    },
    {
      text: t('sidebar.bookingManagement.booking'),
      link: '/booking',
    },
    {
      text: t('sidebar.bookingManagement.detail'),
      link: `/booking/${bookingId}`,
    },
  ]

  const columnHead = [
    t('booking.carDetail.no'),
    t('booking.carDetail.location'),
    t('booking.carDetail.brand'),
    t('booking.carDetail.model'),
    t('booking.carDetail.color'),
    t('booking.carDetail.plateNumber'),
    t('booking.carDetail.pickupDate'),
    t('booking.carDetail.returnDate'),
    t('booking.carDetail.serviceType'),
    t('booking.carDetail.owner'),
    t('booking.carDetail.reseller'),
  ]

  const columnRow = [
    {
      field: 'no',
    },
    {
      field: 'location',
    },
    {
      field: 'brand',
    },
    {
      field: 'model',
    },
    {
      field: 'colour',
    },
    {
      field: 'plateNumber',
    },
    {
      field: 'pickupDate',
      render: (value: string) => {
        return formatCell(value, classes.paddingLeftCell, DEFAULT_DATETIME_FORMAT_MONTH_TEXT)
      },
    },
    {
      field: 'returnDate',
      render: (value: string) => {
        return formatCell(value, classes.paddingLeftCell, DEFAULT_DATETIME_FORMAT_MONTH_TEXT)
      },
    },
    {
      field: 'serviceType',
      render: (value: string) => {
        return (
          <ChipServiceType
            label={
              value === 'true'
                ? t('booking.carDetail.serviceTypes.selfPickUp')
                : t('booking.carDetail.serviceTypes.deliverByEVme')
            }
            color="primary"
          />
        )
      },
    },
    {
      field: 'owner',
    },
    {
      field: 'reseller',
    },
  ]

  const { data: bookingDetails, isFetching } = useQuery(
    'booking',
    () => getDetailsById(resellerServiceAreaId, bookingDetailId),
    {
      refetchOnWindowFocus: false,
    }
  )

  const maxEndDate = getMaxEndDate(bookingDetails)
  const [bookingDetail, setBookingDetail] = useState<BookingRental>({} as BookingRental)
  const [carActivities, setCarActivities] = useState<BookingCarActivity[]>([])
  const [carDetails, setCarDetails] = useState<DefaultCarDetail[]>([])

  useEffect(() => {
    async function getAllData() {
      const fetchedBookingDetail = await getBookingDetail(bookingDetails, bookingDetailId)
      setBookingDetail(fetchedBookingDetail)

      const fetchedCarActivities = await getCarActivities(fetchedBookingDetail)
      setCarActivities(fetchedCarActivities)

      const fetchedCarDetails = await getCarDetails(fetchedCarActivities, fetchedBookingDetail)
      if (fetchedCarDetails) {
        setCarDetails(fetchedCarDetails)
      }
    }

    getAllData()
  }, [bookingDetails, bookingDetailId, carActivities.length])

  const { getPrivileges, firebaseUser } = useAuth()
  const currentPrivilege = getPrivileges()
  const isAllowToDoCarReplacement = hasStatusAllowedToDoCarReplacement(bookingDetail?.displayStatus)
  const isTherePermissionToDoCarReplacement = hasAllowedPrivilege(currentPrivilege, [
    PRIVILEGES.PERM_BOOKING_RENTAL_EDIT,
  ])
  const isEndDateOverToday = checkDateOverToday(bookingDetail)

  return (
    <Page>
      <PageTitle title={t('sidebar.bookingManagement.detail')} breadcrumbs={breadcrumbs} />
      <Card className={classes.card}>
        <Grid className={classes.gridTitle}>
          <Typography variant="h6">
            <strong>{t('sidebar.bookingManagement.detail')}</strong>
          </Typography>
        </Grid>
        {/* Booking Detail ID and Status */}
        <Grid container spacing={3} className={classes.container}>
          <Grid item xs={12} sm={6}>
            <DisabledField
              type="text"
              id="booking_detail__bookingdetailid"
              label={t('booking.details.id')}
              fullWidth
              disabled
              variant="outlined"
              value={bookingDetail?.id || '-'}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DisabledField
              type="text"
              id="booking_detail__status"
              label={t('booking.details.status')}
              fullWidth
              disabled
              variant="outlined"
              value={columnFormatBookingStatus(bookingDetail?.displayStatus, t)}
            />
          </Grid>
        </Grid>
        {/* Price and Duration */}
        <Grid container spacing={3} className={classes.container}>
          <Grid item xs={12} sm={6}>
            <DisabledField
              type="text"
              id="booking_detail__price"
              label={t('booking.details.price')}
              fullWidth
              disabled
              variant="outlined"
              value={Number(bookingDetail?.rentDetail?.chargePrice).toLocaleString()}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DisabledField
              type="text"
              id="booking_detail__duration"
              label={t('booking.details.duration')}
              fullWidth
              disabled
              variant="outlined"
              value={convertToDuration(bookingDetail?.rentDetail?.durationDay, t)}
            />
          </Grid>
        </Grid>
        {/* Voucher ID and Voucher Code */}
        <Grid container spacing={3} className={classes.container}>
          <Grid item xs={12} sm={6}>
            <DisabledField
              type="text"
              id="booking_detail__voucherid"
              label={t('booking.details.voucherId')}
              fullWidth
              disabled
              variant="outlined"
              value={bookingDetail?.rentDetail?.voucherId || '-'}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DisabledField
              type="text"
              id="booking_detail__vouchercode"
              label={t('booking.details.voucherCode')}
              fullWidth
              disabled
              variant="outlined"
              value={bookingDetail?.rentDetail?.voucherCode || '-'}
            />
          </Grid>
        </Grid>
        {/* Start Date and End Date */}
        <Grid container spacing={3} className={classes.container}>
          <Grid item xs={12} sm={6}>
            <DisabledField
              type="text"
              id="booking_detail__startdate"
              label={t('booking.details.startDate')}
              fullWidth
              disabled
              variant="outlined"
              value={dayjs(bookingDetail?.startDate).format(DEFAULT_DATE_FORMAT_MONTH_TEXT)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DisabledField
              type="text"
              id="booking_detail__enddate"
              label={t('booking.details.endDate')}
              fullWidth
              disabled
              variant="outlined"
              value={dayjs(bookingDetail?.endDate).format(DEFAULT_DATE_FORMAT_MONTH_TEXT)}
            />
          </Grid>
        </Grid>
        {/* Created Date and Updated Date */}
        <Grid container spacing={3} className={classes.container}>
          <Grid item xs={12} sm={6}>
            <DisabledField
              type="text"
              id="booking_detail__createdate"
              label={t('booking.details.createDate')}
              fullWidth
              disabled
              variant="outlined"
              value={dayjs(bookingDetail?.createdDate).format(DEFAULT_DATETIME_FORMAT_MONTH_TEXT)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DisabledField
              type="text"
              id="booking_detail__updatedate"
              label={t('booking.details.updateDate')}
              fullWidth
              disabled
              variant="outlined"
              value={dayjs(bookingDetail?.updatedDate).format(DEFAULT_DATETIME_FORMAT_MONTH_TEXT)}
            />
          </Grid>
        </Grid>
        {/* Is Extend and Parent ID */}
        <Grid container spacing={3} className={classes.container}>
          <Grid item xs={12} sm={6}>
            <DisabledField
              type="text"
              id="booking_detail__isextend"
              label={t('booking.details.isExtend')}
              fullWidth
              disabled
              variant="outlined"
              value={formatIsExtend(bookingDetail?.isExtend)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DisabledField
              type="text"
              id="booking_detail__parentid"
              label={t('booking.details.parentId')}
              fullWidth
              disabled
              variant="outlined"
              value={bookingDetail?.bookingId || '-'}
            />
          </Grid>
        </Grid>
      </Card>

      <Card className={classes.subCard}>
        <Grid className={classes.gridSubTitle}>
          <Typography variant="h6">
            <strong>{t('booking.carDetail.title')}</strong>
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() =>
              history.push({
                pathname: `/booking/${bookingId}/${bookingDetailId}/car-replacement`,
                state: { bookingDetail, maxEndDate, editorEmail: firebaseUser?.email || '-' },
              })
            }
            disabled={permissionToReplacement(
              bookingDetail,
              isAllowToDoCarReplacement,
              isTherePermissionToDoCarReplacement,
              isEndDateOverToday
            )}
          >
            {t('booking.carDetail.replacement')}
          </Button>
        </Grid>
        <TableContainer className={classes.table}>
          <Table>
            <TableHead>
              <TableRow>
                {columnHead.map((headerLabel) => (
                  <TableCell key={headerLabel}>
                    <div className={classes.columnHeader}>{headerLabel}</div>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {carDetails?.map((car: DefaultCarDetail) => {
                return (
                  <TableRow
                    hover
                    key={`booking-${bookingId}-${bookingDetailId}_${car.carId}`}
                    onClick={() =>
                      history.push({
                        pathname: `/booking/${bookingId}/${bookingDetailId}/car/${car.carId}`,
                        state: {
                          carActivity: car,
                          isSelfPickUp: bookingDetail?.isSelfPickUp,
                          resellerServiceAreaId,
                        },
                      })
                    }
                  >
                    {columnRow.map((col) => (
                      <TableCell key={col.field}>
                        <div className={classes.paddingLeftCell}>
                          {col.render
                            ? col.render(car[col.field].toString())
                            : formatCell(car[col.field].toString(), classes.paddingLeftCell)}
                        </div>
                      </TableCell>
                    ))}
                  </TableRow>
                )
              }) || (
                <TableRow>
                  <TableCell colSpan={columnHead.length} align="center">
                    {t('booking.noData')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Card className={classes.subCard}>
        <Grid className={classes.gridSubTitle}>
          <Typography variant="h6">
            <strong>{t('booking.customer.title')}</strong>
          </Typography>
        </Grid>
        <TableContainer className={classes.table}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('booking.customer.customerId')}</TableCell>
                <TableCell>
                  <div className={classes.columnHeader}>{t('booking.customer.firstName')}</div>
                </TableCell>
                <TableCell>
                  <div className={classes.columnHeader}>{t('booking.customer.lastName')}</div>
                </TableCell>
                <TableCell>
                  <div className={classes.columnHeader}>{t('booking.customer.email')}</div>
                </TableCell>
                <TableCell>
                  <div className={classes.columnHeader}>{t('booking.customer.phone')}</div>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookingDetail?.customer ? (
                <TableRow>
                  <TableCell component="th" scope="row">
                    {bookingDetail.customer.id || '-'}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    <div className={classes.paddingLeftCell}>
                      {bookingDetail.customer.firstName || '-'}
                    </div>
                  </TableCell>
                  <TableCell component="th" scope="row">
                    <div className={classes.paddingLeftCell}>
                      {bookingDetail.customer.lastName || '-'}
                    </div>
                  </TableCell>
                  <TableCell component="th" scope="row">
                    <div className={classes.paddingLeftCell}>
                      {bookingDetail.customer.email || '-'}
                    </div>
                  </TableCell>
                  <TableCell component="th" scope="row">
                    <div className={classes.paddingLeftCell}>
                      {bookingDetail.customer.phoneNumber || '-'}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    {t('booking.noData')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Card className={classes.subCard}>
        <Grid className={classes.gridSubTitle}>
          <Typography variant="h6">
            <strong>{t('booking.payment.title')}</strong>
          </Typography>
        </Grid>
        <TableContainer className={classes.table}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('booking.payment.id')}</TableCell>
                <TableCell>
                  <div className={classes.columnHeader}>{t('booking.payment.amount')}</div>
                </TableCell>
                <TableCell>
                  <div className={classes.columnHeader}>{t('booking.payment.paymentType')}</div>
                </TableCell>
                <TableCell>
                  <div className={classes.columnHeader}>{t('booking.payment.purpose')}</div>
                </TableCell>
                <TableCell>
                  <div className={classes.columnHeader}>{t('booking.payment.status')}</div>
                </TableCell>
                <TableCell>
                  <div className={classes.columnHeader}>{t('booking.payment.statusMessage')}</div>
                </TableCell>
                <TableCell>
                  <div className={classes.columnHeader}>{t('booking.payment.updatedDate')}</div>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookingDetail?.payments && bookingDetail?.payments.length > 0 ? (
                bookingDetail?.payments.map((payment: BookingPayment) => (
                  <TableRow key={payment.id}>
                    <TableCell component="th" scope="row">
                      {payment.externalTransactionId || '-'}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <div className={classes.paddingLeftCell}>
                        {Number(payment.amount || 0).toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <div className={classes.paddingLeftCell}>{payment.type || '-'}</div>
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <div className={classes.paddingLeftCell}>{payment.description || '-'}</div>
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <div className={classes.paddingLeftCell}>
                        <ChipPaymentType label={payment.status} color="primary" />
                      </div>
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <div className={classes.paddingLeftCell}>{payment.statusMessage || '-'}</div>
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <div className={classes.paddingLeftCell}>
                        <div className={classes.wrapWidth}>
                          <div className={classes.rowOverflow}>
                            {formatDate(payment?.updatedDate, DEFAULT_DATETIME_FORMAT_MONTH_TEXT)}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    {t('booking.noData')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
      <Backdrop open={isFetching} />
    </Page>
  )
}
