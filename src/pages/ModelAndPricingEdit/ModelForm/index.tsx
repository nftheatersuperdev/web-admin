import {
  Button,
  Card,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@material-ui/core'
import { flow, get, includes, map } from 'lodash/fp'
import styled from 'styled-components'
import toast from 'react-hot-toast'
import { useFormik } from 'formik'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useState } from 'react'
import { useAuth } from 'auth/AuthContext'
import { getBodyTypes, getConnectorTypes, update } from 'services/web-bff/car'
import { CarModelDataAndRefetchProps } from 'pages/ModelAndPricingEdit/types'

const ButtonSpace = styled(Button)`
  margin: 0;
`

const CardSpacing = styled(Card)`
  padding: 20px;
`

const CheckBoxGroupLabel = styled(FormLabel)`
  font-size: 12px;
`

export default function ModelForm({ car, refetch }: CarModelDataAndRefetchProps): JSX.Element {
  const accessToken = useAuth().getToken() ?? ''
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { data: carBodyTypes } = useQuery('car-body-types', () => getBodyTypes({ accessToken }))
  const { data: carConnectorTypes } = useQuery('car-connector-types', () =>
    getConnectorTypes({ accessToken })
  )

  const formik = useFormik({
    initialValues: {
      ...car,
      bodyTypeId: `${car?.bodyType.id}` || '',
      connectorTypeId: car?.connectorType.id || '',
      connectorTypeIds: flow(get('connectorTypes'), map('id'))(car),
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      setIsLoading(true)

      const updatedFields = {
        id: values.id,
        brand: values.brand,
        name: values.name,
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
      toast.promise(update({ accessToken, updatedFields }), {
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
                labelId="bodyTypeId"
                label={t('carModel.bodyType')}
                id="bodyTypeId"
                name="bodyTypeId"
                value={formik.values.bodyTypeId}
                onChange={formik.handleChange}
              >
                {carBodyTypes?.map((bodyType) => (
                  <MenuItem key={bodyType.id} value={bodyType.id}>
                    {bodyType.description}
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
          <Grid item xs={12}>
            <FormControl component="fieldset">
              <CheckBoxGroupLabel>{t('carModel.connectorType')}</CheckBoxGroupLabel>
              <FormGroup row>
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
