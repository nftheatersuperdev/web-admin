import {
  Card,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import { useLocation, useParams } from 'react-router-dom'
import config from 'config'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'
import {
  DEFAULT_DATE_FORMAT_MONTH_TEXT,
  DEFAULT_DATETIME_FORMAT_MONTH_TEXT,
  DEFAULT_TIME_FORMAT,
} from 'utils'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@mui/styles'
import dayjs from 'dayjs'
import { Page } from 'layout/LayoutRoute'
import PageTitle, { PageBreadcrumbs } from 'components/PageTitle'

const Wrapper = styled(Card)`
  padding: 15px;
  margin-top: 20px;
`
const ContentSection = styled.div`
  margin-bottom: 20px;
`
interface BookingDetialCarParams {
  // eslint-disable-next-line
  carActivity: any
  isSelfPickUp: boolean
}

const useStyles = makeStyles(() => ({
  hideButton: {
    '& .MuiIconButton-root': { display: 'none' },
    backgroundColor: '#F5F5F5',
  },
  bgColour: {
    backgroundColor: '#F5F5F5',
  },
  table: {
    border: 0,
    marginBottom: '20px',
    marginTop: '20px',
  },
  marginBottomText: {
    marginBottom: '20px',
  },
  columnHeader: {
    borderLeft: '2px solid #E0E0E0',
    fontWeight: '500',
    paddingLeft: '16px',
  },
  rowOverflow: {
    paddingLeft: '16px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    '-webkit-line-clamp': 2,
    '-webkit-box-orient': 'vertical',
  },
}))
interface SubscriptionDetailParams {
  bookingId: string
  bookingDetailId: string
  carId: string
}
export default function BookingCarDetail(): JSX.Element {
  const location = useLocation()
  const classes = useStyles()

  const carDetail = location.state as BookingDetialCarParams
  const { t } = useTranslation()

  // Bangkok Center
  const defaultMapCenter = {
    lat: 13.736717,
    lng: 100.523186,
  }

  const containerStyle = {
    width: '100%',
    height: '240px',
  }
  const deliveryMapAddress = {
    lat: carDetail.carActivity?.deliveryTask?.latitude || defaultMapCenter.lat,
    lng: carDetail.carActivity?.deliveryTask?.longitude || defaultMapCenter.lng,
  }
  const returnMapAddress = {
    lat: carDetail.carActivity?.returnTask?.latitude || defaultMapCenter.lat,
    lng: carDetail.carActivity?.returnTask?.longitude || defaultMapCenter.lng,
  }
  const { bookingId, bookingDetailId, carId } = useParams<SubscriptionDetailParams>()
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
      link: `/booking/${bookingId}/${bookingDetailId}`,
    },
    {
      text: t('sidebar.bookingManagement.carDetail'),
      link: `/booking/${bookingId}/${bookingDetailId}/car/${carId}`,
    },
  ]

  function addTwoHours(timeStr: string) {
    const time = new Date(`2000-01-01T${timeStr}:00`)
    time.setHours(time.getHours() + 2)
    const updatedTimeStr = time.toTimeString().slice(0, 5)

    return updatedTimeStr
  }
  return (
    <Page>
      <PageTitle title={t('sidebar.bookingManagement.carDetail')} breadcrumbs={breadcrumbs} />
      <Wrapper>
        <ContentSection>
          <Typography variant="h6" component="h2" className={classes.marginBottomText}>
            {t('sidebar.bookingManagement.carDetail')}
          </Typography>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                className={classes.bgColour}
                id="booking_car_delivery_detail__serviceType"
                label={t('booking.carDetail.serviceType')}
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
                  carDetail.isSelfPickUp
                    ? t('booking.carDetail.serviceTypes.selfPickUp')
                    : t('booking.carDetail.serviceTypes.deliverByEVme')
                }
              />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={3}>
              <TextField
                className={classes.bgColour}
                id="booking_car_delivery_detail__pickupDate"
                label={t('booking.carDetail.pickupDate')}
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                value={dayjs(carDetail.carActivity?.deliveryTask.date).format(
                  DEFAULT_DATE_FORMAT_MONTH_TEXT
                )}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                className={classes.bgColour}
                id="booking_car_delivery_detail__pickupTime"
                label={t('booking.carDetail.pickupTime')}
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
                  dayjs(carDetail.carActivity?.deliveryTask.date).format(DEFAULT_TIME_FORMAT) +
                  ' - ' +
                  addTwoHours(
                    dayjs(carDetail.carActivity?.deliveryTask.date).format(DEFAULT_TIME_FORMAT)
                  )
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                className={classes.bgColour}
                id="booking_car_delivery_detail__returnDate"
                label={t('booking.carDetail.returnDate')}
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                value={dayjs(carDetail.carActivity?.returnTask.date).format(
                  DEFAULT_DATETIME_FORMAT_MONTH_TEXT
                )}
              />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                className={classes.bgColour}
                id="booking_car_delivery_detail__pickupAddress"
                label={t('booking.carDetail.pickupAddress')}
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                multiline
                rows={2}
                value={carDetail.carActivity?.deliveryTask.fullAddress || 'No Data'}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                className={classes.bgColour}
                id="booking_car_delivery_detail__ReturnAddress"
                label={t('booking.carDetail.ReturnAddress')}
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                multiline
                rows={2}
                value={carDetail.carActivity?.returnTask.fullAddress || 'No Data'}
              />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                className={classes.bgColour}
                id="booking_car_delivery_detail__pickupAddressRemark"
                label={t('booking.carDetail.pickupAddressRemark')}
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                value={carDetail.carActivity?.deliveryTask.remark || 'No Data'}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                className={classes.bgColour}
                id="booking_car_delivery_detail__ReturnAddressRemark"
                label={t('booking.carDetail.ReturnAddressRemark')}
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                value={carDetail.carActivity?.returnTask.remark || 'No Data'}
              />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                disabled
                id="booking_car_delivery_detail__remark"
                label={t('booking.carDetail.remark')}
                fullWidth
                margin="normal"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                className={classes.bgColour}
                id="booking_car_delivery_detail__createDate"
                label={t('booking.carDetail.createDate')}
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                value={dayjs(carDetail.carActivity?.deliveryTask.createdDate).format(
                  DEFAULT_DATETIME_FORMAT_MONTH_TEXT
                )}
              />
            </Grid>
          </Grid>
        </ContentSection>
        <ContentSection>
          <Typography variant="h6" component="h2">
            {t('booking.carDetail.titleCar')}
          </Typography>
          <TableContainer className={classes.table}>
            <Table>
              <TableHead>
                <TableRow>
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
                    <div className={classes.columnHeader}>{t('booking.carDetail.owner')}</div>
                  </TableCell>
                  <TableCell>
                    <div className={classes.columnHeader}>{t('booking.carDetail.reseller')}</div>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <div className={classes.rowOverflow}>
                      {carDetail.carActivity.carDetail.location || '-'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className={classes.rowOverflow}>
                      {carDetail.carActivity.carDetail.carSku.carModel.brand.name || '-'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className={classes.rowOverflow}>
                      {carDetail.carActivity.carDetail.carSku.carModel.name || '-'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className={classes.rowOverflow}>
                      {carDetail.carActivity.carDetail.carSku.color || '-'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className={classes.rowOverflow}>
                      {carDetail.carActivity.carDetail.plateNumber || '-'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className={classes.rowOverflow}>
                      {dayjs(carDetail.carActivity?.deliveryTask.date).format(
                        DEFAULT_DATETIME_FORMAT_MONTH_TEXT
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className={classes.rowOverflow}>
                      {carDetail.carActivity.carDetail.owner || '-'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className={classes.rowOverflow}>
                      {carDetail.carActivity.carDetail.reSeller || '-'}
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          {/* Delivery Address Map */}
          <Grid container spacing={3} className={classes.marginBottomText}>
            <Grid item xs={12}>
              <Typography variant="h6" component="h3" className={classes.marginBottomText}>
                {t('subscription.startAddress')}
              </Typography>
              <LoadScript googleMapsApiKey={config.googleMapsApiKey}>
                <GoogleMap mapContainerStyle={containerStyle} center={deliveryMapAddress} zoom={16}>
                  <Marker position={deliveryMapAddress} />
                </GoogleMap>
              </LoadScript>
            </Grid>
          </Grid>

          {/* Return Address Map */}
          <Grid container spacing={3} className={classes.marginBottomText}>
            <Grid item xs={12}>
              <Typography variant="h6" component="h3" className={classes.marginBottomText}>
                {t('subscription.endAddress')}
              </Typography>
              <LoadScript googleMapsApiKey={config.googleMapsApiKey}>
                <GoogleMap mapContainerStyle={containerStyle} center={returnMapAddress} zoom={16}>
                  <Marker position={returnMapAddress} />
                </GoogleMap>
              </LoadScript>
            </Grid>
          </Grid>
        </ContentSection>
      </Wrapper>
    </Page>
  )
}
