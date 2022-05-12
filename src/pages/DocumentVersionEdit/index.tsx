/* eslint-disable react/forbid-component-props */
import * as yup from 'yup'
import dayjs from 'dayjs'
import styled from 'styled-components'
import { DEFAULT_DATETIME_FORMAT } from 'utils'
import { useState } from 'react'
import { useHistory, Link as RouterLink, useParams } from 'react-router-dom'
import { Breadcrumbs, Button, Divider, Grid, Link, Typography, TextField } from '@material-ui/core'
import { useTranslation } from 'react-i18next'
import { useFormik } from 'formik'
import { Page } from 'layout/LayoutRoute'
import DateTimePicker from 'components/DateTimePicker'
import HTMLEditor from 'components/HTMLEditor'

interface DocumentVersionEditParams {
  documentId: string
  versionId: string
}

const BreadcrumbsWrapper = styled(Breadcrumbs)`
  margin: 10px 0 20px 0;
`
const DividerSpace = styled(Divider)`
  margin: 20px 0;
`
const ButtonSpace = styled(Button)`
  margin: 0 0 0 10px;
`

export default function DocumentVersionEdit(): JSX.Element {
  const history = useHistory()
  const { documentId, versionId } = useParams<DocumentVersionEditParams>()
  const { t } = useTranslation()
  const isEdit = versionId !== 'add'
  const title = isEdit ? t('documents.addEdit.titles.edit') : t('documents.addEdit.titles.add')

  // const [isLoading, setIsLoading] = useState<boolean>(false)
  const [contentThTemp, setcontentThTemp] = useState<string | null>()
  const [contentEnTemp, setcontentEnTemp] = useState<string | null>()

  const validationSchema = yup.object({
    titleTH: yup.string().required(t('validation.required')),
    titleEN: yup.string().required(t('validation.required')),
    effectiveDateTime: yup.date().required(t('validation.required')),
  })

  const datePlusOneDay = dayjs().add(1, 'day')
  const formik = useFormik({
    validationSchema,
    initialValues: {
      effectiveDateTime: datePlusOneDay,
      titleTH: '',
      titleEN: '',
      contentTH: '',
      contentEN: '',
    },
    onSubmit: (values) => {
      console.log('values ->', values)
      console.log('contentThTemp ->', contentThTemp)
      console.log('contentEnTemp ->', contentEnTemp)
    },
  })

  const handleOnDescriptionChange = (value: string, language: string) => {
    if (language === 'th') {
      setcontentThTemp(value)
      formik.setFieldValue('contentTH', value)
      return true
    }
    setcontentEnTemp(value)
    formik.setFieldValue('contentEN', value)
    return true
  }

  const resetForm = () => {
    formik.resetForm()
    setcontentThTemp('')
    setcontentEnTemp('')
    history.push(`/documents/${documentId}/versions`)
  }

  return (
    <Page>
      <Typography variant="h3" color="inherit" component="h1">
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
          to={`/documents/${documentId}/versions`}
        >
          {t('documents.overviewAndVersions')}
        </Link>
        <Typography color="textPrimary">{title}</Typography>
      </BreadcrumbsWrapper>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <DateTimePicker
            inputVariant="outlined"
            fullWidth
            disablePast
            ampm={false}
            label={t('documents.addEdit.effectiveDateTime')}
            id="effectiveDateTime"
            name="effectiveDateTime"
            format={DEFAULT_DATETIME_FORMAT}
            minDate={formik.values.effectiveDateTime}
            minDateMessage=""
            defaultValue={formik.values.effectiveDateTime}
            value={formik.values.effectiveDateTime}
            onChange={(date) => {
              formik.setFieldValue('effectiveDateTime', date)
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
          />
        </Grid>
      </Grid>
      <DividerSpace />
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label={t('documents.addEdit.titleTH')}
            id="titleTH"
            name="titleTH"
            variant="outlined"
            value={formik.values.titleTH}
            onChange={formik.handleChange}
            InputLabelProps={{
              shrink: true,
            }}
            error={formik.touched.titleTH && Boolean(formik.errors.titleTH)}
            helperText={formik.touched.titleTH && formik.errors.titleTH}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label={t('documents.addEdit.titleEN')}
            id="titleEN"
            name="titleEN"
            variant="outlined"
            value={formik.values.titleEN}
            onChange={formik.handleChange}
            InputLabelProps={{
              shrink: true,
            }}
            error={formik.touched.titleEN && Boolean(formik.errors.titleEN)}
            helperText={formik.touched.titleEN && formik.errors.titleEN}
          />
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <HTMLEditor
            id="contentTH"
            label={t('documents.addEdit.contentTH')}
            initialValue={formik.values.contentTH}
            handleOnEditChange={(value: string) => handleOnDescriptionChange(value, 'th')}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <HTMLEditor
            id="contentEN"
            label={t('documents.addEdit.contentEN')}
            initialValue={formik.values.contentEN}
            handleOnEditChange={(value: string) => handleOnDescriptionChange(value, 'en')}
          />
        </Grid>
      </Grid>
      <DividerSpace />
      <Grid container spacing={3}>
        <Grid item xs={12} style={{ textAlign: 'right' }}>
          <Button onClick={() => resetForm()}>{t('button.cancel')}</Button>
          <ButtonSpace
            type="submit"
            onClick={() => formik.handleSubmit()}
            color="primary"
            variant="contained"
          >
            {t(isEdit ? 'button.update' : 'button.create')}
          </ButtonSpace>
        </Grid>
      </Grid>
    </Page>
  )
}
