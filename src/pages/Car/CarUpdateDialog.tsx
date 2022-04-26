import {
  Grid,
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
import { CarUpdateInput } from 'services/web-bff/car.type'
import CarStatusSelect from 'components/CarStatusSelect'

const validationSchema = yup.object({
  vin: yup.string().required('Field is required'),
  plateNumber: yup.string().required('Field is required'),
  status: yup.string().required('Field is required'),
})

export interface CarInfo {
  vin: string
  plateNumber: string
  color: string
  status: string
}

interface CarUpdateDialogProps {
  open: boolean
  onClose: (newCarData: CarUpdateInput | null) => void
  carInfo: CarInfo
}

export default function CarUpdateDialog({
  open,
  onClose,
  carInfo,
}: CarUpdateDialogProps): JSX.Element {
  const {
    vin: originalVin,
    plateNumber: originalPlateNumber,
    color: originalColor,
    status: originalStatus,
  } = carInfo
  const { t } = useTranslation()

  const formik = useFormik({
    validationSchema,
    initialValues: {
      vin: originalVin,
      plateNumber: originalPlateNumber,
      status: originalStatus,
      color: originalColor,
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      onClose({
        vin: values.vin,
        plateNumber: values.plateNumber,
        status: values.status,
      })
      formik.resetForm()
    },
  })

  const onFormCloseHandler = () => {
    onClose(null)
    formik.resetForm()
  }

  const isHasNoChanged =
    originalVin === formik.values.vin &&
    originalPlateNumber === formik.values.plateNumber &&
    originalStatus === formik.values.status

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
              id="color"
              name="color"
              value={formik.values.color}
              onChange={formik.handleChange}
              InputLabelProps={{
                shrink: true,
              }}
              error={formik.touched.color && Boolean(formik.errors.color)}
              helperText={formik.touched.color && formik.errors.color}
              disabled
            />
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
        <Button
          onClick={() => formik.handleSubmit()}
          color="primary"
          variant="contained"
          disabled={isHasNoChanged}
        >
          {t('button.update')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
