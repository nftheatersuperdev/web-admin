import { Fragment } from 'react'
import styled from 'styled-components'
import { Grid, FormControl, TextField, InputAdornment, Typography, Card } from '@material-ui/core'
import { useTranslation } from 'react-i18next'
import { RentalPackage } from 'services/web-bff/package-price.type'

const CardSpacing = styled(Card)`
  padding: 20px;
  margin-top: 20px;
`

interface CarModelPricingProps {
  rentalPackages?: RentalPackage[]
}

export default function PricingForm({ rentalPackages }: CarModelPricingProps): JSX.Element {
  const { t } = useTranslation()

  const durationLable = (value: string) => {
    switch (value) {
      case '3d':
        return t('pricing.3d')
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

  const renderPrices =
    rentalPackages?.map((rentalPackage) => {
      const packageId = `${rentalPackage.id}-${rentalPackage.durationLabel}`

      return (
        <Fragment key={rentalPackage.id}>
          <Grid item xs={12} md={12}>
            <Typography variant="subtitle1">
              {durationLable(rentalPackage.durationLabel)}
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label={t('pricing.price')}
              type="number"
              id={`${packageId}-price`}
              name={`${packageId}-price`}
              variant="outlined"
              value={rentalPackage.price}
              InputProps={{
                startAdornment: <InputAdornment position="start">฿</InputAdornment>,
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              label={t('pricing.fullPrice')}
              type="number"
              id={`${packageId}-full-price`}
              name={`${packageId}-full-price`}
              variant="outlined"
              value={rentalPackage.fullPrice}
              InputProps={{
                startAdornment: <InputAdornment position="start">฿</InputAdornment>,
              }}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              fullWidth
              multiline
              label={t('pricing.description')}
              id={`${packageId}-description`}
              name={`${packageId}-description`}
              variant="outlined"
              value={rentalPackage.description}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
        </Fragment>
      )
    }) || []

  return (
    <CardSpacing>
      <Grid container spacing={3}>
        <Grid item xs={8}>
          <FormControl fullWidth={true}>
            <h3 id="car-model">{t('pricing.plan')}</h3>
          </FormControl>
        </Grid>

        <Grid container item xs={8} spacing={3}>
          {renderPrices}
        </Grid>
      </Grid>
    </CardSpacing>
  )
}
