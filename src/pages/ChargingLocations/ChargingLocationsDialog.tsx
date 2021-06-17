import {
  Grid,
  Typography,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Button,
} from '@material-ui/core'
import { ChargingLocation } from 'services/evme.types'

interface ChargingLocationsDialogProps {
  open: boolean
  onClose: () => void
  location: Partial<ChargingLocation>
}

export default function ChargingLocationsDialog(props: ChargingLocationsDialogProps): JSX.Element {
  const { open, onClose, location } = props
  return (
    <Dialog open={open} fullWidth aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">{location.name}</DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="body1">
              <strong>Provider: </strong>
              {location.provider}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1">
              <strong>Address: </strong>
              {location.address}
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}
