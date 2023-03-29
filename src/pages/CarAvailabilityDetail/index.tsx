import { Card, Grid, TextField, Typography } from '@material-ui/core'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
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
}
export default function CarAvailabilityDetail(): JSX.Element {
  const location = useLocation()
  const CarAvailabilityDetail = location.state as CarAvailabilityDetailParams
  const { t } = useTranslation()

  const breadcrumbs: PageBreadcrumbs[] = [
    {
      text: t('sidebar.carManagement.title'),
      link: '/',
    },
    {
      text: t('sidebar.carAvailability'),
      link: '/car-availability',
    },
    {
      text: t('sidebar.carAvailability') + ' Detail',
      link: '/car-availability/5454',
    },
  ]

  return (
    <Page>
      <PageTitle title="Car Availability Detail" breadcrumbs={breadcrumbs} />
      <Wrapper>
        <ContentSection>
          <Typography variant="h5" component="h2">
            Car Availability Detail
          </Typography>

          {/* Car Id and Car Status */}
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                id="car_availability_detail__carId"
                label="Car Id"
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
                id="car_availability_detail__carStatus"
                label="Car Status"
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

          {/* Cartrack Id */}
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                id="car_availability_detail__cartrackId"
                label="Cartrack Id"
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
          </Grid>

          {/* Plate Number and Vin */}
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                id="car_availability_detail__plateNumber"
                label="Plate Number"
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
                id="car_availability_detail__vin"
                label="Vin"
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
            <Grid item xs={12} sm={3}>
              <TextField
                id="car_availability_detail__carBrand"
                label="Car Brand"
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
            <Grid item xs={12} sm={3}>
              {' '}
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="car_availability_detail__carModel"
                label="Car Model"
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
                id="car_availability_detail__colour"
                label="Color"
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
              <TextField
                id="car_availability_detail__createdDate"
                label="Created Date"
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                value={CarAvailabilityDetail.createdDate}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                id="car_availability_detail__updateDate"
                label="Update Date"
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                value={CarAvailabilityDetail.updatedDate}
              />
            </Grid>
          </Grid>

          {/* Booking ID */}
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                id="car_availability_detail__bookingId"
                label="Booking ID"
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
        </ContentSection>
      </Wrapper>
    </Page>
  )
}
