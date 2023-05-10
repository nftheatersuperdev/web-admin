/* eslint-disable react/forbid-component-props */
import styled from 'styled-components'
import toast from 'react-hot-toast'
import {
  Button,
  Card,
  Grid,
  Checkbox,
  FormControl,
  FormControlLabel,
  MenuItem,
  InputLabel,
  TextField,
  Typography,
  Select,
  Skeleton,
} from '@mui/material'
import { useParams, useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { useFormik } from 'formik'
import { ROUTE_PATHS } from 'routes'
import { useState } from 'react'
import { includes } from 'lodash/fp'
import { getModelPriceById, updateCarModelById } from 'services/web-bff/car'
import { CarModelInput, CarModelInputProps } from 'services/web-bff/car.type'
import { Page } from 'layout/LayoutRoute'
import PageTitle, { PageBreadcrumbs } from 'components/PageTitle'
import Backdrop from 'components/Backdrop'
import { ModelAndPricingEditParams } from './types'
import { carConnectorTypes } from './ModelForm/CarConnectorType'

const Wrapper = styled(Card)`
  padding: 15px;
  margin-top: 20px;
`
const ContentSection = styled.div`
  margin-bottom: 20px;
`
const SubContentSection = styled.div`
  margin: 40px 0 20px 0;
`
const SubContentSectionWithoutMargin = styled.div`
  margin: 0;
`
const SubContentSectionTitle = styled.div`
  margin-bottom: 30px;
`
const GridContainer = styled(Grid)`
  margin: 20px 0;
`
const FormControlLabelHorizontal = styled(FormControlLabel)`
  display: flex !important;
`
const ButtonAction = styled(Button)`
  margin-right: 15px !important;
`
const TextFieldReadOnly = styled(TextField)`
  background: #f5f5f5 !important;
`
const TextIndent = styled.div`
  margin-left: 14px;
`
const ConnectorTypeContainer = styled.div`
  margin-top: 10px;
`

export default function ModelAndPricingEdit(): JSX.Element {
  const { t } = useTranslation()
  const history = useHistory()
  const { id } = useParams<ModelAndPricingEditParams>()
  const carBodyTypes = ['SUV', 'Hatchback', 'Wagon', 'Luxury', 'Sedan', 'Crossover']
  const durationLable = (value: string) => {
    switch (value) {
      case '3d':
        return t('pricing.3d')
      case '7d':
        return t('pricing.7d')
      case '1w':
        return t('pricing.1w')
      case '1m':
        return t('pricing.1m')
      case '3m':
        return t('pricing.3m')
      case '6m':
        return t('pricing.6m')
      case '12m':
        return t('pricing.12m')
      default:
        return '-'
    }
  }

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { data: car, isFetching } = useQuery(
    'model-and-pricing-edit-page',
    () => getModelPriceById({ id }),
    {
      refetchOnWindowFocus: false,
    }
  )

  const handleOnSubmit = async (values: CarModelInput) => {
    try {
      setIsLoading(true)
      await toast.promise(
        updateCarModelById({ id: car?.id, carModel: values } as CarModelInputProps),
        {
          loading: t('toast.loading'),
          success: () => {
            history.goBack()
            return t('modelAndPricing.editDialog.success')
          },
          error: t('modelAndPricing.editDialog.error'),
        }
      )
    } finally {
      formik.resetForm()
      setIsLoading(false)
    }
  }

  const formik = useFormik({
    initialValues: {
      brand: car?.brand.name || '-',
      name: car?.name || '-',
      seats: car?.seats || 0,
      bodyType: car?.bodyType || '-',
      year: car?.year || 0,
      condition: car?.condition || '-',
      acceleration: car?.acceleration || 0,
      topSpeed: car?.topSpeed || 0,
      range: car?.range || 0,
      batteryCapacity: car?.batteryCapacity || 0,
      horsePower: car?.horsePower || 0,
      fastChargeTime: car?.fastChargeTime || 0,
      chargeTime: car?.chargeTime || 0,
      chargers: car?.chargers && car?.chargers.length > 0 ? car?.chargers.map((x) => x.type) : [],
    },
    enableReinitialize: true,
    onSubmit: handleOnSubmit,
  })

  const breadcrumbs: PageBreadcrumbs[] = [
    {
      text: t('carModelAndPricing.breadcrumb.carManagement'),
      link: '',
    },
    {
      text: t('carModelAndPricing.breadcrumb.carModelAndPricing'),
      link: ROUTE_PATHS.MODEL_AND_PRICING,
    },
    {
      text: t('carModelAndPricing.breadcrumb.carModelAndPricingDetail'),
      link: ROUTE_PATHS.MODEL_AND_PRICING_EDIT,
    },
  ]

  const maxPricePlan = 6
  const renderSkeletonPlan = []
  for (let i = 0; i < maxPricePlan; i++) {
    renderSkeletonPlan.push(
      <GridContainer container spacing={3}>
        <Grid item md={1} />
        <Grid item md={1}>
          <Skeleton variant="rectangular" />
        </Grid>
        <Grid item md={3}>
          <Skeleton variant="rectangular" />
        </Grid>
        <Grid item md={3}>
          <Skeleton variant="rectangular" />
        </Grid>
        <Grid item md={4}>
          <Skeleton variant="rectangular" />
        </Grid>
      </GridContainer>
    )
  }

  return (
    <Page>
      <PageTitle title={t('carModelAndPricing.detail.title')} breadcrumbs={breadcrumbs} />
      <Wrapper>
        <ContentSection>
          <Typography variant="h6" component="h1">
            {t('carModelAndPricing.detail.subTitle')}
          </Typography>

          {/* Overview */}
          <SubContentSection>
            <SubContentSectionTitle>
              <Typography variant="h6" component="h2">
                {t('carModelAndPricing.detail.overview')}
              </Typography>
            </SubContentSectionTitle>
            <GridContainer container spacing={3}>
              <Grid item md={6}>
                <TextFieldReadOnly
                  fullWidth
                  label={t('carModelAndPricing.detail.brand')}
                  id="brand"
                  name="brand"
                  variant="outlined"
                  value={formik.values.brand}
                  onChange={formik.handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid item md={6}>
                <TextField
                  fullWidth
                  label={t('carModelAndPricing.detail.model')}
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
            </GridContainer>
            <GridContainer container spacing={3}>
              <Grid item md={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="bodyTypeId">{t('carModelAndPricing.detail.bodyType')}</InputLabel>
                  <Select
                    labelId="bodyType"
                    label={t('carModelAndPricing.detail.bodyType')}
                    id="bodyType"
                    name="bodyType"
                    value={formik.values.bodyType.toLocaleUpperCase()}
                    onChange={formik.handleChange}
                  >
                    {carBodyTypes?.map((bodyType) => (
                      <MenuItem key={bodyType} value={bodyType.toLocaleUpperCase()}>
                        {bodyType}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item md={6}>
                <TextField
                  fullWidth
                  label={t('carModelAndPricing.detail.seats')}
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
            </GridContainer>
            <GridContainer container spacing={3}>
              <Grid item md={6}>
                <TextField
                  fullWidth
                  label={t('carModelAndPricing.detail.modelYear')}
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
            </GridContainer>
            <GridContainer container spacing={3}>
              <Grid item md={12}>
                <TextField
                  fullWidth
                  label={t('carModelAndPricing.detail.condition')}
                  id="condition"
                  name="condition"
                  variant="outlined"
                  value={formik.values.condition}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={formik.handleChange}
                  multiline
                  rows={1}
                />
              </Grid>
            </GridContainer>
          </SubContentSection>

          {/* Performance */}
          <SubContentSection>
            <SubContentSectionTitle>
              <Typography variant="h6" component="h2">
                {t('carModelAndPricing.detail.performance')}
              </Typography>
            </SubContentSectionTitle>
            <GridContainer container spacing={3}>
              <Grid item md={6}>
                <TextField
                  fullWidth
                  label={t('carModelAndPricing.detail.acceleration')}
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
              <Grid item md={6}>
                <TextField
                  fullWidth
                  label={t('carModelAndPricing.detail.topSpeed')}
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
            </GridContainer>
            <GridContainer container spacing={3}>
              <Grid item md={6}>
                <TextField
                  fullWidth
                  label={t('carModelAndPricing.detail.range')}
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
              <Grid item md={6}>
                <TextField
                  fullWidth
                  label={t('carModelAndPricing.detail.batteryCapacity')}
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
            </GridContainer>
            <GridContainer container spacing={3}>
              <Grid item md={6}>
                <TextField
                  fullWidth
                  label={t('carModelAndPricing.detail.horsePower')}
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
            </GridContainer>
          </SubContentSection>

          {/* Charging */}
          <SubContentSection>
            <SubContentSectionTitle>
              <Typography variant="h6" component="h2">
                {t('carModelAndPricing.detail.charging')}
              </Typography>
            </SubContentSectionTitle>
            <GridContainer container spacing={3}>
              <Grid item md={12}>
                <TextIndent>
                  {t('carModelAndPricing.detail.connectorType')}
                  <ConnectorTypeContainer>
                    <FormControl
                      component="fieldset"
                      style={{ display: 'flex', flexDirection: 'row' }}
                    >
                      {carConnectorTypes?.map((connectorType) => (
                        <FormControlLabelHorizontal
                          control={
                            <Checkbox
                              key={connectorType.type}
                              onChange={formik.handleChange}
                              name="chargers"
                              color="primary"
                              value={connectorType.type}
                              checked={includes(connectorType.type)(formik.values.chargers)}
                            />
                          }
                          label={connectorType.type}
                          key={connectorType.id}
                        />
                      ))}
                    </FormControl>
                  </ConnectorTypeContainer>
                </TextIndent>
              </Grid>
            </GridContainer>
            <GridContainer container spacing={3}>
              <Grid item md={6}>
                <TextField
                  fullWidth
                  label={t('carModelAndPricing.detail.fastChargeTime')}
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
              <Grid item md={6}>
                <TextField
                  fullWidth
                  label={t('carModelAndPricing.detail.chargeTime')}
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
            </GridContainer>
          </SubContentSection>

          {/* Plan */}
          <SubContentSection>
            <SubContentSectionTitle>
              <Typography variant="h6" component="h2">
                {t('carModelAndPricing.detail.plan')}
              </Typography>
            </SubContentSectionTitle>
            {isFetching
              ? renderSkeletonPlan
              : car?.rentalPackages.map((rentalPackage) => {
                  const packageId = `${rentalPackage.id}-${rentalPackage.durationLabel}`
                  return (
                    <GridContainer container spacing={3} key={packageId}>
                      <Grid item md={2}>
                        <Typography
                          variant="subtitle2"
                          align="right"
                          style={{ paddingTop: '14px' }}
                        >
                          {durationLable(rentalPackage.durationLabel)}
                        </Typography>
                      </Grid>
                      <Grid item md={3}>
                        <TextFieldReadOnly
                          fullWidth
                          label={t('carModelAndPricing.detail.rentalPackage.price')}
                          id={`${packageId}-price`}
                          name={`${packageId}-price`}
                          variant="outlined"
                          value={rentalPackage.price.toLocaleString()}
                          InputProps={{
                            readOnly: true,
                          }}
                        />
                      </Grid>
                      <Grid item md={3}>
                        <TextFieldReadOnly
                          fullWidth
                          label={t('carModelAndPricing.detail.rentalPackage.fullPrice')}
                          id={`${packageId}-full-price`}
                          name={`${packageId}-full-price`}
                          variant="outlined"
                          value={rentalPackage.fullPrice.toLocaleString()}
                          InputProps={{
                            readOnly: true,
                          }}
                        />
                      </Grid>
                      <Grid item md={4}>
                        <TextField
                          fullWidth
                          multiline
                          id={`${packageId}-description`}
                          name={`${packageId}-description`}
                          variant="outlined"
                          value={rentalPackage.description.toLocaleString()}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          InputProps={{
                            readOnly: true,
                          }}
                        />
                      </Grid>
                    </GridContainer>
                  )
                })}
          </SubContentSection>

          {/* Buttons */}
          <SubContentSectionWithoutMargin>
            <ButtonAction
              onClick={() => formik.handleSubmit()}
              color="primary"
              variant="contained"
              disabled={isLoading}
            >
              {t('carModelAndPricing.detail.button.save')}
            </ButtonAction>
            <ButtonAction
              onClick={() => history.push(ROUTE_PATHS.MODEL_AND_PRICING)}
              variant="outlined"
              disabled={isLoading}
            >
              {t('carModelAndPricing.detail.button.cancel')}
            </ButtonAction>
          </SubContentSectionWithoutMargin>
        </ContentSection>
      </Wrapper>
      <Backdrop open={isLoading || isFetching} />
    </Page>
  )
}
