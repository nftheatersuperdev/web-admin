import * as yup from 'yup'
import { Link, useHistory, useParams } from 'react-router-dom'
import { Card, Grid, Typography, TextField } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { ROUTE_PATHS } from 'routes'
import styled from 'styled-components'
import toast from 'react-hot-toast'
import { FormikProps, useFormik } from 'formik'
import dayjs from 'dayjs'
import { useState } from 'react'
import { DEFAULT_DATETIME_FORMAT } from 'utils'
import { Page } from 'layout/LayoutRoute'
import Backdrop from 'components/Backdrop'
import DateTimePicker from 'components/DateTimePicker'
import HTMLEditor from 'components/HTMLEditor'
import PageTitle, { PageBreadcrumbs } from 'components/PageTitle'
import voucherService, { getByCodeBff } from 'services/web-bff/voucher'
import { VoucherInputBff } from 'services/web-bff/voucher.type'
import { PackagePriceBff } from 'services/web-bff/package-price.type'
import { UserGroup } from 'services/web-bff/user.type'
import UserGroupList from './UserGroupList'
import PackagePriceList from './PackagePriceList'
import {
  handleValidateNumericKeyPress,
  handleValidatePercentageValue,
  handleValidateCodeValue,
  handleValidateCodeKeyPress,
  handleDisableEvent,
  selectOptions,
} from './utils'

const CardWrapper = styled(Card)`
  padding: 20px;
`
const FormWrapper = styled.div`
  padding-top: 20px;
`
const ButtonSpace = styled(LoadingButton)`
  margin: 20px 10px 0 0 !important;
`
const DateTimePickerSpace = styled(DateTimePicker)`
  margin-top: 15px;
`
const SelectListSection = styled.div`
  margin: 30px 0;
`
const SelectListWrapper = styled.div`
  margin-top: 30px;
`

export interface VoucherCreateEditPageParams {
  voucherCode: string
}
export interface VoucherFormInitialValues {
  code: string
  discountPercent: number
  limitPerUser: number
  quantity: number
  startAt: string
  endAt: string
  descriptionTh: string | undefined
  descriptionEn: string | undefined
  customerGroups: UserGroup[]
  customerGroupOption: string
  packagePrices: PackagePriceBff[]
  packagePriceOption: string
  isAllPackages: boolean
}

export default function VoucherCreateEditPage(): JSX.Element {
  const { t } = useTranslation()
  const history = useHistory()
  const { voucherCode } = useParams<VoucherCreateEditPageParams>()
  const isEdit = !!voucherCode
  const pageTitle = isEdit
    ? t('voucherManagement.voucher.detail.formEdit.title')
    : t('voucherManagement.voucher.detail.formCreate.title')

  const {
    data: voucher,
    refetch,
    isFetching,
  } = useQuery('voucher', () => getByCodeBff(voucherCode, isEdit), { refetchOnWindowFocus: false })

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
    customerGroupOption: yup.string(),
    customerGroups: yup.array().when('customerGroupOption', {
      is: selectOptions.SELECT,
      then: yup.array().min(1, 'Required at least one user group'),
    }),
    packagePriceOption: yup.string(),
    packagePrices: yup.array().when('packagePriceOption', {
      is: selectOptions.SELECT,
      then: yup.array().min(1, 'Required at least one package price'),
    }),
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
  const isDisableTextField = isInactive || isActive

  function generatePackagePriceOption() {
    if (voucher) {
      if (voucher.isAllPackages) {
        return selectOptions.ALL
      } else if (voucher.packagePrices.length >= 1) {
        return selectOptions.SELECT
      }
    }
    return ''
  }

  const initialValues =
    isEdit && voucher
      ? {
          code: voucher.code,
          discountPercent: voucher.discountPercent,
          quantity: voucher.quantity,
          limitPerUser: voucher.limitPerUser,
          startAt: voucher.startAt,
          endAt: voucher.endAt,
          descriptionTh: voucher.descriptionTh,
          descriptionEn: voucher.descriptionEn,
          customerGroups: voucher.customerGroups,
          customerGroupOption:
            voucher.customerGroups.length >= 1 ? selectOptions.SELECT : selectOptions.ALL,
          packagePrices: voucher.packagePrices,
          packagePriceOption: generatePackagePriceOption(),
          isAllPackages: voucher.isAllPackages,
        }
      : {
          code: '',
          discountPercent: 0,
          quantity: 0,
          limitPerUser: 0,
          startAt: defaultDate.startAt,
          endAt: defaultDate.endAt,
          descriptionTh: '',
          descriptionEn: '',
          customerGroups: [],
          customerGroupOption: selectOptions.ALL,
          packagePrices: [],
          packagePriceOption: '',
          isAllPackages: false,
        }

  const formik: FormikProps<VoucherFormInitialValues> = useFormik<VoucherFormInitialValues>({
    enableReinitialize: true,
    validationSchema,
    initialValues,
    onSubmit: async (values, _actions) => {
      setIsLoading(true)

      const packagePrices =
        values.packagePriceOption === selectOptions.SELECT &&
        values.packagePrices &&
        values.packagePrices?.length > 0
          ? values.packagePrices.map((packagePrice) => packagePrice.id)
          : []
      const customerGroups =
        values.customerGroupOption === selectOptions.SELECT &&
        values.customerGroups &&
        values.customerGroups?.length > 0
          ? values.customerGroups.map((customerGroup) => customerGroup.id)
          : []

      const requestBody: VoucherInputBff = {
        code: values.code,
        descriptionEn: descriptionEnTemp || voucher?.descriptionEn,
        descriptionTh: descriptionThTemp || voucher?.descriptionTh,
        discountPercent: values?.discountPercent,
        quantity: values?.quantity,
        limitPerUser: values?.limitPerUser,
        startAt: values.startAt,
        endAt: values.endAt,
        isAllPackages: values.packagePriceOption === selectOptions.ALL,
        packagePrices,
        customerGroups,
      }

      const mutate = isEdit
        ? {
            function: voucherService.updateBff,
            data: { id: voucher?.id, ...requestBody },
            successMessage: t('voucher.dialog.update.success'),
            errorMessage: t('voucher.dialog.update.error'),
          }
        : {
            function: voucherService.createBff,
            data: requestBody,
            successMessage: t('voucher.dialog.create.success'),
            errorMessage: t('voucher.dialog.create.error'),
          }
      const voucherId = await mutate.function(mutate.data)
      /**
       * Known Issues: The packagePrices and customerGroups are not support when do creating a voucher.
       * Must remove this workaround after the backend was fixed the issue.
       */
      toast.promise(
        voucherService.updateBff({
          id: voucherId,
          ...requestBody,
        }),
        {
          loading: t('toast.loading'),
          success: () => {
            formik.resetForm()
            setIsLoading(false)
            refetch()
            if (!isEdit) {
              history.push('/vouchers')
            }
            return mutate.successMessage
          },
          error: (error) => {
            setIsLoading(false)
            let errorMessage = mutate.errorMessage
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
        }
      )
    },
  })

  const handleOnDescriptionChange = (value: string, language: string) => {
    if (language === 'en') {
      setDescriptionEnTemp(value)
    }
    setDescriptionThTemp(value)
  }

  const breadcrumbs: PageBreadcrumbs[] = [
    {
      text: t('voucherManagement.title'),
      link: ROUTE_PATHS.ROOT,
    },
    {
      text: t('voucherManagement.voucher.breadcrumb'),
      link: ROUTE_PATHS.VOUCHER,
    },
    {
      text: t('voucherManagement.voucher.detail.title'),
      link: ROUTE_PATHS.VOUCHER,
    },
  ]

  return (
    <Page>
      <PageTitle title={pageTitle} breadcrumbs={breadcrumbs} />
      <CardWrapper>
        <Typography id="voucher_title_table" variant="h6">
          <strong>{pageTitle}</strong>
        </Typography>
        <FormWrapper>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                id="voucher_create_edit__voucher_code_input"
                label={t('voucherManagement.voucher.detail.code')}
                margin="normal"
                name="code"
                type="text"
                variant="outlined"
                value={formik.values.code}
                onChange={formik.handleChange}
                error={formik.touched.code && Boolean(formik.errors.code)}
                helperText={formik.touched.code && formik.errors.code}
                onCut={handleDisableEvent}
                onCopy={handleDisableEvent}
                onPaste={handleDisableEvent}
                onInput={handleValidateCodeValue}
                onKeyPress={handleValidateCodeKeyPress}
                disabled={isInactive || isActive || isEdit}
              />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <DateTimePickerSpace
                inputVariant="outlined"
                fullWidth
                disablePast
                ampm={false}
                label={t('voucherManagement.voucher.detail.startAt')}
                id="startAt"
                name="startAt"
                format={DEFAULT_DATETIME_FORMAT}
                minDate={defaultDate.startAt}
                minDateMessage=""
                defaultValue={formik.values.startAt}
                value={formik.values.startAt}
                onChange={(date) => {
                  formik.setFieldValue('startAt', date)
                  formik.setFieldValue('endAt', dayjs(date || new Date()).endOf('day'))
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
                disabled={isDisableTextField}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <DateTimePickerSpace
                inputVariant="outlined"
                fullWidth
                disablePast
                ampm={false}
                label={t('voucherManagement.voucher.detail.endAt')}
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
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                id="voucher_create_edit__discountPercent_input"
                label={t('voucherManagement.voucher.detail.discountPercent')}
                name="discountPercent"
                variant="outlined"
                margin="normal"
                value={formik.values.discountPercent}
                onChange={formik.handleChange}
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: 1, max: 100, step: 1 }}
                error={formik.touched.discountPercent && Boolean(formik.errors.discountPercent)}
                helperText={formik.touched.discountPercent && formik.errors.discountPercent}
                disabled={isDisableTextField}
                onInput={handleValidatePercentageValue}
                onKeyPress={handleValidateNumericKeyPress}
                onCut={handleDisableEvent}
                onCopy={handleDisableEvent}
                onPaste={handleDisableEvent}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                id="voucher_create_edit__quantity_input"
                label={t('voucherManagement.voucher.detail.quantity')}
                name="quantity"
                variant="outlined"
                margin="normal"
                value={formik.values.quantity}
                onChange={formik.handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{ min: 1 }}
                error={formik.touched.quantity && Boolean(formik.errors.quantity)}
                helperText={formik.touched.quantity && formik.errors.quantity}
                disabled={isDisableTextField}
                onKeyPress={handleValidateNumericKeyPress}
                onCut={handleDisableEvent}
                onCopy={handleDisableEvent}
                onPaste={handleDisableEvent}
              />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                id="voucher_create_edit__limit_per_user_input"
                label={t('voucherManagement.voucher.detail.limitPerUser')}
                margin="normal"
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
                disabled={isDisableTextField}
                onKeyPress={handleValidateNumericKeyPress}
                onCut={handleDisableEvent}
                onCopy={handleDisableEvent}
                onPaste={handleDisableEvent}
              />
            </Grid>
          </Grid>
          <br />
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <HTMLEditor
                id="description-en"
                label={t('voucher.description.en')}
                initialValue={formik.values.descriptionEn}
                handleOnEditChange={(value: string) => handleOnDescriptionChange(value, 'en')}
                disabled={isDisableTextField}
              />
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <HTMLEditor
                id="description-th"
                label={t('voucher.description.th')}
                initialValue={formik.values.descriptionTh}
                handleOnEditChange={(value: string) => handleOnDescriptionChange(value, 'th')}
                disabled={isDisableTextField}
              />
            </Grid>
          </Grid>
          <SelectListSection>
            <Typography id="voucher_sub_title__user_group" variant="h6">
              <strong>{t('voucherManagement.userGroup.title')}</strong>
            </Typography>
            <SelectListWrapper>
              <UserGroupList voucher={voucher} formik={formik} />
            </SelectListWrapper>
          </SelectListSection>
          <SelectListSection>
            <Typography id="voucher_sub_title__package_price" variant="h6">
              <strong>{t('voucherManagement.packagePrice.title')}</strong>
            </Typography>
            <SelectListWrapper>
              <PackagePriceList voucher={voucher} formik={formik} />
            </SelectListWrapper>
          </SelectListSection>
        </FormWrapper>
      </CardWrapper>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <ButtonSpace
            type="submit"
            color="primary"
            variant="contained"
            size="large"
            onClick={() => formik.handleSubmit()}
            loading={isLoading}
            disabled={!(formik.isValid && formik.dirty) || isLoading || isInactive}
          >
            {t('button.save').toUpperCase()}
          </ButtonSpace>
          <Link to="/vouchers">
            <ButtonSpace color="primary" variant="outlined" size="large">
              {t('button.cancel').toUpperCase()}
            </ButtonSpace>
          </Link>
        </Grid>
      </Grid>
      <Backdrop open={isFetching} />
    </Page>
  )
}
