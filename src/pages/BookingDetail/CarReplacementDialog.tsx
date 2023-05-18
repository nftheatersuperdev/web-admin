/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/jsx-no-useless-fragment */
import { useState, Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import styled from 'styled-components'
import dayjs, { Dayjs } from 'dayjs'
import toast from 'react-hot-toast'
import config from 'config'
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  FormControl,
  Grid,
  MenuItem,
  Select,
  InputLabel,
  TextField,
} from '@material-ui/core'
import { Alert, Typography, CircularProgress } from '@mui/material'
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date'
import { DEFAULT_DATE_FORMAT, DEFAULT_DATE_FORMAT_BFF } from 'utils'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'
import Geocode from 'react-geocode'
import DatePicker from 'components/DatePicker'
import ConfirmDialog from 'components/ConfirmDialog'
import { getAvailableListBFF } from 'services/web-bff/car'
import { status as BookingStatus, updateCarReplacement } from 'services/web-bff/booking'
import { CarAvailableListBffFilterRequestProps } from 'services/web-bff/car.type'
import { BookingRental, CarReplacementDeliveryAddress } from 'services/web-bff/booking.type'

const MarginActionButtons = styled.div`
  margin: 10px 15px;
  > button {
    margin-left: 15px;
  }
`
const MapDetailWrapper = styled.div`
  margin-top: 12px;
`
const ReturnDetailWrapper = styled.div`
  margin-top: 28px;
`
const containerStyle = {
  width: '100%',
  height: '290px',
}

/**
 * @TODO needs to handle and discuss about booking status is "upcoming_cancelled"
 */

export interface CarReplacementDialogProps {
  editorEmail: string | null
  open: boolean
  bookingDetail: BookingRental | undefined
  maxEndDate: Date
  onClose: (refetch?: boolean) => void
}
interface DataState {
  carId: string
  deliveryDate: MaterialUiPickersDate | Dayjs
  deliveryTime: string
  deliveryAddress: CarReplacementDeliveryAddress
}

export default function CarReplacementDialog({
  editorEmail,
  open,
  bookingDetail,
  maxEndDate,
  onClose,
}: CarReplacementDialogProps): JSX.Element {
  if (!open || !bookingDetail) {
    return <Fragment />
  }

  Geocode.setApiKey(config.googleMapsApiKey)

  const {
    bookingId,
    rentDetail: { bookingDetailId },
    carActivities,
    displayStatus,
    startDate,
    endDate,
    isSelfPickUp,
    isExtend,
    status: backendStatus,
  } = bookingDetail

  const carActivity = carActivities[carActivities.length - 1]

  const isUpCommingCancelled = backendStatus === 'upcoming_cancelled'
  const isSelfPickUpBooking = isSelfPickUp && displayStatus === BookingStatus.ACCEPTED

  /**
   * The logic to get delivery dates does update on May 18, 2023.
   * Ref: https://evme.atlassian.net/browse/EVME-3977
   */
  function getDeliveryDates() {
    const status = displayStatus.toLocaleLowerCase()
    const todayDate = dayjs().startOf('day')
    const bookingStartDate = dayjs(startDate).startOf('day')
    const bookingEndDateMinusOneDay = dayjs(endDate).add(-1, 'day').endOf('day')
    const isAcceptedStatus = status === BookingStatus.ACCEPTED
    const isDeliveredStatus = status === BookingStatus.DELIVERED
    const isArrivingSoon = dayjs(startDate) > todayDate

    if (
      (isAcceptedStatus && !isExtend && isArrivingSoon) ||
      (isAcceptedStatus && isExtend && isArrivingSoon)
    ) {
      return {
        minDate: bookingStartDate,
        maxDate: bookingEndDateMinusOneDay,
      }
    }

    if (
      (isDeliveredStatus && !isExtend && !isArrivingSoon) ||
      (isDeliveredStatus && isExtend && !isArrivingSoon)
    ) {
      return {
        minDate: todayDate,
        maxDate: bookingEndDateMinusOneDay,
      }
    }

    return {
      minDate: todayDate,
      maxDate: todayDate,
    }
  }
  const deliveryDates = getDeliveryDates()

  const defaultState = {
    carId: '',
    deliveryDate: deliveryDates.minDate,
    deliveryTime: '',
    deliveryAddress: {
      full: '',
      latitude: 13.736717,
      longitude: 100.523186,
    },
  }

  const { t } = useTranslation()
  const [confirmReplaceDialogOpen, setConfirmReplaceDialogOpen] = useState<boolean>(false)
  const [deliveryDate, setDeliveryDate] = useState<DataState['deliveryDate']>(
    dayjs(deliveryDates?.minDate)
  )
  const [deliveryTime, setDeliveryTime] = useState<DataState['deliveryTime']>(
    defaultState.deliveryTime
  )
  const [carId, setCarId] = useState<DataState['carId']>(defaultState.carId)
  const [deliveryAddress, setDeliveryAddress] = useState<DataState['deliveryAddress']>(
    defaultState.deliveryAddress
  )
  const { data: availableCarsResponse, isFetching } = useQuery(
    ['available-cars', deliveryDate],
    () =>
      getAvailableListBFF({
        filter: {
          startDate: deliveryDate?.format(DEFAULT_DATE_FORMAT_BFF),
          endDate: dayjs(maxEndDate).format(DEFAULT_DATE_FORMAT_BFF),
          isSkuNotNull: true,
        },
        size: 10000,
      } as CarAvailableListBffFilterRequestProps),
    { refetchOnWindowFocus: false }
  )

  const availableCars =
    availableCarsResponse?.data.records.filter(
      (car) => car.availabilityStatus.toLocaleLowerCase() === 'available'
    ) || []
  const selectedCar = availableCars.find(({ car: { id } }) => id === carId)
  const isDisableToSave =
    !carId ||
    !deliveryDate ||
    !deliveryTime ||
    !deliveryAddress.full ||
    !deliveryAddress.latitude ||
    !deliveryAddress.longitude

  const handleFormSubmit = async () => {
    if (deliveryDate) {
      await toast.promise(
        updateCarReplacement({
          bookingId,
          bookingDetailId,
          carId,
          deliveryDate: deliveryDate.format(DEFAULT_DATE_FORMAT_BFF),
          deliveryTime,
          deliveryAddress,
        }),
        {
          loading: t('toast.loading'),
          success: () => {
            handleClose(true)
            return t('booking.carReplacement.saveSuccess')
          },
          error: (error) => {
            if (error.data.message) {
              return error.data.message
            } else if (error.message) {
              return error.message
            }
            return t('error.unknown')
          },
        }
      )
    }
  }

  const handleClose = (needRefetch?: boolean) => {
    onClose(needRefetch)
  }

  const handleDeliveryDateChange = (date: MaterialUiPickersDate | Dayjs) => {
    if (date) {
      setCarId(() => defaultState.carId)
      setDeliveryDate(() => date)
    }
  }

  const handleDeliveryTimeChange = (
    event: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    setDeliveryTime(() => event.target.value as string)
  }

  const handleCarChange = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    setCarId(() => event.target.value as string)
  }

  const handleMarkerChanged = async (e: google.maps.MapMouseEvent) => {
    const { lat, lng } = e.latLng.toJSON()
    const location = await Geocode.fromLatLng(String(lat), String(lng))
    const fullAddress = location?.results[0]?.formatted_address || '-'
    setDeliveryAddress((prevState) => ({
      ...prevState,
      full: fullAddress,
      latitude: lat,
      longitude: lng,
    }))
  }

  const handleDeliveryAddressRemarkChanged = (
    e: React.ChangeEvent<{ name?: string; value: string | undefined }>
  ) => {
    setDeliveryAddress((prevState) => ({
      ...prevState,
      remark: e.target.value,
    }))
  }

  const deliveryMarkerAddress = {
    lat: deliveryAddress.latitude,
    lng: deliveryAddress.longitude,
  }

  return (
    <Dialog
      open={open}
      onClose={() => handleClose(false)}
      aria-labelledby="form-dialog-title"
      fullWidth={true}
      maxWidth="lg"
    >
      <DialogTitle id="form-dialog-title">{t('booking.carReplacement.title')}</DialogTitle>
      <DialogContent>
        {isUpCommingCancelled ? (
          <Alert severity="warning">
            This booking is upcoming_cancelled and does not have any agreement right now.
          </Alert>
        ) : (
          ''
        )}
        {/* Delivery Date, Delivery Time, and Return Date */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={3}>
            <DatePicker
              fullWidth
              inputVariant="outlined"
              label={t('booking.carReplacement.deliveryDate')}
              id="car_replacement__deliveryDate"
              name="selectedFromDate"
              format="DD/MM/YYYY"
              onChange={handleDeliveryDateChange}
              value={deliveryDate}
              margin="normal"
              minDate={deliveryDates.minDate}
              maxDate={deliveryDates.maxDate}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth variant="outlined" margin="normal">
              <InputLabel id="car_replacement__deliveryTime_label">
                {t('booking.carReplacement.deliveryTime')}
              </InputLabel>
              <Select
                label={t('booking.carReplacement.deliveryTime')}
                labelId="car_replacement__deliveryTime_label"
                id="car_replacement__deliveryTime"
                value={deliveryTime}
                onChange={handleDeliveryTimeChange}
              >
                <MenuItem value="09:00">09.00 - 10.00</MenuItem>
                <MenuItem value="11:00">11.00 - 13.00</MenuItem>
                <MenuItem value="13:00">13.00 - 15.00</MenuItem>
                <MenuItem value="15:00">15.00 - 17.00</MenuItem>
                {isSelfPickUp ? <MenuItem value="17:00">17:00 - 18:00</MenuItem> : ''}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="car_replacement__returnDate"
              label={t('booking.carReplacement.returnDate')}
              fullWidth
              margin="normal"
              variant="outlined"
              value={dayjs(endDate).format(DEFAULT_DATE_FORMAT)}
            />
          </Grid>
        </Grid>

        {/* Plate Number and VIN */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined" margin="normal">
              {isFetching ? (
                <CircularProgress
                  size={24}
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    marginTop: '-12px',
                    marginLeft: '-12px',
                  }}
                />
              ) : (
                ''
              )}
              <InputLabel id="car_replacement__plateNumber_label">
                {t('booking.carReplacement.plateNumber')}
              </InputLabel>
              <Select
                label={t('booking.carReplacement.plateNumber')}
                labelId="car_replacement__plateNumber_label"
                id="car_replacement__plateNumber"
                value={carId}
                defaultValue={defaultState.carId}
                onChange={handleCarChange}
                disabled={isFetching}
              >
                {availableCars.map((availableCar) => {
                  return (
                    <MenuItem key={availableCar.car.id} value={availableCar.car.id}>
                      {availableCar.car.plateNumber}
                    </MenuItem>
                  )
                })}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="car_replacement__VIN"
              label={t('booking.carReplacement.vin')}
              fullWidth
              margin="normal"
              variant="outlined"
              value={selectedCar?.car.vin || '-'}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
        </Grid>

        {/* Car Brand and Model */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              id="car_replacement__carBrand"
              label={t('booking.carReplacement.brand')}
              fullWidth
              margin="normal"
              variant="outlined"
              value={selectedCar?.car?.carSku?.carModel.brand.name || '-'}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="car_replacement__carModel"
              label={t('booking.carReplacement.model')}
              fullWidth
              margin="normal"
              variant="outlined"
              value={selectedCar?.car?.carSku?.carModel.name || '-'}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
        </Grid>

        {/* Seat */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              id="car_replacement__seat"
              label={t('booking.carReplacement.seat')}
              fullWidth
              margin="normal"
              variant="outlined"
              value={selectedCar?.car?.carSku?.carModel.seats || '-'}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
        </Grid>

        {/* Delivery Address Map */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Typography gutterBottom variant="h4">
              {t('booking.carReplacement.deliveryAddress')}
            </Typography>
            <LoadScript googleMapsApiKey={config.googleMapsApiKey}>
              {isSelfPickUpBooking ? (
                <GoogleMap
                  mapContainerStyle={containerStyle}
                  center={deliveryMarkerAddress}
                  zoom={15}
                >
                  <Marker position={deliveryMarkerAddress} draggable={false} />
                </GoogleMap>
              ) : (
                <GoogleMap
                  mapContainerStyle={containerStyle}
                  center={deliveryMarkerAddress}
                  zoom={15}
                  onClick={handleMarkerChanged}
                >
                  <Marker
                    position={deliveryMarkerAddress}
                    draggable={true}
                    onDragEnd={handleMarkerChanged}
                  />
                </GoogleMap>
              )}
            </LoadScript>
          </Grid>
          <Grid item xs={12} sm={6}>
            <MapDetailWrapper>
              <TextField
                id="car_replacement__deliveryAddress"
                label={t('booking.carReplacement.deliveryAddress')}
                fullWidth
                margin="normal"
                variant="outlined"
                value={deliveryAddress.full}
                multiline
                minRows={3}
                InputProps={{
                  readOnly: true,
                }}
                disabled={isSelfPickUpBooking}
              />
              <TextField
                id="car_replacement__deliveryAddressRemark"
                label={t('booking.carReplacement.deliveryAddressRemark')}
                fullWidth
                margin="normal"
                variant="outlined"
                value={deliveryAddress.remark}
                multiline
                minRows={3}
                onChange={handleDeliveryAddressRemarkChanged}
              />
            </MapDetailWrapper>
          </Grid>
        </Grid>

        {/* Delivery Address Map */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Typography gutterBottom variant="h4">
              {t('booking.carReplacement.returnAddress')}
            </Typography>
            <TextField
              id="car_replacement__returnAddress"
              label={t('booking.carReplacement.returnAddress')}
              fullWidth
              margin="normal"
              variant="outlined"
              value={
                carActivity?.returnTask?.fullAddress
                  ? carActivity.returnTask.fullAddress.trim()
                  : '-'
              }
              multiline
              minRows={3}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <ReturnDetailWrapper>
              <TextField
                id="car_replacement__returnAddressRemark"
                label={t('booking.carReplacement.returnAddressRemark')}
                fullWidth
                margin="normal"
                variant="outlined"
                value={carActivity?.returnTask?.remark ? carActivity.returnTask.remark.trim() : '-'}
                multiline
                minRows={3}
                InputProps={{
                  readOnly: true,
                }}
              />
            </ReturnDetailWrapper>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <MarginActionButtons>
          <Button onClick={() => handleClose(false)} color="secondary" variant="contained">
            {t('booking.carReplacement.button.cancel')}
          </Button>
          <Button
            onClick={() => setConfirmReplaceDialogOpen(() => true)}
            color="primary"
            variant="contained"
            disabled={isDisableToSave}
          >
            {t('booking.carReplacement.button.save')}
          </Button>
        </MarginActionButtons>
      </DialogActions>
      <ConfirmDialog
        open={confirmReplaceDialogOpen}
        title={t('booking.carReplacement.saveConfirmation.title')}
        htmlContent={t('booking.carReplacement.saveConfirmation.description', {
          bookingDetailId,
          editorEmail,
        })}
        onConfirm={() => handleFormSubmit()}
        onCancel={() => setConfirmReplaceDialogOpen(() => false)}
      />
    </Dialog>
  )
}
