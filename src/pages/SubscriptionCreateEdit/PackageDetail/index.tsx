/* eslint-disable react/forbid-component-props */
import * as yup from 'yup'
import dayjs from 'dayjs'
import styled from 'styled-components'
import { FormEvent, useState } from 'react'
import { useAuth } from 'auth/AuthContext'
import { useTranslation } from 'react-i18next'
import { Grid, TextField } from '@material-ui/core'
import { alpha, makeStyles } from '@material-ui/core/styles'
import { useHistory } from 'react-router-dom'
import {
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  IconButton,
  InputAdornment,
  MenuItem,
  Switch,
  Typography,
} from '@mui/material'
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined'
import ClearIcon from '@mui/icons-material/Clear'
import { useFormik } from 'formik'
import toast from 'react-hot-toast'
import { createPackage } from 'services/web-bff/new-subscription'
import DatePicker from 'components/DatePicker'
import HTMLEditor from 'components/HTMLEditor'
import UploadImageDialog from 'components/UploadImageDialog'
import { Page } from 'layout/LayoutRoute'

const useStyles = makeStyles({
  space: {
    marginBottom: '24px;',
  },
  clearButton: {
    position: 'absolute',
    right: 24,
  },
  input: {
    paddingRight: 0,
  },
})
const TitleTypography = styled(Typography)`
  margin-bottom: 44px !important;
`
const Wrapper = styled(Card)`
  padding: 15px;
  margin-top: 20px;
`
const DividerSpace = styled(Divider)`
  margin-bottom: 24px;
`
const InputField = styled(Container)`
  padding: 0px 8px 24px 8px !important;
`
const ButtonSpace = styled(Button)`
  margin-right: 10px !important;
`

const PublishedSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase': {
    color: '#FAFAFA',
    '&:hover': {
      backgroundColor: alpha('#FAFAFA', theme.palette.action.hoverOpacity),
    },
  },
}))

export default function PackageDetail(): JSX.Element {
  const { t } = useTranslation()
  const accessToken = useAuth().getToken() ?? ''
  const currentDate = dayjs()
  const history = useHistory()
  const classes = useStyles()
  const defaultDate = {
    minDate: currentDate,
    maxDate: currentDate.add(90, 'day'),
  }
  const packageNameLimit = 50
  const packageFeatureLimt = 300
  const [fullPriceError, setFullPriceError] = useState<string>('')
  const [priceError, setPriceError] = useState<string>('')
  const [packagePeriodMonthError, setPackagePeriodMonthError] = useState<string>('')
  const [packageNameEnError, setPackageNameEnError] = useState<string>('')
  const [packageNameThError, setPackageNameThError] = useState<string>('')
  const [editorFieldErrorEn, setEditorFieldErrorEn] = useState<string>('')
  const [editorFieldErrorTh, setEditorFieldErrorTh] = useState<string>('')
  const [editorDetailFieldErrorEn, setEditorDetailFieldErrorEn] = useState<string>('')
  const [editorDetailFieldErrorTh, setEditorDetailFieldErrorTh] = useState<string>('')
  const [visibleUpdateDialog, setVisibleUpdateDialog] = useState<boolean>(false)

  const validateFullPrice = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value)
    if (isNaN(value)) {
      formik.setFieldValue('fullPrice', null)
      setFullPriceError('')
      if (formik.values.price !== null) {
        setPriceError('')
      }
    } else {
      formik.setFieldValue('fullPrice', value)
      if (value < 1 || value > 999999) {
        setFullPriceError(t('newSubcription.validation.errors.textInvalid'))
      } else {
        setFullPriceError('')
      }
      if (value <= formik.values.price) {
        setPriceError(t('newSubcription.validation.errors.textInvalid'))
      } else {
        setPriceError('')
      }
    }
  }

  const validatePrice = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value)
    if (isNaN(value)) {
      formik.setFieldValue('price', null)
      setPriceError(t('newSubcription.validation.errors.required'))
    } else {
      formik.setFieldValue('price', value)
      if (
        value > 999999 ||
        (formik.values.fullPrice <= value && formik.values.fullPrice !== null)
      ) {
        setPriceError(t('newSubcription.validation.errors.textInvalid'))
      } else {
        setPriceError('')
      }
    }
  }

  const validatePackagePeriodMonth = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value)
    if (isNaN(value)) {
      formik.setFieldValue('packagePeriodMonth', null)
      setPackagePeriodMonthError(t('newSubcription.validation.errors.required'))
    } else {
      formik.setFieldValue('packagePeriodMonth', value)
      if (value < 1 || value > 999999) {
        setPackagePeriodMonthError(t('newSubcription.validation.errors.textInvalid'))
      } else {
        setPackagePeriodMonthError('')
      }
    }
  }

  const validatePackageName = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    formik.setFieldValue('packageNameEn', event.target.value)
    if (value.length === 0) {
      setPackageNameEnError(t('newSubcription.validation.errors.required'))
    } else if (value.length > packageNameLimit) {
      setPackageNameEnError(t('newSubcription.validation.errors.invalidFormat'))
    } else {
      setPackageNameEnError('')
    }
  }

  const validateBulletPackageListEn = (text: string) => {
    const validateBullet = (text.match(/<li>/g) || []).length
    if (text.length === 0) {
      setEditorFieldErrorEn(t('newSubcription.validation.errors.required'))
    } else if (validateBullet > 5 || validateBullet < 3) {
      setEditorFieldErrorEn(t('newSubcription.validation.errors.limitBullet'))
    } else {
      setEditorFieldErrorEn('')
    }
  }

  const validatePackageNameTh = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    formik.setFieldValue('packageNameTh', event.target.value)
    if (value.length === 0) {
      setPackageNameThError(t('newSubcription.validation.errors.required'))
    } else if (value.length > packageNameLimit) {
      setPackageNameThError(t('newSubcription.validation.errors.invalidFormat'))
    } else {
      setPackageNameThError('')
    }
  }

  const validateBulletPackageListTh = (text: string) => {
    const validateBullet = (text.match(/<li>/g) || []).length
    if (text.length === 0) {
      setEditorFieldErrorTh(t('newSubcription.validation.errors.required'))
    } else if (validateBullet > 5 || validateBullet < 3) {
      setEditorFieldErrorTh(t('newSubcription.validation.errors.limitBullet'))
    } else {
      setEditorFieldErrorTh('')
    }
  }

  const validatePackageListMessageEn = (text: string) => {
    const validateBullet = (text.match(/<li>/g) || []).length
    if (text.length === 0) {
      setEditorDetailFieldErrorEn(t('newSubcription.validation.errors.required'))
    } else if (text.length > packageFeatureLimt) {
      setEditorDetailFieldErrorEn(t('newSubcription.validation.errors.editorFormat'))
    } else if (validateBullet > 5 || validateBullet < 3) {
      setEditorDetailFieldErrorEn(t('newSubcription.validation.errors.limitBullet'))
    } else {
      setEditorDetailFieldErrorEn('')
    }
  }

  const validatePackageListMessageTh = (text: string) => {
    const validateBullet = (text.match(/<li>/g) || []).length
    if (text.length === 0) {
      setEditorDetailFieldErrorTh(t('newSubcription.validation.errors.required'))
    } else if (text.length > packageFeatureLimt) {
      setEditorDetailFieldErrorTh(t('newSubcription.validation.errors.editorFormat'))
    } else if (validateBullet > 5 || validateBullet < 3) {
      setEditorDetailFieldErrorTh(t('newSubcription.validation.errors.limitBullet'))
    } else {
      setEditorDetailFieldErrorTh('')
    }
  }

  const handleValidateNumericKeyPress = (event: React.KeyboardEvent) => {
    const allowCharacters = /[0-9]/
    if (!allowCharacters.test(event.key)) {
      event.preventDefault()
    }
  }

  const handleDisableEvent = (event: FormEvent) => {
    event.preventDefault()
  }

  const handleClearClick = () => {
    formik.setFieldValue('badge', '')
  }

  const validationSchema = yup.object({
    badge: yup.string(),
    publishDate: yup
      .date()
      .typeError(t('newSubcription.validation.errors.required'))
      .required(t('newSubcription.validation.errors.required')),
    price: yup.number().required(t('newSubcription.validation.errors.required')),
    packagePeriodMonth: yup.number().required(t('newSubcription.validation.errors.required')),
    packageNameEn: yup.string().required(t('newSubcription.validation.errors.required')),
    packageNameTh: yup.string().required(t('newSubcription.validation.errors.required')),
  })

  const formik = useFormik({
    validationSchema,
    initialValues: {
      badge: '',
      publishDate: null,
      published: false,
      fullPrice: 0,
      price: 0,
      packagePeriodMonth: 0,
      packageNameEn: '',
      packageNameTh: '',
      listBanner:
        'https://w7.pngwing.com/pngs/347/928/png-transparent-tesla-model-x-tesla-model-s-tesla-motors-tesla-model-3-tesla-compact-car-sedan-headlamp.png',
      detailBanner:
        'https://w7.pngwing.com/pngs/347/928/png-transparent-tesla-model-x-tesla-model-s-tesla-motors-tesla-model-3-tesla-compact-car-sedan-headlamp.png',
      editorPackageDetailEn: '<ul><li></li><li></li><li></li></ul>',
      editorPackageDetailTh: '<ul><li></li><li></li><li></li></ul>',
      editorPackageListEn: '<ul><li></li><li></li><li></li></ul>',
      editorPackageListTh: '<ul><li></li><li></li><li></li></ul>',
    },
    enableReinitialize: false,
    onSubmit: (values, actions) => {
      actions.setSubmitting(true)
      toast
        .promise(
          createPackage({
            accessToken,
            badge: values.badge,
            publishDate: values.publishDate ?? dayjs(),
            fullPrice: values.fullPrice,
            price: values.price,
            periodMonth: values.packagePeriodMonth,
            nameEn: values.packageNameEn,
            nameTh: values.packageNameTh,
            featureEn: values.editorPackageDetailEn,
            featureTh: values.editorPackageDetailTh,
            descriptionEn: values.editorPackageListEn,
            descriptionTh: values.editorPackageListTh,
            isPublish: values.published,
            listBanner: values.listBanner,
            detailBanner: values.detailBanner,
          }),
          {
            loading: t('toast.loading'),
            success: t('newSubcription.dialog.createDialog.success'),
            error: (error) =>
              t('newSubcription.dialog.createDialog.failed', {
                error: error.message || error,
              }),
          }
        )
        .finally(() => {
          actions.resetForm()
          actions.setSubmitting(false)
          history.goBack()
        })
    },
  })

  return (
    <Page>
      <form onSubmit={formik.handleSubmit}>
        <Wrapper>
          <TitleTypography variant="h5"> {t('newSubcription.packageDetail.title')}</TitleTypography>
          <InputField maxWidth={false}>
            <Grid container spacing={5}>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  select
                  label="Badge"
                  id="badge"
                  name="badge"
                  variant="outlined"
                  value={formik.values.badge}
                  onChange={formik.handleChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end" className={classes.clearButton}>
                        {formik.values.badge && (
                          <IconButton onClick={handleClearClick}>
                            <ClearIcon />
                          </IconButton>
                        )}
                      </InputAdornment>
                    ),
                    classes: {
                      adornedEnd: classes.input,
                    },
                  }}
                  SelectProps={{
                    MenuProps: {
                      anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'left',
                      },
                      getContentAnchorEl: null,
                    },
                  }}
                >
                  <MenuItem value="Hot">Hot</MenuItem>
                  <MenuItem value="Recommended">Recommended</MenuItem>
                  <MenuItem value="Coming Soon">Coming Soon</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={4}>
                <DatePicker
                  fullWidth
                  disablePast
                  inputVariant="outlined"
                  label="Publish Date"
                  id="publishDate"
                  name="publishDate"
                  format="D MMM YYYY"
                  minDate={defaultDate.minDate}
                  maxDate={defaultDate.maxDate}
                  defaultValue={formik.values.publishDate}
                  value={formik.values.publishDate}
                  onChange={(date) => {
                    formik.setFieldValue('publishDate', date)
                  }}
                  error={formik.touched.publishDate && Boolean(formik.errors.publishDate)}
                  helperText={formik.touched.publishDate && formik.errors.publishDate}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl component="fieldset">
                  <FormControlLabel
                    control={
                      <PublishedSwitch
                        id="published"
                        name="published"
                        checked={formik.values.published}
                        value={formik.values.published}
                        onChange={formik.handleChange}
                      />
                    }
                    label={
                      <Typography variant="body1" color="textPrimary">
                        Published
                      </Typography>
                    }
                  />
                </FormControl>
              </Grid>
            </Grid>
          </InputField>
          <InputField maxWidth={false}>
            <Grid container spacing={5}>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  type="number"
                  label="Full Price"
                  id="subscription-add__fullPrice_input"
                  name="fullPrice"
                  variant="outlined"
                  value={formik.values.fullPrice}
                  error={
                    !!fullPriceError ||
                    (formik.touched.fullPrice && Boolean(formik.errors.fullPrice))
                  }
                  helperText={
                    fullPriceError || (formik.touched.fullPrice && formik.errors.fullPrice)
                  }
                  onChange={validateFullPrice}
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
                  label="Price"
                  id="price"
                  name="price"
                  variant="outlined"
                  value={formik.values.price}
                  error={!!priceError || (formik.touched.price && Boolean(formik.errors.price))}
                  helperText={priceError || (formik.touched.price && formik.errors.price)}
                  onChange={validatePrice}
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
                  label="Package Period (Month)"
                  id="packagePeriodMonth"
                  name="packagePeriodMonth"
                  variant="outlined"
                  value={formik.values.packagePeriodMonth}
                  error={
                    !!packagePeriodMonthError ||
                    (formik.touched.packagePeriodMonth && Boolean(formik.errors.packagePeriodMonth))
                  }
                  helperText={
                    packagePeriodMonthError ||
                    (formik.touched.packagePeriodMonth && formik.errors.packagePeriodMonth)
                  }
                  onChange={validatePackagePeriodMonth}
                  onKeyPress={handleValidateNumericKeyPress}
                  onCut={handleDisableEvent}
                  onCopy={handleDisableEvent}
                  onPaste={handleDisableEvent}
                />
              </Grid>
            </Grid>
          </InputField>
        </Wrapper>
        <Wrapper>
          <TitleTypography variant="h5">{t('newSubcription.packageList.title')}</TitleTypography>
          <TitleTypography variant="h5">{t('newSubcription.packageList.banner')}</TitleTypography>
          <Card variant="outlined">
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12}>
                  <Grid container justifyContent="center">
                    <UploadFileOutlinedIcon sx={{ fontSize: 80, color: '#BDBDBD' }} />
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <Grid container justifyContent="center">
                    <Typography variant="h5" component="h1">
                      Upload banner
                    </Typography>
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <Grid container justifyContent="center">
                    <Button
                      variant="contained"
                      component="label"
                      startIcon={<UploadFileOutlinedIcon />}
                      onClick={() => {
                        setVisibleUpdateDialog(true)
                      }}
                    >
                      Upload
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <UploadImageDialog
            visible={visibleUpdateDialog}
            onClose={() => {
              setVisibleUpdateDialog(false)
            }}
          />
          <div className={classes.space}>
            <TitleTypography variant="caption" color="#BDBDBD">
              {t('newSubcription.dialog.imageUpload.reccommend')}
            </TitleTypography>
          </div>
          <TitleTypography variant="h5">{t('newSubcription.packageList.message')}</TitleTypography>
          <Grid
            item
            xs={12}
            sm={12}
            style={{
              marginTop: 24,
              marginBottom: 24,
            }}
          >
            <TextField
              fullWidth
              label="Package Name (EN)"
              id="packageName"
              name="packageNameEn"
              variant="outlined"
              value={formik.values.packageNameEn}
              error={
                !!packageNameEnError ||
                (formik.touched.packageNameEn && Boolean(formik.errors.packageNameEn))
              }
              helperText={
                packageNameEnError || (formik.touched.packageNameEn && formik.errors.packageNameEn)
              }
              onChange={validatePackageName}
              onCut={handleDisableEvent}
              onCopy={handleDisableEvent}
              onPaste={handleDisableEvent}
            />
          </Grid>
          <Grid container spacing={5}>
            <Grid item xs={12} sm={12}>
              <HTMLEditor
                id="contentEn"
                label={t('newSubcription.packageList.contentEn')}
                initialValue={formik.values.editorPackageDetailEn}
                handleOnEditChange={(value: string) => validateBulletPackageListEn(value)}
              />
              {editorFieldErrorEn !== '' && (
                <FormHelperText error={true}>{editorFieldErrorEn}</FormHelperText>
              )}
              <Grid
                item
                xs={12}
                sm={12}
                style={{
                  marginTop: 24,
                  marginBottom: 24,
                }}
              >
                <TextField
                  fullWidth
                  label="Package Name (TH)"
                  id="packageNameTh"
                  name="packageNameTh"
                  variant="outlined"
                  value={formik.values.packageNameTh}
                  error={
                    !!packageNameThError ||
                    (formik.touched.packageNameTh && Boolean(formik.errors.packageNameTh))
                  }
                  helperText={
                    packageNameThError ||
                    (formik.touched.packageNameTh && formik.errors.packageNameTh)
                  }
                  onChange={validatePackageNameTh}
                  onCut={handleDisableEvent}
                  onCopy={handleDisableEvent}
                  onPaste={handleDisableEvent}
                />
              </Grid>
              <HTMLEditor
                id="contentTh"
                label={t('newSubcription.packageList.contentTh')}
                initialValue={formik.values.editorPackageDetailTh}
                handleOnEditChange={(value: string) => validateBulletPackageListTh(value)}
              />
              {editorFieldErrorTh !== '' && (
                <FormHelperText error={true}>{editorFieldErrorTh}</FormHelperText>
              )}
            </Grid>
          </Grid>
        </Wrapper>
        <Wrapper>
          <TitleTypography variant="h5">{t('newSubcription.packageDetail.title')}</TitleTypography>
          <TitleTypography variant="h5">{t('newSubcription.packageDetail.banner')}</TitleTypography>
          <Card variant="outlined" sx={{ marginBottom: '20px' }}>
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12}>
                  <Grid container justifyContent="center">
                    <UploadFileOutlinedIcon sx={{ fontSize: 80, color: '#BDBDBD' }} />
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <Grid container justifyContent="center">
                    <Typography variant="h5" component="h1">
                      {t('newSubcription.dialog.imageUpload.title')}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <Grid container justifyContent="center">
                    <Button
                      variant="contained"
                      component="label"
                      startIcon={<UploadFileOutlinedIcon />}
                      onClick={() => {
                        setVisibleUpdateDialog(true)
                      }}
                    >
                      {t('button.upload')}
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
          <TitleTypography variant="h5">
            {t('newSubcription.packageDetail.message')}
          </TitleTypography>
          <Grid container spacing={5}>
            <Grid item xs={12} sm={12}>
              <HTMLEditor
                id="contentDetailEn"
                label={t('newSubcription.packageDetail.contentEn')}
                initialValue={formik.values.editorPackageListEn}
                handleOnEditChange={(value: string) => validatePackageListMessageEn(value)}
              />
              {editorDetailFieldErrorEn !== '' && (
                <FormHelperText error={true}>{editorDetailFieldErrorEn}</FormHelperText>
              )}

              <HTMLEditor
                id="contentDetailTh"
                label={t('newSubcription.packageDetail.contentTh')}
                initialValue={formik.values.editorPackageListTh}
                handleOnEditChange={(value: string) => validatePackageListMessageTh(value)}
              />
              {editorDetailFieldErrorTh !== '' && (
                <FormHelperText error={true}>{editorDetailFieldErrorTh}</FormHelperText>
              )}
            </Grid>
            <DividerSpace />
            <Grid item xs={12} style={{ textAlign: 'left' }}>
              <ButtonSpace color="primary" variant="contained" type="submit">
                {t('button.save')}
              </ButtonSpace>
              <Button variant="outlined" onClick={() => history.goBack()}>
                {t('button.cancel')}
              </Button>
            </Grid>
          </Grid>
        </Wrapper>
      </form>
    </Page>
  )
}
