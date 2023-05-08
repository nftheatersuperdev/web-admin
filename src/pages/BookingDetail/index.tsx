/* eslint-disable react/jsx-props-no-spreading */
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import {
  Card,
  Grid,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  CircularProgress,
} from '@mui/material'
import { getDetailsById } from 'services/web-bff/booking'
import { Page } from 'layout/LayoutRoute'
import PageTitle, { PageBreadcrumbs } from 'components/PageTitle'
import { BookingDetailParams, initialBookingDetail } from './utils'
import { useStyles, DisabledField } from './styles'

export default function CarDetail(): JSX.Element {
  const classes = useStyles()
  const { t } = useTranslation()
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
  const {
    data: bookingDetails,
    isFetching,
    refetch: refetchBooking,
  } = useQuery('booking', () => getDetailsById(bookingId), {
    refetchOnWindowFocus: false,
  })
  console.log(bookingId, bookingDetailId, bookingDetails, refetchBooking)
  const bookingDetail =
    bookingDetails && bookingDetails?.length > 0
      ? bookingDetails.find((booking) => booking.id === bookingDetailId)
      : initialBookingDetail
  console.log(bookingDetail)
  //   const history = useHistory()
  //   const handleCancelClick = () => {
  //     history.goBack()
  //   }

  const getNestedValue = (obj: any, path: string) => {
    return path.split('.').reduce((acc, key) => acc?.[key] ?? null, obj)
  }

  const carDetailHead = [
    {
      colName: t('booking.carDetail.no'),
      hidden: false,
    },
    {
      colName: t('booking.carDetail.location'),
      hidden: false,
    },
    {
      colName: t('booking.carDetail.brand'),
      hidden: false,
    },
    {
      colName: t('booking.carDetail.model'),
      hidden: false,
    },
    {
      colName: t('booking.carDetail.color'),
      hidden: false,
    },
    {
      colName: t('booking.carDetail.plateNumber'),
      hidden: false,
    },
    {
      colName: t('booking.carDetail.pickupDate'),
      hidden: false,
    },
    {
      colName: t('booking.carDetail.returnDate'),
      hidden: false,
    },
    {
      colName: t('booking.carDetail.service'),
      hidden: false,
    },
    {
      colName: t('booking.carDetail.owner'),
      hidden: false,
    },
    {
      colName: t('booking.carDetail.reseller'),
      hidden: false,
    },
  ]
  const carDetailRow = [
    {
      field: 'no',
      hidden: false,
      render: (value: string) => {
        return <div>{value}</div>
      },
    },
    { field: 'resellerServiceArea.areaNameEn', hidden: false },
    { field: 'carSku.carModel.brand.name', hidden: false },
    { field: 'carSku.carModel.name', hidden: false },
    { field: 'carSku.color', hidden: false },
    { field: 'carDetail.plateNumber', hidden: false },
    { field: 'carActivities.deliveryTask.date', hidden: false },
    { field: 'carActivities.returnTask.date', hidden: false },
    { field: 'carActivities.returnTask.date', hidden: false },
  ]
  const carDetailData = bookingDetail?.carActivities ? (
    <TableRow>
      {carDetailRow.map((col, i) =>
        col.field === 'no' ? (
          <TableCell key={col.field} hidden={col.hidden}>
            <div className={classes.paddingLeftCell}>{i + 1}</div>
          </TableCell>
        ) : (
          <TableCell key={col.field} hidden={col.hidden}>
            <div className={classes.paddingLeftCell}>
              {col.render ? (
                col.render(getNestedValue(bookingDetail?.car, col.field))
              ) : (
                <div>{getNestedValue(bookingDetail?.car, col.field)}</div>
              )}
            </div>
          </TableCell>
        )
      )}
    </TableRow>
  ) : (
    <TableRow>
      <TableCell colSpan={carDetailHead.length} align="center">
        {t('booking.noData')}
      </TableCell>
    </TableRow>
  )

  const customerHead = [
    {
      colName: t('booking.customer.customerId'),
      hidden: false,
    },
    {
      colName: t('booking.customer.firstName'),
      hidden: false,
    },
    {
      colName: t('booking.customer.lastName'),
      hidden: false,
    },
    {
      colName: t('booking.customer.email'),
      hidden: false,
    },
    {
      colName: t('booking.customer.phone'),
      hidden: false,
    },
  ]
  const customerData = (
    <TableRow>
      <TableCell colSpan={customerHead.length} align="center">
        {t('booking.noData')}
      </TableCell>
    </TableRow>
  )

  const paymentHead = [
    {
      colName: t('booking.payment.id'),
      hidden: false,
    },
    {
      colName: t('booking.payment.amount'),
      hidden: false,
    },
    {
      colName: t('booking.payment.paymentType'),
      hidden: false,
    },
    {
      colName: t('booking.payment.purpose'),
      hidden: false,
    },
    {
      colName: t('booking.payment.status'),
      hidden: false,
    },
    {
      colName: t('booking.payment.statusMessage'),
      hidden: false,
    },
    {
      colName: t('booking.payment.updatedDate'),
      hidden: false,
    },
  ]
  const paymentData = (
    <TableRow>
      <TableCell colSpan={paymentHead.length} align="center">
        {t('booking.noData')}
      </TableCell>
    </TableRow>
  )

  return (
    <Page>
      <PageTitle title={t('sidebar.bookingManagement.detail')} breadcrumbs={breadcrumbs} />
      <Card className={classes.card}>
        <Grid className={classes.gridTitle}>
          <Typography variant="h6">
            <strong>{t('sidebar.bookingManagement.detail')}</strong>
          </Typography>
        </Grid>

        <Grid container spacing={3} className={classes.container}>
          <Grid item xs={12} sm={6}>
            <DisabledField
              type="text"
              id="booking_detail__bookingdetailid"
              label={t('booking.details.id')}
              fullWidth
              disabled
              variant="outlined"
              value="replace here"
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
              value="replace here"
            />
          </Grid>
        </Grid>

        <Grid container spacing={3} className={classes.container}>
          <Grid item xs={12} sm={6}>
            <DisabledField
              type="text"
              id="booking_detail__price"
              label={t('booking.details.price')}
              fullWidth
              disabled
              variant="outlined"
              value="replace here"
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
              value="replace here"
            />
          </Grid>
        </Grid>

        <Grid container spacing={3} className={classes.container}>
          <Grid item xs={12} sm={6}>
            <DisabledField
              type="text"
              id="booking_detail__voucherid"
              label={t('booking.details.voucherId')}
              fullWidth
              disabled
              variant="outlined"
              value="replace here"
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
              value="replace here"
            />
          </Grid>
        </Grid>

        <Grid container spacing={3} className={classes.container}>
          <Grid item xs={12} sm={6}>
            <DisabledField
              type="text"
              id="booking_detail__startdate"
              label={t('booking.details.startDate')}
              fullWidth
              disabled
              variant="outlined"
              value="replace here"
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
              value="replace here"
            />
          </Grid>
        </Grid>

        <Grid container spacing={3} className={classes.container}>
          <Grid item xs={12} sm={6}>
            <DisabledField
              type="text"
              id="booking_detail__createdate"
              label={t('booking.details.createDate')}
              fullWidth
              disabled
              variant="outlined"
              value="replace here"
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
            />
          </Grid>
        </Grid>

        <Grid container spacing={3} className={classes.container}>
          <Grid item xs={12} sm={6}>
            <DisabledField
              type="text"
              id="booking_detail__isextend"
              label={t('booking.details.isExtend')}
              fullWidth
              disabled
              variant="outlined"
              value="replace here"
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
              value="replace here"
            />
          </Grid>
        </Grid>
      </Card>

      <Card className={classes.subCard}>
        <Grid className={classes.gridSubTitle}>
          <Typography variant="h6">
            <strong>{t('booking.carDetail.title')}</strong>
          </Typography>
          <Button variant="contained" color="primary">
            {t('booking.carDetail.replacement')}
          </Button>
        </Grid>
        <TableContainer className={classes.table}>
          <Table>
            <TableHead>
              <TableRow>
                {carDetailHead.map((col) => (
                  <TableCell key={col.colName} hidden={col.hidden}>
                    <div className={classes.columnHeader}>{col.colName}</div>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            {isFetching ? (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={carDetailHead.length} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              </TableBody>
            ) : (
              <TableBody>{carDetailData}</TableBody>
            )}
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
                {customerHead.map((col) => (
                  <TableCell key={col.colName} hidden={col.hidden}>
                    <div className={classes.columnHeader}>{col.colName}</div>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            {isFetching ? (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={customerHead.length} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              </TableBody>
            ) : (
              <TableBody>{customerData}</TableBody>
            )}
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
                {paymentHead.map((col) => (
                  <TableCell key={col.colName} hidden={col.hidden}>
                    <div className={classes.columnHeader}>{col.colName}</div>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            {isFetching ? (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={paymentHead.length} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              </TableBody>
            ) : (
              <TableBody>{paymentData}</TableBody>
            )}
          </Table>
        </TableContainer>
      </Card>
    </Page>
  )
}
