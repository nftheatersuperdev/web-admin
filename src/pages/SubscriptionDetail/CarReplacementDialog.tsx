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
import { Alert, Typography } from '@mui/material'
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date'
import { DEFAULT_DATE_FORMAT, DEFAULT_DATE_FORMAT_BFF } from 'utils'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'
import Geocode from 'react-geocode'
import DatePicker from 'components/DatePicker'
import ConfirmDialog from 'components/ConfirmDialog'
import { getAvailableListBFF } from 'services/web-bff/car'
import { status as BookingStatus, updateCarReplacement } from 'services/web-bff/subscription'
import { CarAvailableListBffFilterRequestProps } from 'services/web-bff/car.type'
import { BookingRental, CarReplacementDeliveryAddress } from 'services/web-bff/subscription.type'
import { SubEventStatus } from 'pages/Subscriptions/utils'

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
  bookingDetails: BookingRental | undefined
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
  bookingDetails,
  onClose,
}: CarReplacementDialogProps): JSX.Element {
  if (!open || !bookingDetails) {
    return <Fragment />
  }

  Geocode.setApiKey(config.googleMapsApiKey)

  const {
    bookingId,
    rentDetail: { bookingDetailId },
    displayStatus,
    carActivities,
    endDate,
  } = bookingDetails

  const carActivity = carActivities[carActivities.length - 1]
  const rentalDetail = bookingDetails.rentDetail
  const todayDate = dayjs()

  const isStatus = (status: string, statusCondition: string) =>
    status.toLowerCase() === statusCondition.toLowerCase()

  const isUpCommingCancelled = bookingDetails.status === 'upcoming_cancelled'

  function isArrivingSoon() {
    if (bookingDetails) {
      const { rentDetail, displayStatus, startDate, isExtend } = bookingDetails
      if (
        // Normal Case
        (!isExtend &&
          isStatus(displayStatus, BookingStatus.ACCEPTED) &&
          isStatus(rentDetail.status, BookingStatus.RESERVED)) ||
        // Extend Case
        (isExtend &&
          dayjs(startDate) > todayDate &&
          isStatus(displayStatus, BookingStatus.ACCEPTED) &&
          isStatus(rentDetail.status, BookingStatus.DELIVERED))
      ) {
        return true
      }
    }
    return false
  }

  const isArrivingSoonStatus = isArrivingSoon()

  function generateMinAndMaxDates(status: string) {
    const todayAddOneYear = todayDate.add(1, 'year')
    const returnDateMinusOneDay = () =>
      carActivity?.returnTask?.date
        ? dayjs(carActivity?.returnTask?.date).add(-1, 'day').startOf('day')
        : dayjs(carActivity?.deliveryTask?.date)
            .add(rentalDetail.durationDay - 1, 'day')
            .startOf('day')
    switch (status.toLocaleLowerCase()) {
      case SubEventStatus.DELIVERED: {
        return {
          minDate: todayDate.startOf('day'),
          maxDate: returnDateMinusOneDay(),
        }
      }
      default: {
        return {
          minDate: dayjs(carActivity.deliveryTask.date),
          maxDate: isArrivingSoonStatus ? returnDateMinusOneDay() : todayAddOneYear,
        }
      }
    }
  }

  const deliveryDateConditions = generateMinAndMaxDates(displayStatus)

  const defaultState = {
    carId: '',
    deliveryDate: deliveryDateConditions.minDate,
    deliveryTime: '',
    deliveryAddress: {
      full: '',
      latitude: 13.736717,
      longitude: 100.523186,
    },
  }

  const { t } = useTranslation()
  const [confirmReplaceDialogOpen, setConfirmReplaceDialogOpen] = useState<boolean>(false)
  const [carReplacementState, setCarReplacementState] = useState<DataState>(defaultState)
  const { data: availableCarsResponse } = useQuery('available-cars', () =>
    getAvailableListBFF({
      filter: {
        startDate: bookingDetails.startDate,
        endDate: bookingDetails.endDate,
        isSkuNotNull: true,
      },
      size: 10000,
    } as CarAvailableListBffFilterRequestProps)
  )

  const availableCars =
    availableCarsResponse?.data.records.filter(
      (car) => car.availabilityStatus.toLocaleLowerCase() === 'available'
    ) || []
  const selectedCar = availableCars.find(
    (availableCar) => availableCar.car.id === carReplacementState.carId
  )
  const isDisableToSave =
    !carReplacementState.carId ||
    !carReplacementState.deliveryDate ||
    !carReplacementState.deliveryTime ||
    !carReplacementState.deliveryAddress.full ||
    !carReplacementState.deliveryAddress.latitude ||
    !carReplacementState.deliveryAddress.longitude

  const handleFormSubmit = async () => {
    const { carId, deliveryDate, deliveryTime, deliveryAddress } = carReplacementState
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
    setCarReplacementState(() => defaultState)
    onClose(needRefetch)
  }

  const handleDeliveryDateChange = (date: MaterialUiPickersDate | Dayjs) => {
    if (date) {
      setCarReplacementState((prevState) => ({
        ...prevState,
        deliveryDate: date,
      }))
    }
  }

  const handleDeliveryTimeChange = (
    event: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    setCarReplacementState((prevState) => ({
      ...prevState,
      deliveryTime: event.target.value as string,
    }))
  }

  const handleCarChange = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    setCarReplacementState((prevState) => ({
      ...prevState,
      carId: event.target.value as string,
    }))
  }

  const handleMarkerChanged = async (e: google.maps.MapMouseEvent) => {
    const { lat, lng } = e.latLng.toJSON()
    const location = await Geocode.fromLatLng(String(lat), String(lng))
    const fullAddress = location?.results[0]?.formatted_address || '-'
    setCarReplacementState((prevState) => ({
      ...prevState,
      deliveryAddress: {
        ...prevState.deliveryAddress,
        full: fullAddress,
        latitude: lat,
        longitude: lng,
      },
    }))
  }

  const handleDeliveryAddressRemarkChanged = (
    e: React.ChangeEvent<{ name?: string; value: string | undefined }>
  ) => {
    setCarReplacementState((prevState) => ({
      ...prevState,
      deliveryAddress: {
        ...prevState.deliveryAddress,
        remark: e.target.value,
      },
    }))
  }

  const deliveryMarkerAddress = {
    lat: carReplacementState.deliveryAddress.latitude,
    lng: carReplacementState.deliveryAddress.longitude,
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
              value={carReplacementState.deliveryDate}
              margin="normal"
              minDate={deliveryDateConditions.minDate}
              maxDate={deliveryDateConditions.maxDate}
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
                value={carReplacementState.deliveryTime}
                onChange={handleDeliveryTimeChange}
              >
                <MenuItem value="09:00">09.00 - 10.00</MenuItem>
                <MenuItem value="11:00">11.00 - 13.00</MenuItem>
                <MenuItem value="13:00">13.00 - 15.00</MenuItem>
                <MenuItem value="15:00">15.00 - 17.00</MenuItem>
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
              <InputLabel id="car_replacement__plateNumber_label">
                {t('booking.carReplacement.plateNumber')}
              </InputLabel>
              <Select
                label={t('booking.carReplacement.plateNumber')}
                labelId="car_replacement__plateNumber_label"
                id="car_replacement__plateNumber"
                value={carReplacementState.carId}
                defaultValue={defaultState.carId}
                onChange={handleCarChange}
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
                value={carReplacementState.deliveryAddress.full}
                multiline
                minRows={3}
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                id="car_replacement__deliveryAddressRemark"
                label={t('booking.carReplacement.deliveryAddressRemark')}
                fullWidth
                margin="normal"
                variant="outlined"
                value={carReplacementState.deliveryAddress.remark}
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
