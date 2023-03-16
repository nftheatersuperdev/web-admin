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
import Map from 'components/Map'

const MarginActionButtons = styled.div`
  margin: 10px 15px;
`

export interface CarDetailDialogProps {
  open: boolean
  car: any
  onClose: () => void
  // onSubmitSend: (emails: string[]) => void
}

export default function CarDetailDialog({ open, car, onClose }: CarDetailDialogProps): JSX.Element {
  const { t } = useTranslation()
  if (!open) {
    return <Fragment />
  }
  console.log('car ->', car)

  function handleClose() {
    onClose()
  }

  const lat = 13.736717
  const lng = 100.523186

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
      fullWidth={true}
      maxWidth="md"
    >
      <DialogTitle id="form-dialog-title">Car Detail</DialogTitle>
      <DialogContent>
        {/* Delivery Date, and Return Date */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              id="car_detail__deliveryDate"
              label="Delivery Date"
              fullWidth
              margin="normal"
              variant="outlined"
              value="27/07/2022 15:37"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="car_detail__returnDate"
              label="Return Date"
              fullWidth
              margin="normal"
              variant="outlined"
              value="27/07/2022 15:37"
            />
          </Grid>
        </Grid>

        {/* Plate Number and VIN */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              id="car_detail__plateNumber"
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
              value="3กข 8102"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="car_detail__vin"
              label="VIN"
              fullWidth
              margin="normal"
              InputProps={{
                readOnly: true,
              }}
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              value="LRW1921913P2929"
            />
          </Grid>
        </Grid>

        {/* Brand and Model */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              id="car_detail__brand"
              label="Brand"
              fullWidth
              margin="normal"
              InputProps={{
                readOnly: true,
              }}
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              value="Tesla"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="car_detail__model"
              label="Model"
              fullWidth
              margin="normal"
              InputProps={{
                readOnly: true,
              }}
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              value="Model 3 - Long Range"
            />
          </Grid>
        </Grid>

        {/* Seat */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              id="car_detail__seat"
              label="Seat"
              fullWidth
              margin="normal"
              InputProps={{
                readOnly: true,
              }}
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              value="5"
            />
          </Grid>
        </Grid>

        {/* Delivery Address and Return Address */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              id="car_detail__deliveryAddress"
              label="Delivery Address"
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
              value="Thanon Ratchawithi Thanon Phaya Thai Ratchathewi Bangkok Thailand 10400"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="car_detail__returnAddress"
              label="Return Address"
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
              value="Thanon Ratchawithi Thanon Phaya Thai Ratchathewi Bangkok Thailand 10400"
            />
          </Grid>
        </Grid>

        {/* Delivery Address Remark and Return Address Remark */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              id="car_detail__deliveryAddressRemark"
              label="Delivery Address Remark"
              fullWidth
              margin="normal"
              InputProps={{
                readOnly: true,
              }}
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              value="No data"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="car_detail__returnAddressRemark"
              label="Return Address Remark"
              fullWidth
              margin="normal"
              InputProps={{
                readOnly: true,
              }}
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              value="No data"
            />
          </Grid>
        </Grid>

        {/* Delivery Address Map */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" component="h3">
              Delivery Address
            </Typography>
            <Map id="delivery-address" lat={lat} lng={lng} />
          </Grid>
        </Grid>

        {/* Return Address Map */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" component="h3">
              Return Address
            </Typography>
            <Map id="return-address" lat={lat} lng={lng} />
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
