import React, { useState } from 'react'
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
import { useSubscriptions } from 'services/evme'
import { AdditionalExpenseInput } from 'services/evme.types'

const EXPENSE_TYPES = ['maintenance', 'insurance', 'service', 'repair', 'replacement']
const EXPENSE_STATUSES = ['created', 'informed', 'pending', 'paid', 'cancelled']

interface AdditionalExpenseDialogProps {
  open: boolean
  onClose: (data: AdditionalExpenseInput | null) => Promise<void>
}

interface SubscriptionItem {
  id: string
}

export default function AdditionalExpenseCreateDialog(
  props: AdditionalExpenseDialogProps
): JSX.Element {
  const { open, onClose } = props
  const { data: subscriptions } = useSubscriptions()

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
    files: [],
  }

  const [expenseInfo, setExpenseInfo] = useState<AdditionalExpenseInput>(initialData)

  const handleExpenseInfoChange = (key: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setExpenseInfo({
      ...expenseInfo,
      [key]: event.target.value,
    })
  }

  const handleSubscriptionChange = (
    event: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    const { id: subscriptionId } = event.target.value as SubscriptionItem
    setExpenseInfo({
      ...expenseInfo,
      subscriptionId,
    })
  }

  const handleExpenseTypeChange = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    setExpenseInfo({
      ...expenseInfo,
      type: event.target.value as string,
    })
  }

  const handlePriceChange = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    setExpenseInfo({
      ...expenseInfo,
      price: Number(event.target.value) as number,
    })
  }

  const handleExpenseStatusChange = (
    event: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => {
    setExpenseInfo({
      ...expenseInfo,
      status: event.target.value as string,
    })
  }

  return (
    <Dialog open={open} fullWidth aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Create New Additional Expense</DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControl fullWidth={true}>
              <InputLabel id="subscription">Subscription ID</InputLabel>
              <Select
                labelId="subscription"
                onChange={handleSubscriptionChange}
                value={expenseInfo.subscriptionId}
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
              value={expenseInfo.noticeDate}
              onChange={handleExpenseInfoChange('noticeDate')}
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
                value={expenseInfo.type}
              >
                {EXPENSE_TYPES.map((type) => (
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
              value={expenseInfo.price}
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
                value={expenseInfo.status}
              >
                {EXPENSE_STATUSES.map((status) => (
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
              value={expenseInfo.note}
              multiline
              rows={3}
              onChange={handleExpenseInfoChange('note')}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={() => onClose(null)} color="primary">
          Cancel
        </Button>

        <Button
          onClick={() => {
            onClose(expenseInfo)
            setExpenseInfo(initialData)
          }}
          color="primary"
          variant="contained"
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  )
}
