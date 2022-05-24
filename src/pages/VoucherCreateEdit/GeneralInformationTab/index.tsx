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
import voucherService from 'services/web-bff/voucher'
import { VoucherInputBff } from 'services/web-bff/voucher.type'
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
    discountPercent: yup
      .number()
      .min(1, t('validation.minimumIsOne'))
      .max(100, t('validation.maximumIsOneHundred'))
      .required(t('validation.required')),
    quantity: yup.number().min(1, t('validation.minimumIsOne')).required(t('validation.required')),
    limitPerUser: yup
      .number()
      .min(1, t('validation.minimumIsOne'))
      .required(t('validation.required')),
  })

  const datePlusOneDay = dayjs().add(1, 'day')
  const defaultDate = {
    startAt: datePlusOneDay.startOf('day'),
    endAt: datePlusOneDay.endOf('day'),
  }
  const currentDateTime = new Date()
  const startAtDateTime = new Date(voucher?.startAt || new Date())
  const endAtDateTime = new Date(voucher?.endAt || new Date())
  const isActive = isEdit
    ? currentDateTime >= startAtDateTime && currentDateTime <= endAtDateTime
    : false
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
      discountPercent: 0,
      quantity: 0,
      limitPerUser: 0,
      startAt: isEdit ? voucher?.startAt : defaultDate.startAt,
      endAt: isEdit ? voucher?.endAt : defaultDate.endAt,
      ...voucher,
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      setIsLoading(true)

      const packagePrices =
        values.packagePrices && values.packagePrices?.length > 0
          ? values.packagePrices.map((packagePrice) => packagePrice.id)
          : []
      const userGroups =
        values.userGroups && values.userGroups?.length > 0
          ? values.userGroups.map((userGroup) => userGroup.id)
          : []

      const requestBody: VoucherInputBff = {
        code: values.code,
        descriptionEn: descriptionEnTemp ?? voucher?.descriptionEn,
        descriptionTh: descriptionThTemp ?? voucher?.descriptionTh,
        discountPercent: values?.discountPercent,
        quantity: values?.quantity,
        limitPerUser: values?.limitPerUser,
        startAt: values.startAt,
        endAt: values.endAt,
        isAllPackages: values.isAllPackages,
        packagePrices,
        userGroups,
      }
      const mutateFunction = isEdit ? voucherService.updateBff : voucherService.createBff
      const data = isEdit ? { id: voucher?.id, ...requestBody } : requestBody
      const toastMessages = {
        success: isEdit ? t('voucher.dialog.update.success') : t('voucher.dialog.create.success'),
        error: isEdit ? t('voucher.dialog.update.error') : t('voucher.dialog.create.error'),
      }

      toast.promise(mutateFunction(data), {
        loading: t('toast.loading'),
        success: () => {
          formik.resetForm()
          setIsLoading(false)
          refetch()
          if (!isEdit) {
            history.push('/vouchers')
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
            disabled={isInactive || isActive || isEdit}
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
            minDate={isEdit ? formik.values.startAt : defaultDate.startAt}
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
            label={t('voucher.discountPercent')}
            id="discountPercent"
            name="discountPercent"
            variant="outlined"
            value={formik.values.discountPercent}
            onChange={formik.handleChange}
            InputLabelProps={{ shrink: true }}
            inputProps={{ min: 1, max: 100, step: 1 }}
            error={formik.touched.discountPercent && Boolean(formik.errors.discountPercent)}
            helperText={formik.touched.discountPercent && formik.errors.discountPercent}
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
            label={t('voucher.quantity')}
            id="quantity"
            name="quantity"
            variant="outlined"
            value={formik.values.quantity}
            onChange={formik.handleChange}
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{ min: 1 }}
            error={formik.touched.quantity && Boolean(formik.errors.quantity)}
            helperText={formik.touched.quantity && formik.errors.quantity}
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
