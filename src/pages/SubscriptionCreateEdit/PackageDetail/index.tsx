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
  FormControl,
  FormControlLabel,
  FormHelperText,
  IconButton,
  InputAdornment,
  MenuItem,
  Stack,
  Switch,
  Typography,
} from '@mui/material'
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined'
import ClearIcon from '@mui/icons-material/Clear'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers'
import { useFormik } from 'formik'
import toast from 'react-hot-toast'
import { createPackage } from 'services/web-bff/new-subscription'
import HTMLEditor from 'components/HTMLEditor'
import UploadImageDialog from 'components/UploadImageDialog'

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

const ButtonSpace = styled(Button)`
  margin-right: 10px !important;
`

const PackageDetailSpacing = styled(Card)`
  padding: 20px 16px 0px 16px;
`

const HtmlContentEnSpace = styled(Container)`
  padding: 0px 8px 30px 8px !important;
`

const HtmlContentThSpace = styled(Container)`
  padding: 0px 8px 14px 8px !important;
`

const InputField = styled(Container)`
  padding: 0px 8px 24px 8px !important;
`

const PackageNameField = styled(Container)`
  padding: 0px 8px 40px 8px !important;
`

const BannerSpace = styled(Stack)`
  padding: 0px 8px 44px 8px !important;
`

const PublishedSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase': {
    color: '#FAFAFA',
    '&:hover': {
      backgroundColor: alpha('#FAFAFA', theme.palette.action.hoverOpacity),
    },
  },
}))

const HtmlTypography = styled(Typography)`
  margin-bottom: 16px !important;
`

const MainTitleTypography = styled(Typography)`
  margin-bottom: 64px !important;
`

const PackageDetailTitleTypography = styled(Typography)`
  margin-bottom: 60px !important;
`

const TitleTypography = styled(Typography)`
  margin-bottom: 44px !important;
`

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
  const [editorPackageListEnError, setEditorPackageListEnError] = useState<string>('')
  const [editorPackageListThError, setEditorPackageListThError] = useState<string>('')
  const [editorPackageDetailEnError, setEditorPackageDetailEnError] = useState<string>('')
  const [editorPackageDetailThError, setEditorPackageDetailThError] = useState<string>('')
  const [visibleUpdateDialog, setVisibleUpdateDialog] = useState<boolean>(false)
  const [contentListThTemp, setContentListThTemp] = useState<string>('')
  const [contentListEnTemp, setContentListEnTemp] = useState<string>('')
  const [contentDetailThTemp, setContentDetailThTemp] = useState<string>('')
  const [contentDetailEnTemp, setContentDetailEnTemp] = useState<string>('')

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
      if (value < 1 || value > 99) {
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

  const validateEditorPackageListEn = (text: string) => {
    const validateBullet = (text.match(/<li>/g) || []).length
    setContentListEnTemp(text)
    if (text.length === 0) {
      setEditorPackageListEnError(t('newSubcription.validation.errors.required'))
    } else if (text.length > packageFeatureLimt) {
      setEditorPackageListEnError(t('newSubcription.validation.errors.editorFormat'))
    } else if (validateBullet > 5 || validateBullet < 3) {
      setEditorPackageListEnError(t('newSubcription.validation.errors.limitBullet'))
    } else {
      setEditorPackageListEnError('')
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

  const validateEditorPackageListTh = (text: string) => {
    const validateBullet = (text.match(/<li>/g) || []).length
    setContentListThTemp(text)
    if (text.length === 0) {
      setEditorPackageListThError(t('newSubcription.validation.errors.required'))
    } else if (text.length > packageFeatureLimt) {
      setEditorPackageListThError(t('newSubcription.validation.errors.editorFormat'))
    } else if (validateBullet > 5 || validateBullet < 3) {
      setEditorPackageListThError(t('newSubcription.validation.errors.limitBullet'))
    } else {
      setEditorPackageListThError('')
    }
  }

  const validateEditorPackageDetailEn = (text: string) => {
    setContentDetailEnTemp(text)
    if (text.length === 0) {
      setEditorPackageDetailEnError(t('newSubcription.validation.errors.required'))
    } else if (text.length > packageFeatureLimt) {
      setEditorPackageDetailEnError(t('newSubcription.validation.errors.editorFormat'))
    } else {
      setEditorPackageDetailEnError('')
    }
  }

  const validatePackageDetailTh = (text: string) => {
    setContentDetailThTemp(text)
    if (text.length === 0) {
      setEditorPackageDetailThError(t('newSubcription.validation.errors.required'))
    } else if (text.length > packageFeatureLimt) {
      setEditorPackageDetailThError(t('newSubcription.validation.errors.editorFormat'))
    } else {
      setEditorPackageDetailThError('')
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
      editorPackageListEn: '<ul><li></li><li></li><li></li></ul>',
      editorPackageListTh: '<ul><li></li><li></li><li></li></ul>',
      editorPackageDetailEn: '<ul><li></li></ul>',
      editorPackageDetailTh: '<ul><li></li></ul>',
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
            featureEn: contentListEnTemp,
            featureTh: contentListThTemp,
            descriptionEn: contentDetailEnTemp,
            descriptionTh: contentDetailThTemp,
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
    <Stack spacing={6}>
      <PackageDetailSpacing>
        <TitleTypography variant="h5">{t('newSubcription.packageDetail.title')}</TitleTypography>
        <InputField maxWidth={false}>
          <Grid container spacing={5}>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                select
                label={t('newSubcription.packageDetail.badge')}
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
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  disablePast
                  format="D MMM YYYY"
                  label={t('newSubcription.packageDetail.publishDate')}
                  minDate={defaultDate.minDate}
                  maxDate={defaultDate.maxDate}
                  value={formik.values.publishDate}
                  onChange={(date) => formik.setFieldValue('publishDate', date)}
                  slotProps={{
                    textField: {
                      variant: 'outlined',
                      fullWidth: true,
                      id: 'publishDate',
                      name: 'publishDate',
                      error: formik.touched.publishDate && Boolean(formik.errors.publishDate),
                      helperText: formik.touched.publishDate && formik.errors.publishDate,
                    },
                    popper: {
                      placement: 'bottom-end',
                    },
                  }}
                />
              </LocalizationProvider>
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
                      {t('newSubcription.packageDetail.published')}
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
                label={t('newSubcription.packageDetail.fullPrice')}
                id="subscription-add__fullPrice_input"
                name="fullPrice"
                variant="outlined"
                value={formik.values.fullPrice}
                error={
                  !!fullPriceError || (formik.touched.fullPrice && Boolean(formik.errors.fullPrice))
                }
                helperText={fullPriceError || (formik.touched.fullPrice && formik.errors.fullPrice)}
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
                label={t('newSubcription.packageDetail.price')}
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
                label={t('newSubcription.packageDetail.packagePeriodMonth')}
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
      </PackageDetailSpacing>

      <PackageDetailSpacing>
        <MainTitleTypography variant="h5">
          {t('newSubcription.packageList.title')}
        </MainTitleTypography>
        <TitleTypography variant="h5">{t('newSubcription.packageList.banner')}</TitleTypography>
        <BannerSpace spacing={4}>
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
          <Typography variant="caption" color="#BDBDBD">
            {t('newSubcription.dialog.imageUpload.reccommend')}
          </Typography>
        </BannerSpace>
        <UploadImageDialog
          visible={visibleUpdateDialog}
          onClose={() => {
            setVisibleUpdateDialog(false)
          }}
        />
        <TitleTypography variant="h5">{t('newSubcription.packageList.message')}</TitleTypography>
        <PackageNameField maxWidth={false}>
          <TextField
            fullWidth
            label={t('newSubcription.packageList.packageNameEn')}
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
        </PackageNameField>
        <HtmlTypography variant="body2">{t('newSubcription.packageList.contentEn')}</HtmlTypography>
        <InputField maxWidth={false}>
          <HTMLEditor
            id="contentEn"
            label=""
            initialValue={formik.values.editorPackageListEn}
            handleOnEditChange={(value: string) => validateEditorPackageListEn(value)}
          />
          {editorPackageListEnError !== '' && (
            <FormHelperText error={true}>{editorPackageListEnError}</FormHelperText>
          )}
          <Typography variant="caption" color="#BDBDBD">
            {t('newSubcription.packageList.reccommendEditor')}
          </Typography>
        </InputField>
        <PackageNameField maxWidth={false}>
          <TextField
            fullWidth
            id="packageNameTh"
            label={t('newSubcription.packageList.packageNameTh')}
            name="packageNameTh"
            variant="outlined"
            value={formik.values.packageNameTh}
            error={
              !!packageNameThError ||
              (formik.touched.packageNameTh && Boolean(formik.errors.packageNameTh))
            }
            helperText={
              packageNameThError || (formik.touched.packageNameTh && formik.errors.packageNameTh)
            }
            onChange={validatePackageNameTh}
            onCut={handleDisableEvent}
            onCopy={handleDisableEvent}
            onPaste={handleDisableEvent}
          />
        </PackageNameField>
        <HtmlTypography variant="body2">{t('newSubcription.packageList.contentTh')}</HtmlTypography>
        <InputField maxWidth={false}>
          <HTMLEditor
            id="contentTh"
            label=""
            initialValue={formik.values.editorPackageListTh}
            handleOnEditChange={(value: string) => validateEditorPackageListTh(value)}
          />
          {editorPackageListThError !== '' && (
            <FormHelperText error={true}>{editorPackageListThError}</FormHelperText>
          )}
          <TitleTypography variant="caption" color="#BDBDBD">
            {t('newSubcription.packageList.reccommendEditor')}
          </TitleTypography>
        </InputField>
      </PackageDetailSpacing>

      <PackageDetailSpacing>
        <MainTitleTypography variant="h5">
          {t('newSubcription.packageDetail.title')}
        </MainTitleTypography>
        <TitleTypography variant="h5">{t('newSubcription.packageDetail.banner')}</TitleTypography>
        <BannerSpace spacing={4}>
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
          <Typography variant="caption" color="#BDBDBD">
            {t('newSubcription.dialog.imageUpload.reccommendDetail')}
          </Typography>
        </BannerSpace>
        <PackageDetailTitleTypography variant="h5">
          {t('newSubcription.packageDetail.message')}
        </PackageDetailTitleTypography>
        <HtmlTypography variant="body2">
          {t('newSubcription.packageDetail.contentEn')}
        </HtmlTypography>
        <HtmlContentEnSpace maxWidth={false}>
          <HTMLEditor
            id="contentDetailEn"
            label=""
            initialValue={formik.values.editorPackageDetailEn}
            handleOnEditChange={(value: string) => validateEditorPackageDetailEn(value)}
          />
          {editorPackageDetailEnError !== '' && (
            <FormHelperText error={true}>{editorPackageDetailEnError}</FormHelperText>
          )}
        </HtmlContentEnSpace>
        <HtmlTypography variant="body2">
          {t('newSubcription.packageDetail.contentTh')}
        </HtmlTypography>
        <HtmlContentThSpace maxWidth={false}>
          <HTMLEditor
            id="contentDetailTh"
            label=""
            initialValue={formik.values.editorPackageDetailTh}
            handleOnEditChange={(value: string) => validatePackageDetailTh(value)}
          />
          {editorPackageDetailThError !== '' && (
            <FormHelperText error={true}>{editorPackageDetailThError}</FormHelperText>
          )}
        </HtmlContentThSpace>
      </PackageDetailSpacing>

      <PackageDetailSpacing>
        <InputField maxWidth={false}>
          <ButtonSpace
            color="primary"
            variant="contained"
            type="submit"
            onClick={() => formik.handleSubmit()}
          >
            {t('button.save')}
          </ButtonSpace>
          <Button variant="outlined" onClick={() => history.goBack()}>
            {t('button.cancel')}
          </Button>
        </InputField>
      </PackageDetailSpacing>
    </Stack>
  )
}
