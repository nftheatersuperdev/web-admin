import {
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Button,
  TextField,
  Grid,
} from '@material-ui/core'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import { DEFAULT_DATE_FORMAT } from 'utils'
import { IDeliveryModelData, MISSING_VALUE } from './utils'

interface ModalProps {
  open: boolean
  onClose: () => void
  modelData?: IDeliveryModelData
}

export default function CarDeliveryDialog({ open, onClose, modelData }: ModalProps): JSX.Element {
  const { t } = useTranslation()

  const nameDisplay =
    modelData?.user?.firstName || modelData?.user?.lastName
      ? `${modelData?.user?.firstName} ${modelData?.user?.lastName}`
      : MISSING_VALUE

  const deliveryDate = dayjs(modelData?.startDate).isValid()
    ? dayjs(modelData?.startDate).format(DEFAULT_DATE_FORMAT)
    : MISSING_VALUE

  return (
    <Dialog open={open} fullWidth aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">{t('dashboard.carDelivery.dialogTitle')}</DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label={t('dashboard.deliveryDate')}
              id="date"
              name="date"
              value={deliveryDate}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label={t('dashboard.userName')}
              id="name"
              name="name"
              value={nameDisplay}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label={t('dashboard.email')}
              id="email"
              name="email"
              value={modelData?.user?.email || MISSING_VALUE}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label={t('dashboard.phone')}
              id="phone"
              name="phone"
              value={modelData?.user?.phoneNumber || MISSING_VALUE}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label={t('dashboard.remark')}
              id="remark"
              name="remark"
              value={modelData?.remark || MISSING_VALUE}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={onClose}>
          {t('button.close')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
