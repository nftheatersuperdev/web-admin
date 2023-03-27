/* eslint-disable react/jsx-no-useless-fragment */
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Grid,
  TextField,
  Typography,
} from '@material-ui/core'
import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import config from 'config'
import GoogleMapReact from 'google-map-react'
import dayjs from 'dayjs'
import { DEFAULT_DATETIME_FORMAT } from 'utils'
import { BookingCarActivity } from 'services/web-bff/subscription.type'

const MarginActionButtons = styled.div`
  margin: 10px 15px;
`
const GoogleMapContainer = styled.div`
  height: 400px;
  width: 100%;
`
const MapMarkerWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;

  border-radius: 50%;
  border: 10px solid #f00;
  width: 10px;
  height: 10px;

  &::after {
    position: absolute;
    content: '';
    width: 0px;
    height: 0px;
    border: 10px solid transparent;
    border-top: 17px solid #f00;
    margin-left: -10px;
    margin-top: 2px;
  }
`

interface MapMarkerProps {
  lat: number
  lng: number
}
function MapMarker(_props: MapMarkerProps) {
  return <MapMarkerWrapper />
}

export interface CarDetailDialogProps {
  open: boolean
  car: BookingCarActivity | undefined
  onClose: () => void
}

export default function CarDetailDialog({ car, open, onClose }: CarDetailDialogProps): JSX.Element {
  const { t } = useTranslation()
  if (!open && !car) {
    return <Fragment />
  }

  function handleClose() {
    onClose()
  }

  // Bangkok Center
  const defaultValues = {
    lat: 13.736717,
    lng: 100.523186,
  }

  const deliveryMapAddress = {
    lat: car?.deliveryTask?.latitude || defaultValues.lat,
    lng: car?.deliveryTask?.longitude || defaultValues.lng,
  }
  const returnMapAddress = {
    lat: car?.returnTask?.latitude || defaultValues.lat,
    lng: car?.returnTask?.longitude || defaultValues.lng,
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
      fullWidth={true}
      maxWidth="md"
    >
      <DialogTitle id="form-dialog-title">{t('subscription.carDetails')}</DialogTitle>
      <DialogContent>
        {/* Delivery Date, and Return Date */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              id="car_detail__deliveryDate"
              label={t('subscription.deliveryDate')}
              fullWidth
              margin="normal"
              variant="outlined"
              value={dayjs(car?.deliveryTask?.date).format(DEFAULT_DATETIME_FORMAT) || '-'}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="car_detail__returnDate"
              label={t('subscription.returnDate')}
              fullWidth
              margin="normal"
              variant="outlined"
              value={dayjs(car?.returnTask?.date).format(DEFAULT_DATETIME_FORMAT) || '-'}
            />
          </Grid>
        </Grid>

        {/* Plate Number and VIN */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              id="car_detail__plateNumber"
              label={t('subscription.plateNumber')}
              fullWidth
              margin="normal"
              InputProps={{
                readOnly: true,
              }}
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              value={car?.carDetail.plateNumber}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="car_detail__vin"
              label={t('subscription.vin')}
              fullWidth
              margin="normal"
              InputProps={{
                readOnly: true,
              }}
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              value={car?.carDetail.vin}
            />
          </Grid>
        </Grid>

        {/* Brand and Model */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              id="car_detail__brand"
              label={t('subscription.brand')}
              fullWidth
              margin="normal"
              InputProps={{
                readOnly: true,
              }}
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              value={car?.carDetail.carSku.carModel.brand.name}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="car_detail__model"
              label={t('subscription.model')}
              fullWidth
              margin="normal"
              InputProps={{
                readOnly: true,
              }}
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              value={car?.carDetail.carSku.carModel.name}
            />
          </Grid>
        </Grid>

        {/* Seat */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              id="car_detail__seat"
              label={t('subscription.seats')}
              fullWidth
              margin="normal"
              InputProps={{
                readOnly: true,
              }}
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              value={car?.carDetail.carSku.carModel.seats}
            />
          </Grid>
        </Grid>

        {/* Delivery Address and Return Address */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              id="car_detail__deliveryAddress"
              label={t('subscription.startAddress')}
              fullWidth
              margin="normal"
              multiline
              rows={4}
              InputProps={{
                readOnly: true,
              }}
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              value={car?.deliveryTask?.fullAddress?.trim() || t('subscription.noData')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="car_detail__returnAddress"
              label={t('subscription.endAddress')}
              fullWidth
              margin="normal"
              multiline
              rows={4}
              InputProps={{
                readOnly: true,
              }}
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              value={car?.returnTask?.fullAddress?.trim() || t('subscription.noData')}
            />
          </Grid>
        </Grid>

        {/* Delivery Address Remark and Return Address Remark */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              id="car_detail__deliveryAddressRemark"
              label={t('subscription.startAddressRemark')}
              fullWidth
              margin="normal"
              InputProps={{
                readOnly: true,
              }}
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              value={car?.deliveryTask?.remark?.trim() || t('subscription.noData')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="car_detail__returnAddressRemark"
              label={t('subscription.endAddressRemark')}
              fullWidth
              margin="normal"
              InputProps={{
                readOnly: true,
              }}
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              value={car?.returnTask?.remark?.trim() || t('subscription.noData')}
            />
          </Grid>
        </Grid>

        {/* Delivery Address Map */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" component="h3">
              {t('subscription.startAddress')}
            </Typography>
            <GoogleMapContainer>
              <GoogleMapReact
                bootstrapURLKeys={{ key: config.googleMapsApiKey }}
                defaultCenter={{ lat: deliveryMapAddress.lat, lng: deliveryMapAddress.lng }}
                defaultZoom={14}
                options={{
                  gestureHandling: 'none',
                }}
              >
                <MapMarker lat={deliveryMapAddress.lat} lng={deliveryMapAddress.lng} />
              </GoogleMapReact>
            </GoogleMapContainer>
          </Grid>
        </Grid>

        {/* Return Address Map */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" component="h3">
              {t('subscription.endAddress')}
            </Typography>
            <GoogleMapContainer>
              <GoogleMapReact
                bootstrapURLKeys={{ key: config.googleMapsApiKey }}
                defaultCenter={{ lat: returnMapAddress.lat, lng: returnMapAddress.lng }}
                defaultZoom={14}
                options={{
                  gestureHandling: 'none',
                }}
              >
                <MapMarker lat={returnMapAddress.lat} lng={returnMapAddress.lng} />
              </GoogleMapReact>
            </GoogleMapContainer>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <MarginActionButtons>
          <Button onClick={handleClose} color="primary">
            {t('subscription.sendAllData.dialog.actionButton.cancel')}
          </Button>
        </MarginActionButtons>
      </DialogActions>
    </Dialog>
  )
}
