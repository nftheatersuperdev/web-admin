import { Fragment } from 'react'
import { useQuery } from 'react-query'
import { Checkbox, FormControlLabel, Grid, Radio, RadioGroup, TextField } from '@mui/material'
import Autocomplete, { AutocompleteRenderOptionState } from '@material-ui/lab/Autocomplete'
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank'
import CheckBoxIcon from '@material-ui/icons/CheckBox'
import { useTranslation } from 'react-i18next'
import { FormikProps } from 'formik'
import styled from 'styled-components'
import { getActive } from 'services/web-bff/package-price'
import { PackagePriceBff } from 'services/web-bff/package-price.type'
import { Voucher } from 'services/web-bff/voucher.type'
import { selectOptions } from 'pages/VoucherCreateEdit/utils'
import { VoucherFormInitialValues } from '..'

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />
const checkedIcon = <CheckBoxIcon fontSize="small" />

const AutocompleteSpace = styled.div`
  @media (min-width: 801px) {
    margin-top: 40px;
  }
`

export interface PackagePriceListProps {
  voucher?: Voucher
  formik: FormikProps<VoucherFormInitialValues>
}

export default function PackagePriceList({ voucher, formik }: PackagePriceListProps): JSX.Element {
  const { t } = useTranslation()

  const currentDateTime = new Date()
  const endAtDateTime = new Date(voucher?.endAt || new Date())
  const isInactive = currentDateTime > endAtDateTime

  const { data: masterPackagePricesData } = useQuery('master-package-prices', () => getActive())

  const masterPackagePrices = masterPackagePricesData || []
  const packagePricesValues = formik.values.packagePrices.map((packagePrice) =>
    masterPackagePrices.find((masterData) => masterData.id === packagePrice.id)
  )

  const optionLabel = (option: PackagePriceBff) => {
    let durationLabel
    if (option.durationLabel === '3d') {
      durationLabel = t('pricing.3d')
    } else if (option.durationLabel === '1w') {
      durationLabel = t('pricing.1w')
    } else if (option.durationLabel === '1m') {
      durationLabel = t('pricing.1m')
    } else if (option.durationLabel === '3m') {
      durationLabel = t('pricing.3m')
    } else if (option.durationLabel === '6m') {
      durationLabel = t('pricing.6m')
    } else if (option.durationLabel === '12m') {
      durationLabel = t('pricing.12m')
    }

    const selectedOption = masterPackagePricesData?.find((data) => data.id === option.id)

    return `
      ${selectedOption?.carModel?.brand} /
      ${selectedOption?.carModel?.name} /
      ${durationLabel} /
      ${option.price.toLocaleString()} THB
    `
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={3}>
        <RadioGroup
          id="voucher_add_edit__package_price_radio_list"
          name="package-price-radio"
          aria-label="package-price-radio"
          onChange={(_, value) => formik.setFieldValue('packagePriceOption', value)}
          value={formik.values.packagePriceOption}
        >
          <FormControlLabel
            value={selectOptions.ALL}
            control={<Radio />}
            label={t('voucherManagement.voucher.detail.option.packagePrice.all')}
            disabled={isInactive}
          />
          <FormControlLabel
            value={selectOptions.SELECT}
            control={<Radio />}
            label={t('voucherManagement.voucher.detail.option.packagePrice.select')}
            disabled={isInactive}
          />
        </RadioGroup>
      </Grid>
      <Grid item xs={12} sm={5}>
        <AutocompleteSpace>
          <Autocomplete
            multiple
            id="package-price-select"
            value={packagePricesValues}
            options={masterPackagePrices}
            onChange={(_, value) => formik.setFieldValue('packagePrices', value)}
            getOptionLabel={(option) => (option ? optionLabel(option) : '')}
            disableCloseOnSelect
            renderOption={(option, { selected }: AutocompleteRenderOptionState) => (
              <Fragment>
                <Checkbox icon={icon} checkedIcon={checkedIcon} checked={selected} />
                {option ? optionLabel(option) : ''}
              </Fragment>
            )}
            renderInput={(params) => (
              <TextField
                // eslint-disable-next-line react/jsx-props-no-spreading
                {...params}
                label={t('voucher.dialog.packagePrice.availablePackages')}
                variant="outlined"
              />
            )}
            disabled={formik.values.packagePriceOption !== selectOptions.SELECT}
          />
        </AutocompleteSpace>
      </Grid>
    </Grid>
  )
}
