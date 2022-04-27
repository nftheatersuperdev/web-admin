import styled from 'styled-components'
import {
  Card,
  Checkbox,
  FormGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Grid,
  TextField,
} from '@material-ui/core'
import { useTranslation } from 'react-i18next'
import { CarModelDataAndRefetchProps } from 'pages/ModelAndPricingEdit/types'

const CardSpacing = styled(Card)`
  padding: 20px;
`

const CheckBoxGroupLabel = styled(FormLabel)`
  font-size: 12px;
`

export default function ModelForm({ car }: CarModelDataAndRefetchProps): JSX.Element {
  const { t } = useTranslation()

  return (
    <CardSpacing>
      <Grid container spacing={3} xs={8}>
        <Grid item container spacing={3}>
          <Grid item xs={12}>
            <h3>{t('modelForm.overview')}</h3>
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label={t('carModel.brand')}
              id="brand"
              name="brand"
              variant="outlined"
              value={car?.brand?.name}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label={t('carModel.model')}
              id="name"
              name="name"
              variant="outlined"
              value={`${car?.name} (${car?.subModelName})`}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label={t('carModel.seats')}
              id="seats"
              name="seats"
              variant="outlined"
              value={car?.seats}
              type="number"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label={t('carModel.bodyType')}
              id="bodyType"
              name="bodyType"
              variant="outlined"
              value={car?.bodyType}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label={t('carModel.modelYear')}
              id="modelYear"
              name="modelYear"
              variant="outlined"
              value={car?.year}
              type="number"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label={t('carModel.condition')}
              id="condition"
              name="condition"
              variant="outlined"
              value={car?.condition}
              InputLabelProps={{
                shrink: true,
              }}
              multiline
              rows={2}
              maxRows={4}
            />
          </Grid>
        </Grid>
        <Grid item container spacing={3}>
          <Grid item xs={12}>
            <h3>{t('modelForm.performance')}</h3>
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label={t('carModel.acceleration')}
              id="acceleration"
              name="acceleration"
              variant="outlined"
              type="number"
              value={car?.acceleration}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label={t('carModel.topSpeed')}
              id="topSpeed"
              name="topSpeed"
              variant="outlined"
              type="number"
              value={car?.topSpeed}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label={t('carModel.range')}
              id="range"
              name="range"
              variant="outlined"
              type="number"
              value={car?.range}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label={t('carModel.batteryCapacity')}
              id="batteryCapacity"
              name="batteryCapacity"
              variant="outlined"
              type="number"
              value={car?.batteryCapacity}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label={t('carModel.horsePower')}
              id="horsePower"
              name="horsePower"
              variant="outlined"
              type="number"
              value={car?.horsePower}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
        </Grid>
        <Grid item container spacing={3}>
          <Grid item xs={12}>
            <h3>{t('modelForm.charging')}</h3>
          </Grid>
          <Grid item xs={12}>
            <FormControl component="fieldset">
              <CheckBoxGroupLabel>{t('carModel.connectorType')}</CheckBoxGroupLabel>
              <FormGroup row>
                {car?.chargers.map((charger) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        key={charger.id}
                        name="connectorTypeIds"
                        color="primary"
                        value={charger.id}
                        checked
                      />
                    }
                    label={`${charger.description} [${charger.type}]`}
                    key={charger.id}
                  />
                ))}
              </FormGroup>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label={t('carModel.chargeTime')}
              id="chargeTime"
              name="chargeTime"
              variant="outlined"
              type="number"
              value={car?.chargeTime}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label={t('carModel.fastChargeTime')}
              id="fastChargeTime"
              name="fastChargeTime"
              variant="outlined"
              value={car?.fastChargeTime}
              type="number"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
        </Grid>
      </Grid>
    </CardSpacing>
  )
}
