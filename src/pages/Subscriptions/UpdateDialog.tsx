/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/ban-types */
import { useState } from 'react'
import {
  Grid,
  TextField,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Button,
  Typography,
} from '@material-ui/core'
import CircularProgress from '@material-ui/core/CircularProgress'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { GoogleMap, useJsApiLoader, InfoWindow } from '@react-google-maps/api'
import { useFormik } from 'formik'
import { useTranslation } from 'react-i18next'
import { formatDate, columnFormatDate, convertMoneyFormat } from 'utils'
import styled from 'styled-components'
import config from 'config'
import * as yup from 'yup'
import { useQuery } from 'react-query'
import {
  GridColDef,
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton,
} from '@material-ui/data-grid'
import toast from 'react-hot-toast'
import { useAuth } from 'auth/AuthContext'
import { ROLES } from 'auth/roles'
import { getAvailableListBFF } from 'services/web-bff/car'
import { CarAvailableListBffFilterRequestProps } from 'services/web-bff/car.type'
import DataGridLocale from 'components/DataGridLocale'
import { Payment } from 'services/web-bff/payment.type'
import { SubscriptionChangeCarProps } from 'services/web-bff/subscription.type'
import { changeCar } from 'services/web-bff/subscription'
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

const disableToolbar = true
const dataGridDisableToobar = () => (
  <GridToolbarContainer hidden>
    {disableToolbar ? null : <GridToolbarExport />}
    {disableToolbar ? null : <GridToolbarColumnsButton />}
    {disableToolbar ? null : <GridToolbarFilterButton />}
    {disableToolbar ? null : <GridToolbarDensitySelector />}
  </GridToolbarContainer>
)

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
  paymentStatus: string
  deliverDate: string
  returnDate: string
  payments: Payment[]
  voucherId: string
  cleaningDate: string
}

interface SubscriptionProps {
  subscription: Subscription | undefined
  open: boolean
  onClose: (needRefetch?: boolean) => void
}

interface SubscriptionUpdateValuesProps {
  plateNumber: string | undefined
}

export default function CarUpdateDialog(props: SubscriptionProps): JSX.Element {
  const { open, onClose, subscription } = props

  if (!subscription) {
    return <div>{` `}</div>
  }

  const { t } = useTranslation()
  const { getRole } = useAuth()
  const currentUserRole = getRole()
  const isOperationRole = currentUserRole === ROLES.OPERATION

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { data: availableCarsResponse } = useQuery('available-cars', () =>
    getAvailableListBFF({
      filter: {
        startDate: subscription.startDate,
        endDate: subscription.cleaningDate,
        isSkuNotNull: true,
      },
      size: config.maxInteger,
    } as CarAvailableListBffFilterRequestProps)
  )

  const availableCars = availableCarsResponse?.data.records || []

  const handleOnSubmit = async ({ plateNumber }: SubscriptionUpdateValuesProps) => {
    try {
      setIsLoading(true)
      const carSelected = availableCars.find((data) => data.car.plateNumber === plateNumber)
      const carId = carSelected?.car.id
      const subscriptionId = subscription?.id

      if (carId && subscriptionId) {
        await toast.promise(changeCar({ subscriptionId, carId } as SubscriptionChangeCarProps), {
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

  const availablePlateNumbers =
    availableCars
      .filter((data) => data.availabilityStatus.toLowerCase() === 'available')
      .map((data) => data.car.plateNumber) || []

  if (
    !availablePlateNumbers.find((plateNumber) => plateNumber === subscription?.carPlateNumber) &&
    subscription?.carPlateNumber
  ) {
    availablePlateNumbers.push(subscription.carPlateNumber)
  }

  const disableToChangePlateNumber = (): boolean => {
    if (isOperationRole) {
      return ![SubEventStatus.ACCEPTED, SubEventStatus.DELIVERED].includes(subscription?.status)
    }
    return true
  }

  let disableUpdateButton =
    !isOperationRole ||
    ![SubEventStatus.ACCEPTED, SubEventStatus.DELIVERED].includes(subscription?.status)

  const handlePlateNumberChange = (_event: React.ChangeEvent<{}>, value: string | null) => {
    disableUpdateButton = subscription.carPlateNumber === value
    formik.setFieldValue('plateNumber', value || '')
    return true
  }

  /*const handleExtendEndDateDays = (
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
  }*/

  const rowPaymentCount = subscription.payments.length

  const paymentRow = subscription.payments.map((value) => {
    const price = convertMoneyFormat(value?.amount)
    const priceFullFormat = `${price} ${t('pricing.currency.thb')}`

    return {
      id: value.externalTrxId || '',
      amount: priceFullFormat || '',
      updateDate: value.updatedDate || '',
      paymentType: value.paymentType || '',
      purpose: value.purpose || '',
      status: value.status || '',
      statusMessage: value.statusMessage || '',
    }
  })
  const paymentColumns: GridColDef[] = [
    {
      field: 'id',
      headerName: t('subscription.paymentColumn.externalTrxId'),
      description: t('subscription.paymentColumn.externalTrxId'),
      flex: 1,
      sortable: false,
      filterable: false,
    },
    {
      field: 'amount',
      headerName: t('subscription.paymentColumn.amount'),
      description: t('subscription.paymentColumn.amount'),
      flex: 1,
      sortable: false,
      filterable: false,
    },
    {
      field: 'updateDate',
      headerName: t('subscription.paymentColumn.updateDate'),
      description: t('subscription.paymentColumn.updateDate'),
      flex: 1,
      sortable: false,
      filterable: false,
      valueFormatter: columnFormatDate,
    },
    /* {
      field: 'createDate',
      headerName: t('subscription.paymentColumn.createDate'),
      description: t('subscription.paymentColumn.createDate'),
      flex: 1,
      sortable: false,
      filterable: false,
      valueFormatter: columnFormatDate,
    },*/
    {
      field: 'paymentType',
      headerName: t('subscription.paymentColumn.paymentType'),
      description: t('subscription.paymentColumn.paymentType'),
      flex: 1,
      sortable: false,
      filterable: false,
    },
    {
      field: 'purpose',
      headerName: t('subscription.paymentColumn.purpose'),
      description: t('subscription.paymentColumn.purpose'),
      flex: 1,
      sortable: false,
      filterable: false,
    },
    {
      field: 'status',
      headerName: t('subscription.paymentColumn.status'),
      description: t('subscription.paymentColumn.status'),
      flex: 1,
      sortable: false,
      filterable: false,
    },
    {
      field: 'statusMessage',
      headerName: t('subscription.paymentColumn.statusMessage'),
      description: t('subscription.paymentColumn.statusMessage'),
      flex: 1,
      sortable: false,
      filterable: false,
    },
  ]

  return (
    <Dialog open={open} fullWidth maxWidth="lg" aria-labelledby="form-dialog-title">
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
              value={subscription.price}
              fullWidth
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label={t('subscription.duration')}
              value={subscription?.duration || ''}
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
          <Grid item xs={12} md={6}>
            <TextField
              label={t('subscription.deliveryDate')}
              value={formatDate(subscription?.deliverDate)}
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
              label={t('subscription.returnDate')}
              value={formatDate(subscription?.returnDate)}
              fullWidth
              multiline
              maxRows={3}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <Typography variant="subtitle1">{t('subscription.payments')}</Typography>
          </Grid>
          <Grid item xs={12} md={12}>
            <DataGridLocale
              autoHeight
              pagination
              rowCount={rowPaymentCount}
              paginationMode="server"
              rows={paymentRow}
              columns={paymentColumns}
              customToolbar={dataGridDisableToobar}
              hideFooterPagination
              hideFooter
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
            <Autocomplete
              value={formik.values.plateNumber}
              options={availablePlateNumbers}
              onChange={handlePlateNumberChange}
              renderInput={(param) => (
                <TextField {...param} label={t('subscription.plateNumber')} />
              )}
              disabled={disableToChangePlateNumber()}
            />
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
          <Grid item xs={12} md={6}>
            <TextField
              label={t('subscription.voucherCode')}
              value={subscription?.voucherCode}
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
                  options={{
                    gestureHandling: 'none',
                  }}
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
      Î
      <DialogActions>
        {isLoading && <CircularProgress size={24} />}
        <Button onClick={onFormCloseHandler} color="primary" disabled={isLoading}>
          {t('button.cancel')}
        </Button>
        <Button
          onClick={() => formik.handleSubmit()}
          color="primary"
          variant="contained"
          disabled={isLoading || disableUpdateButton}
        >
          {t('button.update')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
