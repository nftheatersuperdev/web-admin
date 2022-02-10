import {
  Button,
  Card,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@material-ui/core'
import styled from 'styled-components'
import toast from 'react-hot-toast'
import { useFormik } from 'formik'
import { useTranslation } from 'react-i18next'
import config from 'config'
import { useState } from 'react'
import { CarModelDataAndRefetchProps } from 'pages/ModelAndPricingEdit/types'
import { useCarBodyTypes, useCarConnectorTypes, useUpdateCarModel } from 'services/evme'

const ButtonSpace = styled(Button)`
  margin: 0;
`

const CardSpacing = styled(Card)`
  padding: 20px;
`

export default function ModelForm({ carModel, refetch }: CarModelDataAndRefetchProps): JSX.Element {
  const { t } = useTranslation()
  const updateCarModel = useUpdateCarModel()
  const { data: carBodyTypes } = useCarBodyTypes(config.maxInteger)
  const { data: carConnectorTypes } = useCarConnectorTypes(config.maxInteger)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const formik = useFormik({
    initialValues: {
      ...carModel,
      bodyTypeId: `${carModel?.bodyTypeId}` || '',
      connectorTypeId: carModel?.connectorTypeId || '',
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      setIsLoading(true)

      const updatedFields = {
        id: values.id,
        brand: values.brand,
        model: values.model,
        seats: values.seats,
        condition: values.condition,
        acceleration: values.acceleration,
        topSpeed: values.topSpeed,
        range: values.range,
        horsePower: values.horsePower,
        batteryCapacity: values.batteryCapacity,
        connectorTypeId: `${values.connectorTypeId}`,
        modelYear: values.modelYear,
        chargeTime: values.chargeTime,
        fastChargeTime: values.fastChargeTime,
        bodyTypeId: `${values.bodyTypeId}`,
      }
      toast.promise(updateCarModel.mutateAsync(updatedFields), {
        loading: t('toast.loading'),
        success: () => {
          formik.resetForm()
          setIsLoading(false)
          refetch()

          return t('modelForm.success')
        },
        error: () => {
          setIsLoading(false)

          return t('modelForm.error')
        },
      })
    },
  })

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
              value={formik.values.brand}
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
              id="model"
              name="model"
              variant="outlined"
              value={formik.values.model}
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
                labelId="bodyTypeId"
                label={t('carModel.bodyType')}
                id="bodyTypeId"
                name="bodyTypeId"
                value={formik.values.bodyTypeId}
                onChange={formik.handleChange}
              >
                {carBodyTypes?.edges?.map(({ node: { id, bodyType } }) => (
                  <MenuItem key={id} value={id}>
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
              id="modelYear"
              name="modelYear"
              variant="outlined"
              value={formik.values.modelYear}
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
              onChange={formik.handleChange}
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
              value={formik.values.acceleration}
              onChange={formik.handleChange}
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
              value={formik.values.topSpeed}
              onChange={formik.handleChange}
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
              value={formik.values.range}
              onChange={formik.handleChange}
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
          <Grid item xs={4}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="connectorTypeId">{t('carModel.connectorType')}</InputLabel>
              <Select
                labelId="connectorTypeId"
                label={t('carModel.connectorType')}
                id="connectorTypeId"
                name="connectorTypeId"
                value={formik.values.connectorTypeId}
                onChange={formik.handleChange}
              >
                {carConnectorTypes?.edges?.map(({ node: { id, type } }) => (
                  <MenuItem key={id} value={id}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
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
              type="number"
              onChange={formik.handleChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
        </Grid>
        <Grid item container spacing={3}>
          <Grid item xs={12}>
            <ButtonSpace
              disabled={isLoading}
              onClick={() => formik.handleSubmit()}
              color="primary"
              variant="contained"
            >
              {t('button.update')}
            </ButtonSpace>
          </Grid>
        </Grid>
      </Grid>
    </CardSpacing>
  )
}
