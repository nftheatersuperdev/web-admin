/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { useQuery } from 'react-query'
import { useParams, useHistory } from 'react-router-dom'
import dayjs from 'dayjs'
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
import { ROLES, hasAllowedRole } from 'auth/roles'
import { DEFAULT_DATETIME_FORMAT_MONTH_TEXT, formatDate } from 'utils'
import {
  convertToDuration,
  columnFormatSubEventStatus,
  SubEventStatus,
} from 'pages/Subscriptions/utils'
import { Page } from 'layout/LayoutRoute'
import Backdrop from 'components/Backdrop'
import PageTitle, { PageBreadcrumbs } from 'components/PageTitle'
import { getDetailsById } from 'services/web-bff/booking'
import { BookingCarActivity } from 'services/web-bff/booking.type'
import CarDetailDialog from './CarDetailDialog'
import CarReplacementDialog from './CarReplacementDialog'
import { useStyles, ChipServiceType, ChipPaymentType, DisabledField } from './styles'

interface SubscriptionDetailParams {
  bookingId: string
  bookingDetailId: string
}

export function hasStatusAllowedToDoCarReplacement(status: string | undefined): boolean {
  if (!status) {
    return false
  }
  return [SubEventStatus.ACCEPTED, SubEventStatus.DELIVERED].includes(status.toLowerCase())
}

export default function SubscriptionDetail(): JSX.Element {
  const classes = useStyles()
  const { getRole, firebaseUser } = useAuth()
  const currentRole = getRole()
  const { t } = useTranslation()
  const history = useHistory()

  const { bookingId, bookingDetailId } = useParams<SubscriptionDetailParams>()

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

  const {
    data: bookingDetails,
    isFetching,
    refetch: refetchBooking,
  } = useQuery('booking', () => getDetailsById(bookingId), {
    refetchOnWindowFocus: false,
  })

  const bookingDetail =
    bookingDetails && bookingDetails?.length > 0
      ? bookingDetails.find((booking) => booking.id === bookingDetailId)
      : {
          carActivities: [],
          displayStatus: '',
          startDate: '',
          endDate: '',
          customer: {
            firstName: '',
            lastName: '',
            email: '',
            phoneNumber: '',
          },
          rentDetail: {
            chargePrice: 0,
            durationDay: 0,
            createdDate: '',
            updatedDate: '',
            voucherCode: '',
          },
          payments: [
            {
              id: '',
              externalTransactionId: '',
              amount: 0,
              updatedDate: '',
              type: '',
              description: '',
              status: '',
              statusMessage: '',
            },
          ],
        }

  let maxEndDate = new Date()
  if (bookingDetails && bookingDetails.length > 0) {
    maxEndDate = new Date(
      Math.max(...bookingDetails.map((bookingDetail) => new Date(bookingDetail.endDate)))
    )
  }
  const carActivities = bookingDetail?.carActivities.reverse() || []

  const [carDetail, setCarDetail] = useState<BookingCarActivity | undefined>(undefined)
  const [carDetailDialogOpen, setCarDetailDialogOpen] = useState<boolean>(false)
  const [carReplacementDialogOpen, setCarReplacementlogOpen] = useState<boolean>(false)

  const isAllowToDoCarReplacement = hasStatusAllowedToDoCarReplacement(bookingDetail?.displayStatus)
  const isTherePermissionToDoCarReplacement = hasAllowedRole(currentRole, [ROLES.OPERATION])
  const isEndDateOverToday = bookingDetail ? new Date(bookingDetail?.endDate) < new Date() : false

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
              value={bookingDetail.id || '-'}
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
              value={
                bookingDetail?.displayStatus
                  ? columnFormatSubEventStatus(bookingDetail?.displayStatus, t)
                  : t('booking.statuses.unknown')
              }
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
              value={Number(bookingDetail.rentDetail.chargePrice || 0).toLocaleString()}
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
              value={convertToDuration(bookingDetail?.rentDetail.durationDay || 0, t)}
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
              value={bookingDetail?.rentDetail.voucherId || t('subscription.noData')}
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
              value={bookingDetail?.rentDetail.voucherCode || t('subscription.noData')}
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
              value={dayjs(bookingDetail?.startDate).format(DEFAULT_DATETIME_FORMAT_MONTH_TEXT)}
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
              value={dayjs(bookingDetail?.endDate).format(DEFAULT_DATETIME_FORMAT_MONTH_TEXT)}
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
              value={dayjs(bookingDetail?.rentDetail.createdDate).format(
                DEFAULT_DATETIME_FORMAT_MONTH_TEXT
              )}
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
              value={dayjs(bookingDetail?.rentDetail.updatedDate).format(
                DEFAULT_DATETIME_FORMAT_MONTH_TEXT
              )}
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
              value={bookingDetail.isExtend ? 'Yes' : 'No'}
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
              value={bookingDetail.bookingId || '-'}
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
            onClick={() => setCarReplacementlogOpen(true)}
            disabled={
              !bookingDetail ||
              !isAllowToDoCarReplacement ||
              !isTherePermissionToDoCarReplacement ||
              isEndDateOverToday
            }
          >
            {t('booking.carDetail.replacement')}
          </Button>
        </Grid>
        <TableContainer className={classes.table}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('booking.carDetail.no')}</TableCell>
                <TableCell>
                  <div className={classes.columnHeader}>{t('booking.carDetail.location')}</div>
                </TableCell>
                <TableCell>
                  <div className={classes.columnHeader}>{t('booking.carDetail.brand')}</div>
                </TableCell>
                <TableCell>
                  <div className={classes.columnHeader}>{t('booking.carDetail.model')}</div>
                </TableCell>
                <TableCell>
                  <div className={classes.columnHeader}>{t('booking.carDetail.color')}</div>
                </TableCell>
                <TableCell>
                  <div className={classes.columnHeader}>{t('booking.carDetail.plateNumber')}</div>
                </TableCell>
                <TableCell>
                  <div className={classes.columnHeader}>{t('booking.carDetail.pickupDate')}</div>
                </TableCell>
                <TableCell>
                  <div className={classes.columnHeader}>{t('booking.carDetail.returnDate')}</div>
                </TableCell>
                <TableCell>
                  <div className={classes.columnHeader}>{t('booking.carDetail.serviceType')}</div>
                </TableCell>
                <TableCell>
                  <div className={classes.columnHeader}>{t('booking.carDetail.owner')}</div>
                </TableCell>
                <TableCell>
                  <div className={classes.columnHeader}>{t('booking.carDetail.reseller')}</div>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {carActivities.length > 0 ? (
                carActivities.map((carActivity, index) => (
                  <TableRow
                    key={carActivity.carId}
                    onClick={() =>
                      history.push({
                        pathname: `/booking/${bookingId}/${bookingDetailId}/car/${carActivity.carId}`,
                        state: { carActivity, isSelfPickUp: bookingDetail.isSelfPickUp },
                      })
                    }
                  >
                    <TableCell component="th" scope="row">
                      {index + 1 || '-'}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <div className={classes.paddingLeftCell}>
                        {carActivity.carDetail.resellerServiceArea.areaNameEn || '-'}
                      </div>
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <div className={classes.paddingLeftCell}>
                        {carActivity.carDetail.carSku.carModel.brand.name || '-'}
                      </div>
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <div className={classes.paddingLeftCell}>
                        {carActivity.carDetail.carSku.carModel.name || '-'}
                      </div>
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <div className={classes.paddingLeftCell}>
                        {carActivity.carDetail.plateNumber || '-'}
                      </div>
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <div className={classes.paddingLeftCell}>
                        {carActivity.carDetail.vin || '-'}
                      </div>
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <div className={classes.paddingLeftCell}>
                        <div className={classes.wrapWidth}>
                          <div className={classes.rowOverflow}>
                            {carActivity.deliveryTask?.date
                              ? dayjs(carActivity.deliveryTask?.date).format(
                                  DEFAULT_DATETIME_FORMAT_MONTH_TEXT
                                )
                              : '-'}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <div className={classes.paddingLeftCell}>
                        <div className={classes.wrapWidth}>
                          <div className={classes.rowOverflow}>
                            {carActivity.returnTask?.date
                              ? dayjs(carActivity.returnTask?.date).format(
                                  DEFAULT_DATETIME_FORMAT_MONTH_TEXT
                                )
                              : '-'}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <div className={classes.paddingLeftCell}>
                        <ChipServiceType
                          label={
                            bookingDetail.isSelfPickUp
                              ? t('booking.carDetail.serviceTypes.selfPickUp')
                              : t('booking.carDetail.serviceTypes.deliverByEVme')
                          }
                          color="primary"
                        />
                      </div>
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <div className={classes.paddingLeftCell}>
                        {carActivity.carDetail.owner || '-'}
                      </div>
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <div className={classes.paddingLeftCell}>
                        {carActivity.carDetail.reSeller || '-'}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan="11" align="center">
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
              {bookingDetail.customer ? (
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
                      {bookingDetail.customer.phone || '-'}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                <TableRow>
                  <TableCell colSpan="5" align="center">
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
              {bookingDetail?.payments.length > 0 ? (
                bookingDetail?.payments.map((payment: any) => (
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
                  <TableCell colSpan="7" align="center">
                    {t('booking.noData')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <CarDetailDialog
        open={carDetailDialogOpen}
        car={carDetail}
        isSelfPickUp={bookingDetail.isSelfPickUp}
        onClose={() => {
          setCarDetail(undefined)
          setCarDetailDialogOpen(false)
        }}
      />
      <CarReplacementDialog
        editorEmail={firebaseUser?.email || '-'}
        open={carReplacementDialogOpen}
        bookingDetail={bookingDetail}
        maxEndDate={maxEndDate}
        onClose={(needRefetch) => {
          if (needRefetch) {
            refetchBooking()
          }
          setCarReplacementlogOpen(false)
        }}
      />
      <Backdrop open={isFetching} />
    </Page>
  )
}
