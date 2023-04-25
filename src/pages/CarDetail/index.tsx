/* eslint-disable react/jsx-props-no-spreading */
import { useState, useEffect } from 'react'
import { useParams, useHistory, useLocation } from 'react-router-dom'
import { useFormik } from 'formik'
import * as yup from 'yup'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { Card, Grid, Typography, TextField, Button, Autocomplete, Chip } from '@mui/material'
import { getCarById, updateById } from 'services/web-bff/car'
import { Page } from 'layout/LayoutRoute'
import PageTitle, { PageBreadcrumbs } from 'components/PageTitle'
import Backdrop from 'components/Backdrop'
import { CarConnectorType } from 'services/web-bff/car.type'
import {
  CarDetailParams,
  getCarStatusOnlyUsedInBackendOptions,
  CarStatus,
  SelectOption,
  CarStateParams,
} from './constant'
import { useStyles } from './styles'

const validationSchema = yup.object({
  vin: yup.string().required('Field is required'),
  plateNumber: yup.string().required('Field is required'),
  status: yup.string().required('Field is required'),
})

export default function CarDetail(): JSX.Element {
  const location = useLocation()
  const classes = useStyles()
  const { t } = useTranslation()
  const { id: carId } = useParams<CarDetailParams>()
  const stateParams = location.state as CarStateParams
  const breadcrumbs: PageBreadcrumbs[] = [
    {
      text: t('sidebar.carManagement.title'),
      link: '/',
    },
    {
      text: t('sidebar.carManagement.car'),
      link: '/car',
    },
    {
      text: t('sidebar.carManagement.carDetail'),
      link: `/car/${carId}`,
    },
  ]
  const { data: carDetail, isFetching: isFetchingCarDetail } = useQuery('car-detail', () =>
    getCarById(carId)
  )
  const [selectedStatus, setSelectedStatus] = useState<SelectOption | null>(null)

  useEffect(() => {
    const defaultValue = {
      label: carDetail?.isActive ? t('car.statuses.published') : t('car.statuses.outOfService'),
      value: carDetail?.isActive ? CarStatus.PUBLISHED : CarStatus.OUT_OF_SERVICE,
    }
    setSelectedStatus(defaultValue)
  }, [t, carDetail])

  const statusOptions = getCarStatusOnlyUsedInBackendOptions(t)
  const onChangeStatus = (item: SelectOption | null) => {
    setSelectedStatus(item)
    formik.setFieldValue('status', item?.value)
  }
  const formik = useFormik({
    validationSchema,
    initialValues: {
      vin: carDetail?.vin,
      plateNumber: carDetail?.plateNumber,
      status: carDetail?.isActive ? CarStatus.PUBLISHED : CarStatus.OUT_OF_SERVICE,
    },
    enableReinitialize: true,
    onSubmit: async (values) => {
      await toast.promise(
        updateById({
          id: carDetail?.id || '',
          vin: values.vin || '',
          plateNumber: values.plateNumber || '',
          isActive: values.status === CarStatus.PUBLISHED ? true : false,
        }),
        {
          loading: t('toast.loading'),
          success: t('car.updateDialog.success'),
          error: t('car.updateDialog.error'),
        }
      )
    },
  })

  const history = useHistory()
  const handleCancelClick = () => {
    history.goBack()
  }

  return (
    <Page>
      <PageTitle title="Car Management" breadcrumbs={breadcrumbs} />
      <Card className={classes.card}>
        <Grid className={classes.gridTitle}>
          <Typography variant="h6">
            <strong>Car Detail</strong>
          </Typography>
        </Grid>

        <Grid container spacing={3} className={classes.container}>
          <Grid item xs={12} sm={6}>
            <TextField
              type="text"
              id="car_detail__carId"
              className={classes.textField}
              label={t('car.id')}
              fullWidth
              disabled
              variant="outlined"
              value={carDetail?.id || ''}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Autocomplete
              autoHighlight
              id="status-select-list"
              options={statusOptions}
              getOptionLabel={(option) => option.label}
              isOptionEqualToValue={(option, value) =>
                option.value === value.value || value.value === ''
              }
              renderInput={(params) => {
                return <TextField {...params} label={t('car.carStatus')} variant="outlined" />
              }}
              value={selectedStatus}
              onChange={(_event, item) => onChangeStatus(item)}
            />
          </Grid>
        </Grid>

        <Grid container spacing={3} className={classes.container}>
          <Grid item xs={12} sm={6}>
            <TextField
              type="text"
              id="car_detail__carTrack"
              className={classes.textField}
              label={t('car.carTrackId')}
              fullWidth
              disabled
              variant="outlined"
              value={carDetail?.carTrackId || ''}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              type="text"
              id="car_detail__location"
              className={classes.textField}
              label={t('car.location')}
              fullWidth
              disabled
              variant="outlined"
              value={stateParams.location || ''}
            />
          </Grid>
        </Grid>

        <Grid container spacing={3} className={classes.container}>
          <Grid item xs={12} sm={6}>
            <TextField
              type="text"
              id="car_detail__plateNumber"
              className={classes.textField}
              label={t('car.plateNumber')}
              fullWidth
              variant="outlined"
              value={formik.values.plateNumber || ''}
              onChange={(event) => {
                formik.setFieldValue('plateNumber', event.target.value)
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              type="text"
              id="car_detail__vin"
              className={classes.textField}
              label={t('car.vin')}
              fullWidth
              variant="outlined"
              value={formik.values.vin || ''}
              onChange={(event) => {
                formik.setFieldValue('vin', event.target.value)
              }}
            />
          </Grid>
        </Grid>

        <Grid container spacing={3} className={classes.container}>
          <Grid item xs={12} sm={6}>
            <TextField
              type="text"
              id="car_detail__carBrand"
              className={classes.textField}
              label={t('car.brand')}
              fullWidth
              disabled
              variant="outlined"
              value={carDetail?.carSku.carModel.brand.name || ''}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              type="text"
              id="car_detail__model"
              className={classes.textField}
              label={t('car.model')}
              fullWidth
              disabled
              variant="outlined"
              value={carDetail?.carSku.carModel.name || ''}
            />
          </Grid>
        </Grid>

        <Grid container spacing={3} className={classes.container}>
          <Grid item xs={12} sm={6}>
            <TextField
              type="text"
              id="car_detail__color"
              className={classes.textField}
              label={t('car.color')}
              fullWidth
              disabled
              variant="outlined"
              value={carDetail?.carSku.color || ''}
            />
          </Grid>
        </Grid>
        <Grid container spacing={3} className={classes.container}>
          <Grid item xs={12} sm={6}>
            <TextField
              type="text"
              id="car_detail__owner"
              className={classes.textField}
              label={t('car.owner')}
              fullWidth
              disabled
              variant="outlined"
              value={stateParams.owner}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              type="text"
              id="car_detail__reseller"
              className={classes.textField}
              label={t('car.reseller')}
              fullWidth
              disabled
              variant="outlined"
              value={stateParams.reseller}
            />
          </Grid>
        </Grid>

        <Grid container spacing={3} className={classes.container}>
          <Grid item xs={12} sm={6}>
            <TextField
              type="text"
              id="car_detail__createDate"
              className={classes.textField}
              label={t('car.createdDate')}
              fullWidth
              disabled
              variant="outlined"
              value={carDetail?.createdDate || ''}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              type="text"
              id="car_detail__updateDate"
              className={classes.textField}
              label={t('car.updatedDate')}
              fullWidth
              disabled
              variant="outlined"
              value={carDetail?.updatedDate || ''}
            />
          </Grid>
        </Grid>

        <Grid className={`${classes.gridTitle} ${classes.marginSection}`}>
          <Typography variant="h6">
            <strong>Overview</strong>
          </Typography>
        </Grid>

        <Grid container spacing={3} className={classes.container}>
          <Grid item xs={12} sm={6}>
            <TextField
              type="text"
              id="car_detail__bodyType"
              className={classes.textField}
              label={t('car.bodyType')}
              fullWidth
              disabled
              variant="outlined"
              value={carDetail?.carSku.carModel.bodyType || ''}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              type="text"
              id="car_detail__seat"
              className={classes.textField}
              label={t('car.seats')}
              fullWidth
              disabled
              variant="outlined"
              value={carDetail?.carSku.carModel.seats || ''}
            />
          </Grid>
        </Grid>

        <Grid container spacing={3} className={classes.container}>
          <Grid item xs={12} sm={6}>
            <TextField
              type="text"
              id="car_detail__year"
              className={classes.textField}
              label={t('car.year')}
              fullWidth
              disabled
              variant="outlined"
              value={carDetail?.carSku.carModel.year || ''}
            />
          </Grid>
        </Grid>

        <Grid container spacing={3} className={classes.container}>
          <Grid item xs={12} sm={12}>
            <TextField
              type="text"
              id="car_detail__condition"
              className={classes.textField}
              label={t('car.condition')}
              fullWidth
              disabled
              variant="outlined"
              value={carDetail?.carSku.carModel.condition || ''}
            />
          </Grid>
        </Grid>

        <Grid className={`${classes.gridTitle} ${classes.marginSection}`}>
          <Typography variant="h6">
            <strong>Performance</strong>
          </Typography>
        </Grid>

        <Grid container spacing={3} className={classes.container}>
          <Grid item xs={12} sm={6}>
            <TextField
              type="text"
              id="car_detail__acc"
              className={classes.textField}
              label={t('car.acceleration')}
              fullWidth
              disabled
              variant="outlined"
              value={carDetail?.carSku.carModel.acceleration || ''}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              type="text"
              id="car_detail__speed"
              className={classes.textField}
              label={t('car.topSpeed')}
              fullWidth
              disabled
              variant="outlined"
              value={carDetail?.carSku.carModel.topSpeed || ''}
            />
          </Grid>
        </Grid>

        <Grid container spacing={3} className={classes.container}>
          <Grid item xs={12} sm={6}>
            <TextField
              type="text"
              id="car_detail__range"
              className={classes.textField}
              label={t('car.range')}
              fullWidth
              disabled
              variant="outlined"
              value={carDetail?.carSku.carModel.range || ''}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              type="text"
              id="car_detail__batt"
              className={classes.textField}
              label={t('car.batteryCapacity')}
              fullWidth
              disabled
              variant="outlined"
              value={carDetail?.carSku.carModel.batteryCapacity || ''}
            />
          </Grid>
        </Grid>

        <Grid container spacing={3} className={classes.container}>
          <Grid item xs={12} sm={6}>
            <TextField
              type="text"
              id="car_detail__horsePower"
              className={classes.textField}
              label={t('car.horsePower')}
              fullWidth
              disabled
              variant="outlined"
              value={carDetail?.carSku.carModel.horsePower || ''}
            />
          </Grid>
        </Grid>

        <Grid className={`${classes.gridTitle} ${classes.marginSection}`}>
          <Typography variant="h6">
            <strong>Charging</strong>
          </Typography>
        </Grid>

        <Grid container spacing={3} className={classes.container}>
          <Grid item xs={12} sm={6}>
            <TextField
              type="text"
              id="car_detail__chargeType"
              className={classes.textField}
              label={t('car.connectorType')}
              fullWidth
              disabled
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <div className={classes.chargeTypeStyle}>
                    {carDetail?.carSku.carModel.connectorTypes &&
                    carDetail?.carSku.carModel.connectorTypes !== undefined &&
                    carDetail?.carSku.carModel.connectorTypes.length > 0
                      ? carDetail?.carSku.carModel.connectorTypes.map(
                          (charger: CarConnectorType, index: number) => (
                            <Chip
                              color="primary"
                              key={index}
                              label={charger.description}
                              sx={{ m: 2, ml: 0, mt: 3, borderRadius: '64px', height: '24px' }}
                            />
                          )
                        )
                      : '-'}
                  </div>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              type="text"
              id="car_detail__chargeTime"
              className={classes.textField}
              label={t('car.chargeTime')}
              fullWidth
              disabled
              variant="outlined"
              value={carDetail?.carSku.carModel.chargeTime || ''}
            />
          </Grid>
        </Grid>

        <Grid container spacing={3} className={classes.container}>
          <Grid item xs={12} sm={6}>
            <TextField
              type="text"
              id="car_detail__fastCharge"
              className={classes.textField}
              label={t('car.fastChargeTime')}
              fullWidth
              disabled
              variant="outlined"
              value={carDetail?.carSku.carModel.fastChargeTime || ''}
            />
          </Grid>
        </Grid>

        <Grid container spacing={3} className={classes.container}>
          <Grid item>
            <Button
              id="car_detail__update_btn"
              color="primary"
              variant="contained"
              onClick={() => formik.handleSubmit()}
            >
              {t('button.save').toUpperCase()}
            </Button>
          </Grid>
          <Grid item>
            <Button
              id="car_detail__cancle_btn"
              color="primary"
              variant="outlined"
              onClick={() => {
                formik.resetForm()
                handleCancelClick()
              }}
            >
              {t('button.cancel').toUpperCase()}
            </Button>
          </Grid>
        </Grid>
      </Card>
      <Backdrop open={isFetchingCarDetail} />
    </Page>
  )
}
