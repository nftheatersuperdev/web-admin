/* eslint-disable react/forbid-component-props */
import * as yup from 'yup'
import dayjs from 'dayjs'
import styled from 'styled-components'
import { FormEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Grid, TextField, Card, Typography } from '@material-ui/core'
import { alpha } from '@material-ui/core/styles'
import { Container, FormControl, FormControlLabel, Switch } from '@mui/material'
import { useFormik } from 'formik'
import DatePicker from 'components/DatePicker'
import HTMLEditor from 'components/HTMLEditor'

const PackageDetailSpacing = styled(Card)`
  padding: 20px 16px 0px 16px;
`

const TitleTypography = styled(Typography)`
  margin-bottom: 44px;
`

const InputField = styled(Container)`
  padding: 0px 8px 24px 8px !important;
`

const PublishedSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase': {
    color: '#FAFAFA',
    // boxShadow: `
    //   0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px rgba(0, 0, 0, 0.14), 0px 1px 3px rgba(0, 0, 0, 0.12);`,
    '&:hover': {
      backgroundColor: alpha('#FAFAFA', theme.palette.action.hoverOpacity),
    },
  },
}))

export default function PackageDetail(): JSX.Element {
  //const [published, setPublished] = useState(false)
  const currentDate = dayjs()
  const defaultDate = {
    minDate: currentDate,
    maxDate: currentDate.add(90, 'day'),
  }
  const { t } = useTranslation()

  const validationSchema = yup.object({
    // code: yup
    //   .string()
    //   .matches(/^[a-zA-Z0-9]+$/, t('validation.invalidVoucherCode'))
    //   .required(t('validation.required')),
    badge: yup.string(),
    publishDate: yup
      .date()
      .min(defaultDate.minDate, 'Min wrong')
      .max(defaultDate.maxDate, 'Max wrong')
      .required(t('validation.required')),
    fullPrice: yup
      .number()
      .min(1, t('validation.minimumIsOne'))
      .max(100, t('validation.maximumIsOneHundred'))
      .required(t('validation.required')),
    price: yup.number().min(1, t('validation.minimumIsOne')).required(t('validation.required')),
    packagePeriodMonth: yup
      .number()
      .min(1, t('validation.minimumIsOne'))
      .required(t('validation.required')),
  })

  // const handlePublishedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setPublished(event.target.checked)
  // }

  const handleValidateNumericKeyPress = (event: React.KeyboardEvent) => {
    const allowCharacters = /[0-9]/
    if (!allowCharacters.test(event.key)) {
      event.preventDefault()
    }
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

  // const handleClearClick = () => {
  //   formik.setFieldValue('badge', '')
  // }

  const formik = useFormik({
    validationSchema,
    initialValues: {
      badge: '',
      publishDate: currentDate,
      published: false,
      fullPrice: 0.0,
      price: 0.0,
      packagePeriodMonth: 0,
    },
    enableReinitialize: false,
    onSubmit: () => {
      //console.log(values)
      /*const packagePrices =
        values.packagePrices && values.packagePrices?.length > 0
          ? values.packagePrices.map((packagePrice) => packagePrice.id)
          : []
      const customerGroups =
        values.customerGroups && values.customerGroups?.length > 0
          ? values.customerGroups.map((customerGroup) => customerGroup.id)
          : []*/
    },
  })

  const packageNameLimit = 50
  const packageFeatureLimt = 300

  const [filterSearchFieldError, setFilterSearchFieldError] = useState<string>('')

  const validatePackageName = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    if (value.length > packageNameLimit) {
      setFilterSearchFieldError(t('carAvailability.searchField.errors.invalidFormat'))
    }
  }

  const validatePackageListMessage = (text: string) => {
    if (text.length > packageFeatureLimt) {
      console.log('Error limit 300 characters')
    }
    //count bullet
  }

  return (
    <PackageDetailSpacing>
      <TitleTypography variant="h5">Package Management</TitleTypography>
      <InputField maxWidth={false}>
        <Grid container spacing={5}>
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
              //maxDate={defaultDate.maxDate}
              defaultValue={formik.values.publishDate}
              value={formik.values.publishDate}
              onChange={(date) => {
                formik.setFieldValue('publishDate', date)
              }}
              error={formik.touched.publishDate && Boolean(formik.errors.publishDate)}
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
                    checked={formik.values.published}
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
              id="fullPrice"
              name="fullPrice"
              variant="outlined"
              value={formik.values.fullPrice}
              onChange={formik.handleChange}
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: 1, max: 100, step: 1 }}
              //error={formik.touched.discountPercent && Boolean(formik.errors.discountPercent)}
              //helperText={formik.touched.discountPercent && formik.errors.discountPercent}
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
              label="Price"
              id="price"
              name="price"
              variant="outlined"
              value={formik.values.price}
              onChange={formik.handleChange}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{ min: 1 }}
              //error={formik.touched.quantity && Boolean(formik.errors.quantity)}
              //helperText={formik.touched.quantity && formik.errors.quantity}
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
              onChange={formik.handleChange}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{ min: 1 }}
              //error={formik.touched.limitPerUser && Boolean(formik.errors.limitPerUser)}
              //helperText={formik.touched.limitPerUser && formik.errors.limitPerUser}
              onKeyPress={handleValidateNumericKeyPress}
              onCut={handleDisableEvent}
              onCopy={handleDisableEvent}
              onPaste={handleDisableEvent}
            />
          </Grid>
        </Grid>
      </InputField>
      <TitleTypography variant="h5">Package List Message</TitleTypography>
      <Grid
        item
        xs={12}
        sm={12}
        style={{
          marginTop: 24,
        }}
      >
        <TextField
          fullWidth
          label="Package Name (EN)"
          id="packageName"
          name="packageNameField"
          variant="outlined"
          error={!!filterSearchFieldError}
          InputLabelProps={{ shrink: true }}
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
            label={t('documents.addEdit.contentEn')}
            initialValue="english"
            handleOnEditChange={(value: string) => validatePackageListMessage(value)}
          />

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
              name="packageNameFieldTH"
              variant="outlined"
              InputLabelProps={{ shrink: true }}
              onCut={handleDisableEvent}
              onCopy={handleDisableEvent}
              onPaste={handleDisableEvent}
            />
          </Grid>
          <HTMLEditor
            id="contentTh"
            label={t('documents.addEdit.contentTh')}
            initialValue="ไทย"
            handleOnEditChange={(value: string) => validatePackageListMessage(value)}
          />
        </Grid>
      </Grid>
    </PackageDetailSpacing>
  )
}
