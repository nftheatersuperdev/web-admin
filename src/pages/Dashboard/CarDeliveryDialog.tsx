import {
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Button,
  TextField,
  Grid,
} from '@material-ui/core'
import { GoogleMap, useJsApiLoader, InfoWindow } from '@react-google-maps/api'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import config from 'config'
import { DEFAULT_DATETIME_FORMAT } from 'utils'
import styled from 'styled-components'
import { columnFormatSubEventStatus } from 'pages/Subscriptions/utils'
import { DeliveryModelData, MISSING_VALUE } from './utils'

const MapWrapper = styled.div`
  display: flex;
  flex: 1 1 100%;
  height: 500px;

  #map-car-delivery {
    flex: 1 1 auto;
  }
`

interface ModalProps {
  open: boolean
  onClose: () => void
  modelData?: DeliveryModelData
}

export default function CarDeliveryDialog({ open, onClose, modelData }: ModalProps): JSX.Element {
  const { t } = useTranslation()
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: config.googleMapsApiKey,
  })

  const nameDisplay =
    modelData?.user?.firstName || modelData?.user?.lastName
      ? `${modelData?.user?.firstName} ${modelData?.user?.lastName}`
      : MISSING_VALUE

  const deliveryDate = dayjs(modelData?.startDate).isValid()
    ? dayjs(modelData?.startDate).format(DEFAULT_DATETIME_FORMAT)
    : MISSING_VALUE

  const { latitude: lat = 0, longitude: lng = 0, address } = modelData || {}

  return (
    <Dialog open={open} fullWidth aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">{t('dashboard.carDelivery.dialogTitle')}</DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
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

          <Grid item xs={12} md={6}>
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

          <Grid item xs={12} md={6}>
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

          <Grid item xs={12} md={6}>
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

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label={t('subscription.status.title')}
              id="status"
              name="status"
              value={columnFormatSubEventStatus(modelData?.status || '', t)}
              InputProps={{
                readOnly: true,
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
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

          <Grid item xs={12} md={12}>
            <MapWrapper>
              {isLoaded ? (
                <GoogleMap id="map-car-delivery" center={{ lat, lng }} zoom={15}>
                  <InfoWindow position={{ lat, lng }}>
                    <h4>{address}</h4>
                  </InfoWindow>
                </GoogleMap>
              ) : null}
            </MapWrapper>
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
