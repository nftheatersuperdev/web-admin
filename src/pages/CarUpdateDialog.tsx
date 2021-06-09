import {
  Grid,
  MenuItem,
  FormControl,
  TextField,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Button,
} from '@material-ui/core'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { ICarModelItem } from 'helper/car.helper'
import { CarInput } from 'services/evme.types'

const validationSchema = yup.object({
  vin: yup.string().required('Field is required'),
  plateNumber: yup.string().required('Field is required'),
  carColor: yup.string().required('Field is required'),
  carModel: yup.string().required('Field is required'),
})

export interface ICarInfo {
  vin: string
  plateNumber: string
  carModelId: string
  color: string
}

interface SubscriptionProps {
  open: boolean
  onClose: (newCarData: CarInput | null) => void
  carModelOptions: ICarModelItem[]
  carInfo: ICarInfo
}

export default function CarUpdateDialog({
  open,
  onClose,
  carModelOptions,
  carInfo,
}: SubscriptionProps): JSX.Element {
  const {
    vin: originalVin,
    plateNumber: originalPlate,
    carModelId: originalModelId,
    color: originalColor,
  } = carInfo

  const formik = useFormik({
    validationSchema,
    initialValues: {
      vin: originalVin,
      plateNumber: originalPlate,
      carColor: originalColor,
      carModel: originalModelId,
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      onClose({
        vin: values.vin,
        carModelId: values.carModel,
        plateNumber: values.plateNumber,
        color: values.carColor,
      })
      formik.resetForm()
    },
  })

  const _selectedCarModel = carModelOptions.find((model: ICarModelItem) => {
    return model.id === originalModelId
  })

  const onFormCloseHandler = () => {
    onClose(null)
    formik.resetForm()
  }

  return (
    <Dialog open={open} fullWidth aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Update Car</DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="VIN"
              id="vin"
              name="vin"
              value={formik.values.vin}
              onChange={formik.handleChange}
              InputLabelProps={{
                shrink: true,
              }}
              error={formik.touched.vin && Boolean(formik.errors.vin)}
              helperText={formik.touched.vin && formik.errors.vin}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Plate Number"
              id="plateNumber"
              name="plateNumber"
              value={formik.values.plateNumber}
              onChange={formik.handleChange}
              InputLabelProps={{
                shrink: true,
              }}
              error={formik.touched.plateNumber && Boolean(formik.errors.plateNumber)}
              helperText={formik.touched.plateNumber && formik.errors.plateNumber}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Color"
              id="carColor"
              name="carColor"
              value={formik.values.carColor}
              onChange={formik.handleChange}
              InputLabelProps={{
                shrink: true,
              }}
              error={formik.touched.carColor && Boolean(formik.errors.carColor)}
              helperText={formik.touched.carColor && formik.errors.carColor}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth={true}>
              <TextField
                fullWidth
                select
                label="Car Model"
                id="carModel"
                name="carModel"
                defaultValue={_selectedCarModel}
                value={formik.values.carModel}
                onChange={formik.handleChange}
                error={formik.touched.carModel && Boolean(formik.errors.carModel)}
                helperText={formik.touched.carModel && formik.errors.carModel}
              >
                {carModelOptions.map((model) => (
                  <MenuItem key={model.id} value={model.id}>
                    {model.modelName}
                  </MenuItem>
                ))}
              </TextField>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onFormCloseHandler} color="primary">
          Cancel
        </Button>
        <Button onClick={() => formik.handleSubmit()} color="primary" variant="contained">
          Update
        </Button>
      </DialogActions>
    </Dialog>
  )
}
