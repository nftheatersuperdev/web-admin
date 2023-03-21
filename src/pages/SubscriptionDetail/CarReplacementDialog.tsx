/* eslint-disable react/jsx-no-useless-fragment */
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Grid,
  TextField,
} from '@material-ui/core'
import { Fragment } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

const MarginActionButtons = styled.div`
  margin: 10px 15px;
`

export interface CarReplacementDialogProps {
  open: boolean
  onClose: () => void
  // onSubmitSend: (emails: string[]) => void
}

export default function CarReplacementDialog({
  open,
  onClose,
}: CarReplacementDialogProps): JSX.Element {
  const { t } = useTranslation()
  if (!open) {
    return <Fragment />
  }

  function handleClose() {
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
      fullWidth={true}
      maxWidth="lg"
    >
      <DialogTitle id="form-dialog-title">Car Replacement</DialogTitle>
      <DialogContent>
        <DialogContentText>Here is the content text</DialogContentText>

        {/* Start Date, End Date, and Return Date */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={3}>
            <TextField
              id="car_replacement__startDate"
              label="Start Date"
              fullWidth
              margin="normal"
              variant="outlined"
              value="27/07/2022 15:37"
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              id="car_replacement__endDate"
              label="End Date"
              fullWidth
              margin="normal"
              variant="outlined"
              value="27/07/2022 15:37"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="car_replacement__returnDate"
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
              id="car_replacement__startDate"
              label="Start Date"
              fullWidth
              margin="normal"
              variant="outlined"
              value="27/07/2022 15:37"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              id="car_replacement__VIN"
              label="VIN"
              fullWidth
              margin="normal"
              variant="outlined"
              value="27/07/2022 15:37"
            />
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
