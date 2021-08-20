import { useState } from 'react'
import {
  Grid,
  TextField,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  FormControl,
  MenuItem,
  Button,
  Typography,
  InputLabel,
  Select,
  FormHelperText,
} from '@material-ui/core'
import CircularProgress from '@material-ui/core/CircularProgress'
import toast from 'react-hot-toast'
import { GoogleMap, useJsApiLoader, InfoWindow } from '@react-google-maps/api'
import { useFormik } from 'formik'
import { useTranslation } from 'react-i18next'
import { formatDate } from 'utils'
import styled from 'styled-components'
import config from 'config'
import * as yup from 'yup'
import { useCarModelById, useChangeCar } from 'services/evme'
import { columnFormatDuration } from 'pages/Pricing/utils'
import { columnFormatSubEventStatus, SubEventStatus } from './utils'

const MapWrapper = styled.div`
  display: flex;
  flex: 1 1 100%;
  height: 250px;

  #map-delivery-address,
  #map-return-address {
    flex: 1 1 auto;
  }
`

const validationSchema = yup.object({
  plateNumber: yup.string().required('Field is required'),
})

interface Subscription {
  id: string
  vin: string
  plateNumber: string
  brand: string
  model: string
  carModelId: string
  color: string
  price: number
  duration: string
  seats: number
  topSpeed: number
  fastChargeTime: number
  startDate: string
  endDate: string
  createdAt: string
  updatedAt: string
  email: string
  phoneNumber: string
  firstName: string
  lastName: string
  startAddress: string
  startLat: number
  startLng: number
  startAddressRemark: string | null
  endAddress: string
  endLat: number
  endLng: number
  endAddressRemark: string | null
  status: string
}

interface SubscriptionProps {
  open: boolean
  onClose: () => void
  subscription: Subscription | undefined
}

interface SubscriptionUpdateValuesProps {
  plateNumber: string | undefined
}

export default function CarUpdateDialog(props: SubscriptionProps): JSX.Element {
  const { open, onClose, subscription } = props
  const { startLat = 0, startLng = 0, endLat = 0, endLng = 0 } = subscription || {}

  const [isLoading, setIsLoading] = useState<boolean>(false)

  // Fetch the available cars with the car model ID and the color of the subscription so that an admin
  // can possibly change the vehicle in this car model category
  const { data: carModel } = useCarModelById({
    carModelId: subscription?.carModelId || '',
    carFilter: { color: { eq: subscription?.color } },
    availableFilter: { startDate: subscription?.startDate, endDate: subscription?.endDate },
  })

  const changeCarMutation = useChangeCar()

  const { t } = useTranslation()

  const handleOnSubmit = async ({ plateNumber }: SubscriptionUpdateValuesProps) => {
    setIsLoading(true)
    const carSelected = carModel?.cars?.find((car) => car.plateNumber === plateNumber)
    const carId = carSelected?.id
    const subscriptionId = subscription?.id

    if (carId && subscriptionId) {
      await toast.promise(
        changeCarMutation.mutateAsync({
          carId,
          subscriptionId,
        }),
        {
          loading: t('toast.loading'),
          success: t('subscription.updateDialog.success'),
          error: t('subscription.updateDialog.error'),
        }
      )
    }

    setIsLoading(false)
    onClose()
    formik.resetForm()
  }

  const formik = useFormik({
    validationSchema,
    initialValues: {
      plateNumber: subscription?.plateNumber,
    },
    enableReinitialize: true,
    onSubmit: handleOnSubmit,
  })

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: config.googleMapsApiKey,
  })

  const onFormCloseHandler = () => {
    onClose()
    formik.resetForm()
  }

  const availablePlateNumbers =
    carModel?.cars?.filter((car) => car.available).map((car) => car.plateNumber) || []

  if (
    !availablePlateNumbers.find((plateNumber) => plateNumber === subscription?.plateNumber) &&
    subscription?.plateNumber
  ) {
    availablePlateNumbers.push(subscription.plateNumber)
  }

  const disableToChangePlateNumber =
    subscription &&
    ![SubEventStatus.ACCEPTED, SubEventStatus.DELIVERED].includes(subscription?.status)

  return (
    <Dialog open={open} fullWidth aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">
        {t('subscription.updateSubscriptionDetails')}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <Typography variant="subtitle1">{t('subscription.bookingDetails')}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label={t('subscription.firstName')}
              value={subscription?.firstName}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label={t('subscription.lastName')}
              value={subscription?.lastName}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label={t('subscription.email')}
              value={subscription?.email}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label={t('subscription.phone')}
              value={subscription?.phoneNumber}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label={t('subscription.price')}
              value={subscription?.price}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label={t('subscription.duration')}
              value={columnFormatDuration(subscription?.duration || '', t)}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label={t('subscription.status.title')}
              value={columnFormatSubEventStatus(subscription?.status || '', t)}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label={t('subscription.subscriptionId')}
              value={subscription?.id}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label={t('subscription.createdDate')}
              value={formatDate(subscription?.createdAt)}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label={t('subscription.updatedDate')}
              value={formatDate(subscription?.updatedAt)}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label={t('subscription.startDate')}
              value={formatDate(subscription?.startDate)}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label={t('subscription.endDate')}
              value={formatDate(subscription?.endDate)}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label={t('subscription.startAddress')}
              value={subscription?.startAddress}
              fullWidth
              multiline
              maxRows={3}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label={t('subscription.endAddress')}
              value={subscription?.endAddress}
              fullWidth
              multiline
              maxRows={3}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label={t('subscription.startAddressRemark')}
              value={subscription?.startAddressRemark?.trim() || t('subscription.noData')}
              fullWidth
              multiline
              maxRows={3}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label={t('subscription.endAddressRemark')}
              value={subscription?.endAddressRemark?.trim() || t('subscription.noData')}
              fullWidth
              multiline
              maxRows={3}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>

          <Grid item xs={12} md={12}>
            <Typography variant="subtitle1">{t('subscription.carDetails')}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label={t('subscription.brand')}
              value={subscription?.brand}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label={t('subscription.model')}
              value={subscription?.model}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl
              fullWidth
              error={formik.touched.plateNumber && Boolean(formik.errors.plateNumber)}
            >
              <InputLabel shrink id="plateNumber">
                {t('subscription.plateNumber')}
              </InputLabel>
              <Select
                labelId="plateNumber"
                id="plateNumber"
                name="plateNumber"
                value={formik.values.plateNumber}
                onChange={formik.handleChange}
                disabled={disableToChangePlateNumber}
              >
                {availablePlateNumbers.map((plateNumber) => (
                  <MenuItem key={plateNumber} value={plateNumber}>
                    {plateNumber}
                  </MenuItem>
                ))}
                {formik.touched.plateNumber && Boolean(formik.errors.plateNumber) && (
                  <FormHelperText>
                    {formik.touched.plateNumber && formik.errors.plateNumber}
                  </FormHelperText>
                )}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label={t('subscription.vin')}
              value={subscription?.vin}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label={t('subscription.seats')}
              value={subscription?.seats}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <Typography gutterBottom color="textPrimary" variant="body1">
              {t('subscription.startAddress')}
            </Typography>
            <MapWrapper>
              {isLoaded ? (
                <GoogleMap
                  id="map-delivery-address"
                  center={{ lat: startLat, lng: startLng }}
                  zoom={15}
                >
                  <InfoWindow position={{ lat: startLat, lng: startLng }}>
                    <h4>{subscription?.startAddress}</h4>
                  </InfoWindow>
                </GoogleMap>
              ) : null}
            </MapWrapper>
          </Grid>
          <Grid item xs={12} md={12}>
            <Typography gutterBottom color="textPrimary" variant="body1">
              {t('subscription.endAddress')}
            </Typography>
            <MapWrapper>
              {isLoaded ? (
                <GoogleMap id="map-return-address" center={{ lat: endLat, lng: endLng }} zoom={15}>
                  <InfoWindow position={{ lat: endLat, lng: endLng }}>
                    <h4>{subscription?.endAddress}</h4>
                  </InfoWindow>
                </GoogleMap>
              ) : null}
            </MapWrapper>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        {isLoading && <CircularProgress size={24} />}
        <Button onClick={onFormCloseHandler} color="primary" disabled={isLoading}>
          {t('button.cancel')}
        </Button>
        <Button
          onClick={() => formik.handleSubmit()}
          color="primary"
          variant="contained"
          disabled={isLoading}
        >
          {t('button.update')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
