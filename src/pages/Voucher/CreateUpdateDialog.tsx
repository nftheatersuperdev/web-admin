import { FormEvent, useState } from 'react'
import {
  Box,
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
import { useAuth } from 'auth/AuthContext'
import { Voucher, VoucherEventsInput, VoucherInput } from 'services/evme.types'
import { useCreateVoucher, useUpdateVoucher, useCreateVoucherEvents } from 'services/evme'
import DateTimePicker from 'components/DateTimePicker'
import HTMLEditor from 'components/HTMLEditor'
import { events } from './utils'

interface CreateUpdateDialogProps {
  voucher?: Voucher | null
  open: boolean
  onClose: () => void
}

const ButtonSpace = styled(Button)`
  margin: 0 15px 10px;
`

// eslint-disable-next-line complexity
export default function VoucherCreateUpdateDialog({
  voucher,
  open,
  onClose,
}: CreateUpdateDialogProps): JSX.Element {
  const { getUserId } = useAuth()
  const voucherId = voucher?.id
  const isUpdate = !!voucherId
  const { t } = useTranslation()
  const createVoucher = useCreateVoucher()
  const updateVoucher = useUpdateVoucher()
  const createVoucherEvents = useCreateVoucherEvents()
  const validationSchema = yup.object({
    code: yup
      .string()
      .matches(/^[a-zA-Z0-9]+$/, t('validation.invalidVoucherCode'))
      .required(t('validation.required')),
    description: yup.string(),
    percentDiscount: yup
      .number()
      .min(1, t('validation.minimumIsOne'))
      .max(100, t('validation.maximumIsOneHundred'))
      .required(t('validation.required')),
    amount: yup.number().min(1, t('validation.minimumIsOne')).required(t('validation.required')),
    limitPerUser: yup
      .number()
      .min(1, t('validation.minimumIsOne'))
      .required(t('validation.required')),
  })

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [descriptionEnTemp, setDescriptionEnTemp] = useState<string | null>()
  const [descriptionThTemp, setDescriptionThTemp] = useState<string | null>()

  const datePlusOneDay = dayjs().add(1, 'day')
  const defaultDate = {
    startAt: datePlusOneDay.startOf('day'),
    endAt: datePlusOneDay.endOf('day'),
  }
  const currentDateTime = new Date()
  const startAtDateTime = new Date(voucher?.startAt)
  const endAtDateTime = new Date(voucher?.endAt)
  const isActive = currentDateTime >= startAtDateTime && currentDateTime <= endAtDateTime
  const isInactive = currentDateTime > endAtDateTime

  const handleValidateCodeKeyPress = (event: React.KeyboardEvent) => {
    const allowCharacters = /[a-zA-Z0-9]/
    if (!allowCharacters.test(event.key)) {
      event.preventDefault()
    }
  }

  const handleValidateNumericKeyPress = (event: React.KeyboardEvent) => {
    const allowCharacters = /[0-9]/
    if (!allowCharacters.test(event.key)) {
      event.preventDefault()
    }
  }

  const handleValidateCodeValue = (event: FormEvent) => {
    const target = event.target as HTMLInputElement
    target.value = target.value.toUpperCase().replace(/\s/g, '')
  }

  const handleValidatePercentageValue = (event: FormEvent, maximum = 100) => {
    const target = event.target as HTMLInputElement
    target.value = target.value.toUpperCase().replace(/\s/g, '')
    if (Number(target.value) > maximum) {
      target.value = String(maximum)
    }
  }

  const handleDisableEvent = (event: FormEvent) => {
    event.preventDefault()
  }

  const sendVoucherEvent = (id: string, data: VoucherInput) => {
    const voucherEventInput: VoucherEventsInput = {
      voucherId: id,
      userId: getUserId() || '',
      event: isUpdate ? events.UPDATE : events.CREATE,
      code: data.code || '',
      descriptionEn: data.descriptionEn || '',
      descriptionTh: data.descriptionTh || '',
      percentDiscount: data.percentDiscount || 0,
      amount: data.amount || 0,
      limitPerUser: data.limitPerUser || 0,
      startAt: data.startAt || '',
      endAt: data.endAt || '',
      isAllPackages: data.isAllPackages || false,
    }

    toast.promise(createVoucherEvents.mutateAsync(voucherEventInput), {
      loading: t('toast.loading'),
      success: () => {
        console.log('success!')
        return 'Success'
      },
      error: (error) => {
        console.log('error ->', error)
        return 'Error'
      },
    })
  }

  const formik = useFormik({
    validationSchema,
    initialValues: {
      code: '',
      percentDiscount: undefined,
      amount: undefined,
      limitPerUser: undefined,
      startAt: isUpdate ? voucher?.startAt : defaultDate.startAt,
      endAt: isUpdate ? voucher?.endAt : defaultDate.endAt,
      ...voucher,
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      setIsLoading(true)

      const requestBody: VoucherInput = {
        code: values.code,
        descriptionEn: descriptionEnTemp ?? voucher?.descriptionEn,
        descriptionTh: descriptionThTemp ?? voucher?.descriptionTh,
        percentDiscount: values?.percentDiscount,
        amount: values?.amount,
        limitPerUser: values?.limitPerUser,
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
        success: (result) => {
          sendVoucherEvent(result.id, mutateObject)
          formik.resetForm()
          setIsLoading(false)
          onClose()
          return toastMessages.success
        },
        error: (error) => {
          setIsLoading(false)
          let errorMessage = toastMessages.error
          let errorField = ''

          if (error.message) {
            // The voucher code is duplicated
            if (error.message.includes('unique constraint')) {
              errorField = 'code'
              errorMessage = t('voucher.errors.duplicatedCode')
            }

            formik.setFieldError(errorField, errorMessage)
            return errorMessage
          }
          return errorMessage
        },
      })
    },
  })

  const handleOnDescriptionChange = (value: string, language: string) => {
    if (language === 'en') {
      setDescriptionEnTemp(value)
      return true
    }
    setDescriptionThTemp(value)
    return true
  }

  const voucherIdField = isUpdate && (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Box mb={2}>
          <TextField
            fullWidth
            label={t('voucher.id')}
            variant="standard"
            value={voucherId}
            InputProps={{
              readOnly: true,
            }}
            disabled
          />
        </Box>
      </Grid>
    </Grid>
  )

  return (
    <Dialog open={open} fullWidth aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">
        {isUpdate ? t('voucher.dialog.update.title') : t('voucher.dialog.create.title')}
      </DialogTitle>
      <DialogContent>
        {voucherIdField}
        <Grid container spacing={3}>
          <Grid item xs={12}>
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
              disabled={isInactive || isActive}
              onInput={handleValidateCodeValue}
              onKeyPress={handleValidateCodeKeyPress}
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
              minDate={isUpdate ? formik.values.startAt : defaultDate.startAt}
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
              InputProps={{
                readOnly: true,
              }}
              disabled={isInactive || isActive}
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
              InputProps={{
                readOnly: true,
              }}
              disabled={isInactive}
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
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: 1, max: 100, step: 1 }}
              error={formik.touched.percentDiscount && Boolean(formik.errors.percentDiscount)}
              helperText={formik.touched.percentDiscount && formik.errors.percentDiscount}
              disabled={isInactive || isActive}
              onInput={handleValidatePercentageValue}
              onKeyPress={handleValidateNumericKeyPress}
              onCut={handleDisableEvent}
              onCopy={handleDisableEvent}
              onPaste={handleDisableEvent}
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
              inputProps={{ min: 1 }}
              error={formik.touched.amount && Boolean(formik.errors.amount)}
              helperText={formik.touched.amount && formik.errors.amount}
              disabled={isInactive || isActive}
              onKeyPress={handleValidateNumericKeyPress}
              onCut={handleDisableEvent}
              onCopy={handleDisableEvent}
              onPaste={handleDisableEvent}
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
              inputProps={{ min: 1 }}
              error={formik.touched.limitPerUser && Boolean(formik.errors.limitPerUser)}
              helperText={formik.touched.limitPerUser && formik.errors.limitPerUser}
              disabled={isInactive || isActive}
              onKeyPress={handleValidateNumericKeyPress}
              onCut={handleDisableEvent}
              onCopy={handleDisableEvent}
              onPaste={handleDisableEvent}
            />
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <HTMLEditor
              id="description-en"
              label={t('voucher.description.en')}
              initialValue={voucher?.descriptionEn}
              handleOnEditChange={(value: string) => handleOnDescriptionChange(value, 'en')}
              disabled={isInactive || isActive}
            />
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <HTMLEditor
              id="description-th"
              label={t('voucher.description.th')}
              initialValue={voucher?.descriptionTh}
              handleOnEditChange={(value: string) => handleOnDescriptionChange(value, 'th')}
              disabled={isInactive || isActive}
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
          disabled={isLoading || isInactive}
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
