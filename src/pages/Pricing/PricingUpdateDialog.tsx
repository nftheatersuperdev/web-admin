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
} from '@material-ui/core'
import styled from 'styled-components'
import { ICarModelItem } from 'helper/car.helper'
import { usePricingById } from 'services/evme'
import { PackagePriceInput } from 'services/evme.types'

interface SubscriptionProps {
  open: boolean
  onClose: (data: PackagePriceInput[] | null) => void
  modelOptions: ICarModelItem[]
  modelId: string
}

const Warning = styled.div`
  text-align: center;
  flex-basis: 100%;
  color: red;
`

export default function PricingUpdateDialog({
  open,
  onClose,
  modelOptions = [],
  modelId,
}: SubscriptionProps): JSX.Element {
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

  const { data } = usePricingById({
    carModelId: modelId,
  })

  useEffect(() => {
    const selectedModel = modelOptions.find((model) => {
      return model.id === modelId
    })?.modelName
    selectedModel && setSelectedCarModelsId(selectedModel)
  }, [modelId, modelOptions])

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

  const handlePriceChange = (
    period: string,
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setCarModelPrices({
      ...carModelPrices,
      [period]: parseInt(event.target.value),
    })
  }

  const handleUpdateCar = () => {
    const changePrices = [] as PackagePriceInput[]
    const { price1w, price1m, price3m, price6m, price9m } = carModelPrices
    if (price1w !== carModelPricesRef.current.price1w) {
      changePrices.push({
        duration: '1w',
        price: price1w,
        carModelId: modelId,
      })
    }
    if (price1m !== carModelPricesRef.current.price1m) {
      changePrices.push({
        duration: '1m',
        price: price1m,
        carModelId: modelId,
      })
    }
    if (price3m !== carModelPricesRef.current.price3m) {
      changePrices.push({
        duration: '3m',
        price: price3m,
        carModelId: modelId,
      })
    }
    if (price6m !== carModelPricesRef.current.price6m) {
      changePrices.push({
        duration: '6m',
        price: price6m,
        carModelId: modelId,
      })
    }
    if (price9m !== carModelPricesRef.current.price9m) {
      changePrices.push({
        duration: '9m',
        price: price9m,
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
      <DialogTitle id="form-dialog-title">Update Price</DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl fullWidth={true}>
              <h2 id="car-model">{selectedCarModel}</h2>
            </FormControl>
          </Grid>

          {selectedCarModel ? (
            <Grid container item xs={12} spacing={3}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Price per 1 week"
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
                  label="Price per 1 month"
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
                  label="Price per 3 months"
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
                  label="Price per 6 months"
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
                  label="Price per 9 months"
                  value={carModelPrices.price9m}
                  type="number"
                  onChange={(event) => handlePriceChange('price9m', event)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">฿</InputAdornment>,
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
          Cancel
        </Button>
        <Button
          onClick={handleUpdateCar}
          color="primary"
          variant="contained"
          disabled={!isPriceUpdated}
        >
          Update
        </Button>
      </DialogActions>
    </Dialog>
  )
}
