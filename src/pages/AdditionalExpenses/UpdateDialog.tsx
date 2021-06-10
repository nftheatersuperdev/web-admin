import { useState, useEffect } from 'react'
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
  FormHelperText,
} from '@material-ui/core'
import dayjs from 'dayjs'
import { useFormik } from 'formik'
import toast from 'react-hot-toast'
import {
  useSubscriptions,
  useAdditionalExpenseById,
  useUpdateAdditionalExpense,
} from 'services/evme'
import { ExpenseTypes, ExpenseStatuses, transformToMutationInput, validationSchema } from './utils'

interface AdditionalExpenseUpdateDialogProps {
  open: boolean
  onClose: () => void
  id: string
}

export default function AdditionalExpenseUpdateDialog(
  props: AdditionalExpenseUpdateDialogProps
): JSX.Element {
  const { open, onClose, id } = props
  const { data: subscriptions } = useSubscriptions()
  const { data } = useAdditionalExpenseById(id)
  const updateAdditionalExpense = useUpdateAdditionalExpense()

  const [initialValues, setInitialValues] = useState({
    subscriptionId: '',
    price: 0,
    type: '',
    noticeDate: '',
    status: '',
    note: '',
  })

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      const update = transformToMutationInput(values)

      toast.promise(
        updateAdditionalExpense.mutateAsync({
          id,
          update,
        }),
        {
          loading: 'Loading',
          success: () => {
            formik.resetForm()
            onClose()
            return 'Updated additional expense successfully!'
          },
          error: 'Failed to update additional expense!',
        }
      )
    },
  })

  const [subscriptionItems, setSubscriptionItems] = useState<string[]>([])

  useEffect(() => {
    if (data) {
      const { subscriptionId, price, type, noticeDate, status, note } = data

      setInitialValues({
        subscriptionId,
        price,
        type,
        noticeDate: noticeDate ? dayjs(noticeDate).format('YYYY-MM-DDTHH:mm:ss') : '',
        status,
        note: note || '',
      })

      const subscriptionIds = subscriptions?.edges?.map(({ node }) => node?.id) || []

      if (!subscriptionIds.includes(subscriptionId)) {
        setSubscriptionItems([subscriptionId, ...subscriptionIds])
      } else {
        setSubscriptionItems(subscriptionIds)
      }
    }
  }, [data, subscriptions])

  return (
    <Dialog open={open} fullWidth aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Update Additional Expense</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl
                fullWidth
                error={formik.touched.subscriptionId && Boolean(formik.errors.subscriptionId)}
              >
                <InputLabel id="subscription">Subscription ID</InputLabel>
                <Select
                  labelId="subscription"
                  id="subscriptionId"
                  name="subscriptionId"
                  value={formik.values.subscriptionId}
                  onChange={formik.handleChange}
                >
                  {(subscriptionItems || []).map((id) => (
                    <MenuItem key={id} value={id}>
                      {id}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.subscriptionId && Boolean(formik.errors.subscriptionId) && (
                  <FormHelperText>
                    {formik.touched.subscriptionId && formik.errors.subscriptionId}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Date of expense notice"
                type="datetime-local"
                id="noticeDate"
                name="noticeDate"
                value={formik.values.noticeDate}
                onChange={({ target }) => formik.setFieldValue('noticeDate', target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
                error={formik.touched.noticeDate && Boolean(formik.errors.noticeDate)}
                helperText={formik.touched.noticeDate && formik.errors.noticeDate}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth error={formik.touched.type && Boolean(formik.errors.type)}>
                <InputLabel id="expenseType">Type of expense</InputLabel>
                <Select
                  labelId="expenseType"
                  id="type"
                  name="type"
                  value={formik.values.type}
                  onChange={formik.handleChange}
                >
                  {ExpenseTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.type && Boolean(formik.errors.type) && (
                  <FormHelperText>{formik.touched.type && formik.errors.type}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Price"
                id="price"
                name="price"
                value={formik.values.price}
                onChange={({ target }) => formik.setFieldValue('price', Number(target.value))}
                InputProps={{
                  startAdornment: <InputAdornment position="start">฿</InputAdornment>,
                }}
                error={formik.touched.price && Boolean(formik.errors.price)}
                helperText={formik.touched.price && formik.errors.price}
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth error={formik.touched.status && Boolean(formik.errors.status)}>
                <InputLabel id="status">Status</InputLabel>
                <Select
                  labelId="status"
                  id="status"
                  name="status"
                  value={formik.values.status}
                  onChange={formik.handleChange}
                >
                  {ExpenseStatuses.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
                {formik.touched.status && Boolean(formik.errors.status) && (
                  <FormHelperText>{formik.touched.status && formik.errors.status}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Note"
                id="note"
                name="note"
                value={formik.values.note}
                onChange={formik.handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
                error={formik.touched.note && Boolean(formik.errors.note)}
                helperText={formik.touched.note && formik.errors.note}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => {
              formik.resetForm()
              onClose()
            }}
            color="primary"
          >
            Cancel
          </Button>

          <Button color="primary" variant="contained" type="submit">
            Update
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
