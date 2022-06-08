/* eslint-disable no-alert */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/forbid-component-props */
import * as yup from 'yup'
import dayjs from 'dayjs'
import styled from 'styled-components'
import toast from 'react-hot-toast'
import { useBeforeunload } from 'react-beforeunload'
import { DEFAULT_DATETIME_FORMAT } from 'utils'
import { useEffect, useState } from 'react'
import { useHistory, Link as RouterLink, useParams } from 'react-router-dom'
import { Breadcrumbs, Button, Divider, Grid, Link, Typography, TextField } from '@material-ui/core'
import Alert from '@material-ui/lab/Alert'
import { useTranslation } from 'react-i18next'
import { useFormik } from 'formik'
import { useQuery } from 'react-query'
import { Page } from 'layout/LayoutRoute'
import DateTimePicker from 'components/DateTimePicker'
import HTMLEditor from 'components/HTMLEditor'
import {
  getDetail,
  getVersionDetail,
  getLatestVersion,
  createNew,
  updateByVersion,
} from 'services/web-bff/document'
import { mapErrorMessage, mapAlertErrorField } from './error'

interface DocumentVersionEditParams {
  documentCode: string
  version: string
}

const BreadcrumbsWrapper = styled(Breadcrumbs)`
  margin: 10px 0 20px 0;
`
const AlertWrapper = styled.div`
  margin: 10px 0 20px 0;
`
const AlertItem = styled(Alert)`
  margin: 2px 0;
`
const DividerSpace = styled(Divider)`
  margin: 20px 0;
`
const ButtonSpace = styled(Button)`
  margin: 0 0 0 10px;
`

export default function DocumentVersionEdit(): JSX.Element {
  const history = useHistory()
  const { documentCode, version } = useParams<DocumentVersionEditParams>()
  const { t, i18n } = useTranslation()
  const currentVersion = +version
  const currentLanguage = i18n.language
  const isEdit = version !== 'add'
  const isTherePreviousVersion = currentVersion > 1
  const [contentThTemp, setContentThTemp] = useState<string | undefined>()
  const [contentEnTemp, setContentEnTemp] = useState<string | undefined>()
  const [getBackOrOutFinish, setGetBackOrOutFinish] = useState<boolean>(false)

  const { data: documentDetail } = useQuery('document-detail', () =>
    getDetail({ code: documentCode })
  )
  const { data: document, isFetched } = useQuery(
    'document-current-version',
    () => (isEdit ? getVersionDetail({ code: documentCode, version: currentVersion }) : undefined),
    {
      cacheTime: 0,
    }
  )
  const { data: documentPreviousVersion, isFetched: isFetchedPreviousVersion } = useQuery(
    'document-previous-version',
    () =>
      isTherePreviousVersion
        ? getVersionDetail({ code: documentCode, version: currentVersion - 1 })
        : undefined,
    {
      cacheTime: 0,
    }
  )
  const { data: documentLatestVersion, isFetched: isFetchedLastVersion } = useQuery(
    'document-latest-version',
    () => (!isEdit ? getLatestVersion(documentCode) : undefined),
    {
      cacheTime: 0,
    }
  )

  const documentName = currentLanguage === 'th' ? documentDetail?.nameTh : documentDetail?.nameEn
  const documentTitle = isEdit ? 'documents.addEdit.titles.edit' : 'documents.addEdit.titles.add'
  const title = t(documentTitle, { version })
  const isAllDataFetched = isFetched || isFetchedPreviousVersion || isFetchedLastVersion
  const validationSchema = yup.object({
    remark: yup.string().required(t('validation.required')),
    effectiveDate: yup.date().required(t('validation.required')),
    contentTh: yup.string().required(t('validation.required')),
    contentEn: yup.string().required(t('validation.required')),
  })
  const isTodayGreaterThenLatestVersionEffectiveDate =
    dayjs() > dayjs(documentLatestVersion?.effectiveDate)
  const dateAvailableToSelect = dayjs(
    // eslint-disable-next-line no-nested-ternary
    isEdit
      ? documentPreviousVersion?.effectiveDate
      : isTodayGreaterThenLatestVersionEffectiveDate
      ? dayjs()
      : documentLatestVersion?.effectiveDate
  )
    .add(1, 'day')
    .startOf('day')

  const formik = useFormik({
    validationSchema,
    initialValues: {
      effectiveDate: dateAvailableToSelect,
      remark: '',
      contentTh: '',
      contentEn: '',
    },
    onSubmit: (values) => {
      const documentObject = {
        ...values,
        code: documentCode,
        version: currentVersion,
        contentTh: contentThTemp,
        contentEn: contentEnTemp,
      }
      const requestFunction = isEdit ? updateByVersion : createNew
      toast.promise(requestFunction(documentObject), {
        loading: t('toast.loading'),
        success: () => {
          resetForm()
          return 'Success'
        },
        error: (error) => mapErrorMessage(error, t),
      })
    },
  })

  const handleOnDescriptionChange = (value: string, language: string) => {
    if (language === 'th') {
      setContentThTemp(value)
      formik.setFieldValue('contentTh', value)
      return true
    }
    setContentEnTemp(value)
    formik.setFieldValue('contentEn', value)
    return true
  }

  const resetForm = () => {
    formik.resetForm()
    setContentThTemp('')
    setContentEnTemp('')
    return history.push(`/documents/${documentCode}/versions`)
  }

  useEffect(() => {
    formik.setFieldValue('effectiveDate', dayjs(document?.effectiveDate))
    formik.setFieldValue('remark', document?.remark ?? '')
    formik.setFieldValue('contentTh', document?.contentTh)
    formik.setFieldValue('contentEn', document?.contentEn)
    setContentThTemp(document?.contentTh)
    setContentEnTemp(document?.contentEn)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetched, isFetchedPreviousVersion])

  useEffect(() => {
    formik.setFieldValue('effectiveDate', dateAvailableToSelect)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFetchedLastVersion])

  const onBeforeLeavePage = (event: PopStateEvent | BeforeUnloadEvent) => {
    event.preventDefault()
    if (!getBackOrOutFinish) {
      if (window.confirm(t('browserEvents.leaveSite'))) {
        setGetBackOrOutFinish(true)
        return history.goBack()
      }
      setGetBackOrOutFinish(false)
      return window.history.pushState(null, '', window.location.pathname)
    }
  }

  useBeforeunload((event: BeforeUnloadEvent) => onBeforeLeavePage(event))

  useEffect(() => {
    window.history.pushState(null, '', window.location.pathname)
    window.addEventListener('popstate', onBeforeLeavePage)
    return () => {
      window.removeEventListener('popstate', onBeforeLeavePage)
    }
  }, [])

  /**
   * Render errors
   * X 1111, 2222, 3333
   */
  const renderErrorAlert =
    Object.keys(formik.errors).length > 0 ? (
      <AlertItem severity="error">
        {Object.entries(formik.errors)
          .map(([key, value]) => {
            return `${mapAlertErrorField(key, t)} ${value}`
          })
          .join(', ')}
      </AlertItem>
    ) : (
      ''
    )
  const isDisabledSubmitButton = !isAllDataFetched || !!renderErrorAlert

  /**
   * Render errors
   * X 1111
   * X 2222
   * X 3333
   */
  // const renderErrorAlert = Object.entries(formik.errors).map(([key, value]) => {
  //   return (
  //     <AlertItem severity="error" key={key}>{`${mapAlertErrorField(key, t)} ${value}`}</AlertItem>
  //   )
  // })
  // const isDisabledSubmitButton = !isAllDataFetched || renderErrorAlert.length > 0

  return (
    <Page>
      <Typography variant="h5" color="inherit" component="h1">
        {title}
      </Typography>
      <BreadcrumbsWrapper aria-label="breadcrumb">
        <Link underline="hover" color="inherit" component={RouterLink} to="/">
          {t('sidebar.others')}
        </Link>
        <Link underline="hover" color="inherit" component={RouterLink} to="/documents">
          {t('documents.header')}
        </Link>
        <Link
          underline="hover"
          color="inherit"
          component={RouterLink}
          to={`/documents/${documentCode}/versions`}
        >
          {documentName}
        </Link>
        <Typography color="textPrimary">{title}</Typography>
      </BreadcrumbsWrapper>

      <AlertWrapper>{renderErrorAlert}</AlertWrapper>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <DateTimePicker
            inputVariant="outlined"
            fullWidth
            disablePast
            ampm={false}
            label={t('documents.addEdit.effectiveDate')}
            id="effectiveDate"
            name="effectiveDate"
            format={DEFAULT_DATETIME_FORMAT}
            minDate={dateAvailableToSelect}
            minDateMessage=""
            defaultValue={formik.values.effectiveDate}
            value={formik.values.effectiveDate}
            onChange={(date) => {
              formik.setFieldValue('effectiveDate', date)
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
            helperText={t('documents.addEdit.helpers.effectiveDateGreaterThanLastVersion')}
          />
        </Grid>
      </Grid>
      <DividerSpace />
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label={t('documents.addEdit.revisionSummary')}
            id="remark"
            name="remark"
            variant="outlined"
            value={formik.values.remark}
            onChange={formik.handleChange}
            InputLabelProps={{
              shrink: true,
            }}
            error={formik.touched.remark && Boolean(formik.errors.remark)}
            helperText={formik.touched.remark && formik.errors.remark}
            multiline
            rows={5}
          />
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <HTMLEditor
            id="contentTh"
            label={t('documents.addEdit.contentTh')}
            initialValue={document?.contentTh}
            handleOnEditChange={(value: string) => handleOnDescriptionChange(value, 'th')}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <HTMLEditor
            id="contentEn"
            label={t('documents.addEdit.contentEn')}
            initialValue={document?.contentEn}
            handleOnEditChange={(value: string) => handleOnDescriptionChange(value, 'en')}
          />
        </Grid>
      </Grid>
      <DividerSpace />
      <Grid container spacing={3}>
        <Grid item xs={12} style={{ textAlign: 'right' }}>
          <Button onClick={() => history.goBack()}>{t('button.cancel')}</Button>
          <ButtonSpace
            type="submit"
            onClick={() => formik.handleSubmit()}
            color="primary"
            variant="contained"
            disabled={isDisabledSubmitButton}
          >
            {t(isEdit ? 'button.update' : 'button.add')}
          </ButtonSpace>
        </Grid>
      </Grid>
    </Page>
  )
}
