import { useState } from 'react'
import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'
import dayjs from 'dayjs'
import styled from 'styled-components'
import {
  Box,
  Button,
  Card,
  Grid,
  Paper,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core'
import { useTranslation } from 'react-i18next'
import { useAuth } from 'auth/AuthContext'
import { ROLES, hasAllowedRole } from 'auth/roles'
import { DEFAULT_DATETIME_FORMAT, DEFAULT_DATE_FORMAT } from 'utils'
import { ROUTE_PATHS } from 'routes'
import {
  convertToDuration,
  columnFormatSubEventStatus,
  SubEventStatus,
} from 'pages/Subscriptions/utils'
import { Page } from 'layout/LayoutRoute'
import Backdrop from 'components/Backdrop'
import PageTitle, { PageBreadcrumbs } from 'components/PageTitle'
import { getDetailById } from 'services/web-bff/subscription'
import { BookingCarActivity } from 'services/web-bff/subscription.type'
import CarDetailDialog from './CarDetailDialog'
import CarReplacementDialog from './CarReplacementDialog'

interface SubscriptionDetailParams {
  id: string
}

const Wrapper = styled(Card)`
  padding: 15px;
  margin-top: 20px;
`
const ContentSection = styled.div`
  margin-bottom: 20px;
`
const TableWrapper = styled.div`
  margin: 10px 0;
`

export function hasStatusAllowedToDoCarReplacement(status: string | undefined): boolean {
  if (!status) {
    return false
  }
  return [SubEventStatus.ACCEPTED, SubEventStatus.DELIVERED].includes(status.toLowerCase())
}

export default function SubscriptionDetail(): JSX.Element {
  const { getRole, firebaseUser } = useAuth()
  const currentRole = getRole()
  const { t } = useTranslation()

  const { id: bookingDetailId } = useParams<SubscriptionDetailParams>()

  const breadcrumbs: PageBreadcrumbs[] = [
    {
      text: t('sidebar.dashboard'),
      link: ROUTE_PATHS.ROOT,
    },
    {
      text: t('sidebar.subscriptions'),
      link: ROUTE_PATHS.SUBSCRIPTION,
    },
    {
      text: t('sidebar.subscriptionDetail'),
      link: ROUTE_PATHS.SUBSCRIPTION_DETAIL.replace(':id', bookingDetailId),
    },
  ]

  const {
    data: bookingDetails,
    isFetching,
    refetch: refetchBooking,
  } = useQuery('subscription-detail', () => getDetailById(bookingDetailId), {
    refetchOnWindowFocus: false,
  })
  const carActivities = bookingDetails?.carActivities.reverse() || []

  const [carDetail, setCarDetail] = useState<BookingCarActivity | undefined>(undefined)
  const [carDetailDialogOpen, setCarDetailDialogOpen] = useState<boolean>(false)
  const [carReplacementDialogOpen, setCarReplacementlogOpen] = useState<boolean>(false)

  const handleClickToOpenDetailDialog = (carActivity: BookingCarActivity) => {
    setCarDetail(carActivity)
    setCarDetailDialogOpen(true)
  }

  const isAllowToDoCarReplacement = hasStatusAllowedToDoCarReplacement(
    bookingDetails?.displayStatus
  )
  const isTherePermissionToDoCarReplacement = hasAllowedRole(currentRole, [ROLES.OPERATION])
  const isEndDateOverToday = bookingDetails ? new Date(bookingDetails?.endDate) < new Date() : false

  return (
    <Page>
      <PageTitle title={t('sidebar.subscriptionDetail')} breadcrumbs={breadcrumbs} />
      <Wrapper>
        <ContentSection>
          <Typography variant="h5" component="h2">
            {t('sidebar.bookingDetail')}
          </Typography>

          {/* First Name and Last Name */}
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <TextField
                id="subscription_detail__firstName"
                label={t('subscription.firstName')}
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                value={bookingDetails?.customer.firstName || '-'}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                id="subscription_detail__lastName"
                label={t('subscription.lastName')}
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                value={bookingDetails?.customer.lastName || '-'}
              />
            </Grid>
          </Grid>

          {/* Email and Phone number */}
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <TextField
                id="subscription_detail__email"
                label={t('subscription.email')}
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                value={bookingDetails?.customer.email || '-'}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                id="subscription_detail__phoneNumber"
                label={t('subscription.phone')}
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                value={bookingDetails?.customer.phoneNumber || '-'}
              />
            </Grid>
          </Grid>

          {/* Price and Duration */}
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <TextField
                id="subscription_detail__price"
                label={t('subscription.price')}
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                value={Number(bookingDetails?.rentDetail.chargePrice || 0).toLocaleString()}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                id="subscription_detail__duration"
                label={t('subscription.duration')}
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                value={convertToDuration(bookingDetails?.rentDetail.durationDay || 0, t)}
              />
            </Grid>
          </Grid>

          {/* Status and Subscription ID */}
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <TextField
                id="subscription_detail__status"
                label={t('subscription.status.title')}
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                value={
                  bookingDetails?.displayStatus
                    ? columnFormatSubEventStatus(bookingDetails?.displayStatus, t)
                    : t('booking.statuses.unknown')
                }
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                id="subscription_detail__id"
                label={t('subscription.id')}
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                value={bookingDetailId}
              />
            </Grid>
          </Grid>

          {/* Created Date and Updated Date */}
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <TextField
                id="subscription_detail__createdDate"
                label={t('subscription.createdDate')}
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                value={dayjs(bookingDetails?.rentDetail.createdDate).format(
                  DEFAULT_DATETIME_FORMAT
                )}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                id="subscription_detail__updatedDate"
                label={t('subscription.updatedDate')}
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                value={dayjs(bookingDetails?.rentDetail.updatedDate).format(
                  DEFAULT_DATETIME_FORMAT
                )}
              />
            </Grid>
          </Grid>

          {/* Start Date and End Date */}
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <TextField
                id="subscription_detail__startDate"
                label={t('subscription.startDate')}
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                value={dayjs(bookingDetails?.startDate).format(DEFAULT_DATE_FORMAT)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                id="subscription_detail__endDate"
                label={t('subscription.endDate')}
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                value={dayjs(bookingDetails?.endDate).format(DEFAULT_DATE_FORMAT)}
              />
            </Grid>
          </Grid>

          {/* Voucher */}
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <TextField
                id="subscription_detail__voucher"
                label={t('subscription.voucherCode')}
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                value={bookingDetails?.rentDetail.voucherCode || t('subscription.noData')}
              />
            </Grid>
          </Grid>
        </ContentSection>

        <ContentSection>
          <Typography variant="h5" component="h2">
            {t('subscription.paymentHistory.title')}
          </Typography>
          <TableWrapper>
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>{t('subscription.paymentHistory.id')}</TableCell>
                    <TableCell>{t('subscription.paymentHistory.amount')}</TableCell>
                    <TableCell>{t('subscription.paymentHistory.updatedDate')}</TableCell>
                    <TableCell>{t('subscription.paymentHistory.type')}</TableCell>
                    <TableCell>{t('subscription.paymentHistory.purpose')}</TableCell>
                    <TableCell>{t('subscription.paymentHistory.status')}</TableCell>
                    <TableCell>{t('subscription.paymentHistory.statusMessage')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bookingDetails?.payments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell component="th" scope="row">
                        {payment.externalTransactionId || '-'}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {Number(payment.amount || 0).toLocaleString()}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {dayjs(payment?.updatedDate).format(DEFAULT_DATETIME_FORMAT) || '-'}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {payment.type || '-'}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {payment.description || '-'}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {payment.status || '-'}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {payment.statusMessage || '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TableWrapper>
        </ContentSection>

        <ContentSection>
          <Grid container>
            <Grid item xs={6}>
              <Typography variant="h5" component="h2">
                {t('subscription.carDetails')}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Box display="flex" justifyContent="flex-end">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setCarReplacementlogOpen(true)}
                  disabled={
                    !bookingDetails ||
                    !isAllowToDoCarReplacement ||
                    !isTherePermissionToDoCarReplacement ||
                    isEndDateOverToday
                  }
                >
                  {t('booking.carDetail.replacement')}
                </Button>
              </Box>
            </Grid>
          </Grid>
          <TableWrapper>
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>{t('booking.carDetail.no')}</TableCell>
                    <TableCell>{t('booking.carDetail.brand')}</TableCell>
                    <TableCell>{t('booking.carDetail.model')}</TableCell>
                    <TableCell>{t('booking.carDetail.plateNumber')}</TableCell>
                    <TableCell>{t('booking.carDetail.vin')}</TableCell>
                    <TableCell>{t('booking.carDetail.deliveryDate')}</TableCell>
                    <TableCell>{t('booking.carDetail.returnDate')}</TableCell>
                    <TableCell>{t('booking.carDetail.remark')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {carActivities.map((carActivity, index) => (
                    <TableRow
                      key={carActivity.carId}
                      onClick={() => handleClickToOpenDetailDialog(carActivity)}
                    >
                      <TableCell component="th" scope="row">
                        {index + 1 || '-'}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {carActivity.carDetail.carSku.carModel.brand.name || '-'}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {carActivity.carDetail.carSku.carModel.name || '-'}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {carActivity.carDetail.plateNumber || '-'}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {carActivity.carDetail.vin || '-'}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {carActivity.deliveryTask?.date
                          ? dayjs(carActivity.deliveryTask?.date).format(DEFAULT_DATETIME_FORMAT)
                          : '-'}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        {carActivity.returnTask?.date
                          ? dayjs(carActivity.returnTask?.date).format(DEFAULT_DATETIME_FORMAT)
                          : '-'}
                      </TableCell>
                      <TableCell component="th" scope="row">
                        -
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TableWrapper>
        </ContentSection>
      </Wrapper>

      <CarDetailDialog
        open={carDetailDialogOpen}
        car={carDetail}
        onClose={() => {
          setCarDetail(undefined)
          setCarDetailDialogOpen(false)
        }}
      />
      <CarReplacementDialog
        editorEmail={firebaseUser?.email || '-'}
        open={carReplacementDialogOpen}
        bookingDetails={bookingDetails}
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
