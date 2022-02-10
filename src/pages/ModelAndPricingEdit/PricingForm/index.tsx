import { useEffect, useRef, useState } from 'react'
import {
  Grid,
  FormControl,
  TextField,
  InputAdornment,
  Button,
  Typography,
  Card,
} from '@material-ui/core'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { CarModelItem } from 'types'
import toast from 'react-hot-toast'
import { useCreatePrices, usePricingByCarModelId } from 'services/evme'
import { PackagePriceInput } from 'services/evme.types'
import { CarModelPrices, Period, defaultCarModelPrices, getPriceChanges } from 'pages/Pricing/utils'

const Warning = styled.div`
  text-align: center;
  flex-basis: 100%;
  color: red;
`

const CardSpacing = styled(Card)`
  padding: 20px;
  margin-top: 20px;
`

interface SubscriptionProps {
  modelOptions: CarModelItem[]
  modelId: string
}

export default function PricingForm({
  modelOptions = [],
  modelId,
}: SubscriptionProps): JSX.Element {
  const { t } = useTranslation()
  const [selectedCarModel, setSelectedCarModelsId] = useState<string>('')
  const [carModelPrices, setCarModelPrices] = useState<CarModelPrices>({ ...defaultCarModelPrices })
  const carModelPricesRef = useRef<CarModelPrices>({ ...defaultCarModelPrices })
  const [isPriceUpdated, setIsPriceUpdate] = useState(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const mutationCreatePrice = useCreatePrices()

  const { data } = usePricingByCarModelId({
    carModelId: modelId,
  })
  const handleUpdatePrice = (data: PackagePriceInput[] | null) => {
    setIsLoading(true)
    if (!data) {
      return
    }

    toast.promise(mutationCreatePrice.mutateAsync(data), {
      loading: t('toast.loading'),
      success: () => {
        setIsLoading(false)
        return t('pricing.updateDialog.success')
      },
      error: () => {
        setIsLoading(false)
        return t('pricing.updateDialog.error')
      },
    })
  }

  useEffect(() => {
    const selectedModel = modelOptions.find((model) => {
      return model.id === modelId
    })?.modelName
    selectedModel && setSelectedCarModelsId(selectedModel)
  }, [modelId, modelOptions])

  useEffect(() => {
    const priceSnapshot = { ...defaultCarModelPrices }

    data?.edges?.forEach(({ node }) => {
      const { duration, price, fullPrice, description } = node || {}

      switch (duration) {
        case '3d':
          priceSnapshot.price3d = {
            price,
            fullPrice: fullPrice || 0,
            description: description || '',
          }
          break
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
  }, [data]) // INFO: need to add "open" to the dependency list to render data when close/open dialog without change other param

  useEffect(() => {
    const {
      isPrice3DChange,
      isPrice1WChange,
      isPrice1MChange,
      isPrice3MChange,
      isPrice6MChange,
      isPrice12MChange,
    } = getPriceChanges(carModelPrices, carModelPricesRef.current)

    if (
      isPrice3DChange ||
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
    const { price3d, price1w, price1m, price3m, price6m, price12m } = carModelPrices
    const {
      isPrice3DChange,
      isPrice1WChange,
      isPrice1MChange,
      isPrice3MChange,
      isPrice6MChange,
      isPrice12MChange,
    } = getPriceChanges(carModelPrices, carModelPricesRef.current)

    if (isPrice3DChange) {
      changePrices.push({
        duration: '3d',
        price: price3d.price,
        fullPrice: price3d.fullPrice,
        description: price3d.description,
        carModelId: modelId,
      })
    }

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

    handleUpdatePrice(changePrices)
  }

  return (
    <CardSpacing>
      <Grid container spacing={3}>
        <Grid item xs={8}>
          <FormControl fullWidth={true}>
            <h3 id="car-model">{t('pricing.plan')}</h3>
          </FormControl>
        </Grid>

        {selectedCarModel ? (
          <Grid container item xs={8} spacing={3}>
            <Grid item xs={12} md={12}>
              <Typography variant="subtitle1">{t('pricing.pricePerThreeDays')}</Typography>
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label={t('pricing.price')}
                type="number"
                id="price3d.price"
                name="price3d.price"
                variant="outlined"
                value={carModelPrices.price3d.price}
                onChange={(event) => handlePriceChange('price3d', 'price', event)}
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
                id="price3d.fullPrice"
                name="price3d.fullPrice"
                variant="outlined"
                value={carModelPrices.price3d.fullPrice}
                onChange={(event) => handlePriceChange('price3d', 'fullPrice', event)}
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
                id="price3d.description"
                name="price3d.description"
                variant="outlined"
                value={carModelPrices.price3d.description}
                onChange={(event) => handleDescriptionChange('price3d', event)}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            <Grid item xs={12} md={12}>
              <Typography variant="subtitle1">{t('pricing.pricePerOneWeek')}</Typography>
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                label={t('pricing.price')}
                type="number"
                id="price1w.price"
                name="price1w.price"
                variant="outlined"
                value={carModelPrices.price1w.price}
                onChange={(event) => handlePriceChange('price1w', 'price', event)}
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
                id="price1w.fullPrice"
                name="price1w.fullPrice"
                variant="outlined"
                value={carModelPrices.price1w.fullPrice}
                onChange={(event) => handlePriceChange('price1w', 'fullPrice', event)}
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
                id="price1w.description"
                name="price1w.description"
                variant="outlined"
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
            <Grid item xs={4}>
              <TextField
                fullWidth
                label={t('pricing.price')}
                type="number"
                id="price1m.price"
                name="price1m.price"
                variant="outlined"
                value={carModelPrices.price1m.price}
                onChange={(event) => handlePriceChange('price1m', 'price', event)}
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
                id="price1m.fullPrice"
                name="price1m.fullPrice"
                variant="outlined"
                value={carModelPrices.price1m.fullPrice}
                onChange={(event) => handlePriceChange('price1m', 'fullPrice', event)}
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
                id="price1m.description"
                name="price1m.description"
                variant="outlined"
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
            <Grid item xs={4}>
              <TextField
                fullWidth
                label={t('pricing.price')}
                type="number"
                id="price3m.price"
                name="price3m.price"
                variant="outlined"
                value={carModelPrices.price3m.price}
                onChange={(event) => handlePriceChange('price3m', 'price', event)}
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
                id="price3m.fullPrice"
                name="price3m.fullPrice"
                variant="outlined"
                value={carModelPrices.price3m.fullPrice}
                onChange={(event) => handlePriceChange('price3m', 'fullPrice', event)}
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
                id="price3m.description"
                name="price3m.description"
                variant="outlined"
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
            <Grid item xs={4}>
              <TextField
                fullWidth
                label={t('pricing.price')}
                type="number"
                id="price6m.price"
                name="price6m.price"
                variant="outlined"
                value={carModelPrices.price6m.price}
                onChange={(event) => handlePriceChange('price6m', 'price', event)}
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
                id="price6m.fullPrice"
                name="price6m.fullPrice"
                variant="outlined"
                value={carModelPrices.price6m.fullPrice}
                onChange={(event) => handlePriceChange('price6m', 'fullPrice', event)}
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
                id="price6m.description"
                name="price6m.description"
                variant="outlined"
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
            <Grid item xs={4}>
              <TextField
                fullWidth
                label={t('pricing.price')}
                type="number"
                id="price12m.price"
                name="price12m.price"
                variant="outlined"
                value={carModelPrices.price12m.price}
                onChange={(event) => handlePriceChange('price12m', 'price', event)}
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
                id="price12m.fullPrice"
                name="price12m.fullPrice"
                variant="outlined"
                value={carModelPrices.price12m.fullPrice}
                onChange={(event) => handlePriceChange('price12m', 'fullPrice', event)}
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
                id="price12m.description"
                name="price12m.description"
                variant="outlined"
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
        <Grid item xs={8}>
          <Button
            onClick={handleUpdateCar}
            color="primary"
            variant="contained"
            disabled={!isPriceUpdated || isLoading}
          >
            {t('button.update')}
          </Button>
        </Grid>
      </Grid>
    </CardSpacing>
  )
}
