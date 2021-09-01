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
import { useTranslation } from 'react-i18next'
import { CarModelItem } from 'types'
import { CarInput } from 'services/evme.types'
import CarStatusSelect from 'components/CarStatusSelect'

const validationSchema = yup.object({
  vin: yup.string().required('Field is required'),
  plateNumber: yup.string().required('Field is required'),
  carColor: yup.string().required('Field is required'),
  carModel: yup.string().required('Field is required'),
})

export interface CarInfo {
  vin: string
  plateNumber: string
  carModelId: string
  color: string
  colorHex: string
  status: string
}

interface CarUpdateDialogProps {
  open: boolean
  onClose: (newCarData: CarInput | null) => void
  carModelOptions: CarModelItem[]
  carInfo: CarInfo
}

export default function CarUpdateDialog({
  open,
  onClose,
  carModelOptions,
  carInfo,
}: CarUpdateDialogProps): JSX.Element {
  /**
   * @DESCRIPTION The variable here is because our business doesn't need anyone to add or update a car in the MVP phase.
   */
  const forceDisableFields = true

  const {
    vin: originalVin,
    plateNumber: originalPlate,
    carModelId: originalModelId,
    color: originalColor,
    colorHex: originalColorHex,
    status: originalStatus,
  } = carInfo

  const { t } = useTranslation()

  const formik = useFormik({
    validationSchema,
    initialValues: {
      vin: originalVin,
      plateNumber: originalPlate,
      carColor: originalColor,
      carModel: originalModelId,
      carColorHex: originalColorHex,
      status: originalStatus,
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      onClose({
        vin: values.vin,
        carModelId: values.carModel,
        plateNumber: values.plateNumber,
        color: values.carColor,
        colorHex: values.carColorHex,
        status: values.status,
      })
      formik.resetForm()
    },
  })

  const _selectedCarModel = carModelOptions.find((model: CarModelItem) => {
    return model.id === originalModelId
  })

  const onFormCloseHandler = () => {
    onClose(null)
    formik.resetForm()
  }

  return (
    <Dialog open={open} fullWidth aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">{t('car.updateDialog.title')}</DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label={t('car.vin')}
              id="vin"
              name="vin"
              value={formik.values.vin}
              onChange={formik.handleChange}
              InputLabelProps={{
                shrink: true,
              }}
              error={formik.touched.vin && Boolean(formik.errors.vin)}
              helperText={formik.touched.vin && formik.errors.vin}
              disabled={forceDisableFields}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label={t('car.plateNumber')}
              id="plateNumber"
              name="plateNumber"
              value={formik.values.plateNumber}
              onChange={formik.handleChange}
              InputLabelProps={{
                shrink: true,
              }}
              error={formik.touched.plateNumber && Boolean(formik.errors.plateNumber)}
              helperText={formik.touched.plateNumber && formik.errors.plateNumber}
              disabled={forceDisableFields}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label={t('car.color')}
              id="carColor"
              name="carColor"
              value={formik.values.carColor}
              onChange={formik.handleChange}
              InputLabelProps={{
                shrink: true,
              }}
              error={formik.touched.carColor && Boolean(formik.errors.carColor)}
              helperText={formik.touched.carColor && formik.errors.carColor}
              disabled={forceDisableFields}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label={t('car.colorHex')}
              id="carColorHex"
              name="carColorHex"
              value={formik.values.carColorHex}
              onChange={formik.handleChange}
              InputLabelProps={{
                shrink: true,
              }}
              error={formik.touched.carColorHex && Boolean(formik.errors.carColorHex)}
              helperText={formik.touched.carColorHex && formik.errors.carColorHex}
              disabled={forceDisableFields}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth={true}>
              <TextField
                fullWidth
                select
                label={t('car.model')}
                id="carModel"
                name="carModel"
                defaultValue={_selectedCarModel}
                value={formik.values.carModel}
                onChange={formik.handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
                error={formik.touched.carModel && Boolean(formik.errors.carModel)}
                helperText={formik.touched.carModel && formik.errors.carModel}
                disabled={forceDisableFields}
              >
                {carModelOptions.map((model) => (
                  <MenuItem key={model.id} value={model.id}>
                    {model.modelName}
                  </MenuItem>
                ))}
              </TextField>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <CarStatusSelect status={formik.values.status} onChange={formik.handleChange} />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onFormCloseHandler} color="primary">
          {t('button.cancel')}
        </Button>
        <Button onClick={() => formik.handleSubmit()} color="primary" variant="contained">
          {t('button.update')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
