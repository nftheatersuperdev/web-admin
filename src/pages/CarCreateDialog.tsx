import React, { useState } from 'react'
import {
  Select,
  Grid,
  MenuItem,
  FormControl,
  TextField,
  InputLabel,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Button,
} from '@material-ui/core'
import { ICarModelItem } from 'helper/car.helper'
import { CarInput } from 'services/evme.types'

interface SubscriptionProps {
  open: boolean
  onClose: (newCarData: CarInput | null) => void
  carModelOptions: ICarModelItem[]
}

export default function CarCreateDialog({
  open,
  onClose,
  carModelOptions,
}: SubscriptionProps): JSX.Element {
  const [carModelId, setCarModelId] = useState<string>('')
  const [vin, setVin] = useState<string>('')
  const [plateNumber, setPlateNumber] = useState<string>('')

  const handleVinChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setVin(event.target.value as string)
  }

  const handlePlateNumberChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setPlateNumber(event.target.value as string)
  }

  const selectCarModel = (event: React.ChangeEvent<{ value: unknown }>) => {
    setCarModelId(event.target.value as string)
  }

  const handleCreateCar = () => {
    onClose({
      vin,
      carModelId,
      plateNumber,
    })
  }

  return (
    <Dialog open={open} fullWidth aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Create New Car</DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="VIN"
              value={vin}
              onChange={handleVinChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Plate Number"
              value={plateNumber}
              onChange={handlePlateNumberChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth={true}>
              <InputLabel id="car-model">Car Model</InputLabel>
              <Select labelId="car-model" value={carModelId} onChange={selectCarModel}>
                {carModelOptions.map((model) => (
                  <MenuItem key={model.id} value={model.id}>
                    {model.modelName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(null)} color="primary">
          Cancel
        </Button>
        <Button onClick={handleCreateCar} color="primary" variant="contained">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  )
}
