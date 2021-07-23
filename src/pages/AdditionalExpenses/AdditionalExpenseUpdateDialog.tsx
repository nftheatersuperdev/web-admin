import { useMemo, useState, useEffect, ChangeEvent, Fragment } from 'react'
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
import Autocomplete from '@material-ui/lab/Autocomplete'
import { useFormik } from 'formik'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { DEFAULT_DATETIME_FORMAT } from 'utils'
import DateTimePicker from 'components/DateTimePicker'
import { useSearchSubscriptions, useUpdateAdditionalExpense } from 'services/evme'
import { AdditionalExpense } from 'services/evme.types'
import {
  ExpenseTypes,
  ExpenseStatuses,
  transformToMutationInput,
  validationSchema,
  getSubFilterByKeyword,
} from './utils'

interface AdditionalExpenseUpdateDialogProps {
  open: boolean
  onClose: () => void
  initialData?: AdditionalExpense
}

interface SubItem {
  id: string
  userId: string
  firstName: string
  lastName: string
  plateNumber: string
}

export default function AdditionalExpenseUpdateDialog(
  props: AdditionalExpenseUpdateDialogProps
): JSX.Element {
  const { open, onClose, initialData } = props
  const {
    id = '',
    subscriptionId,
    subscription,
    price,
    type,
    noticeDate,
    status,
    note,
  } = initialData || {}

  const { t } = useTranslation()

  const [subscriptionKeyword, setSubscriptionKeyword] = useState<string | null>()

  const {
    data: subscriptions,
    isLoading: isLoadingSubscriptions,
    refetch: refetchSubscriptions,
  } = useSearchSubscriptions(
    {
      first: 50,
    },
    getSubFilterByKeyword(subscriptionKeyword)
  )

  useEffect(() => {
    refetchSubscriptions()
  }, [subscriptionKeyword, refetchSubscriptions])

  const updateAdditionalExpense = useUpdateAdditionalExpense()

  const formik = useFormik({
    initialValues: {
      subscriptionId: subscriptionId || '',
      userId: subscription?.userId || '',
      firstName: subscription?.user?.firstName || '',
      lastName: subscription?.user?.lastName || '',
      plateNumber: subscription?.car?.plateNumber || '',
      price: price || 0,
      type: type || '',
      noticeDate,
      status: status || '',
      note: note || '',
    },
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
          loading: t('toast.loading'),
          success: () => {
            formik.resetForm()
            onClose()
            return t('additionalExpense.updateDialog.success')
          },
          error: t('additionalExpense.updateDialog.error'),
        }
      )
    },
  })

  const subscriptionItems = useMemo(() => {
    return (
      subscriptions?.edges?.map(({ node: { id, userId, user, car } }) => {
        return {
          id,
          userId,
          firstName: user?.firstName || '',
          lastName: user?.lastName || '',
          plateNumber: car?.plateNumber || '',
        }
      }) || ([] as SubItem[])
    )
  }, [subscriptions])

  const handleSubscriptionChange = (_event: ChangeEvent<unknown>, value: SubItem | null) => {
    formik.setFieldValue('subscriptionId', value?.id || '')
    formik.setFieldValue('userId', value?.userId || '')
    formik.setFieldValue('firstName', value?.firstName || '')
    formik.setFieldValue('lastName', value?.lastName || '')
    formik.setFieldValue('plateNumber', value?.plateNumber || '')
  }

  return (
    <Dialog open={open} fullWidth aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">{t('additionalExpense.updateDialog.title')}</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Autocomplete
                id="subscriptionId"
                defaultValue={{
                  id: formik.values.subscriptionId,
                  userId: formik.values.userId,
                  firstName: formik.values.firstName,
                  lastName: formik.values.lastName,
                  plateNumber: formik.values.plateNumber,
                }}
                options={subscriptionItems}
                getOptionLabel={({ id, firstName, plateNumber }) =>
                  `${id}${firstName ? ` - ${firstName}` : ''}${
                    plateNumber ? ` - ${plateNumber}` : ''
                  }`
                }
                loading={isLoadingSubscriptions}
                onChange={handleSubscriptionChange}
                onInputChange={(_event: ChangeEvent<unknown>, value: string | null) => {
                  setSubscriptionKeyword(value)
                }}
                renderOption={(option) => (
                  <Fragment>
                    <span>{option.id}</span>
                    {option.firstName && <span>&nbsp;-&nbsp;{option.firstName}</span>}
                    {option.plateNumber && <span>&nbsp;-&nbsp;{option.plateNumber}</span>}
                  </Fragment>
                )}
                renderInput={(params) => (
                  <TextField
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    {...params}
                    fullWidth
                    label={t('additionalExpense.autoCompleteSubscription')}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: <div>{params.InputProps.endAdornment}</div>,
                    }}
                    InputLabelProps={{
                      ...params.InputLabelProps,
                      shrink: true,
                    }}
                    error={formik.touched.subscriptionId && Boolean(formik.errors.subscriptionId)}
                    helperText={formik.touched.subscriptionId && formik.errors.subscriptionId}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('additionalExpense.userId')}
                id="userId"
                name="userId"
                value={formik.values.userId}
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('additionalExpense.userFullName')}
                id="fullName"
                name="fullName"
                value={`${formik.values.firstName} ${formik.values.lastName}`}
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>

            <Grid item xs={6}>
              <DateTimePicker
                fullWidth
                ampm={false}
                label={t('additionalExpense.noticeDate')}
                id="noticeDate"
                name="noticeDate"
                format={DEFAULT_DATETIME_FORMAT}
                value={formik.values.noticeDate}
                onChange={(date) => date && formik.setFieldValue('noticeDate', date.toDate())}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                error={formik.touched.noticeDate && Boolean(formik.errors.noticeDate)}
                helperText={formik.touched.noticeDate && formik.errors.noticeDate}
              />
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth error={formik.touched.type && Boolean(formik.errors.type)}>
                <InputLabel id="expenseType">{t('additionalExpense.type')}</InputLabel>
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

            <Grid item xs={6}>
              <TextField
                fullWidth
                label={t('additionalExpense.price')}
                id="price"
                name="price"
                type="number"
                value={formik.values.price}
                onChange={({ target }) => formik.setFieldValue('price', Number(target.value))}
                InputProps={{
                  startAdornment: <InputAdornment position="start">฿</InputAdornment>,
                }}
                error={formik.touched.price && Boolean(formik.errors.price)}
                helperText={formik.touched.price && formik.errors.price}
              />
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth error={formik.touched.status && Boolean(formik.errors.status)}>
                <InputLabel id="status">{t('additionalExpense.status')}</InputLabel>
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
                rows={2}
                label={t('additionalExpense.note')}
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
            {t('button.cancel')}
          </Button>

          <Button color="primary" variant="contained" type="submit">
            {t('button.update')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
