import styled from 'styled-components'
import {
  Card,
  Checkbox,
  FormControlLabel,
  FormControl,
  FormLabel,
  Grid,
  TextField,
  Button,
  InputLabel,
  Select,
  MenuItem,
} from '@material-ui/core'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { useFormik } from 'formik'
import { useState } from 'react'
import { includes } from 'lodash/fp'
import { CarModelDataAndRefetchProps } from 'pages/ModelAndPricingEdit/types'
import { updateCarModelById } from 'services/web-bff/car'
import { CarModelInput, CarModelInputProps } from 'services/web-bff/car.type'
import { carConnectorTypes } from './CarConnectorType'

const CardSpacing = styled(Card)`
  padding: 20px;
`

const CheckBoxGroupLabel = styled(FormLabel)`
  font-size: 12px;
`

export default function ModelForm({ car }: CarModelDataAndRefetchProps): JSX.Element {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const history = useHistory()
  const carBodyTypes = ['SUV', 'Hatchback', 'Wagon', 'Luxury', 'Sedan', 'Crossover']

  const handleOnSubmit = async (values: CarModelInput) => {
    try {
      setIsLoading(true)
      await toast.promise(
        updateCarModelById({ id: car?.id, carModel: values } as CarModelInputProps),
        {
          loading: t('toast.loading'),
          success: () => {
            history.goBack()
            return t('additionalExpense.createDialog.success')
          },
          error: t('additionalExpense.createDialog.error'),
        }
      )
    } finally {
      formik.resetForm()
      setIsLoading(false)
    }
  }

  const formik = useFormik({
    initialValues: {
      name: car?.name || '',
      seats: car?.seats || 0,
      bodyType: car?.bodyType || '',
      year: car?.year || 0,
      condition: car?.condition || '',
      acceleration: car?.acceleration || 0,
      topSpeed: car?.topSpeed || 0,
      range: car?.range || 0,
      batteryCapacity: car?.batteryCapacity || 0,
      horsePower: car?.horsePower || 0,
      fastChargeTime: car?.fastChargeTime || 0,
      chargeTime: car?.chargeTime || 0,
      chargers: [],
      connectorTypeIds: car?.chargers.map((x) => x.id),
    },
    enableReinitialize: true,
    onSubmit: handleOnSubmit,
  })

  return (
    <CardSpacing>
      <FormControl>
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
                onChange={formik.handleChange}
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
                value={formik.values.name}
                onChange={formik.handleChange}
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
                value={formik.values.seats}
                type="number"
                onChange={formik.handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="bodyTypeId">{t('carModel.bodyType')}</InputLabel>
                <Select
                  labelId="bodyType"
                  label={t('carModel.bodyType')}
                  id="bodyType"
                  name="bodyType"
                  value={formik.values.bodyType}
                  onChange={formik.handleChange}
                >
                  {carBodyTypes?.map((bodyType) => (
                    <MenuItem key={bodyType} value={bodyType}>
                      {bodyType}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label={t('carModel.modelYear')}
                id="year"
                name="year"
                variant="outlined"
                value={formik.values.year}
                type="number"
                onChange={formik.handleChange}
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
                value={formik.values.condition}
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={formik.handleChange}
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
                onChange={formik.handleChange}
                value={formik.values.acceleration}
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
                onChange={formik.handleChange}
                value={formik.values.topSpeed}
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
                onChange={formik.handleChange}
                value={formik.values.range}
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
                value={formik.values.batteryCapacity}
                onChange={formik.handleChange}
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
                value={formik.values.horsePower}
                onChange={formik.handleChange}
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
                {carConnectorTypes?.map((connectorType) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        key={connectorType.id}
                        onChange={formik.handleChange}
                        name="connectorTypeIds"
                        color="primary"
                        value={connectorType.id}
                        checked={includes(connectorType.id)(formik.values.connectorTypeIds)}
                      />
                    }
                    label={connectorType.type}
                    key={connectorType.id}
                  />
                ))}
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
                value={formik.values.chargeTime}
                onChange={formik.handleChange}
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
                value={formik.values.fastChargeTime}
                onChange={formik.handleChange}
                type="number"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
          </Grid>
          <Grid item xs={8}>
            <Button
              onClick={() => formik.handleSubmit()}
              color="primary"
              variant="contained"
              disabled={isLoading}
            >
              {t('button.update')}
            </Button>
          </Grid>
        </Grid>
      </FormControl>
    </CardSpacing>
  )
}
