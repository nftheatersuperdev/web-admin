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
import { formatDate, DEFAULT_DATETIME_FORMAT } from 'utils'
import styled from 'styled-components'
import config from 'config'
import dayjs from 'dayjs'
import * as yup from 'yup'
import { useQuery } from 'react-query'
import { useAuth } from 'auth/AuthContext'
import { ROLES } from 'auth/roles'
import { columnFormatDuration } from 'pages/Pricing/utils'
import DateTimePicker from 'components/DateTimePicker'
import { changeCar, extend } from 'services/web-bff/subscription'
import { getList } from 'services/web-bff/car'
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
  userFirstName: string
  userLastName: string
  userEmail: string
  userPhoneNumber: string
  carId: string
  carModelId: string
  carName: string
  carBrand: string
  carColor: string
  carPlateNumber: string
  carVin: string
  carSeats: number
  carTopSpeed: number
  carFastChargeTime: number
  price: number
  duration: string
  startDate: string
  endDate: string
  deliveryAddress: string
  deliveryLatitude: number
  deliveryLongitude: number
  deliveryRemark: string
  returnAddress: string
  returnLatitude: number
  returnLongitude: number
  returnRemark: string
  status: string
  voucherCode: string
  paymentVersion: string
  createdDate: string
  updatedDate: string
}

interface SubscriptionProps {
  accessToken: string
  subscription: Subscription | undefined
  open: boolean
  onClose: (needRefetch?: boolean) => void
}

interface SubscriptionUpdateValuesProps {
  plateNumber: string | undefined
}

export default function CarUpdateDialog(props: SubscriptionProps): JSX.Element {
  const { accessToken, open, onClose, subscription } = props

  if (!subscription) {
    return <div>{` `}</div>
  }

  const { t } = useTranslation()
  const { getRole } = useAuth()
  const currentUserRole = getRole()
  const isSuperAdminRole = currentUserRole === ROLES.SUPER_ADMIN
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { data: availableCarsResponse } = useQuery('available-cars', () =>
    getList({
      accessToken,
      query: {
        modeId: {
          eq: subscription.carModelId,
        },
        availableDate: {
          startDate: subscription.startDate,
          endDate: subscription.endDate,
        },
      },
      limit: 500,
    })
  )
  const availableCars = availableCarsResponse?.data.cars || []

  const handleOnSubmit = async ({ plateNumber }: SubscriptionUpdateValuesProps) => {
    try {
      setIsLoading(true)
      const carSelected = availableCars.find((car) => car.plateNumber === plateNumber)
      const carId = carSelected?.id
      const subscriptionId = subscription?.id

      if (carId && subscriptionId) {
        await toast.promise(changeCar({ accessToken, subscriptionId, carId }), {
          loading: t('toast.loading'),
          success: t('subscription.updateDialog.success'),
          error: t('subscription.updateDialog.error'),
        })
      }
    } finally {
      setIsLoading(false)
      onClose(true)
      formik.resetForm()
    }
  }

  const formik = useFormik({
    validationSchema,
    initialValues: {
      plateNumber: subscription?.carPlateNumber,
    },
    enableReinitialize: true,
    onSubmit: handleOnSubmit,
  })

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: config.googleMapsApiKey,
  })

  const onFormCloseHandler = () => {
    onClose(true)
    formik.resetForm()
  }

  const availablePlateNumbers = availableCars?.map((car) => car.plateNumber) || []
  if (
    !availablePlateNumbers.find((plateNumber) => plateNumber === subscription?.carPlateNumber) &&
    subscription?.carPlateNumber
  ) {
    availablePlateNumbers.push(subscription.carPlateNumber)
  }

  const disableToChangePlateNumber =
    subscription &&
    ![SubEventStatus.ACCEPTED, SubEventStatus.DELIVERED].includes(subscription?.status)

  const handleExtendEndDateDays = async (
    subscriptionId: string,
    originalDate: string,
    newDate: string
  ) => {
    const confirmationMessage = t('subscription.extending.confirmationMessage')
      .replace(':originalDate', dayjs(originalDate).format(DEFAULT_DATETIME_FORMAT))
      .replace(':newDate', dayjs(newDate).format(DEFAULT_DATETIME_FORMAT))
    // eslint-disable-next-line no-alert
    const confirmed = window.confirm(confirmationMessage)
    if (confirmed) {
      await toast.promise(
        extend({
          accessToken,
          subscriptionId,
          endDate: newDate,
        }),
        {
          loading: t('toast.loading'),
          success: t('subscription.updateDialog.success'),
          error: t('subscription.updateDialog.error'),
        }
      )

      onClose(true)
    }
  }

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
              value={subscription?.userFirstName}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label={t('subscription.lastName')}
              value={subscription?.userLastName}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label={t('subscription.email')}
              value={subscription?.userEmail}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label={t('subscription.phone')}
              value={subscription?.userPhoneNumber}
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
              value={formatDate(subscription?.createdDate)}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label={t('subscription.updatedDate')}
              value={formatDate(subscription?.updatedDate)}
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
            {!isSuperAdminRole && (
              <TextField
                label={t('subscription.endDate')}
                value={formatDate(subscription?.endDate)}
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
              />
            )}
            {subscription?.endDate && (
              <DateTimePicker
                fullWidth
                disablePast
                ampm={false}
                label={t('subscription.endDate')}
                id="extendEndDate"
                name="extendEndDate"
                format={DEFAULT_DATETIME_FORMAT}
                minDate={dayjs(subscription?.endDate).add(1, 'day')}
                minDateMessage=""
                defaultValue={subscription?.endDate}
                value={subscription?.endDate}
                onChange={(date) =>
                  date &&
                  handleExtendEndDateDays(
                    subscription.id,
                    subscription?.endDate,
                    date?.toISOString()
                  )
                }
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            )}
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label={t('subscription.startAddress')}
              value={subscription?.deliveryAddress}
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
              value={subscription?.returnAddress}
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
              value={subscription?.deliveryRemark?.trim() || t('subscription.noData')}
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
              value={subscription?.returnRemark?.trim() || t('subscription.noData')}
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
              value={subscription?.carBrand}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label={t('subscription.model')}
              value={subscription?.carName}
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
              value={subscription?.carVin}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label={t('subscription.seats')}
              value={subscription?.carSeats}
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
                  center={{
                    lat: subscription?.deliveryLatitude ?? 0,
                    lng: subscription?.deliveryLongitude ?? 0,
                  }}
                  zoom={15}
                >
                  <InfoWindow
                    position={{
                      lat: subscription?.deliveryLatitude ?? 0,
                      lng: subscription?.deliveryLongitude ?? 0,
                    }}
                  >
                    <h4>{subscription?.deliveryAddress}</h4>
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
                <GoogleMap
                  id="map-return-address"
                  center={{
                    lat: subscription?.returnLatitude ?? 0,
                    lng: subscription?.returnLongitude ?? 0,
                  }}
                  zoom={15}
                >
                  <InfoWindow
                    position={{
                      lat: subscription?.returnLatitude ?? 0,
                      lng: subscription?.returnLongitude ?? 0,
                    }}
                  >
                    <h4>{subscription?.returnAddress}</h4>
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
