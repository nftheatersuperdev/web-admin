import { useState } from 'react'
import {
  Select,
  Grid,
  MenuItem,
  FormControl,
  TextField,
  Input,
  InputLabel,
  InputAdornment,
  Dialog,
  Chip,
  DialogActions,
  DialogTitle,
  DialogContent,
  Button,
} from '@material-ui/core'

const CAR_MODELS = ['Tesla', 'MG', 'BMW']

interface SubscriptionProps {
  open: boolean
  onClose: () => void
}

export default function PackageCreateDialog({ open, onClose }: SubscriptionProps): JSX.Element {
  const [selectedCarModels, setSelectedCarModels] = useState<string[]>([])

  const handleCarModelsChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedCarModels(event.target.value as string[])
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Create New Package</DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Package name"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth={true}>
              <InputLabel id="car-model">Car Model IDs</InputLabel>
              <Select
                multiple
                labelId="car-model"
                onChange={handleCarModelsChange}
                input={<Input />}
                value={selectedCarModels}
                renderValue={(selected) => (
                  <div>
                    {(selected as string[]).map((car) => (
                      <Chip key={car} label={car} />
                    ))}
                  </div>
                )}
              >
                {CAR_MODELS.map((car) => (
                  <MenuItem key={car} value={car}>
                    {car}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid container item xs={12} spacing={3}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Price per 1 week"
                InputProps={{
                  startAdornment: <InputAdornment position="start">฿</InputAdornment>,
                }}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Price per 1 month"
                InputProps={{
                  startAdornment: <InputAdornment position="start">฿</InputAdornment>,
                }}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Price per 3 months"
                InputProps={{
                  startAdornment: <InputAdornment position="start">฿</InputAdornment>,
                }}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Price per 6 months"
                InputProps={{
                  startAdornment: <InputAdornment position="start">฿</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Price per 9 months"
                InputProps={{
                  startAdornment: <InputAdornment position="start">฿</InputAdornment>,
                }}
              />
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={onClose} color="primary" variant="contained">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  )
}
