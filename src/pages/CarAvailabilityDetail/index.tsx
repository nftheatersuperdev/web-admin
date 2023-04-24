import { useState } from 'react'
import { Card, Grid, TextField, Typography } from '@material-ui/core'
import { useLocation } from 'react-router-dom'
import { DEFAULT_DATETIME_FORMAT_MONTH_TEXT } from 'utils'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { makeStyles } from '@mui/styles'
import DateTimePicker from 'components/DateTimePicker'
import { Page } from 'layout/LayoutRoute'
import PageTitle, { PageBreadcrumbs } from 'components/PageTitle'

const Wrapper = styled(Card)`
  padding: 15px;
  margin-top: 20px;
`
const ContentSection = styled.div`
  margin-bottom: 20px;
`
interface CarAvailabilityDetailParams {
  id: string
  status: string
  carTrackId: string
  plateNumber: string
  vin: string
  brand: string
  model: string
  color: string
  updatedDate: string
  createdDate: string
  subscriptionId: string
  location: string
  owner: string
  reSeller: string
}
const useStyles = makeStyles(() => ({
  hideButton: {
    '& .MuiIconButton-root': { display: 'none' },
    backgroundColor: '#F5F5F5',
  },
  bgColour: {
    backgroundColor: '#F5F5F5',
  },
}))
export default function CarAvailabilityDetail(): JSX.Element {
  const location = useLocation()
  const classes = useStyles()
  const CarAvailabilityDetail = location.state as CarAvailabilityDetailParams
  const { t } = useTranslation()
  const [, setText] = useState<string | undefined>()
  const breadcrumbs: PageBreadcrumbs[] = [
    {
      text: t('sidebar.carManagement.title'),
      link: '/',
    },
    {
      text: t('sidebar.carManagement.carAvailability'),
      link: '/car-availability',
    },
    {
      text: t('sidebar.carManagement.carAvailabilityDetail'),
      link: '/car-availability/5454',
    },
  ]

  return (
    <Page>
      <PageTitle title={t('sidebar.carAvailabilityDetail')} breadcrumbs={breadcrumbs} />
      <Wrapper>
        <ContentSection>
          <Typography variant="body1" component="h2">
            {t('sidebar.carAvailabilityDetail')}
          </Typography>

          {/* Car Id and Car Status */}
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                className={classes.bgColour}
                id="car_availability_detail__carId"
                label={t('carAvailabilityDetail.carId')}
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                value={CarAvailabilityDetail.id}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                className={classes.bgColour}
                id="car_availability_detail__carStatus"
                label={t('carAvailabilityDetail.carStatus')}
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                value={CarAvailabilityDetail.status}
              />
            </Grid>
          </Grid>

          {/* Cartrack Id And Location Service*/}
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                className={classes.bgColour}
                id="car_availability_detail__carTrackId"
                label={t('carAvailabilityDetail.carTrackId')}
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                value={CarAvailabilityDetail.carTrackId}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                className={classes.bgColour}
                id="car_availability_detail__location"
                label={t('carAvailabilityDetail.location')}
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                value={CarAvailabilityDetail.location}
              />
            </Grid>
          </Grid>

          {/* Plate Number and Vin */}
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                className={classes.bgColour}
                id="car_availability_detail__plateNumber"
                label={t('carAvailabilityDetail.plateNumber')}
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                value={CarAvailabilityDetail.plateNumber}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                className={classes.bgColour}
                id="car_availability_detail__vin"
                label={t('carAvailabilityDetail.vin')}
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                value={CarAvailabilityDetail.vin}
              />
            </Grid>
          </Grid>

          {/* Car Brand and Car Model */}
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                className={classes.bgColour}
                id="car_availability_detail__carBrand"
                label={t('carAvailabilityDetail.carBrand')}
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                value={CarAvailabilityDetail.brand}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                className={classes.bgColour}
                id="car_availability_detail__carModel"
                label={t('carAvailabilityDetail.carModel')}
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                value={CarAvailabilityDetail.model}
              />
            </Grid>
          </Grid>

          {/* Color */}
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                className={classes.bgColour}
                id="car_availability_detail__color"
                label={t('carAvailabilityDetail.color')}
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                value={CarAvailabilityDetail.color}
              />
            </Grid>
          </Grid>

          {/* Created Date and Update Date */}
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <DateTimePicker
                fullWidth
                className={classes.hideButton}
                label={t('carAvailabilityDetail.createdDate')}
                id="car_availability_detail__createdDate"
                name="createdDate"
                format={DEFAULT_DATETIME_FORMAT_MONTH_TEXT}
                value={CarAvailabilityDetail.createdDate}
                onChange={() => {
                  setText('')
                }}
                inputVariant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DateTimePicker
                fullWidth
                className={classes.hideButton}
                label={t('carAvailabilityDetail.updatedDate')}
                id="car_availability_detail__updateDate"
                name="updateDate"
                format={DEFAULT_DATETIME_FORMAT_MONTH_TEXT}
                value={CarAvailabilityDetail.updatedDate}
                onChange={() => {
                  setText('')
                }}
                inputVariant="outlined"
              />
            </Grid>
          </Grid>

          {/* Booking ID */}
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                className={classes.bgColour}
                id="car_availability_detail__bookingId"
                label={t('carAvailabilityDetail.bookingId')}
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                value={CarAvailabilityDetail.subscriptionId}
              />
            </Grid>
          </Grid>
          {/* Owner And ReSeller */}
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                className={classes.bgColour}
                id="car_availability_detail__owner"
                label={t('carAvailabilityDetail.owner')}
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                value={CarAvailabilityDetail.owner}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                className={classes.bgColour}
                id="car_availability_detail__reseller"
                label={t('carAvailabilityDetail.reSeller')}
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                value={CarAvailabilityDetail.reSeller}
              />
            </Grid>
          </Grid>
        </ContentSection>
      </Wrapper>
    </Page>
  )
}
