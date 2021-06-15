import { Dispatch, SetStateAction, useEffect, useState } from 'react'
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
  const [price1w, setPrice1w] = useState(0)
  const [price1m, setPrice1m] = useState(0)
  const [price3m, setPrice3m] = useState(0)
  const [price6m, setPrice6m] = useState(0)
  const [price9m, setPrice9m] = useState(0)
  const [carModelPrices, setCarModelPrices] = useState({
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
          setPrice1w(edge?.node?.price)
          priceSnapshot.price1w = edge?.node?.price
          break
        case '1m':
          setPrice1m(edge?.node?.price)
          priceSnapshot.price1m = edge?.node?.price
          break
        case '3m':
          setPrice3m(edge?.node?.price)
          priceSnapshot.price3m = edge?.node?.price
          break
        case '6m':
          setPrice6m(edge?.node?.price)
          priceSnapshot.price6m = edge?.node?.price
          break
        case '9m':
          setPrice9m(edge?.node?.price)
          priceSnapshot.price9m = edge?.node?.price
          break
        default:
          break
      }
    })
    setCarModelPrices(priceSnapshot)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, open]) // INFO: need to add "open" to the dependency list to render data when close/open dialog without change other param

  useEffect(() => {
    const isPrice1WChange = price1w !== carModelPrices.price1w
    const isPrice1MChange = price1m !== carModelPrices.price1m
    const isPrice3MChange = price3m !== carModelPrices.price3m
    const isPrice6MChange = price6m !== carModelPrices.price6m
    const isPrice9MChange = price9m !== carModelPrices.price9m

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
  }, [price1w, price1m, price3m, price6m, price9m])

  const handlePriceChange = (
    dispatch: Dispatch<SetStateAction<number>>,
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    dispatch(parseInt(event.target.value))
  }

  const handleUpdateCar = () => {
    const changePrices = [] as PackagePriceInput[]
    if (price1w !== carModelPrices.price1w) {
      changePrices.push({
        duration: '1w',
        price: price1w,
        carModelId: modelId,
      })
    }
    if (price1m !== carModelPrices.price1m) {
      changePrices.push({
        duration: '1m',
        price: price1m,
        carModelId: modelId,
      })
    }
    if (price3m !== carModelPrices.price3m) {
      changePrices.push({
        duration: '3m',
        price: price3m,
        carModelId: modelId,
      })
    }
    if (price6m !== carModelPrices.price6m) {
      changePrices.push({
        duration: '6m',
        price: price6m,
        carModelId: modelId,
      })
    }
    if (price9m !== carModelPrices.price9m) {
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
    setPrice1w(0)
    setPrice1m(0)
    setPrice3m(0)
    setPrice6m(0)
    setPrice9m(0)
    setCarModelPrices({
      price1w: 0,
      price1m: 0,
      price3m: 0,
      price6m: 0,
      price9m: 0,
    })
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
                  value={price1w}
                  onChange={(event) => handlePriceChange(setPrice1w, event)}
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
                  onChange={(event) => handlePriceChange(setPrice1m, event)}
                  value={price1m}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">฿</InputAdornment>,
                  }}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Price per 3 months"
                  value={price3m}
                  type="number"
                  onChange={(event) => handlePriceChange(setPrice3m, event)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">฿</InputAdornment>,
                  }}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Price per 6 months"
                  value={price6m}
                  type="number"
                  onChange={(event) => handlePriceChange(setPrice6m, event)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">฿</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Price per 9 months"
                  value={price9m}
                  type="number"
                  onChange={(event) => handlePriceChange(setPrice9m, event)}
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
