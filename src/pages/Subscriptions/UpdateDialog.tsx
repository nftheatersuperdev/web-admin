import {
  Grid,
  TextField,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  FormControl,
  MenuItem,
  Button,
  Typography,
} from '@material-ui/core'
import { useFormik } from 'formik'
import { useTranslation } from 'react-i18next'
import { functionFormatRawDate } from 'utils'
import * as yup from 'yup'
import { useCarModelById } from 'services/evme'

const validationSchema = yup.object({
  plateNumber: yup.string().required('Field is required'),
})

interface Subscription {
  id: string
  vin: string
  plateNumber: string
  brand: string
  model: string
  modelId: string
  color: string
  price: number
  duration: string
  seats: number
  topSpeed: number
  fastChargeTime: number
  startDate: string
  endDate: string
  createdAt: string
  updatedAt: string
  email: string
  phoneNumber: string
  firstName: string
  lastName: string
  startAddress: string
  endAddress: string
}

interface SubscriptionProps {
  open: boolean
  onClose: () => void
  subscription: Subscription | undefined
}

export default function CarUpdateDialog(props: SubscriptionProps): JSX.Element {
  const { open, onClose, subscription } = props

  // Fetch the available cars with the car model ID and the color of the subscription so that an admin
  // can possibly change the vehicle in this car model category
  const { data: carModel } = useCarModelById({
    carModelId: subscription?.modelId || '',
    carFilter: { color: { eq: subscription?.color } },
    availableFilter: { startDate: subscription?.startDate, endDate: subscription?.endDate },
  })
  const { t } = useTranslation()
  const formik = useFormik({
    validationSchema,
    initialValues: {
      plateNumber: subscription?.plateNumber,
    },
    enableReinitialize: true,
    onSubmit: () => {
      onClose()
      formik.resetForm()
    },
  })

  const onFormCloseHandler = () => {
    onClose()
    formik.resetForm()
  }

  const availablePlateNumbers =
    carModel?.cars?.filter((car) => car.available).map((car) => car.plateNumber) || []

  if (
    !availablePlateNumbers.find((plateNumber) => plateNumber === subscription?.plateNumber) &&
    subscription?.plateNumber
  ) {
    availablePlateNumbers.push(subscription.plateNumber)
  }

  return (
    <Dialog open={open} fullWidth aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">
        {t('subscription.updateSubscriptionDetails')}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="subtitle1">{t('subscription.bookingDetails')}</Typography>
          </Grid>
          <Grid item md={6}>
            <TextField
              label={t('subscription.firstName')}
              value={subscription?.firstName}
              disabled
              fullWidth
            />
          </Grid>
          <Grid item md={6}>
            <TextField
              label={t('subscription.lastName')}
              value={subscription?.lastName}
              disabled
              fullWidth
            />
          </Grid>
          <Grid item md={6}>
            <TextField
              label={t('subscription.email')}
              value={subscription?.email}
              disabled
              fullWidth
            />
          </Grid>
          <Grid item md={6}>
            <TextField
              label={t('subscription.subscriptionId')}
              value={subscription?.id}
              disabled
              fullWidth
            />
          </Grid>
          <Grid item md={6}>
            <TextField
              label={t('subscription.startDate')}
              value={functionFormatRawDate(subscription?.startDate)}
              disabled
              fullWidth
            />
          </Grid>
          <Grid item md={6}>
            <TextField
              label={t('subscription.startAddress')}
              value={subscription?.startAddress}
              disabled
              fullWidth
            />
          </Grid>
          <Grid item md={6}>
            <TextField
              label={t('subscription.endDate')}
              value={functionFormatRawDate(subscription?.endDate)}
              disabled
              fullWidth
            />
          </Grid>
          <Grid item md={6}>
            <TextField
              label={t('subscription.endAddress')}
              value={subscription?.endAddress}
              disabled
              fullWidth
            />
          </Grid>
          <Grid item md={6}>
            <TextField
              label={t('subscription.createdDate')}
              value={functionFormatRawDate(subscription?.createdAt)}
              disabled
              fullWidth
            />
          </Grid>
          <Grid item md={6}>
            <TextField
              label={t('subscription.updatedDate')}
              value={functionFormatRawDate(subscription?.updatedAt)}
              disabled
              fullWidth
            />
          </Grid>
          <Grid item md={6}>
            <TextField
              label={t('subscription.duration')}
              value={subscription?.duration}
              disabled
              fullWidth
            />
          </Grid>
          <Grid item md={6}>
            <TextField
              label={t('subscription.price')}
              value={subscription?.price}
              disabled
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1">{t('subscription.carDetails')}</Typography>
          </Grid>
          <Grid item md={6}>
            <TextField
              label={t('subscription.brand')}
              value={subscription?.brand}
              disabled
              fullWidth
            />
          </Grid>
          <Grid item md={6}>
            <TextField
              label={t('subscription.model')}
              value={subscription?.model}
              disabled
              fullWidth
            />
          </Grid>
          <Grid item md={6}>
            <FormControl fullWidth={true}>
              <TextField
                fullWidth
                select
                label={t('subscription.plateNumber')}
                id="plateNumber"
                name="plateNumber"
                value={formik.values.plateNumber}
                onChange={formik.handleChange}
                error={formik.touched.plateNumber && Boolean(formik.errors.plateNumber)}
                helperText={formik.touched.plateNumber && formik.errors.plateNumber}
              >
                {availablePlateNumbers.map((plateNumber) => (
                  <MenuItem key={plateNumber} value={plateNumber}>
                    {plateNumber}
                  </MenuItem>
                ))}
              </TextField>
            </FormControl>
          </Grid>

          <Grid item md={6}>
            <TextField label={t('subscription.vin')} value={subscription?.vin} disabled fullWidth />
          </Grid>
          <Grid item md={6}>
            <TextField
              label={t('subscription.seats')}
              value={subscription?.seats}
              disabled
              fullWidth
            />
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
