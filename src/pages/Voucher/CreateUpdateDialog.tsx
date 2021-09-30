import { useState } from 'react'
import {
  Grid,
  TextField,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Button,
} from '@material-ui/core'
import { useFormik } from 'formik'
import * as yup from 'yup'
import dayjs from 'dayjs'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { DEFAULT_DATETIME_FORMAT } from 'utils'
import { Voucher, VoucherInput } from 'services/evme.types'
import { useCreateVoucher, useUpdateVoucher } from 'services/evme'
import DateTimePicker from 'components/DateTimePicker'

interface CreateUpdateDialogProps {
  method: string
  voucher?: Voucher | null
  open: boolean
  onClose: () => void
}

const ButtonSpace = styled(Button)`
  margin: 0 15px 10px 15px;
`

const validationSchema = yup.object({
  code: yup.string().required('Field is required'),
  description: yup.string(),
  percentDiscount: yup.number().required('Field is required'),
  amount: yup.number().required('Field is required'),
  limitPerUser: yup.number().required('Field is required'),
})

export default function VoucherCreateDialog({
  method,
  voucher,
  open,
  onClose,
}: CreateUpdateDialogProps): JSX.Element {
  const voucherId = voucher?.id
  const isUpdate = method === 'update'
  const { t } = useTranslation()
  const createVoucher = useCreateVoucher()
  const updateVoucher = useUpdateVoucher()

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const datePlusOneDay = dayjs().add(1, 'day')
  const defaultDate = {
    startAt: datePlusOneDay.startOf('day'),
    endAt: datePlusOneDay.endOf('day'),
  }

  const formik = useFormik({
    validationSchema,
    initialValues: {
      code: '',
      description: '',
      percentDiscount: 0,
      amount: 0,
      limitPerUser: 0,
      startAt: isUpdate ? voucher?.startAt : defaultDate.startAt,
      endAt: isUpdate ? voucher?.endAt : defaultDate.endAt,
      ...voucher,
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      setIsLoading(true)

      const requestBody: VoucherInput = {
        code: values.code,
        description: values.description,
        percentDiscount: values.percentDiscount,
        amount: values.amount,
        limitPerUser: values.limitPerUser,
        startAt: values.startAt,
        endAt: values.endAt,
      }
      const mutateFunction = isUpdate ? updateVoucher : createVoucher
      const mutateObject = isUpdate ? { id: voucherId, ...requestBody } : requestBody
      const toastMessages = {
        success: isUpdate ? t('voucher.dialog.update.success') : t('voucher.dialog.create.success'),
        error: isUpdate ? t('voucher.dialog.update.error') : t('voucher.dialog.create.error'),
      }

      toast.promise(mutateFunction.mutateAsync(mutateObject), {
        loading: t('toast.loading'),
        success: () => {
          formik.resetForm()
          setIsLoading(false)
          onClose()
          return toastMessages.success
        },
        error: toastMessages.error,
      })
    },
  })

  return (
    <Dialog open={open} fullWidth aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">
        {isUpdate ? t('voucher.dialog.update.title') : t('voucher.dialog.create.title')}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label={t('voucher.code')}
              id="code"
              name="code"
              variant="outlined"
              value={formik.values.code}
              onChange={formik.handleChange}
              InputLabelProps={{
                shrink: true,
              }}
              error={formik.touched.code && Boolean(formik.errors.code)}
              helperText={formik.touched.code && formik.errors.code}
              disabled={isUpdate}
            />
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <DateTimePicker
              inputVariant="outlined"
              fullWidth
              disablePast
              ampm={false}
              label={t('voucher.startAt')}
              id="startAt"
              name="startAt"
              format={DEFAULT_DATETIME_FORMAT}
              minDate={formik.values.startAt}
              minDateMessage=""
              defaultValue={formik.values.startAt}
              value={formik.values.startAt}
              onChange={(date) => {
                formik.setFieldValue('startAt', date)
                formik.setFieldValue('endAt', dayjs(date ?? new Date()).endOf('day'))
              }}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DateTimePicker
              inputVariant="outlined"
              fullWidth
              disablePast
              ampm={false}
              label={t('voucher.endAt')}
              id="endAt"
              name="endAt"
              format={DEFAULT_DATETIME_FORMAT}
              minDate={formik.values.startAt}
              minDateMessage=""
              defaultValue={formik.values.endAt}
              value={formik.values.endAt}
              onChange={(date) => {
                formik.setFieldValue('endAt', date)
              }}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              type="number"
              label={t('voucher.percentDiscount')}
              id="percentDiscount"
              name="percentDiscount"
              variant="outlined"
              value={formik.values.percentDiscount}
              onChange={formik.handleChange}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{ min: 0, max: 100 }}
              error={formik.touched.percentDiscount && Boolean(formik.errors.percentDiscount)}
              helperText={formik.touched.percentDiscount && formik.errors.percentDiscount}
              disabled={isUpdate}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              type="number"
              label={t('voucher.amount')}
              id="amount"
              name="amount"
              variant="outlined"
              value={formik.values.amount}
              onChange={formik.handleChange}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{ min: 0 }}
              error={formik.touched.amount && Boolean(formik.errors.amount)}
              helperText={formik.touched.amount && formik.errors.amount}
              disabled={isUpdate}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              type="number"
              label={t('voucher.limitPerUser')}
              id="limitPerUser"
              name="limitPerUser"
              variant="outlined"
              value={formik.values.limitPerUser}
              onChange={formik.handleChange}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{ min: 0 }}
              error={formik.touched.limitPerUser && Boolean(formik.errors.limitPerUser)}
              helperText={formik.touched.limitPerUser && formik.errors.limitPerUser}
            />
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label={t('voucher.description')}
              id="description"
              name="description"
              variant="outlined"
              value={formik.values.description}
              onChange={formik.handleChange}
              InputLabelProps={{
                shrink: true,
              }}
              error={formik.touched.description && Boolean(formik.errors.description)}
              helperText={formik.touched.description && formik.errors.description}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <ButtonSpace
          onClick={() => {
            onClose()
            formik.resetForm()
          }}
          color="primary"
          disabled={isLoading}
        >
          {t('button.cancel')}
        </ButtonSpace>
        <ButtonSpace
          disabled={isLoading}
          onClick={() => formik.handleSubmit()}
          color="primary"
          variant="contained"
        >
          {t(isUpdate ? 'button.update' : 'button.create')}
        </ButtonSpace>
      </DialogActions>
    </Dialog>
  )
}
