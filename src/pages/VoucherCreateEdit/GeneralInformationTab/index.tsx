/* eslint-disable react/forbid-component-props */
import * as yup from 'yup'
import dayjs from 'dayjs'
import styled from 'styled-components'
import toast from 'react-hot-toast'
import { Fragment, FormEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Divider, Grid, TextField } from '@material-ui/core'
import { useFormik } from 'formik'
import { useHistory } from 'react-router-dom'
import { DEFAULT_DATETIME_FORMAT } from 'utils'
import { useAuth } from 'auth/AuthContext'
import voucherService from 'services/web-bff/voucher'
import { VoucherInput } from 'services/web-bff/voucher.type'
import { VoucherAbleToEditProps } from 'pages/VoucherCreateEdit/types'
import DateTimePicker from 'components/DateTimePicker'
import HTMLEditor from 'components/HTMLEditor'

const ButtonSpace = styled(Button)`
  margin: 0;
`
const DividerSpace = styled(Divider)`
  margin: 20px 0;
`

export default function VoucherGeneralInformationTab({
  voucher,
  isEdit,
  refetch,
}: VoucherAbleToEditProps): JSX.Element {
  const accessToken = useAuth().getToken() ?? ''
  const history = useHistory()
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [descriptionEnTemp, setDescriptionEnTemp] = useState<string | null>()
  const [descriptionThTemp, setDescriptionThTemp] = useState<string | null>()

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

  const datePlusOneDay = dayjs().add(1, 'day')
  const defaultDate = {
    startDate: datePlusOneDay.startOf('day'),
    endDate: datePlusOneDay.endOf('day'),
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

  const handleOnDescriptionChange = (value: string, language: string) => {
    if (language === 'en') {
      setDescriptionEnTemp(value)
      return true
    }
    setDescriptionThTemp(value)
    return true
  }

  const formik = useFormik({
    validationSchema,
    initialValues: {
      code: '',
      percentDiscount: undefined,
      amount: undefined,
      limitPerUser: undefined,
      startDate: isEdit ? voucher?.startAt : defaultDate.startDate,
      endDate: isEdit ? voucher?.endAt : defaultDate.endDate,
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
        startDate: values.startDate,
        endDate: values.endDate,
      }
      const mutateFunction = isEdit ? voucherService.update : voucherService.create
      const data = isEdit ? { id: voucher?.id, ...requestBody } : requestBody
      const toastMessages = {
        success: isEdit ? t('voucher.dialog.update.success') : t('voucher.dialog.create.success'),
        error: isEdit ? t('voucher.dialog.update.error') : t('voucher.dialog.create.error'),
      }

      toast.promise(mutateFunction({ accessToken, data }), {
        loading: t('toast.loading'),
        success: ({ id }) => {
          formik.resetForm()
          setIsLoading(false)
          refetch()
          if (!isEdit) {
            history.push(`/vouchers/${id}/edit`)
          }
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

  return (
    <Fragment>
      <Grid container spacing={3}>
        <Grid item xs={12} style={{ textAlign: 'right' }}>
          <ButtonSpace
            disabled={isLoading || isInactive}
            onClick={() => formik.handleSubmit()}
            color="primary"
            variant="contained"
          >
            {t(isEdit ? 'button.update' : 'button.create')}
          </ButtonSpace>
        </Grid>
      </Grid>
      <DividerSpace />
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
            id="startDate"
            name="startDate"
            format={DEFAULT_DATETIME_FORMAT}
            minDate={isEdit ? formik.values.startDate : defaultDate.startDate}
            minDateMessage=""
            defaultValue={formik.values.startDate}
            value={formik.values.startDate}
            onChange={(date) => {
              formik.setFieldValue('startDate', date)
              formik.setFieldValue('endDate', dayjs(date ?? new Date()).endOf('day'))
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
            id="endDate"
            name="endDate"
            format={DEFAULT_DATETIME_FORMAT}
            minDate={formik.values.startDate}
            minDateMessage=""
            defaultValue={formik.values.endDate}
            value={formik.values.endDate}
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
    </Fragment>
  )
}
