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
import { useFormik } from 'formik'
import toast from 'react-hot-toast'
import { useSubscriptions, useCreateAdditionalExpense } from 'services/evme'
import { ExpenseTypes, ExpenseStatuses, transformToMutationInput, validationSchema } from './utils'

interface AdditionalExpenseCreateDialogProps {
  open: boolean
  onClose: () => void
}

export default function AdditionalExpenseCreateDialog(
  props: AdditionalExpenseCreateDialogProps
): JSX.Element {
  const { open, onClose } = props

  const { data: subscriptions } = useSubscriptions()
  const createAdditionalExpense = useCreateAdditionalExpense()

  const formik = useFormik({
    initialValues: {
      subscriptionId: '',
      price: 0,
      type: '',
      noticeDate: '',
      status: '',
      note: '',
    },
    validationSchema,
    onSubmit: (values) => {
      const input = transformToMutationInput(values)

      toast.promise(createAdditionalExpense.mutateAsync(input), {
        loading: 'Loading',
        success: () => {
          formik.resetForm()
          onClose()
          return 'Created additional expense successfully!'
        },
        error: 'Failed to create additional expense!',
      })
    },
  })

  const subscriptionItems = subscriptions?.edges?.map(({ node }) => node?.id)

  return (
    <Dialog open={open} fullWidth aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Create New Additional Expense</DialogTitle>
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
            Create
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
