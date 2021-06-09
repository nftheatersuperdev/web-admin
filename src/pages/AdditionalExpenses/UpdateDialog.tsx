import React, { useState, useEffect } from 'react'
import {
  Select,
  Grid,
  MenuItem,
  FormControl,
  TextField,
  Input,
  InputLabel,
  InputAdornment,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Button,
} from '@material-ui/core'
import toast from 'react-hot-toast'
import { transformToMutationInput, transformToFormData } from 'pages/AdditionalExpenses/utils'
import {
  useSubscriptions,
  useAdditionalExpenseById,
  useUpdateAdditionalExpense,
} from 'services/evme'
import { AdditionalExpenseInput } from 'services/evme.types'
import { ExpenseTypes, ExpenseStatuses } from './utils'

interface AdditionalExpenseUpdateDialogProps {
  open: boolean
  onSubmit: () => void
  onCancel: () => void
  id: string
}

interface SubscriptionItem {
  id: string
}

export default function AdditionalExpenseUpdateDialog(
  props: AdditionalExpenseUpdateDialogProps
): JSX.Element {
  const { open, onSubmit, onCancel, id } = props
  const { data: subscriptions } = useSubscriptions()
  const { data } = useAdditionalExpenseById(id)
  const updateAdditionalExpense = useUpdateAdditionalExpense()

  const subscriptionItems = subscriptions?.edges?.map(({ node }) => ({
    id: node?.id,
  }))

  const initialData = {
    subscriptionId: '',
    price: 0,
    type: '',
    noticeDate: '',
    status: '',
    note: '',
  }

  const [additionalExpenseData, setAdditionalExpenseData] =
    useState<AdditionalExpenseInput>(initialData)

  const [isDisableSubmit, setIsDisableSubmit] = useState(false)

  useEffect(() => {
    if (data) {
      const formData = transformToFormData(data)
      setAdditionalExpenseData(formData)
    }
  }, [data])

  const handleInputChange = (key: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setAdditionalExpenseData({
      ...additionalExpenseData,
      [key]: event.target.value,
    })
  }

  const handleSubscriptionChange = (
    event: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    const { id: subscriptionId } = event.target.value as SubscriptionItem
    setAdditionalExpenseData({
      ...additionalExpenseData,
      subscriptionId,
    })
  }

  const handleExpenseTypeChange = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    setAdditionalExpenseData({
      ...additionalExpenseData,
      type: event.target.value as string,
    })
  }

  const handlePriceChange = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    setAdditionalExpenseData({
      ...additionalExpenseData,
      price: Number(event.target.value) as number,
    })
  }

  const handleExpenseStatusChange = (
    event: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    setAdditionalExpenseData({
      ...additionalExpenseData,
      status: event.target.value as string,
    })
  }

  const handleSubmit = () => {
    setIsDisableSubmit(true)

    const update = transformToMutationInput(additionalExpenseData)

    toast.promise(
      updateAdditionalExpense.mutateAsync({
        id,
        update,
      }),
      {
        loading: 'Loading',
        success: () => {
          setIsDisableSubmit(false)
          onSubmit()
          return 'Updated additional expense successfully!'
        },
        error: () => {
          setIsDisableSubmit(false)
          return 'Failed to update additional expense!'
        },
      }
    )
  }

  return (
    <Dialog open={open} fullWidth aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Update Additional Expense</DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl fullWidth={true}>
              <InputLabel id="subscription">Subscription ID</InputLabel>
              <Select
                labelId="subscription"
                onChange={handleSubscriptionChange}
                value={additionalExpenseData.subscriptionId}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                renderValue={(selected: any) => <div>{selected}</div>}
              >
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {(subscriptionItems || []).map((item: any) => (
                  <MenuItem key={item.id} value={item}>
                    {item.id}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Date of expense notice"
              type="datetime-local"
              value={additionalExpenseData.noticeDate}
              onChange={handleInputChange('noticeDate')}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth={true}>
              <InputLabel id="expenseType">Type of expense</InputLabel>
              <Select
                labelId="expenseType"
                onChange={handleExpenseTypeChange}
                input={<Input />}
                value={additionalExpenseData.type}
              >
                {ExpenseTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Price"
              onChange={handlePriceChange}
              value={additionalExpenseData.price}
              InputProps={{
                startAdornment: <InputAdornment position="start">฿</InputAdornment>,
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth={true}>
              <InputLabel id="status">Status</InputLabel>
              <Select
                labelId="status"
                onChange={handleExpenseStatusChange}
                input={<Input />}
                value={additionalExpenseData.status}
              >
                {ExpenseStatuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Note"
              value={additionalExpenseData.note}
              multiline
              rows={3}
              onChange={handleInputChange('note')}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onCancel} color="primary">
          Cancel
        </Button>

        <Button
          onClick={handleSubmit}
          color="primary"
          variant="contained"
          disabled={isDisableSubmit}
        >
          Update
        </Button>
      </DialogActions>
    </Dialog>
  )
}
