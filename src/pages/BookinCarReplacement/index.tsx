/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable react/jsx-props-no-spreading */

import { useState } from 'react'
import {
  Alert,
  Autocomplete,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material'
import ArrowRightIcon from '@mui/icons-material/ArrowRight'
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date'
import { useLocation, useParams, useHistory } from 'react-router-dom'
import config from 'config'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'
import Geocode from 'react-geocode'
import {
  DEFAULT_DATETIME_FORMAT_MONTH_TEXT,
  DEFAULT_DATE_FORMAT_MONTH_TEXT,
  DEFAULT_DATE_FORMAT_BFF,
} from 'utils'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { makeStyles } from '@mui/styles'
import dayjs, { Dayjs } from 'dayjs'
import toast from 'react-hot-toast'
import DatePicker from 'components/DatePicker'
import ConfirmDialog from 'components/ConfirmDialog'
import { Page } from 'layout/LayoutRoute'
import PageTitle, { PageBreadcrumbs } from 'components/PageTitle'
import { getAvailableListBFF } from 'services/web-bff/car'
import { status as BookingStatus, updateCarReplacement } from 'services/web-bff/booking'
import { CarAvailableListBffFilterRequestProps } from 'services/web-bff/car.type'
import { BookingRental, CarReplacementDeliveryAddress } from 'services/web-bff/booking.type'

const Wrapper = styled(Card)`
  padding: 15px;
  margin-top: 20px;
`
const ContentSection = styled.div`
  margin-bottom: 10px;
`
const MarginActionButtons = styled.div`
  margin-top: 20px;
  margin-bottom: 20px;
`
const containerStyle = {
  width: '100%',
  height: '200px',
}
const MapDetailWrapper = styled.div`
  margin-top: 16px;
`

interface SelectOption {
  label: string
  value: string
}

interface CarReplacementDialogProps {
  editorEmail: string | null
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

const useStyles = makeStyles(() => ({
  datePickerFromTo: {
    '&& .MuiOutlinedInput-input': {
      padding: '16px 13.5px',
    },
  },
  bgColour: {
    backgroundColor: '#F5F5F5',
  },
  marginBottomText: {
    marginBottom: '20px',
  },
  mgBtnLeft: {
    marginLeft: '15px',
  },
  autoCompleteSelect: {
    '& fieldSet': {
      borderColor: '#424E63',
    },
  },
  listbox: {
    marginBlockEnd: '20px',
    backgroundColor: '#F5F5F5',
  },
}))
interface SubscriptionDetailParams {
  bookingId: string
  bookingDetailId: string
}
export default function BookingCarReplacement(): JSX.Element {
  const location = useLocation()
  const classes = useStyles()
  const { t } = useTranslation()
  const bookingDetailProps = location.state as CarReplacementDialogProps
  Geocode.setApiKey(config.googleMapsApiKey)

  const status = bookingDetailProps.bookingDetail?.displayStatus.toLocaleLowerCase()
  const isAcceptedStatus = status === BookingStatus.ACCEPTED
  const isDeliveredStatus = status === BookingStatus.DELIVERED
  const todayDate = dayjs().startOf('day')
  const isArrivingSoon = dayjs(bookingDetailProps.bookingDetail?.startDate) > dayjs(todayDate)
  const bookingStartDate = dayjs(bookingDetailProps.bookingDetail?.startDate).startOf('day')
  const bookingEndDateMinusOneDay = dayjs(bookingDetailProps.bookingDetail?.endDate)
    .add(-1, 'day')
    .endOf('day')
  function getDeliveryDates() {
    if (
      (isAcceptedStatus && !bookingDetailProps.bookingDetail?.isExtend && isArrivingSoon) ||
      (isAcceptedStatus && bookingDetailProps.bookingDetail?.isExtend && isArrivingSoon) ||
      (isDeliveredStatus && bookingDetailProps.bookingDetail?.isExtend && isArrivingSoon)
    ) {
      return {
        minDate: bookingStartDate,
        maxDate: bookingEndDateMinusOneDay,
      }
    } else if (
      (isDeliveredStatus && !bookingDetailProps.bookingDetail?.isExtend && !isArrivingSoon) ||
      (isDeliveredStatus && bookingDetailProps.bookingDetail?.isExtend && !isArrivingSoon)
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
    deliveryTime: '09:00',
    deliveryAddress: {
      full: '',
      latitude: 13.736717,
      longitude: 100.523186,
    },
  }

  const history = useHistory()
  const [confirmReplaceDialogOpen, setConfirmReplaceDialogOpen] = useState<boolean>(false)
  const [pickupReplaceDialogOpen, setPickupReplaceDialogOpen] = useState<boolean>(false)

  const { bookingId, bookingDetailId } = useParams<SubscriptionDetailParams>()

  const bookingDetail = bookingDetailProps?.bookingDetail
  const editorEmail = bookingDetailProps?.editorEmail
  const carActivity = bookingDetail?.carActivities[bookingDetail?.carActivities.length - 1]

  const isUpCommingCancelled =
    bookingDetailProps.bookingDetail?.displayStatus === 'upcoming_cancelled'
  const isSelfPickUpArrivingSoon =
    bookingDetailProps.bookingDetail?.isSelfPickUp &&
    bookingDetailProps.bookingDetail?.displayStatus === BookingStatus.ACCEPTED &&
    isArrivingSoon
  const isSelfPickUpExtendArrivingSoon =
    bookingDetailProps.bookingDetail?.isSelfPickUp &&
    bookingDetailProps.bookingDetail?.displayStatus === BookingStatus.DELIVERED &&
    isArrivingSoon &&
    bookingDetailProps.bookingDetail?.isExtend

  const isSelfPickUpAndReturnBooking = isSelfPickUpArrivingSoon || isSelfPickUpExtendArrivingSoon
  /**
   * The logic to get delivery dates does update on May 17, 2023.
   * Ref: https://evme.atlassian.net/browse/EVME-3977
   */

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

  const [dialogDeliveryAddress, setDialogDeliveryAddress] = useState<DataState['deliveryAddress']>(
    defaultState.deliveryAddress
  )

  const { data: availableCarsResponse, isFetching } = useQuery(
    ['available-cars', deliveryDate],
    () =>
      getAvailableListBFF({
        filter: {
          startDate: deliveryDate?.format(DEFAULT_DATE_FORMAT_BFF),
          endDate: dayjs(bookingDetailProps?.maxEndDate).format(DEFAULT_DATE_FORMAT_BFF),
          isSkuNotNull: true,
          resellerServiceAreaId: bookingDetailProps?.bookingDetail?.car?.resellerServiceArea?.id,
        },
        size: 10000,
      } as CarAvailableListBffFilterRequestProps),
    { refetchOnWindowFocus: false }
  )
  const availableCars =
    availableCarsResponse?.data.records.filter(
      (car) => car.availabilityStatus.toLocaleLowerCase() === 'available'
    ) || []

  const availableCarsSelect = availableCars?.map((availableCar) => {
    return {
      value: availableCar.car.id,
      label: availableCar.car.plateNumber,
    }
  })

  const selectedCar = availableCars?.find(({ car: { id } }) => id === carId)
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
      text: t('booking.carReplacement.title'),
      link: `/booking/${bookingId}/${bookingDetailId}/car-replacement`,
    },
  ]

  const handleDeliveryDateChange = (date: MaterialUiPickersDate | Dayjs) => {
    if (date) {
      setCarId(() => defaultState.carId)
      setDeliveryDate(() => date)
    }
  }
  const handleDeliveryTimeChange = (event: SelectChangeEvent<string>) => {
    setDeliveryTime(() => event.target.value as string)
  }
  const handleDeliveryAddressRemarkChanged = (
    e: React.ChangeEvent<{ name?: string; value: string | undefined }>
  ) => {
    setDeliveryAddress((prevState) => ({
      ...prevState,
      remark: e.target.value,
    }))
  }

  const handleMarkerChanged = async (e: google.maps.MapMouseEvent) => {
    const { lat, lng } = e.latLng.toJSON()
    const location = await Geocode.fromLatLng(String(lat), String(lng))
    const fullAddress = location?.results[0]?.formatted_address || '-'
    setDialogDeliveryAddress((prevState) => ({
      ...prevState,
      full: fullAddress,
      latitude: lat,
      longitude: lng,
    }))
  }
  const handleSubmitMarkerChange = () => {
    setDeliveryAddress((prevState) => ({
      ...prevState,
      full: dialogDeliveryAddress.full,
      latitude: dialogDeliveryAddress.latitude,
      longitude: dialogDeliveryAddress.longitude,
    }))
    setPickupReplaceDialogOpen(() => false)
  }

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
            history.push({
              pathname: `/booking/${bookingId}/${bookingDetailId}`,
            })
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
  const [selectedPlateNumber, setSelectedPlateNumber] = useState<SelectOption | null>()
  const defaultSelectPlateNumber = {
    label: '',
    value: '',
  }
  const onSetSelectedLocation = (option: SelectOption | null) => {
    if (option) {
      setSelectedPlateNumber(option)
      setCarId(option.value)
    } else {
      setCarId('')
      setSelectedPlateNumber(defaultSelectPlateNumber)
    }
  }
  const deliveryMarkerAddress = {
    lat: deliveryAddress.latitude,
    lng: deliveryAddress.longitude,
  }
  const isDisableToSave =
    !carId ||
    !deliveryDate ||
    !deliveryTime ||
    !deliveryAddress.full ||
    !deliveryAddress.latitude ||
    !deliveryAddress.longitude

  const isDisableToSaveMarkerDialog =
    !dialogDeliveryAddress.full ||
    !dialogDeliveryAddress.latitude ||
    !dialogDeliveryAddress.longitude
  return (
    <Page>
      <PageTitle title={t('booking.carReplacement.title')} breadcrumbs={breadcrumbs} />
      <Wrapper>
        <ContentSection>
          {isUpCommingCancelled ? (
            <Alert severity="warning">
              This booking is upcoming_cancelled and does not have any agreement right now.
            </Alert>
          ) : (
            ''
          )}
          <Typography variant="h6" component="h2" className={classes.marginBottomText}>
            {t('booking.carReplacement.title')}
          </Typography>

          {/* Delivery Date, Delivery Time, and Return Date */}
          <Grid container spacing={3}>
            <Grid item xs={12} sm={3} className={classes.datePickerFromTo}>
              <DatePicker
                className={classes.autoCompleteSelect}
                fullWidth
                inputVariant="outlined"
                label={t('booking.carReplacement.deliveryDate')}
                id="car_replacement__deliveryDate"
                name="selectedFromDate"
                format={DEFAULT_DATE_FORMAT_MONTH_TEXT}
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
                  className={classes.autoCompleteSelect}
                  label={t('booking.carReplacement.deliveryTime')}
                  labelId="car_replacement__deliveryTime_label"
                  id="car_replacement__deliveryTime"
                  value={deliveryTime}
                  onChange={handleDeliveryTimeChange}
                >
                  <MenuItem value="09:00">09.00 - 11.00</MenuItem>
                  <MenuItem value="11:00">11.00 - 13.00</MenuItem>
                  <MenuItem value="13:00">13.00 - 15.00</MenuItem>
                  <MenuItem value="15:00">15.00 - 17.00</MenuItem>
                  {bookingDetail?.isSelfPickUp ? (
                    <MenuItem value="17:00">17:00 - 18:00</MenuItem>
                  ) : (
                    ''
                  )}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                className={classes.bgColour}
                id="car_replacement__returnDate"
                label={t('booking.carReplacement.returnDate')}
                fullWidth
                margin="normal"
                variant="outlined"
                value={
                  bookingDetail?.endDate
                    ? dayjs(bookingDetail?.endDate).format(DEFAULT_DATETIME_FORMAT_MONTH_TEXT)
                    : '-'
                }
              />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                id="car_replacement__deliveryAddress"
                label={t('booking.carReplacement.deliveryAddress')}
                fullWidth
                margin="normal"
                variant="outlined"
                value={deliveryAddress.full}
                onClick={() => setPickupReplaceDialogOpen(() => true)}
                maxRows={2}
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <IconButton>
                      <ArrowRightIcon />
                    </IconButton>
                  ),
                }}
                disabled={isSelfPickUpAndReturnBooking}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                className={classes.bgColour}
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
                minRows={2}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                className={classes.autoCompleteSelect}
                id="car_replacement__deliveryAddressRemark"
                label={t('booking.carReplacement.deliveryAddressRemark')}
                fullWidth
                margin="normal"
                variant="outlined"
                value={deliveryAddress?.remark ? deliveryAddress.remark : 'No Data'}
                onChange={handleDeliveryAddressRemarkChanged}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                className={classes.bgColour}
                id="car_replacement__returnAddressRemark"
                label={t('booking.carReplacement.returnAddressRemark')}
                fullWidth
                margin="normal"
                variant="outlined"
                value={
                  carActivity?.returnTask?.remark ? carActivity.returnTask.remark.trim() : 'No Data'
                }
                multiline
                minRows={1}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                id="car_replacement__remark"
                label={t('booking.carDetail.remark')}
                fullWidth
                margin="normal"
                variant="outlined"
                value={bookingDetail?.remark}
              />
            </Grid>
          </Grid>
        </ContentSection>
      </Wrapper>
      <Wrapper>
        <ContentSection>
          <Typography variant="h6" component="h2" className={classes.marginBottomText}>
            {t('booking.carDetail.titleCar')}
          </Typography>

          {/* Delivery Date, Delivery Time, and Return Date */}
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined" margin="normal">
                <Autocomplete
                  classes={{ listbox: classes.listbox }}
                  autoHighlight
                  id="car_replacement__plateNumber"
                  disabled={isFetching}
                  options={availableCarsSelect || []}
                  getOptionLabel={(option) => option.label}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={t('booking.carReplacement.plateNumber')}
                      variant="outlined"
                    />
                  )}
                  value={selectedPlateNumber || defaultSelectPlateNumber}
                  defaultValue={selectedPlateNumber || defaultSelectPlateNumber}
                  onChange={(_event, value) => onSetSelectedLocation(value)}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                className={classes.autoCompleteSelect}
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
                className={classes.autoCompleteSelect}
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
                className={classes.autoCompleteSelect}
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
          {/* Color  */}
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                className={classes.autoCompleteSelect}
                id="car_replacement__carColor"
                label={t('booking.carDetail.color')}
                fullWidth
                margin="normal"
                variant="outlined"
                value={selectedCar?.car?.carSku?.color || '-'}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
          </Grid>
        </ContentSection>
      </Wrapper>
      <MarginActionButtons>
        <Button
          onClick={() => setConfirmReplaceDialogOpen(() => true)}
          color="primary"
          variant="contained"
          disabled={isDisableToSave}
        >
          {t('booking.carReplacement.button.save')}
        </Button>
        <Button
          className={classes.mgBtnLeft}
          onClick={() =>
            history.push({
              pathname: `/booking/${bookingId}/${bookingDetailId}`,
            })
          }
          variant="outlined"
        >
          {t('booking.carReplacement.button.cancel')}
        </Button>
      </MarginActionButtons>
      <ConfirmDialog
        open={confirmReplaceDialogOpen}
        title={t('booking.carReplacement.saveConfirmation.title')}
        htmlContent={t('booking.carReplacement.saveConfirmation.description', {
          bookingDetailId,
          editorEmail,
        })}
        confirmText={t('booking.carReplacement.button.save')}
        cancelText={t('booking.carReplacement.button.cancel')}
        onConfirm={() => handleFormSubmit()}
        onCancel={() => setConfirmReplaceDialogOpen(() => false)}
      />
      <Dialog
        open={pickupReplaceDialogOpen}
        fullWidth
        maxWidth="md"
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          {t('booking.carReplacement.deliveryAddress')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <MapDetailWrapper>
              <LoadScript googleMapsApiKey={config.googleMapsApiKey}>
                {isSelfPickUpAndReturnBooking ? (
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
            </MapDetailWrapper>
            <MapDetailWrapper>
              <TextField
                className={classes.autoCompleteSelect}
                id="car_replacement__deliveryAddressDialog"
                label={t('booking.carReplacement.deliveryAddressOld')}
                fullWidth
                margin="normal"
                variant="outlined"
                value={dialogDeliveryAddress.full || '-'}
                multiline
                minRows={2}
                InputProps={{
                  readOnly: true,
                }}
                disabled={isSelfPickUpAndReturnBooking}
              />
            </MapDetailWrapper>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            disabled={isDisableToSaveMarkerDialog}
            onClick={handleSubmitMarkerChange}
            color="primary"
            variant="contained"
            aria-label="confirm"
          >
            {t('booking.carReplacement.button.save')}
          </Button>
          <Button
            onClick={() => setPickupReplaceDialogOpen(() => false)}
            color="primary"
            variant="outlined"
            aria-label="cancel"
          >
            {t('booking.carReplacement.button.cancel')}
          </Button>
        </DialogActions>
      </Dialog>
    </Page>
  )
}
