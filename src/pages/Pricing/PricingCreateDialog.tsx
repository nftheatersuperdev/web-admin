import { useEffect, useRef, useState } from 'react'
import {
  Select,
  Grid,
  MenuItem,
  FormControl,
  TextField,
  InputLabel,
  InputAdornment,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Button,
} from '@material-ui/core'
import { useTranslation } from 'react-i18next'
import { CarModelItem } from 'types'
import { usePricingById } from 'services/evme'
import { PackagePriceInput } from 'services/evme.types'

interface SubscriptionProps {
  open: boolean
  onClose: (data: PackagePriceInput[] | null) => void
  modelOptions: CarModelItem[]
}

export default function PricingCreateDialog({
  open,
  onClose,
  modelOptions = [],
}: SubscriptionProps): JSX.Element {
  const { t } = useTranslation()
  const [selectedCarModel, setSelectedCarModelsId] = useState('')
  const [carModelPrices, setCarModelPrices] = useState({
    price1w: 0,
    price1m: 0,
    price3m: 0,
    price6m: 0,
    price9m: 0,
  })
  const carModelPricesRef = useRef({
    price1w: 0,
    price1m: 0,
    price3m: 0,
    price6m: 0,
    price9m: 0,
  })
  const [isPriceUpdated, setIsPriceUpdate] = useState(false)

  const selectedId =
    modelOptions.find((model) => {
      return model.modelName === selectedCarModel
    })?.id || ''
  const { data } = usePricingById({
    carModelId: selectedId,
  })

  useEffect(() => {
    const priceSnapshot = {
      price1w: 0,
      price1m: 0,
      price3m: 0,
      price6m: 0,
      price9m: 0,
    }
    data?.edges?.forEach((edge) => {
      switch (edge?.node?.duration) {
        case '1w':
          priceSnapshot.price1w = edge?.node?.price
          break
        case '1m':
          priceSnapshot.price1m = edge?.node?.price
          break
        case '3m':
          priceSnapshot.price3m = edge?.node?.price
          break
        case '6m':
          priceSnapshot.price6m = edge?.node?.price
          break
        case '9m':
          priceSnapshot.price9m = edge?.node?.price
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
    const isPrice1WChange = carModelPrices.price1w !== carModelPricesRef.current.price1w
    const isPrice1MChange = carModelPrices.price1m !== carModelPricesRef.current.price1m
    const isPrice3MChange = carModelPrices.price3m !== carModelPricesRef.current.price3m
    const isPrice6MChange = carModelPrices.price6m !== carModelPricesRef.current.price6m
    const isPrice9MChange = carModelPrices.price9m !== carModelPricesRef.current.price9m

    if (
      isPrice1WChange ||
      isPrice1MChange ||
      isPrice3MChange ||
      isPrice6MChange ||
      isPrice9MChange
    ) {
      setIsPriceUpdate(true)
    } else {
      setIsPriceUpdate(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [carModelPrices])

  const handleCarModelsChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedCarModelsId(event.target.value as string)
  }

  const handlePriceChange = (
    period: string,
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setCarModelPrices({
      ...carModelPrices,
      [period]: parseInt(event.target.value),
    })
  }

  const handleCreateCar = () => {
    const changePrices = [] as PackagePriceInput[]
    const { price1w, price1m, price3m, price6m, price9m } = carModelPrices
    if (price1w !== carModelPricesRef.current.price1w) {
      changePrices.push({
        duration: '1w',
        price: price1w,
        carModelId: selectedId,
      })
    }
    if (price1m !== carModelPricesRef.current.price1m) {
      changePrices.push({
        duration: '1m',
        price: price1m,
        carModelId: selectedId,
      })
    }
    if (price3m !== carModelPricesRef.current.price3m) {
      changePrices.push({
        duration: '3m',
        price: price3m,
        carModelId: selectedId,
      })
    }
    if (price6m !== carModelPricesRef.current.price6m) {
      changePrices.push({
        duration: '6m',
        price: price6m,
        carModelId: selectedId,
      })
    }
    if (price9m !== carModelPricesRef.current.price9m) {
      changePrices.push({
        duration: '9m',
        price: price9m,
        carModelId: selectedId,
      })
    }
    onClose(changePrices)
    resetDialogState()
  }

  const handleCancelCreateCar = () => {
    onClose(null)
    resetDialogState()
  }

  const resetDialogState = () => {
    setSelectedCarModelsId('')
    setCarModelPrices({
      price1w: 0,
      price1m: 0,
      price3m: 0,
      price6m: 0,
      price9m: 0,
    })
    carModelPricesRef.current = {
      price1w: 0,
      price1m: 0,
      price3m: 0,
      price6m: 0,
      price9m: 0,
    }
  }

  return (
    <Dialog open={open} fullWidth aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">{t('pricing.createDialog.title')}</DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl fullWidth={true}>
              <InputLabel id="car-model">{t('pricing.model')}</InputLabel>
              <Select labelId="car-model" onChange={handleCarModelsChange} value={selectedCarModel}>
                {modelOptions.map((model) => (
                  <MenuItem key={model.id} value={model.modelName}>
                    {model.modelName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {selectedCarModel && (
            <Grid container item xs={12} spacing={3}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label={t('pricing.pricePerOneWeek')}
                  type="number"
                  value={carModelPrices.price1w}
                  onChange={(event) => handlePriceChange('price1w', event)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">฿</InputAdornment>,
                  }}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label={t('pricing.pricePerOneMonth')}
                  type="number"
                  onChange={(event) => handlePriceChange('price1m', event)}
                  value={carModelPrices.price1m}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">฿</InputAdornment>,
                  }}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label={t('pricing.pricePerThreeMonths')}
                  value={carModelPrices.price3m}
                  type="number"
                  onChange={(event) => handlePriceChange('price3m', event)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">฿</InputAdornment>,
                  }}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label={t('pricing.pricePerSixMonths')}
                  value={carModelPrices.price6m}
                  type="number"
                  onChange={(event) => handlePriceChange('price6m', event)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">฿</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label={t('pricing.pricePerNineMonths')}
                  value={carModelPrices.price9m}
                  type="number"
                  onChange={(event) => handlePriceChange('price9m', event)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">฿</InputAdornment>,
                  }}
                />
              </Grid>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancelCreateCar} color="primary">
          {t('button.cancel')}
        </Button>
        <Button
          onClick={handleCreateCar}
          color="primary"
          variant="contained"
          disabled={!isPriceUpdated}
        >
          {t('button.create')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
