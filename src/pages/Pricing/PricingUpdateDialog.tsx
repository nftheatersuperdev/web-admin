import { useEffect, useRef, useState } from 'react'
import {
  Grid,
  FormControl,
  TextField,
  InputAdornment,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Button,
  Typography,
} from '@material-ui/core'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { CarModelItem } from 'types'
import { usePricingByCarModelId } from 'services/evme'
import { PackagePriceInput } from 'services/evme.types'
import { CarModelPrices, Period, defaultCarModelPrices, getPriceChanges } from './utils'

const Warning = styled.div`
  text-align: center;
  flex-basis: 100%;
  color: red;
`

interface SubscriptionProps {
  open: boolean
  onClose: (data: PackagePriceInput[] | null) => void
  modelOptions: CarModelItem[]
  modelId: string
}

export default function PricingUpdateDialog({
  open,
  onClose,
  modelOptions = [],
  modelId,
}: SubscriptionProps): JSX.Element {
  const { t } = useTranslation()
  const [selectedCarModel, setSelectedCarModelsId] = useState<string>('')
  const [carModelPrices, setCarModelPrices] = useState<CarModelPrices>({ ...defaultCarModelPrices })
  const carModelPricesRef = useRef<CarModelPrices>({ ...defaultCarModelPrices })
  const [isPriceUpdated, setIsPriceUpdate] = useState(false)

  const { data } = usePricingByCarModelId({
    carModelId: modelId,
  })

  useEffect(() => {
    const selectedModel = modelOptions.find((model) => {
      return model.id === modelId
    })?.modelName
    selectedModel && setSelectedCarModelsId(selectedModel)
  }, [modelId, modelOptions, open])

  useEffect(() => {
    const priceSnapshot = { ...defaultCarModelPrices }

    data?.edges?.forEach(({ node }) => {
      const { duration, price, fullPrice, description } = node || {}

      switch (duration) {
        case '1w':
          priceSnapshot.price1w = {
            price,
            fullPrice: fullPrice || 0,
            description: description || '',
          }
          break
        case '1m':
          priceSnapshot.price1m = {
            price,
            fullPrice: fullPrice || 0,
            description: description || '',
          }
          break
        case '3m':
          priceSnapshot.price3m = {
            price,
            fullPrice: fullPrice || 0,
            description: description || '',
          }
          break
        case '6m':
          priceSnapshot.price6m = {
            price,
            fullPrice: fullPrice || 0,
            description: description || '',
          }
          break
        case '12m':
          priceSnapshot.price12m = {
            price,
            fullPrice: fullPrice || 0,
            description: description || '',
          }
          break
        default:
          break
      }
    })

    carModelPricesRef.current = priceSnapshot

    setCarModelPrices(priceSnapshot)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, open]) // INFO: need to add "open" to the dependency list to render data when close/open dialog without change other param

  useEffect(() => {
    const { isPrice1WChange, isPrice1MChange, isPrice3MChange, isPrice6MChange, isPrice12MChange } =
      getPriceChanges(carModelPrices, carModelPricesRef.current)

    if (
      isPrice1WChange ||
      isPrice1MChange ||
      isPrice3MChange ||
      isPrice6MChange ||
      isPrice12MChange
    ) {
      setIsPriceUpdate(true)
    } else {
      setIsPriceUpdate(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [carModelPrices])

  const handlePriceChange = (
    period: Period,
    key: string,
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const prevCarModelPrice = carModelPrices[period]

    setCarModelPrices({
      ...carModelPrices,
      [period]: {
        ...prevCarModelPrice,
        [key]: parseInt(event.target.value),
      },
    })
  }

  const handleDescriptionChange = (
    period: Period,
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const prevCarModelPrice = carModelPrices[period]

    setCarModelPrices({
      ...carModelPrices,
      [period]: {
        ...prevCarModelPrice,
        description: event.target.value,
      },
    })
  }

  const handleUpdateCar = () => {
    const changePrices = [] as PackagePriceInput[]
    const { price1w, price1m, price3m, price6m, price12m } = carModelPrices
    const { isPrice1WChange, isPrice1MChange, isPrice3MChange, isPrice6MChange, isPrice12MChange } =
      getPriceChanges(carModelPrices, carModelPricesRef.current)

    if (isPrice1WChange) {
      changePrices.push({
        duration: '1w',
        price: price1w.price,
        fullPrice: price1w.fullPrice,
        description: price1w.description,
        carModelId: modelId,
      })
    }

    if (isPrice1MChange) {
      changePrices.push({
        duration: '1m',
        price: price1m.price,
        fullPrice: price1m.fullPrice,
        description: price1m.description,
        carModelId: modelId,
      })
    }

    if (isPrice3MChange) {
      changePrices.push({
        duration: '3m',
        price: price3m.price,
        fullPrice: price3m.fullPrice,
        description: price3m.description,
        carModelId: modelId,
      })
    }

    if (isPrice6MChange) {
      changePrices.push({
        duration: '6m',
        price: price6m.price,
        fullPrice: price6m.fullPrice,
        description: price6m.description,
        carModelId: modelId,
      })
    }

    if (isPrice12MChange) {
      changePrices.push({
        duration: '12m',
        price: price12m.price,
        fullPrice: price12m.fullPrice,
        description: price12m.description,
        carModelId: modelId,
      })
    }

    onClose(changePrices)
    resetDialogState()
  }

  const handleCancelUpdateCar = () => {
    onClose(null)
    resetDialogState()
  }

  const resetDialogState = () => {
    setSelectedCarModelsId('')
    setCarModelPrices({ ...defaultCarModelPrices })
    carModelPricesRef.current = { ...defaultCarModelPrices }
  }

  return (
    <Dialog open={open} fullWidth aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">{t('pricing.updateDialog.title')}</DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl fullWidth={true}>
              <label id="car-model">{t('pricing.model')}</label>
              <h3 id="car-model">{selectedCarModel}</h3>
            </FormControl>
          </Grid>

          {selectedCarModel ? (
            <Grid container item xs={12} spacing={3}>
              <Grid item xs={12} md={12}>
                <Typography variant="subtitle1">{t('pricing.pricePerOneWeek')}</Typography>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label={t('pricing.price')}
                  type="number"
                  id="price1w.price"
                  name="price1w.price"
                  value={carModelPrices.price1w.price}
                  onChange={(event) => handlePriceChange('price1w', 'price', event)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">฿</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label={t('pricing.fullPrice')}
                  type="number"
                  id="price1w.fullPrice"
                  name="price1w.fullPrice"
                  value={carModelPrices.price1w.fullPrice}
                  onChange={(event) => handlePriceChange('price1w', 'fullPrice', event)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">฿</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  label={t('pricing.description')}
                  id="price1w.description"
                  name="price1w.description"
                  value={carModelPrices.price1w.description}
                  onChange={(event) => handleDescriptionChange('price1w', event)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              <Grid item xs={12} md={12}>
                <Typography variant="subtitle1">{t('pricing.pricePerOneMonth')}</Typography>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label={t('pricing.price')}
                  type="number"
                  id="price1m.price"
                  name="price1m.price"
                  value={carModelPrices.price1m.price}
                  onChange={(event) => handlePriceChange('price1m', 'price', event)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">฿</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label={t('pricing.fullPrice')}
                  type="number"
                  id="price1m.fullPrice"
                  name="price1m.fullPrice"
                  value={carModelPrices.price1m.fullPrice}
                  onChange={(event) => handlePriceChange('price1m', 'fullPrice', event)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">฿</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  label={t('pricing.description')}
                  id="price1m.description"
                  name="price1m.description"
                  value={carModelPrices.price1m.description}
                  onChange={(event) => handleDescriptionChange('price1m', event)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              <Grid item xs={12} md={12}>
                <Typography variant="subtitle1">{t('pricing.pricePerThreeMonths')}</Typography>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label={t('pricing.price')}
                  type="number"
                  id="price3m.price"
                  name="price3m.price"
                  value={carModelPrices.price3m.price}
                  onChange={(event) => handlePriceChange('price3m', 'price', event)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">฿</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label={t('pricing.fullPrice')}
                  type="number"
                  id="price3m.fullPrice"
                  name="price3m.fullPrice"
                  value={carModelPrices.price3m.fullPrice}
                  onChange={(event) => handlePriceChange('price3m', 'fullPrice', event)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">฿</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  label={t('pricing.description')}
                  id="price3m.description"
                  name="price3m.description"
                  value={carModelPrices.price3m.description}
                  onChange={(event) => handleDescriptionChange('price3m', event)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              <Grid item xs={12} md={12}>
                <Typography variant="subtitle1">{t('pricing.pricePerSixMonths')}</Typography>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label={t('pricing.price')}
                  type="number"
                  id="price6m.price"
                  name="price6m.price"
                  value={carModelPrices.price6m.price}
                  onChange={(event) => handlePriceChange('price6m', 'price', event)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">฿</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label={t('pricing.fullPrice')}
                  type="number"
                  id="price6m.fullPrice"
                  name="price6m.fullPrice"
                  value={carModelPrices.price6m.fullPrice}
                  onChange={(event) => handlePriceChange('price6m', 'fullPrice', event)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">฿</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  label={t('pricing.description')}
                  id="price6m.description"
                  name="price6m.description"
                  value={carModelPrices.price6m.description}
                  onChange={(event) => handleDescriptionChange('price6m', event)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              <Grid item xs={12} md={12}>
                <Typography variant="subtitle1">{t('pricing.pricePerTwelveMonths')}</Typography>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label={t('pricing.price')}
                  type="number"
                  id="price12m.price"
                  name="price12m.price"
                  value={carModelPrices.price12m.price}
                  onChange={(event) => handlePriceChange('price12m', 'price', event)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">฿</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label={t('pricing.fullPrice')}
                  type="number"
                  id="price12m.fullPrice"
                  name="price12m.fullPrice"
                  value={carModelPrices.price12m.fullPrice}
                  onChange={(event) => handlePriceChange('price12m', 'fullPrice', event)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">฿</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  label={t('pricing.description')}
                  id="price12m.description"
                  name="price12m.description"
                  value={carModelPrices.price12m.description}
                  onChange={(event) => handleDescriptionChange('price12m', event)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
            </Grid>
          ) : (
            <Warning>Cannot find related model!</Warning>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancelUpdateCar} color="primary">
          {t('button.cancel')}
        </Button>
        <Button
          onClick={handleUpdateCar}
          color="primary"
          variant="contained"
          disabled={!isPriceUpdated}
        >
          {t('button.update')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
