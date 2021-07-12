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

interface SubscriptionProps {
  open: boolean
  onClose: (newCarData: CarInput | null) => void
  carModelOptions: CarModelItem[]
}

const validationSchema = yup.object({
  vin: yup.string().required('Field is required'),
  plateNumber: yup.string().required('Field is required'),
  carColor: yup.string().required('Field is required'),
  carModel: yup.string().required('Field is required'),
})

export default function CarCreateDialog({
  open,
  onClose,
  carModelOptions,
}: SubscriptionProps): JSX.Element {
  const { t } = useTranslation()

  const formik = useFormik({
    validationSchema,
    initialValues: {
      vin: '',
      plateNumber: '',
      carColor: '',
      carModel: '',
      carColorHex: '',
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      onClose({
        vin: values.vin,
        carModelId: values.carModel,
        plateNumber: values.plateNumber,
        color: values.carColor,
        colorHex: values.carColorHex,
      })
      formik.resetForm()
    },
  })

  return (
    <Dialog open={open} fullWidth aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">{t('car.createDialog.title')}</DialogTitle>
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
        <Button
          onClick={() => {
            onClose(null)
            formik.resetForm()
          }}
          color="primary"
        >
          {t('button.cancel')}
        </Button>
        <Button onClick={() => formik.handleSubmit()} color="primary" variant="contained">
          {t('button.create')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
